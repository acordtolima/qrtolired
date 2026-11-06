import { createHash, randomBytes } from "node:crypto";
import { getSql, type Sql } from "@/lib/db";
import {
  compose,
  inputFromParts,
  payloadOf,
  safeHttp,
  UserError,
} from "@/lib/qr/content";
import type {
  AdminOverview,
  AdminPackage,
  AdminSettings,
  AdminUser,
  CheckoutStart,
  CornerStyle,
  Dashboard,
  DotStyle,
  EntitlementView,
  Kind,
  Me,
  PackageCard,
  PaymentState,
  PublicQr,
  QrDetail,
  QrInput,
  QrListItem,
} from "@/lib/qr/types";

type Settings = {
  wompi_public_key: string;
  wompi_integrity_secret: string;
  wompi_events_secret: string;
  wompi_env: string;
  allow_demo_checkout: boolean;
  free_qr_limit: number;
  free_grace_days: number;
};

type EntRow = {
  id: number;
  user_id: string;
  package_name: string;
  qr_quota: number;
  price_cop: number;
  duration_days: number;
  status: string;
  starts_at: unknown;
  expires_at: unknown;
  reference: string;
  granted_by: string | null;
};

function iso(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function num(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function flag(value: unknown) {
  return value === true || value === "t" || value === "true" || value === 1;
}

function hint(secret: string) {
  if (!secret) return "";
  return `••••${secret.slice(-4)}`;
}

async function db() {
  return getSql();
}

async function settings(sql: Sql): Promise<Settings> {
  const rows = await sql<Settings>`select wompi_public_key, wompi_integrity_secret, wompi_events_secret, wompi_env, allow_demo_checkout, free_qr_limit, free_grace_days from app_settings where id = 1`;
  const row = rows[0];
  if (!row) throw new UserError("Falta la configuración.");
  return {
    ...row,
    allow_demo_checkout: flag(row.allow_demo_checkout),
    free_qr_limit: num(row.free_qr_limit) || 3,
    free_grace_days: num(row.free_grace_days) || 30,
  };
}

async function sweep(sql: Sql) {
  await sql`update entitlements set status = 'expired' where status = 'active' and expires_at is not null and expires_at <= now()`;
}

async function ensureProfile(sql: Sql, userId: string) {
  const auth = await sql<{ name: string; email: string }>`select name, email from "user" where id = ${userId}`;
  const name = auth[0]?.name ?? "";
  const email = auth[0]?.email ?? "";
  const existing = await sql<{ role: string }>`select role from profiles where user_id = ${userId}`;
  if (!existing[0]) {
    const admins = await sql<{ n: number }>`select count(*)::int as n from profiles where role = 'admin'`;
    const role = num(admins[0]?.n) === 0 ? "admin" : "user";
    await sql`insert into profiles (user_id, email, name, role) values (${userId}, ${email}, ${name}, ${role}) on conflict (user_id) do update set email = excluded.email, name = excluded.name`;
    return;
  }
  await sql`update profiles set email = ${email}, name = ${name} where user_id = ${userId}`;
}

async function touchSeen(sql: Sql, userId: string, graceDays: number) {
  const rows = await sql<{ last_seen_at: unknown }>`select last_seen_at from profiles where user_id = ${userId}`;
  const previous = iso(rows[0]?.last_seen_at);
  const wasLapsed = previous
    ? Date.now() - new Date(previous).getTime() > graceDays * 86_400_000
    : false;
  await sql`update profiles set last_seen_at = now() where user_id = ${userId}`;
  return {
    wasLapsed,
    freeUntil: new Date(Date.now() + graceDays * 86_400_000).toISOString(),
  };
}

async function activeEntitlements(sql: Sql, userId: string) {
  const rows = await sql<EntRow>`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements
    where user_id = ${userId} and status = 'active' and (expires_at is null or expires_at > now())
    order by expires_at desc nulls first, id desc
  `;
  return rows.map((row) => ({ ...row, qr_quota: num(row.qr_quota), price_cop: num(row.price_cop) }));
}

async function usage(sql: Sql, userId: string, freeLimit: number) {
  const free = await sql<{ n: number }>`select count(*)::int as n from qr_codes where user_id = ${userId} and slot = 'free'`;
  const active = await activeEntitlements(sql, userId);
  const paidCapacity = active.reduce((sum, row) => sum + row.qr_quota, 0);
  const usedRows = await sql<{ entitlement_id: number | null; n: number }>`
    select entitlement_id, count(*)::int as n
    from qr_codes
    where user_id = ${userId} and slot = 'paid'
    group by entitlement_id
  `;
  const activeIds = new Set(active.map((row) => row.id));
  const paidUsed = usedRows.reduce(
    (sum, row) => (row.entitlement_id != null && activeIds.has(num(row.entitlement_id)) ? sum + num(row.n) : sum),
    0,
  );
  const freeUsed = num(free[0]?.n);
  return {
    freeUsed,
    paidCapacity,
    paidUsed,
    remaining: Math.max(0, freeLimit - freeUsed) + Math.max(0, paidCapacity - paidUsed),
    active,
  };
}

function mapEntitlement(row: EntRow): EntitlementView {
  return {
    id: num(row.id),
    packageName: row.package_name,
    qrQuota: num(row.qr_quota),
    priceCop: num(row.price_cop),
    status: row.status,
    startsAt: iso(row.starts_at),
    expiresAt: iso(row.expires_at),
    reference: row.reference,
    granted: Boolean(row.granted_by),
  };
}

type QrRow = {
  id: number;
  public_id: string;
  title: string;
  kind: string;
  summary: string;
  slot: string;
  entitlement_id: number | null;
  fg_color: string;
  bg_color: string;
  accent_color: string;
  dot_style: string;
  corner_style: string;
  has_logo: boolean;
  scans: number;
  payload?: string;
  destination?: string;
  logo_data?: string | null;
  package_name: string | null;
  ent_status: string | null;
  ent_expires: unknown;
};

function liveOf(
  row: { slot: string; ent_status: string | null; ent_expires: unknown },
  freeLive: boolean,
) {
  if (row.slot === "free") {
    return freeLive
      ? { live: true, pauseReason: null }
      : { live: false, pauseReason: "Gratis en pausa: hay que entrar al panel al menos una vez al mes." };
  }
  const expires = iso(row.ent_expires);
  const active = row.ent_status === "active" && (!expires || new Date(expires).getTime() > Date.now());
  return active
    ? { live: true, pauseReason: null }
    : { live: false, pauseReason: "El paquete de este código no tiene el pago activo." };
}

function sourceLabel(row: { slot: string; package_name: string | null }, freeUntil: string | null) {
  if (row.slot === "free") return freeUntil ? `Gratis · entra antes del ${freeUntil}` : "Gratis";
  return row.package_name ? `Paquete ${row.package_name}` : "Paquete";
}

function mapList(row: QrRow, freeLive: boolean, freeUntilLabel: string | null): QrListItem {
  const state = liveOf(row, freeLive);
  return {
    id: num(row.id),
    publicId: row.public_id,
    title: row.title || "Sin título",
    kind: row.kind as Kind,
    summary: row.summary,
    slot: row.slot === "paid" ? "paid" : "free",
    live: state.live,
    pauseReason: state.pauseReason,
    sourceLabel: sourceLabel(row, freeUntilLabel),
    scans: num(row.scans),
    fg: row.fg_color,
    bg: row.bg_color,
    accent: row.accent_color,
    dotStyle: row.dot_style as DotStyle,
    cornerStyle: row.corner_style as CornerStyle,
    hasLogo: flag(row.has_logo),
  };
}

async function meFor(sql: Sql, userId: string, touch: boolean): Promise<Me> {
  await sweep(sql);
  await ensureProfile(sql, userId);
  const cfg = await settings(sql);
  const seen = touch
    ? await touchSeen(sql, userId, cfg.free_grace_days)
    : {
        wasLapsed: false,
        freeUntil: new Date(Date.now() + cfg.free_grace_days * 86_400_000).toISOString(),
      };
  const profile = await sql<{ name: string; email: string; role: string }>`select name, email, role from profiles where user_id = ${userId}`;
  const quota = await usage(sql, userId, cfg.free_qr_limit);
  return {
    name: profile[0]?.name ?? "",
    email: profile[0]?.email ?? "",
    role: profile[0]?.role === "admin" ? "admin" : "user",
    wasLapsed: seen.wasLapsed,
    freeUntil: seen.freeUntil,
    freeLimit: cfg.free_qr_limit,
    graceDays: cfg.free_grace_days,
    freeUsed: quota.freeUsed,
    paidCapacity: quota.paidCapacity,
    paidUsed: quota.paidUsed,
    remaining: quota.remaining,
  };
}

export async function getMeFor(userId: string): Promise<Me> {
  return meFor(await db(), userId, true);
}

export async function dashboardFor(userId: string): Promise<Dashboard> {
  const sql = await db();
  const me = await meFor(sql, userId, true);
  const rows = await sql<QrRow>`
    select q.id, q.public_id, q.title, q.kind, q.summary, q.slot, q.entitlement_id,
           q.fg_color, q.bg_color, q.accent_color, q.dot_style, q.corner_style,
           (q.logo_data is not null and q.logo_data <> '') as has_logo,
           q.scans, e.package_name, e.status as ent_status, e.expires_at as ent_expires
    from qr_codes q
    left join entitlements e on e.id = q.entitlement_id
    where q.user_id = ${userId}
    order by q.updated_at desc
  `;
  const ents = await sql<EntRow>`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements where user_id = ${userId} order by created_at desc limit 20
  `;
  const { fecha } = await import("@/lib/qr/format");
  return {
    ...me,
    qrs: rows.map((row) => mapList(row, true, fecha(me.freeUntil))),
    entitlements: ents.map(mapEntitlement),
  };
}

export async function qrFor(userId: string, id: number): Promise<QrDetail> {
  const sql = await db();
  await sweep(sql);
  await ensureProfile(sql, userId);
  const rows = await sql<QrRow & { payload: string; logo_data: string | null }>`
    select q.id, q.public_id, q.title, q.kind, q.summary, q.slot, q.entitlement_id,
           q.fg_color, q.bg_color, q.accent_color, q.dot_style, q.corner_style,
           q.payload, q.logo_data, q.scans,
           (q.logo_data is not null and q.logo_data <> '') as has_logo,
           e.package_name, e.status as ent_status, e.expires_at as ent_expires
    from qr_codes q
    left join entitlements e on e.id = q.entitlement_id
    where q.id = ${id} and q.user_id = ${userId}
  `;
  const row = rows[0];
  if (!row) throw new UserError("No encontramos ese código.");
  const cfg = await settings(sql);
  const profile = await sql<{ last_seen_at: unknown }>`select last_seen_at from profiles where user_id = ${userId}`;
  const seen = iso(profile[0]?.last_seen_at);
  const freeLive = seen ? Date.now() - new Date(seen).getTime() <= cfg.free_grace_days * 86_400_000 : false;
  const state = liveOf(row, freeLive);
  const input = inputFromParts({
    title: row.title,
    kind: row.kind,
    payload: row.payload,
    fg: row.fg_color,
    bg: row.bg_color,
    accent: row.accent_color,
    dotStyle: row.dot_style,
    cornerStyle: row.corner_style,
    logoData: row.logo_data,
  });
  const { fecha } = await import("@/lib/qr/format");
  const freeUntil = seen
    ? fecha(new Date(new Date(seen).getTime() + cfg.free_grace_days * 86_400_000).toISOString())
    : null;
  return {
    id: num(row.id),
    publicId: row.public_id,
    input,
    scans: num(row.scans),
    live: state.live,
    pauseReason: state.pauseReason,
    sourceLabel: sourceLabel(row, freeUntil),
  };
}

function publicId() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(8);
  let out = "";
  for (let i = 0; i < 8; i += 1) out += alphabet[bytes[i]! % alphabet.length];
  return out;
}

async function pickSlot(sql: Sql, userId: string) {
  const cfg = await settings(sql);
  const quota = await usage(sql, userId, cfg.free_qr_limit);
  if (quota.freeUsed < cfg.free_qr_limit) return { slot: "free" as const, entitlementId: null as number | null };
  for (const ent of quota.active) {
    const used = await sql<{ n: number }>`select count(*)::int as n from qr_codes where user_id = ${userId} and entitlement_id = ${ent.id}`;
    if (num(used[0]?.n) < ent.qr_quota) return { slot: "paid" as const, entitlementId: ent.id };
  }
  throw new UserError("Ya usaste tus códigos gratis y no tienes un paquete con cupo. Compra uno para crear más.");
}

export async function createQrFor(userId: string, input: QrInput) {
  const sql = await db();
  await sweep(sql);
  await ensureProfile(sql, userId);
  const made = compose(input);
  const slot = await pickSlot(sql, userId);
  const code = publicId();
  const title = input.title || "Sin título";
  const rows = await sql<{ id: number }>`
    insert into qr_codes (
      user_id, public_id, title, kind, payload, destination, summary, slot, entitlement_id,
      fg_color, bg_color, accent_color, dot_style, corner_style, logo_data
    ) values (
      ${userId}, ${code}, ${title}, ${input.kind}, ${JSON.stringify(payloadOf(input))}, ${made.destination},
      ${made.summary}, ${slot.slot}, ${slot.entitlementId}, ${input.fg}, ${input.bg}, ${input.accent},
      ${input.dotStyle}, ${input.cornerStyle}, ${input.logoData}
    ) returning id
  `;
  return { ok: true as const, id: num(rows[0]?.id) };
}

export async function updateQrFor(userId: string, id: number, input: QrInput) {
  const sql = await db();
  await ensureProfile(sql, userId);
  const made = compose(input);
  const title = input.title || "Sin título";
  const rows = await sql<{ id: number }>`
    update qr_codes set
      title = ${title},
      kind = ${input.kind},
      payload = ${JSON.stringify(payloadOf(input))},
      destination = ${made.destination},
      summary = ${made.summary},
      fg_color = ${input.fg},
      bg_color = ${input.bg},
      accent_color = ${input.accent},
      dot_style = ${input.dotStyle},
      corner_style = ${input.cornerStyle},
      logo_data = ${input.logoData},
      updated_at = now()
    where id = ${id} and user_id = ${userId}
    returning id
  `;
  if (!rows[0]) throw new UserError("No encontramos ese código.");
  return { ok: true as const };
}

export async function deleteQrFor(userId: string, id: number) {
  const sql = await db();
  const rows = await sql<{ id: number }>`delete from qr_codes where id = ${id} and user_id = ${userId} returning id`;
  if (!rows[0]) throw new UserError("No encontramos ese código.");
  return { ok: true as const };
}

export async function reactivateQrFor(userId: string, id: number) {
  const sql = await db();
  await sweep(sql);
  await ensureProfile(sql, userId);
  const rows = await sql<{ id: number; slot: string; entitlement_id: number | null }>`
    select id, slot, entitlement_id from qr_codes where id = ${id} and user_id = ${userId}
  `;
  const row = rows[0];
  if (!row) throw new UserError("No encontramos ese código.");
  const slot = await pickSlot(sql, userId);
  await sql`update qr_codes set slot = ${slot.slot}, entitlement_id = ${slot.entitlementId}, updated_at = now() where id = ${id} and user_id = ${userId}`;
  return { ok: true as const };
}

function mapPackage(row: {
  id: number;
  name: string;
  qr_quota: number;
  price_cop: number;
  duration_days: number;
  description: string;
}): PackageCard {
  return {
    id: num(row.id),
    name: row.name,
    qrQuota: num(row.qr_quota),
    priceCop: num(row.price_cop),
    durationDays: num(row.duration_days),
    description: row.description,
  };
}

export async function publicPackages(): Promise<PackageCard[]> {
  const sql = await db();
  const rows = await sql<{
    id: number;
    name: string;
    qr_quota: number;
    price_cop: number;
    duration_days: number;
    description: string;
  }>`select id, name, qr_quota, price_cop, duration_days, description from packages where active = true order by sort_order, id`;
  return rows.map(mapPackage);
}

export async function plansFor(userId: string) {
  const sql = await db();
  const me = await meFor(sql, userId, true);
  const cfg = await settings(sql);
  const packages = await publicPackages();
  const ents = await sql<EntRow>`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements where user_id = ${userId} order by created_at desc limit 12
  `;
  const key = cfg.wompi_public_key.trim();
  return {
    packages,
    entitlements: ents.map(mapEntitlement),
    wompiReady: key.startsWith("pub_") && cfg.wompi_integrity_secret.trim().length > 0,
    demoCheckout: cfg.allow_demo_checkout && key.length === 0,
    remaining: me.remaining,
  };
}

function referenceOf(prefix: string) {
  return `${prefix}${randomBytes(8).toString("hex")}`.slice(0, 32).toUpperCase();
}

function integrity(reference: string, amountInCents: number, secret: string) {
  return createHash("sha256").update(`${reference}${amountInCents}COP${secret}`).digest("hex");
}

export async function startCheckoutFor(userId: string, packageId: number): Promise<CheckoutStart> {
  const sql = await db();
  await sweep(sql);
  await ensureProfile(sql, userId);
  const packs = await sql<{
    id: number;
    name: string;
    qr_quota: number;
    price_cop: number;
    duration_days: number;
    active: boolean;
  }>`select id, name, qr_quota, price_cop, duration_days, active from packages where id = ${packageId}`;
  const pack = packs[0];
  if (!pack || !flag(pack.active)) throw new UserError("Ese paquete no está disponible.");
  const price = num(pack.price_cop);
  const quota = num(pack.qr_quota);
  const days = num(pack.duration_days);
  await sql`update entitlements set status = 'cancelled' where user_id = ${userId} and status = 'pending'`;
  const reference = referenceOf("SL");
  if (price === 0) {
    await sql`
      insert into entitlements (user_id, package_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, payment_method)
      values (${userId}, ${pack.id}, ${pack.name}, ${quota}, ${price}, ${days}, 'active', now(), now() + (${days} * interval '1 day'), ${reference}, 'gratis')
    `;
    return { ok: true, mode: "activated", reference };
  }
  await sql`
    insert into entitlements (user_id, package_id, package_name, qr_quota, price_cop, duration_days, status, reference)
    values (${userId}, ${pack.id}, ${pack.name}, ${quota}, ${price}, ${days}, 'pending', ${reference})
  `;
  const cfg = await settings(sql);
  const key = cfg.wompi_public_key.trim();
  const secret = cfg.wompi_integrity_secret.trim();
  if (key.startsWith("pub_") && secret) {
    return {
      ok: true,
      mode: "wompi",
      reference,
      publicKey: key,
      amountInCents: price * 100,
      currency: "COP",
      integrity: integrity(reference, price * 100, secret),
      packageName: pack.name,
      priceCop: price,
    };
  }
  if (cfg.allow_demo_checkout && !key) {
    return { ok: true, mode: "demo", reference, priceCop: price, packageName: pack.name };
  }
  throw new UserError("Los pagos con Wompi todavía no están configurados.");
}

type WompiTx = {
  id: string;
  amount_in_cents: number;
  reference: string;
  currency: string;
  status: string;
  payment_method_type?: string;
};

function wompiBase(publicKey: string, env: string) {
  if (publicKey.startsWith("pub_prod_") || env === "production") return "https://production.wompi.co/v1";
  return "https://sandbox.wompi.co/v1";
}

async function fetchTx(base: string, id: string): Promise<WompiTx> {
  const response = await fetch(`${base}/transactions/${encodeURIComponent(id)}`, {
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new UserError("Wompi no devolvió la transacción.");
  const body = (await response.json()) as { data?: WompiTx };
  if (!body.data?.id) throw new UserError("La respuesta de Wompi está incompleta.");
  return body.data;
}

async function activate(sql: Sql, reference: string, txId: string, method: string | null) {
  const rows = await sql<EntRow>`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements where reference = ${reference}
  `;
  const ent = rows[0];
  if (!ent) throw new UserError("No encontramos ese pago.");
  if (ent.status === "active") return ent;
  if (ent.status !== "pending") throw new UserError("Ese pago ya no se puede confirmar.");
  const days = num(ent.duration_days);
  await sql`
    update entitlements set
      status = 'active',
      starts_at = now(),
      expires_at = now() + (${days} * interval '1 day'),
      wompi_transaction_id = ${txId},
      payment_method = ${method}
    where id = ${ent.id} and status = 'pending'
  `;
  const again = await sql<EntRow>`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements where id = ${ent.id}
  `;
  return again[0] ?? ent;
}

export async function confirmPaymentFor(
  userId: string,
  reference: string,
  transactionId: string,
): Promise<PaymentState> {
  const sql = await db();
  const rows = await sql<EntRow>`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements where reference = ${reference} and user_id = ${userId}
  `;
  const ent = rows[0];
  if (!ent) throw new UserError("No encontramos ese pago.");
  if (ent.status === "active") {
    return {
      ok: true,
      status: "active",
      packageName: ent.package_name,
      expiresAt: iso(ent.expires_at),
      detail: "El paquete ya está activo.",
    };
  }
  const price = num(ent.price_cop);
  const cfg = await settings(sql);
  if (!transactionId || transactionId === "demo") {
    if (price !== 0 && !(cfg.allow_demo_checkout && !cfg.wompi_public_key.trim())) {
      throw new UserError("Falta la transacción de Wompi.");
    }
    const saved = await activate(sql, reference, price === 0 ? "GRATIS" : "DEMO", price === 0 ? "gratis" : "demo");
    return {
      ok: true,
      status: "active",
      packageName: saved.package_name,
      expiresAt: iso(saved.expires_at),
      detail: price === 0 ? "Paquete activado." : "Pago de prueba aprobado. En producción aquí responde Wompi.",
    };
  }
  const tx = await fetchTx(wompiBase(cfg.wompi_public_key, cfg.wompi_env), transactionId);
  if (tx.reference !== reference || tx.currency !== "COP" || num(tx.amount_in_cents) !== price * 100) {
    throw new UserError("La transacción no coincide con este paquete.");
  }
  if (tx.status === "APPROVED") {
    const saved = await activate(sql, reference, tx.id, tx.payment_method_type ?? "wompi");
    return {
      ok: true,
      status: "active",
      packageName: saved.package_name,
      expiresAt: iso(saved.expires_at),
      detail: "Wompi aprobó el pago. El paquete ya está activo.",
    };
  }
  if (tx.status === "PENDING") {
    return {
      ok: true,
      status: "pending",
      packageName: ent.package_name,
      expiresAt: null,
      detail: "Wompi todavía está confirmando el pago. Vuelve a revisar en un momento.",
    };
  }
  await sql`update entitlements set status = 'declined', wompi_transaction_id = ${tx.id}, payment_method = ${tx.payment_method_type ?? null} where id = ${ent.id} and status = 'pending'`;
  return {
    ok: true,
    status: "declined",
    packageName: ent.package_name,
    expiresAt: null,
    detail: "Wompi no aprobó el pago. Puedes intentarlo de nuevo.",
  };
}

function readPath(source: unknown, path: string) {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) return (acc as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

export async function handleWompiEvent(request: Request) {
  const sql = await db();
  const cfg = await settings(sql);
  const secret = cfg.wompi_events_secret.trim();
  if (!secret) return Response.json({ ok: false, ignored: true });
  let event: {
    data?: { transaction?: { id?: string } };
    timestamp?: number;
    signature?: { properties?: string[]; checksum?: string };
  };
  try {
    event = (await request.json()) as typeof event;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const properties = event.signature?.properties ?? [];
  const signed = properties.map((prop) => String(readPath(event.data, prop) ?? "")).join("");
  const checksum = createHash("sha256").update(`${signed}${event.timestamp ?? ""}${secret}`).digest("hex");
  if (checksum !== String(event.signature?.checksum ?? "").toLowerCase()) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const txId = event.data?.transaction?.id;
  if (!txId) return Response.json({ ok: true });
  try {
    const tx = await fetchTx(wompiBase(cfg.wompi_public_key, cfg.wompi_env), txId);
    if (tx.status === "APPROVED") await activate(sql, tx.reference, tx.id, tx.payment_method_type ?? "wompi");
  } catch (error) {
    console.error("[wompi]", error);
    return Response.json({ ok: false }, { status: 422 });
  }
  return Response.json({ ok: true });
}

async function requireAdmin(sql: Sql, userId: string) {
  await ensureProfile(sql, userId);
  const rows = await sql<{ role: string }>`select role from profiles where user_id = ${userId}`;
  if (rows[0]?.role !== "admin") throw new UserError("No autorizado.");
}

export async function adminOverviewFor(userId: string): Promise<AdminOverview> {
  const sql = await db();
  await sweep(sql);
  await requireAdmin(sql, userId);
  const users = await sql<{ n: number }>`select count(*)::int as n from profiles`;
  const qrs = await sql<{ n: number }>`select count(*)::int as n from qr_codes`;
  const scans = await sql<{ n: number }>`select coalesce(sum(scans), 0)::int as n from qr_codes`;
  const active = await sql<{ n: number }>`select count(*)::int as n from entitlements where status = 'active' and (expires_at is null or expires_at > now())`;
  const expiring = await sql<{ name: string; email: string; package_name: string; expires_at: unknown }>`
    select p.name, p.email, e.package_name, e.expires_at
    from entitlements e join profiles p on p.user_id = e.user_id
    where e.status = 'active' and e.expires_at is not null and e.expires_at < now() + interval '7 day'
    order by e.expires_at
    limit 12
  `;
  const recent = await sql<{ name: string; email: string; package_name: string; status: string; price_cop: number; created_at: unknown }>`
    select coalesce(p.name, '') as name, coalesce(p.email, '') as email, e.package_name, e.status, e.price_cop, e.created_at
    from entitlements e left join profiles p on p.user_id = e.user_id
    order by e.created_at desc limit 8
  `;
  return {
    users: num(users[0]?.n),
    qrs: num(qrs[0]?.n),
    scans: num(scans[0]?.n),
    activePacks: num(active[0]?.n),
    expiring: expiring.map((row) => ({
      name: row.name,
      email: row.email,
      packageName: row.package_name,
      expiresAt: iso(row.expires_at) ?? "",
    })),
    recent: recent.map((row) => ({
      name: row.name,
      email: row.email,
      packageName: row.package_name,
      status: row.status,
      priceCop: num(row.price_cop),
      createdAt: iso(row.created_at) ?? "",
    })),
  };
}

export async function adminUsersFor(userId: string): Promise<{ users: AdminUser[]; packages: AdminPackage[] }> {
  const sql = await db();
  await sweep(sql);
  await requireAdmin(sql, userId);
  const cfg = await settings(sql);
  const people = await sql<{
    user_id: string;
    name: string;
    email: string;
    role: string;
    last_seen_at: unknown;
    qr_count: number;
  }>`
    select p.user_id, p.name, p.email, p.role, p.last_seen_at,
           (select count(*)::int from qr_codes q where q.user_id = p.user_id) as qr_count
    from profiles p
    order by p.created_at desc
    limit 200
  `;
  const ents = await sql<{
    id: number;
    user_id: string;
    package_name: string;
    qr_quota: number;
    status: string;
    expires_at: unknown;
    price_cop: number;
  }>`select id, user_id, package_name, qr_quota, status, expires_at, price_cop from entitlements order by created_at desc`;
  const packs = await allPackages(sql);
  const users = people.map((person) => {
    const seen = iso(person.last_seen_at) ?? new Date().toISOString();
    const freeUntil = new Date(new Date(seen).getTime() + cfg.free_grace_days * 86_400_000).toISOString();
    return {
      userId: person.user_id,
      name: person.name,
      email: person.email,
      role: person.role === "admin" ? ("admin" as const) : ("user" as const),
      lastSeenAt: seen,
      freeUntil,
      freeLive: new Date(freeUntil).getTime() > Date.now(),
      qrCount: num(person.qr_count),
      entitlements: ents
        .filter((row) => row.user_id === person.user_id)
        .slice(0, 8)
        .map((row) => ({
          id: num(row.id),
          packageName: row.package_name,
          qrQuota: num(row.qr_quota),
          status: row.status,
          expiresAt: iso(row.expires_at),
          priceCop: num(row.price_cop),
        })),
    };
  });
  return { users, packages: packs };
}

async function allPackages(sql: Sql): Promise<AdminPackage[]> {
  const rows = await sql<{
    id: number;
    name: string;
    qr_quota: number;
    price_cop: number;
    duration_days: number;
    description: string;
    active: boolean;
    sort_order: number;
  }>`select id, name, qr_quota, price_cop, duration_days, description, active, sort_order from packages order by sort_order, id`;
  return rows.map((row) => ({
    ...mapPackage(row),
    active: flag(row.active),
    sortOrder: num(row.sort_order),
  }));
}

export async function adminPackagesFor(userId: string) {
  const sql = await db();
  await requireAdmin(sql, userId);
  return allPackages(sql);
}

export async function savePackageFor(
  userId: string,
  input: {
    id?: number;
    name: string;
    qrQuota: number;
    priceCop: number;
    durationDays: number;
    description: string;
    active: boolean;
    sortOrder: number;
  },
) {
  const sql = await db();
  await requireAdmin(sql, userId);
  const name = input.name.trim().slice(0, 60);
  if (!name) throw new UserError("El paquete necesita un nombre.");
  if (!Number.isInteger(input.qrQuota) || input.qrQuota < 1 || input.qrQuota > 500) {
    throw new UserError("La cantidad de códigos debe estar entre 1 y 500.");
  }
  if (!Number.isInteger(input.priceCop) || input.priceCop < 0 || input.priceCop > 100_000_000) {
    throw new UserError("El precio no es válido.");
  }
  if (!Number.isInteger(input.durationDays) || input.durationDays < 1 || input.durationDays > 3650) {
    throw new UserError("La duración debe estar entre 1 y 3650 días.");
  }
  const description = input.description.trim().slice(0, 240);
  const sortOrder = Number.isInteger(input.sortOrder) ? input.sortOrder : 0;
  if (input.id) {
    const rows = await sql<{ id: number }>`
      update packages set name = ${name}, qr_quota = ${input.qrQuota}, price_cop = ${input.priceCop},
        duration_days = ${input.durationDays}, description = ${description}, active = ${input.active}, sort_order = ${sortOrder}
      where id = ${input.id} returning id
    `;
    if (!rows[0]) throw new UserError("No encontramos ese paquete.");
    return { ok: true as const };
  }
  await sql`
    insert into packages (name, qr_quota, price_cop, duration_days, description, active, sort_order)
    values (${name}, ${input.qrQuota}, ${input.priceCop}, ${input.durationDays}, ${description}, ${input.active}, ${sortOrder})
  `;
  return { ok: true as const };
}

export async function deletePackageFor(userId: string, id: number) {
  const sql = await db();
  await requireAdmin(sql, userId);
  await sql`delete from packages where id = ${id}`;
  return { ok: true as const };
}

export async function grantPackageFor(userId: string, targetId: string, packageId: number) {
  const sql = await db();
  await requireAdmin(sql, userId);
  const people = await sql<{ user_id: string }>`select user_id from profiles where user_id = ${targetId}`;
  if (!people[0]) throw new UserError("No encontramos a esa persona.");
  const packs = await sql<{ id: number; name: string; qr_quota: number; price_cop: number; duration_days: number }>`
    select id, name, qr_quota, price_cop, duration_days from packages where id = ${packageId}
  `;
  const pack = packs[0];
  if (!pack) throw new UserError("No encontramos ese paquete.");
  const days = num(pack.duration_days);
  const reference = referenceOf("AD");
  await sql`
    insert into entitlements (
      user_id, package_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, payment_method, granted_by
    ) values (
      ${targetId}, ${pack.id}, ${pack.name}, ${num(pack.qr_quota)}, ${num(pack.price_cop)}, ${days}, 'active', now(),
      now() + (${days} * interval '1 day'), ${reference}, 'admin', ${userId}
    )
  `;
  return { ok: true as const };
}

export async function setExpiryFor(userId: string, entitlementId: number, day: string) {
  const sql = await db();
  await requireAdmin(sql, userId);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new UserError("Fecha inválida.");
  const expires = new Date(`${day}T23:59:59-05:00`);
  if (Number.isNaN(expires.getTime())) throw new UserError("Fecha inválida.");
  const status = expires.getTime() > Date.now() ? "active" : "expired";
  const rows = await sql<{ id: number }>`
    update entitlements set expires_at = ${expires.toISOString()}, status = ${status}
    where id = ${entitlementId} and status in ('active', 'expired')
    returning id
  `;
  if (!rows[0]) throw new UserError("Ese paquete no se puede modificar.");
  return { ok: true as const };
}

export async function setRoleFor(userId: string, targetId: string, role: "admin" | "user") {
  const sql = await db();
  await requireAdmin(sql, userId);
  if (role !== "admin" && role !== "user") throw new UserError("Rol inválido.");
  if (role === "user") {
    const others = await sql<{ n: number }>`select count(*)::int as n from profiles where role = 'admin' and user_id <> ${targetId}`;
    if (num(others[0]?.n) === 0) throw new UserError("Tiene que quedar al menos una cuenta de administración.");
  }
  const rows = await sql<{ user_id: string }>`update profiles set role = ${role} where user_id = ${targetId} returning user_id`;
  if (!rows[0]) throw new UserError("No encontramos a esa persona.");
  return { ok: true as const };
}

export async function adminSettingsFor(userId: string): Promise<AdminSettings> {
  const sql = await db();
  await requireAdmin(sql, userId);
  const cfg = await settings(sql);
  const env = cfg.wompi_env === "production" ? "production" : "sandbox";
  return {
    wompiPublicKey: cfg.wompi_public_key,
    hasIntegrity: cfg.wompi_integrity_secret.trim().length > 0,
    integrityHint: hint(cfg.wompi_integrity_secret.trim()),
    hasEvents: cfg.wompi_events_secret.trim().length > 0,
    eventsHint: hint(cfg.wompi_events_secret.trim()),
    wompiEnv: env,
    allowDemoCheckout: cfg.allow_demo_checkout,
    freeQrLimit: cfg.free_qr_limit,
    freeGraceDays: cfg.free_grace_days,
  };
}

export async function saveSettingsFor(
  userId: string,
  input: {
    wompiPublicKey: string;
    wompiIntegritySecret: string;
    wompiEventsSecret: string;
    wompiEnv: string;
    allowDemoCheckout: boolean;
    freeQrLimit: number;
    freeGraceDays: number;
  },
) {
  const sql = await db();
  await requireAdmin(sql, userId);
  const key = input.wompiPublicKey.trim();
  if (key && !key.startsWith("pub_")) throw new UserError("La llave pública de Wompi empieza por pub_test_ o pub_prod_.");
  if (!Number.isInteger(input.freeQrLimit) || input.freeQrLimit < 0 || input.freeQrLimit > 20) {
    throw new UserError("El cupo gratis debe estar entre 0 y 20.");
  }
  if (!Number.isInteger(input.freeGraceDays) || input.freeGraceDays < 1 || input.freeGraceDays > 365) {
    throw new UserError("Los días de actividad deben estar entre 1 y 365.");
  }
  const env = input.wompiEnv === "production" ? "production" : "sandbox";
  const current = await settings(sql);
  const integritySecret = input.wompiIntegritySecret.trim() || current.wompi_integrity_secret;
  const eventsSecret = input.wompiEventsSecret.trim() || current.wompi_events_secret;
  await sql`
    update app_settings set
      wompi_public_key = ${key},
      wompi_integrity_secret = ${integritySecret},
      wompi_events_secret = ${eventsSecret},
      wompi_env = ${env},
      allow_demo_checkout = ${input.allowDemoCheckout},
      free_qr_limit = ${input.freeQrLimit},
      free_grace_days = ${input.freeGraceDays}
    where id = 1
  `;
  return { ok: true as const };
}

export async function resolvePublic(code: string): Promise<PublicQr> {
  const normalized = code.trim().toLowerCase();
  if (!/^[a-z0-9]{6,16}$/.test(normalized)) return { kind: "missing" };
  const sql = await db();
  await sweep(sql);
  const rows = await sql<{
    title: string;
    kind: string;
    destination: string;
    payload: string;
    slot: string;
    last_seen_at: unknown;
    ent_status: string | null;
    ent_expires: unknown;
    grace: number;
  }>`
    select q.title, q.kind, q.destination, q.payload, q.slot, p.last_seen_at,
           e.status as ent_status, e.expires_at as ent_expires, s.free_grace_days as grace
    from qr_codes q
    join profiles p on p.user_id = q.user_id
    left join entitlements e on e.id = q.entitlement_id
    cross join app_settings s
    where q.public_id = ${normalized} and s.id = 1
  `;
  const row = rows[0];
  if (!row) return { kind: "missing" };
  await sql`update qr_codes set scans = scans + 1, last_scanned_at = now() where public_id = ${normalized}`;
  const seen = iso(row.last_seen_at);
  const freeLive = seen ? Date.now() - new Date(seen).getTime() <= num(row.grace) * 86_400_000 : false;
  const state = liveOf(
    { slot: row.slot, ent_status: row.ent_status, ent_expires: row.ent_expires },
    freeLive,
  );
  if (!state.live) return { kind: "paused" };
  const kind = row.kind as Kind;
  if (kind === "url" || kind === "whatsapp") {
    const href = safeHttp(row.destination);
    if (href) return { kind: "redirect", href };
  }
  if (kind === "phone" && row.destination.startsWith("tel:")) return { kind: "redirect", href: row.destination };
  if (kind === "email" && row.destination.startsWith("mailto:")) return { kind: "redirect", href: row.destination };
  let stored: Partial<QrInput> = {};
  try {
    stored = JSON.parse(row.payload) as Partial<QrInput>;
  } catch {
    stored = {};
  }
  if (kind === "wifi") {
    return {
      kind: "card",
      title: row.title || "Wi-Fi",
      presentation: "wifi",
      raw: row.destination,
      lines: [
        { label: "Red", value: stored.wifiSsid || row.destination, copy: true },
        {
          label: "Clave",
          value: stored.wifiSecurity === "nopass" ? "Red abierta" : stored.wifiPassword || "",
          copy: stored.wifiSecurity !== "nopass",
        },
      ],
    };
  }
  if (kind === "vcard") {
    return {
      kind: "card",
      title: stored.vcardName || row.title || "Contacto",
      presentation: "vcard",
      raw: row.destination,
      lines: [
        { label: "Nombre", value: stored.vcardName || "" },
        { label: "Organización", value: stored.vcardOrg || "" },
        { label: "Teléfono", value: stored.vcardPhone || "", copy: Boolean(stored.vcardPhone) },
        { label: "Correo", value: stored.vcardEmail || "", copy: Boolean(stored.vcardEmail) },
      ].filter((line) => line.value),
    };
  }
  return {
    kind: "card",
    title: row.title || "Texto",
    presentation: "text",
    raw: row.destination,
    lines: [{ label: "Mensaje", value: row.destination, copy: true }],
  };
}
