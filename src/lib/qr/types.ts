export const KINDS = ["url", "whatsapp", "wifi", "vcard", "text", "phone", "email"] as const;
export type Kind = (typeof KINDS)[number];

export const DOT_STYLES = [
  "square",
  "rounded",
  "dots",
  "extra-rounded",
  "classy",
  "classy-rounded",
] as const;
export type DotStyle = (typeof DOT_STYLES)[number];

export const CORNER_STYLES = ["square", "rounded", "extra-rounded", "dot"] as const;
export type CornerStyle = (typeof CORNER_STYLES)[number];

export type QrInput = {
  title: string;
  kind: Kind;
  url: string;
  whatsappPhone: string;
  whatsappMessage: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiSecurity: "WPA" | "WEP" | "nopass";
  vcardName: string;
  vcardOrg: string;
  vcardPhone: string;
  vcardEmail: string;
  text: string;
  phone: string;
  email: string;
  emailSubject: string;
  emailBody: string;
  fg: string;
  bg: string;
  accent: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  logoData: string | null;
};

export type PackageCard = {
  id: number;
  name: string;
  qrQuota: number;
  priceCop: number;
  durationDays: number;
  description: string;
};

export type EntitlementView = {
  id: number;
  packageName: string;
  qrQuota: number;
  priceCop: number;
  status: string;
  startsAt: string | null;
  expiresAt: string | null;
  reference: string;
  granted: boolean;
};

export type QrListItem = {
  id: number;
  publicId: string;
  title: string;
  kind: Kind;
  summary: string;
  slot: "free" | "paid" | "admin";
  live: boolean;
  pauseReason: string | null;
  sourceLabel: string;
  scans: number;
  fg: string;
  bg: string;
  accent: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  hasLogo: boolean;
};

export type Me = {
  name: string;
  email: string;
  role: "admin" | "user";
  wasLapsed: boolean;
  freeUntil: string;
  freeLimit: number;
  graceDays: number;
  freeUsed: number;
  paidCapacity: number;
  paidUsed: number;
  remaining: number;
};

export type Dashboard = Me & {
  qrs: QrListItem[];
  entitlements: EntitlementView[];
};

export type QrDetail = {
  id: number;
  publicId: string;
  input: QrInput;
  scans: number;
  live: boolean;
  pauseReason: string | null;
  sourceLabel: string;
};

export type PlansPayload = {
  packages: PackageCard[];
  entitlements: EntitlementView[];
  wompiReady: boolean;
  demoCheckout: boolean;
  remaining: number;
};

export type CheckoutStart =
  | { ok: false; error: string }
  | { ok: true; mode: "activated"; reference: string }
  | { ok: true; mode: "demo"; reference: string; priceCop: number; packageName: string }
  | {
      ok: true;
      mode: "wompi";
      reference: string;
      publicKey: string;
      amountInCents: number;
      currency: "COP";
      integrity: string;
      packageName: string;
      priceCop: number;
    };

export type PaymentState = {
  ok: true;
  status: "active" | "pending" | "declined";
  packageName: string;
  expiresAt: string | null;
  detail: string;
};

export type PublicQr =
  | { kind: "missing" }
  | { kind: "paused" }
  | { kind: "redirect"; href: string }
  | {
      kind: "card";
      title: string;
      presentation: "wifi" | "vcard" | "text";
      lines: { label: string; value: string; copy?: boolean }[];
      raw: string;
    };

export type Mutation = { ok: true } | { ok: false; error: string };

export type AdminOverview = {
  users: number;
  qrs: number;
  scans: number;
  activePacks: number;
  expiring: { name: string; email: string; packageName: string; expiresAt: string }[];
  recent: { name: string; email: string; packageName: string; status: string; priceCop: number; createdAt: string }[];
};

export type AdminUser = {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "user";
  lastSeenAt: string;
  freeUntil: string;
  freeLive: boolean;
  qrCount: number;
  entitlements: {
    id: number;
    packageName: string;
    qrQuota: number;
    status: string;
    expiresAt: string | null;
    priceCop: number;
  }[];
};

export type AdminPackage = PackageCard & { active: boolean; sortOrder: number };

export type AdminSettings = {
  wompiPublicKey: string;
  hasIntegrity: boolean;
  integrityHint: string;
  hasEvents: boolean;
  eventsHint: string;
  wompiEnv: "sandbox" | "production";
  allowDemoCheckout: boolean;
  freeQrLimit: number;
  freeGraceDays: number;
};
