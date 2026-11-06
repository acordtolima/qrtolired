import { r as getSql } from "./db-dFpH7jxL.mjs";
import { c as UserError, f as payloadOf, l as compose, p as safeHttp, u as inputFromParts } from "./content-B_3bvPxl.mjs";
import { createHash, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/logic.server-f5Dz6u3U.js
function iso(value) {
	if (value == null) return null;
	if (value instanceof Date) return value.toISOString();
	const date = new Date(String(value));
	if (Number.isNaN(date.getTime())) return null;
	return date.toISOString();
}
function num(value) {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}
function flag(value) {
	return value === true || value === "t" || value === "true" || value === 1;
}
function hint(secret) {
	if (!secret) return "";
	return `••••${secret.slice(-4)}`;
}
async function db() {
	return getSql();
}
async function settings(sql) {
	const row = (await sql`select wompi_public_key, wompi_integrity_secret, wompi_events_secret, wompi_env, allow_demo_checkout, free_qr_limit, free_grace_days from app_settings where id = 1`)[0];
	if (!row) throw new UserError("Falta la configuración.");
	return {
		...row,
		allow_demo_checkout: flag(row.allow_demo_checkout),
		free_qr_limit: num(row.free_qr_limit) || 3,
		free_grace_days: num(row.free_grace_days) || 30
	};
}
async function sweep(sql) {
	await sql`update entitlements set status = 'expired' where status = 'active' and expires_at is not null and expires_at <= now()`;
}
async function ensureProfile(sql, userId) {
	const auth = await sql`select name, email from "user" where id = ${userId}`;
	const name = auth[0]?.name ?? "";
	const email = auth[0]?.email ?? "";
	if (!(await sql`select role from profiles where user_id = ${userId}`)[0]) {
		await sql`insert into profiles (user_id, email, name, role) values (${userId}, ${email}, ${name}, ${num((await sql`select count(*)::int as n from profiles where role = 'admin'`)[0]?.n) === 0 ? "admin" : "user"}) on conflict (user_id) do update set email = excluded.email, name = excluded.name`;
		return;
	}
	await sql`update profiles set email = ${email}, name = ${name} where user_id = ${userId}`;
}
async function touchSeen(sql, userId, graceDays) {
	const previous = iso((await sql`select last_seen_at from profiles where user_id = ${userId}`)[0]?.last_seen_at);
	const wasLapsed = previous ? Date.now() - new Date(previous).getTime() > graceDays * 864e5 : false;
	await sql`update profiles set last_seen_at = now() where user_id = ${userId}`;
	return {
		wasLapsed,
		freeUntil: new Date(Date.now() + graceDays * 864e5).toISOString()
	};
}
async function activeEntitlements(sql, userId) {
	return (await sql`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements
    where user_id = ${userId} and status = 'active' and (expires_at is null or expires_at > now())
    order by expires_at desc nulls first, id desc
  `).map((row) => ({
		...row,
		qr_quota: num(row.qr_quota),
		price_cop: num(row.price_cop)
	}));
}
async function usage(sql, userId, freeLimit) {
	const free = await sql`select count(*)::int as n from qr_codes where user_id = ${userId} and slot = 'free'`;
	const active = await activeEntitlements(sql, userId);
	const paidCapacity = active.reduce((sum, row) => sum + row.qr_quota, 0);
	const usedRows = await sql`
    select entitlement_id, count(*)::int as n
    from qr_codes
    where user_id = ${userId} and slot = 'paid'
    group by entitlement_id
  `;
	const activeIds = new Set(active.map((row) => row.id));
	const paidUsed = usedRows.reduce((sum, row) => row.entitlement_id != null && activeIds.has(num(row.entitlement_id)) ? sum + num(row.n) : sum, 0);
	const freeUsed = num(free[0]?.n);
	return {
		freeUsed,
		paidCapacity,
		paidUsed,
		remaining: Math.max(0, freeLimit - freeUsed) + Math.max(0, paidCapacity - paidUsed),
		active
	};
}
function mapEntitlement(row) {
	return {
		id: num(row.id),
		packageName: row.package_name,
		qrQuota: num(row.qr_quota),
		priceCop: num(row.price_cop),
		status: row.status,
		startsAt: iso(row.starts_at),
		expiresAt: iso(row.expires_at),
		reference: row.reference,
		granted: Boolean(row.granted_by)
	};
}
function liveOf(row, freeLive) {
	if (row.slot === "free") return freeLive ? {
		live: true,
		pauseReason: null
	} : {
		live: false,
		pauseReason: "Gratis en pausa: hay que entrar al panel al menos una vez al mes."
	};
	const expires = iso(row.ent_expires);
	return row.ent_status === "active" && (!expires || new Date(expires).getTime() > Date.now()) ? {
		live: true,
		pauseReason: null
	} : {
		live: false,
		pauseReason: "El paquete de este código no tiene el pago activo."
	};
}
function sourceLabel(row, freeUntil) {
	if (row.slot === "free") return freeUntil ? `Gratis · entra antes del ${freeUntil}` : "Gratis";
	return row.package_name ? `Paquete ${row.package_name}` : "Paquete";
}
function mapList(row, freeLive, freeUntilLabel) {
	const state = liveOf(row, freeLive);
	return {
		id: num(row.id),
		publicId: row.public_id,
		title: row.title || "Sin título",
		kind: row.kind,
		summary: row.summary,
		slot: row.slot === "paid" ? "paid" : "free",
		live: state.live,
		pauseReason: state.pauseReason,
		sourceLabel: sourceLabel(row, freeUntilLabel),
		scans: num(row.scans),
		fg: row.fg_color,
		bg: row.bg_color,
		accent: row.accent_color,
		dotStyle: row.dot_style,
		cornerStyle: row.corner_style,
		hasLogo: flag(row.has_logo)
	};
}
async function meFor(sql, userId, touch) {
	await sweep(sql);
	await ensureProfile(sql, userId);
	const cfg = await settings(sql);
	const seen = touch ? await touchSeen(sql, userId, cfg.free_grace_days) : {
		wasLapsed: false,
		freeUntil: new Date(Date.now() + cfg.free_grace_days * 864e5).toISOString()
	};
	const profile = await sql`select name, email, role from profiles where user_id = ${userId}`;
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
		remaining: quota.remaining
	};
}
async function getMeFor(userId) {
	return meFor(await db(), userId, true);
}
async function dashboardFor(userId) {
	const sql = await db();
	const me = await meFor(sql, userId, true);
	const rows = await sql`
    select q.id, q.public_id, q.title, q.kind, q.summary, q.slot, q.entitlement_id,
           q.fg_color, q.bg_color, q.accent_color, q.dot_style, q.corner_style,
           (q.logo_data is not null and q.logo_data <> '') as has_logo,
           q.scans, e.package_name, e.status as ent_status, e.expires_at as ent_expires
    from qr_codes q
    left join entitlements e on e.id = q.entitlement_id
    where q.user_id = ${userId}
    order by q.updated_at desc
  `;
	const ents = await sql`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements where user_id = ${userId} order by created_at desc limit 20
  `;
	const { fecha } = await import("./format-Bv96BNfL.mjs").then((n) => n.r);
	return {
		...me,
		qrs: rows.map((row) => mapList(row, true, fecha(me.freeUntil))),
		entitlements: ents.map(mapEntitlement)
	};
}
async function qrFor(userId, id) {
	const sql = await db();
	await sweep(sql);
	await ensureProfile(sql, userId);
	const row = (await sql`
    select q.id, q.public_id, q.title, q.kind, q.summary, q.slot, q.entitlement_id,
           q.fg_color, q.bg_color, q.accent_color, q.dot_style, q.corner_style,
           q.payload, q.logo_data, q.scans,
           (q.logo_data is not null and q.logo_data <> '') as has_logo,
           e.package_name, e.status as ent_status, e.expires_at as ent_expires
    from qr_codes q
    left join entitlements e on e.id = q.entitlement_id
    where q.id = ${id} and q.user_id = ${userId}
  `)[0];
	if (!row) throw new UserError("No encontramos ese código.");
	const cfg = await settings(sql);
	const seen = iso((await sql`select last_seen_at from profiles where user_id = ${userId}`)[0]?.last_seen_at);
	const state = liveOf(row, seen ? Date.now() - new Date(seen).getTime() <= cfg.free_grace_days * 864e5 : false);
	const input = inputFromParts({
		title: row.title,
		kind: row.kind,
		payload: row.payload,
		fg: row.fg_color,
		bg: row.bg_color,
		accent: row.accent_color,
		dotStyle: row.dot_style,
		cornerStyle: row.corner_style,
		logoData: row.logo_data
	});
	const { fecha } = await import("./format-Bv96BNfL.mjs").then((n) => n.r);
	const freeUntil = seen ? fecha(new Date(new Date(seen).getTime() + cfg.free_grace_days * 864e5).toISOString()) : null;
	return {
		id: num(row.id),
		publicId: row.public_id,
		input,
		scans: num(row.scans),
		live: state.live,
		pauseReason: state.pauseReason,
		sourceLabel: sourceLabel(row, freeUntil)
	};
}
function publicId() {
	const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
	const bytes = randomBytes(8);
	let out = "";
	for (let i = 0; i < 8; i += 1) out += alphabet[bytes[i] % 31];
	return out;
}
async function pickSlot(sql, userId) {
	const cfg = await settings(sql);
	const quota = await usage(sql, userId, cfg.free_qr_limit);
	if (quota.freeUsed < cfg.free_qr_limit) return {
		slot: "free",
		entitlementId: null
	};
	for (const ent of quota.active) if (num((await sql`select count(*)::int as n from qr_codes where user_id = ${userId} and entitlement_id = ${ent.id}`)[0]?.n) < ent.qr_quota) return {
		slot: "paid",
		entitlementId: ent.id
	};
	throw new UserError("Ya usaste tus códigos gratis y no tienes un paquete con cupo. Compra uno para crear más.");
}
async function createQrFor(userId, input) {
	const sql = await db();
	await sweep(sql);
	await ensureProfile(sql, userId);
	const made = compose(input);
	const slot = await pickSlot(sql, userId);
	return {
		ok: true,
		id: num((await sql`
    insert into qr_codes (
      user_id, public_id, title, kind, payload, destination, summary, slot, entitlement_id,
      fg_color, bg_color, accent_color, dot_style, corner_style, logo_data
    ) values (
      ${userId}, ${publicId()}, ${input.title || "Sin título"}, ${input.kind}, ${JSON.stringify(payloadOf(input))}, ${made.destination},
      ${made.summary}, ${slot.slot}, ${slot.entitlementId}, ${input.fg}, ${input.bg}, ${input.accent},
      ${input.dotStyle}, ${input.cornerStyle}, ${input.logoData}
    ) returning id
  `)[0]?.id)
	};
}
async function updateQrFor(userId, id, input) {
	const sql = await db();
	await ensureProfile(sql, userId);
	const made = compose(input);
	if (!(await sql`
    update qr_codes set
      title = ${input.title || "Sin título"},
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
  `)[0]) throw new UserError("No encontramos ese código.");
	return { ok: true };
}
async function deleteQrFor(userId, id) {
	if (!(await (await db())`delete from qr_codes where id = ${id} and user_id = ${userId} returning id`)[0]) throw new UserError("No encontramos ese código.");
	return { ok: true };
}
async function reactivateQrFor(userId, id) {
	const sql = await db();
	await sweep(sql);
	await ensureProfile(sql, userId);
	if (!(await sql`
    select id, slot, entitlement_id from qr_codes where id = ${id} and user_id = ${userId}
  `)[0]) throw new UserError("No encontramos ese código.");
	const slot = await pickSlot(sql, userId);
	await sql`update qr_codes set slot = ${slot.slot}, entitlement_id = ${slot.entitlementId}, updated_at = now() where id = ${id} and user_id = ${userId}`;
	return { ok: true };
}
function mapPackage(row) {
	return {
		id: num(row.id),
		name: row.name,
		qrQuota: num(row.qr_quota),
		priceCop: num(row.price_cop),
		durationDays: num(row.duration_days),
		description: row.description
	};
}
async function publicPackages() {
	return (await (await db())`select id, name, qr_quota, price_cop, duration_days, description from packages where active = true order by sort_order, id`).map(mapPackage);
}
async function plansFor(userId) {
	const sql = await db();
	const me = await meFor(sql, userId, true);
	const cfg = await settings(sql);
	const packages = await publicPackages();
	const ents = await sql`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements where user_id = ${userId} order by created_at desc limit 12
  `;
	const key = cfg.wompi_public_key.trim();
	return {
		packages,
		entitlements: ents.map(mapEntitlement),
		wompiReady: key.startsWith("pub_") && cfg.wompi_integrity_secret.trim().length > 0,
		demoCheckout: cfg.allow_demo_checkout && key.length === 0,
		remaining: me.remaining
	};
}
function referenceOf(prefix) {
	return `${prefix}${randomBytes(8).toString("hex")}`.slice(0, 32).toUpperCase();
}
function integrity(reference, amountInCents, secret) {
	return createHash("sha256").update(`${reference}${amountInCents}COP${secret}`).digest("hex");
}
async function startCheckoutFor(userId, packageId) {
	const sql = await db();
	await sweep(sql);
	await ensureProfile(sql, userId);
	const pack = (await sql`select id, name, qr_quota, price_cop, duration_days, active from packages where id = ${packageId}`)[0];
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
		return {
			ok: true,
			mode: "activated",
			reference
		};
	}
	await sql`
    insert into entitlements (user_id, package_id, package_name, qr_quota, price_cop, duration_days, status, reference)
    values (${userId}, ${pack.id}, ${pack.name}, ${quota}, ${price}, ${days}, 'pending', ${reference})
  `;
	const cfg = await settings(sql);
	const key = cfg.wompi_public_key.trim();
	const secret = cfg.wompi_integrity_secret.trim();
	if (key.startsWith("pub_") && secret) return {
		ok: true,
		mode: "wompi",
		reference,
		publicKey: key,
		amountInCents: price * 100,
		currency: "COP",
		integrity: integrity(reference, price * 100, secret),
		packageName: pack.name,
		priceCop: price
	};
	if (cfg.allow_demo_checkout && !key) return {
		ok: true,
		mode: "demo",
		reference,
		priceCop: price,
		packageName: pack.name
	};
	throw new UserError("Los pagos con Wompi todavía no están configurados.");
}
function wompiBase(publicKey, env) {
	if (publicKey.startsWith("pub_prod_") || env === "production") return "https://production.wompi.co/v1";
	return "https://sandbox.wompi.co/v1";
}
async function fetchTx(base, id) {
	const response = await fetch(`${base}/transactions/${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(12e3) });
	if (!response.ok) throw new UserError("Wompi no devolvió la transacción.");
	const body = await response.json();
	if (!body.data?.id) throw new UserError("La respuesta de Wompi está incompleta.");
	return body.data;
}
async function activate(sql, reference, txId, method) {
	const ent = (await sql`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements where reference = ${reference}
  `)[0];
	if (!ent) throw new UserError("No encontramos ese pago.");
	if (ent.status === "active") return ent;
	if (ent.status !== "pending") throw new UserError("Ese pago ya no se puede confirmar.");
	await sql`
    update entitlements set
      status = 'active',
      starts_at = now(),
      expires_at = now() + (${num(ent.duration_days)} * interval '1 day'),
      wompi_transaction_id = ${txId},
      payment_method = ${method}
    where id = ${ent.id} and status = 'pending'
  `;
	return (await sql`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements where id = ${ent.id}
  `)[0] ?? ent;
}
async function confirmPaymentFor(userId, reference, transactionId) {
	const sql = await db();
	const ent = (await sql`
    select id, user_id, package_name, qr_quota, price_cop, duration_days, status, starts_at, expires_at, reference, granted_by
    from entitlements where reference = ${reference} and user_id = ${userId}
  `)[0];
	if (!ent) throw new UserError("No encontramos ese pago.");
	if (ent.status === "active") return {
		ok: true,
		status: "active",
		packageName: ent.package_name,
		expiresAt: iso(ent.expires_at),
		detail: "El paquete ya está activo."
	};
	const price = num(ent.price_cop);
	const cfg = await settings(sql);
	if (!transactionId || transactionId === "demo") {
		if (price !== 0 && !(cfg.allow_demo_checkout && !cfg.wompi_public_key.trim())) throw new UserError("Falta la transacción de Wompi.");
		const saved = await activate(sql, reference, price === 0 ? "GRATIS" : "DEMO", price === 0 ? "gratis" : "demo");
		return {
			ok: true,
			status: "active",
			packageName: saved.package_name,
			expiresAt: iso(saved.expires_at),
			detail: price === 0 ? "Paquete activado." : "Pago de prueba aprobado. En producción aquí responde Wompi."
		};
	}
	const tx = await fetchTx(wompiBase(cfg.wompi_public_key, cfg.wompi_env), transactionId);
	if (tx.reference !== reference || tx.currency !== "COP" || num(tx.amount_in_cents) !== price * 100) throw new UserError("La transacción no coincide con este paquete.");
	if (tx.status === "APPROVED") {
		const saved = await activate(sql, reference, tx.id, tx.payment_method_type ?? "wompi");
		return {
			ok: true,
			status: "active",
			packageName: saved.package_name,
			expiresAt: iso(saved.expires_at),
			detail: "Wompi aprobó el pago. El paquete ya está activo."
		};
	}
	if (tx.status === "PENDING") return {
		ok: true,
		status: "pending",
		packageName: ent.package_name,
		expiresAt: null,
		detail: "Wompi todavía está confirmando el pago. Vuelve a revisar en un momento."
	};
	await sql`update entitlements set status = 'declined', wompi_transaction_id = ${tx.id}, payment_method = ${tx.payment_method_type ?? null} where id = ${ent.id} and status = 'pending'`;
	return {
		ok: true,
		status: "declined",
		packageName: ent.package_name,
		expiresAt: null,
		detail: "Wompi no aprobó el pago. Puedes intentarlo de nuevo."
	};
}
function readPath(source, path) {
	return path.split(".").reduce((acc, key) => {
		if (acc && typeof acc === "object" && key in acc) return acc[key];
	}, source);
}
async function handleWompiEvent(request) {
	const sql = await db();
	const cfg = await settings(sql);
	const secret = cfg.wompi_events_secret.trim();
	if (!secret) return Response.json({
		ok: false,
		ignored: true
	});
	let event;
	try {
		event = await request.json();
	} catch {
		return Response.json({ ok: false }, { status: 400 });
	}
	const signed = (event.signature?.properties ?? []).map((prop) => String(readPath(event.data, prop) ?? "")).join("");
	if (createHash("sha256").update(`${signed}${event.timestamp ?? ""}${secret}`).digest("hex") !== String(event.signature?.checksum ?? "").toLowerCase()) return Response.json({ ok: false }, { status: 401 });
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
async function requireAdmin(sql, userId) {
	await ensureProfile(sql, userId);
	if ((await sql`select role from profiles where user_id = ${userId}`)[0]?.role !== "admin") throw new UserError("No autorizado.");
}
async function adminOverviewFor(userId) {
	const sql = await db();
	await sweep(sql);
	await requireAdmin(sql, userId);
	const users = await sql`select count(*)::int as n from profiles`;
	const qrs = await sql`select count(*)::int as n from qr_codes`;
	const scans = await sql`select coalesce(sum(scans), 0)::int as n from qr_codes`;
	const active = await sql`select count(*)::int as n from entitlements where status = 'active' and (expires_at is null or expires_at > now())`;
	const expiring = await sql`
    select p.name, p.email, e.package_name, e.expires_at
    from entitlements e join profiles p on p.user_id = e.user_id
    where e.status = 'active' and e.expires_at is not null and e.expires_at < now() + interval '7 day'
    order by e.expires_at
    limit 12
  `;
	const recent = await sql`
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
			expiresAt: iso(row.expires_at) ?? ""
		})),
		recent: recent.map((row) => ({
			name: row.name,
			email: row.email,
			packageName: row.package_name,
			status: row.status,
			priceCop: num(row.price_cop),
			createdAt: iso(row.created_at) ?? ""
		}))
	};
}
async function adminUsersFor(userId) {
	const sql = await db();
	await sweep(sql);
	await requireAdmin(sql, userId);
	const cfg = await settings(sql);
	const people = await sql`
    select p.user_id, p.name, p.email, p.role, p.last_seen_at,
           (select count(*)::int from qr_codes q where q.user_id = p.user_id) as qr_count
    from profiles p
    order by p.created_at desc
    limit 200
  `;
	const ents = await sql`select id, user_id, package_name, qr_quota, status, expires_at, price_cop from entitlements order by created_at desc`;
	const packs = await allPackages(sql);
	return {
		users: people.map((person) => {
			const seen = iso(person.last_seen_at) ?? (/* @__PURE__ */ new Date()).toISOString();
			const freeUntil = new Date(new Date(seen).getTime() + cfg.free_grace_days * 864e5).toISOString();
			return {
				userId: person.user_id,
				name: person.name,
				email: person.email,
				role: person.role === "admin" ? "admin" : "user",
				lastSeenAt: seen,
				freeUntil,
				freeLive: new Date(freeUntil).getTime() > Date.now(),
				qrCount: num(person.qr_count),
				entitlements: ents.filter((row) => row.user_id === person.user_id).slice(0, 8).map((row) => ({
					id: num(row.id),
					packageName: row.package_name,
					qrQuota: num(row.qr_quota),
					status: row.status,
					expiresAt: iso(row.expires_at),
					priceCop: num(row.price_cop)
				}))
			};
		}),
		packages: packs
	};
}
async function allPackages(sql) {
	return (await sql`select id, name, qr_quota, price_cop, duration_days, description, active, sort_order from packages order by sort_order, id`).map((row) => ({
		...mapPackage(row),
		active: flag(row.active),
		sortOrder: num(row.sort_order)
	}));
}
async function adminPackagesFor(userId) {
	const sql = await db();
	await requireAdmin(sql, userId);
	return allPackages(sql);
}
async function savePackageFor(userId, input) {
	const sql = await db();
	await requireAdmin(sql, userId);
	const name = input.name.trim().slice(0, 60);
	if (!name) throw new UserError("El paquete necesita un nombre.");
	if (!Number.isInteger(input.qrQuota) || input.qrQuota < 1 || input.qrQuota > 500) throw new UserError("La cantidad de códigos debe estar entre 1 y 500.");
	if (!Number.isInteger(input.priceCop) || input.priceCop < 0 || input.priceCop > 1e8) throw new UserError("El precio no es válido.");
	if (!Number.isInteger(input.durationDays) || input.durationDays < 1 || input.durationDays > 3650) throw new UserError("La duración debe estar entre 1 y 3650 días.");
	const description = input.description.trim().slice(0, 240);
	const sortOrder = Number.isInteger(input.sortOrder) ? input.sortOrder : 0;
	if (input.id) {
		if (!(await sql`
      update packages set name = ${name}, qr_quota = ${input.qrQuota}, price_cop = ${input.priceCop},
        duration_days = ${input.durationDays}, description = ${description}, active = ${input.active}, sort_order = ${sortOrder}
      where id = ${input.id} returning id
    `)[0]) throw new UserError("No encontramos ese paquete.");
		return { ok: true };
	}
	await sql`
    insert into packages (name, qr_quota, price_cop, duration_days, description, active, sort_order)
    values (${name}, ${input.qrQuota}, ${input.priceCop}, ${input.durationDays}, ${description}, ${input.active}, ${sortOrder})
  `;
	return { ok: true };
}
async function deletePackageFor(userId, id) {
	const sql = await db();
	await requireAdmin(sql, userId);
	await sql`delete from packages where id = ${id}`;
	return { ok: true };
}
async function grantPackageFor(userId, targetId, packageId) {
	const sql = await db();
	await requireAdmin(sql, userId);
	if (!(await sql`select user_id from profiles where user_id = ${targetId}`)[0]) throw new UserError("No encontramos a esa persona.");
	const pack = (await sql`
    select id, name, qr_quota, price_cop, duration_days from packages where id = ${packageId}
  `)[0];
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
	return { ok: true };
}
async function setExpiryFor(userId, entitlementId, day) {
	const sql = await db();
	await requireAdmin(sql, userId);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new UserError("Fecha inválida.");
	const expires = /* @__PURE__ */ new Date(`${day}T23:59:59-05:00`);
	if (Number.isNaN(expires.getTime())) throw new UserError("Fecha inválida.");
	const status = expires.getTime() > Date.now() ? "active" : "expired";
	if (!(await sql`
    update entitlements set expires_at = ${expires.toISOString()}, status = ${status}
    where id = ${entitlementId} and status in ('active', 'expired')
    returning id
  `)[0]) throw new UserError("Ese paquete no se puede modificar.");
	return { ok: true };
}
async function setRoleFor(userId, targetId, role) {
	const sql = await db();
	await requireAdmin(sql, userId);
	if (role !== "admin" && role !== "user") throw new UserError("Rol inválido.");
	if (role === "user") {
		if (num((await sql`select count(*)::int as n from profiles where role = 'admin' and user_id <> ${targetId}`)[0]?.n) === 0) throw new UserError("Tiene que quedar al menos una cuenta de administración.");
	}
	if (!(await sql`update profiles set role = ${role} where user_id = ${targetId} returning user_id`)[0]) throw new UserError("No encontramos a esa persona.");
	return { ok: true };
}
async function adminSettingsFor(userId) {
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
		freeGraceDays: cfg.free_grace_days
	};
}
async function saveSettingsFor(userId, input) {
	const sql = await db();
	await requireAdmin(sql, userId);
	const key = input.wompiPublicKey.trim();
	if (key && !key.startsWith("pub_")) throw new UserError("La llave pública de Wompi empieza por pub_test_ o pub_prod_.");
	if (!Number.isInteger(input.freeQrLimit) || input.freeQrLimit < 0 || input.freeQrLimit > 20) throw new UserError("El cupo gratis debe estar entre 0 y 20.");
	if (!Number.isInteger(input.freeGraceDays) || input.freeGraceDays < 1 || input.freeGraceDays > 365) throw new UserError("Los días de actividad deben estar entre 1 y 365.");
	const env = input.wompiEnv === "production" ? "production" : "sandbox";
	const current = await settings(sql);
	await sql`
    update app_settings set
      wompi_public_key = ${key},
      wompi_integrity_secret = ${input.wompiIntegritySecret.trim() || current.wompi_integrity_secret},
      wompi_events_secret = ${input.wompiEventsSecret.trim() || current.wompi_events_secret},
      wompi_env = ${env},
      allow_demo_checkout = ${input.allowDemoCheckout},
      free_qr_limit = ${input.freeQrLimit},
      free_grace_days = ${input.freeGraceDays}
    where id = 1
  `;
	return { ok: true };
}
async function resolvePublic(code) {
	const normalized = code.trim().toLowerCase();
	if (!/^[a-z0-9]{6,16}$/.test(normalized)) return { kind: "missing" };
	const sql = await db();
	await sweep(sql);
	const row = (await sql`
    select q.title, q.kind, q.destination, q.payload, q.slot, p.last_seen_at,
           e.status as ent_status, e.expires_at as ent_expires, s.free_grace_days as grace
    from qr_codes q
    join profiles p on p.user_id = q.user_id
    left join entitlements e on e.id = q.entitlement_id
    cross join app_settings s
    where q.public_id = ${normalized} and s.id = 1
  `)[0];
	if (!row) return { kind: "missing" };
	await sql`update qr_codes set scans = scans + 1, last_scanned_at = now() where public_id = ${normalized}`;
	const seen = iso(row.last_seen_at);
	const freeLive = seen ? Date.now() - new Date(seen).getTime() <= num(row.grace) * 864e5 : false;
	if (!liveOf({
		slot: row.slot,
		ent_status: row.ent_status,
		ent_expires: row.ent_expires
	}, freeLive).live) return { kind: "paused" };
	const kind = row.kind;
	if (kind === "url" || kind === "whatsapp") {
		const href = safeHttp(row.destination);
		if (href) return {
			kind: "redirect",
			href
		};
	}
	if (kind === "phone" && row.destination.startsWith("tel:")) return {
		kind: "redirect",
		href: row.destination
	};
	if (kind === "email" && row.destination.startsWith("mailto:")) return {
		kind: "redirect",
		href: row.destination
	};
	let stored = {};
	try {
		stored = JSON.parse(row.payload);
	} catch {
		stored = {};
	}
	if (kind === "wifi") return {
		kind: "card",
		title: row.title || "Wi-Fi",
		presentation: "wifi",
		raw: row.destination,
		lines: [{
			label: "Red",
			value: stored.wifiSsid || row.destination,
			copy: true
		}, {
			label: "Clave",
			value: stored.wifiSecurity === "nopass" ? "Red abierta" : stored.wifiPassword || "",
			copy: stored.wifiSecurity !== "nopass"
		}]
	};
	if (kind === "vcard") return {
		kind: "card",
		title: stored.vcardName || row.title || "Contacto",
		presentation: "vcard",
		raw: row.destination,
		lines: [
			{
				label: "Nombre",
				value: stored.vcardName || ""
			},
			{
				label: "Organización",
				value: stored.vcardOrg || ""
			},
			{
				label: "Teléfono",
				value: stored.vcardPhone || "",
				copy: Boolean(stored.vcardPhone)
			},
			{
				label: "Correo",
				value: stored.vcardEmail || "",
				copy: Boolean(stored.vcardEmail)
			}
		].filter((line) => line.value)
	};
	return {
		kind: "card",
		title: row.title || "Texto",
		presentation: "text",
		raw: row.destination,
		lines: [{
			label: "Mensaje",
			value: row.destination,
			copy: true
		}]
	};
}
//#endregion
export { adminOverviewFor, adminPackagesFor, adminSettingsFor, adminUsersFor, confirmPaymentFor, createQrFor, dashboardFor, deletePackageFor, deleteQrFor, getMeFor, grantPackageFor, handleWompiEvent, plansFor, publicPackages, qrFor, reactivateQrFor, resolvePublic, savePackageFor, saveSettingsFor, setExpiryFor, setRoleFor, startCheckoutFor, updateQrFor };
