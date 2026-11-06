import {
  CORNER_STYLES,
  DOT_STYLES,
  KINDS,
  type CornerStyle,
  type DotStyle,
  type Kind,
  type QrInput,
} from "./types";

export const EMPTY_INPUT: QrInput = {
  title: "",
  kind: "url",
  url: "",
  whatsappPhone: "",
  whatsappMessage: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiSecurity: "WPA",
  vcardName: "",
  vcardOrg: "",
  vcardPhone: "",
  vcardEmail: "",
  text: "",
  phone: "",
  email: "",
  emailSubject: "",
  emailBody: "",
  fg: "#1c1612",
  bg: "#fffaf3",
  accent: "#b4331e",
  dotStyle: "rounded",
  cornerStyle: "extra-rounded",
  logoData: null,
};

export const KIND_LABEL: Record<Kind, string> = {
  url: "Enlace",
  whatsapp: "WhatsApp",
  wifi: "Wi-Fi",
  vcard: "Contacto",
  text: "Texto",
  phone: "Teléfono",
  email: "Correo",
};

export const DOT_LABEL: Record<DotStyle, string> = {
  square: "Cuadrado",
  rounded: "Redondo",
  dots: "Puntos",
  "extra-rounded": "Suave",
  classy: "Clásico",
  "classy-rounded": "Clásico suave",
};

export const CORNER_LABEL: Record<CornerStyle, string> = {
  square: "Recta",
  rounded: "Media",
  "extra-rounded": "Redonda",
  dot: "Punto",
};

const HEX = /^#[0-9a-fA-F]{6}$/;
const LOGO = /^data:image\/(png|jpeg|jpg|webp);base64,[a-z0-9+/=\s]+$/i;
const MAX_LOGO = 150_000;

export class UserError extends Error {}

function clip(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function raw(value: unknown, max: number) {
  return String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
}

export function parseInput(data: unknown): QrInput {
  if (!data || typeof data !== "object") throw new UserError("Datos inválidos.");
  const d = data as Record<string, unknown>;
  const kind = d.kind;
  if (!KINDS.includes(kind as Kind)) throw new UserError("Tipo de código inválido.");
  const dotStyle = d.dotStyle;
  const cornerStyle = d.cornerStyle;
  if (!DOT_STYLES.includes(dotStyle as DotStyle)) throw new UserError("Forma inválida.");
  if (!CORNER_STYLES.includes(cornerStyle as CornerStyle)) throw new UserError("Esquina inválida.");
  const fg = String(d.fg ?? "");
  const bg = String(d.bg ?? "");
  const accent = String(d.accent ?? "");
  if (!HEX.test(fg) || !HEX.test(bg) || !HEX.test(accent)) {
    throw new UserError("Usa colores en formato #RRGGBB.");
  }
  if (fg.toLowerCase() === bg.toLowerCase()) {
    throw new UserError("La tinta y el fondo no pueden ser el mismo color.");
  }
  let logoData: string | null = null;
  if (d.logoData != null && d.logoData !== "") {
    const logo = String(d.logoData);
    if (!LOGO.test(logo) || logo.length > MAX_LOGO) {
      throw new UserError("El logo debe ser PNG, JPG o WebP de menos de 100 KB.");
    }
    logoData = logo;
  }
  const security = d.wifiSecurity;
  const wifiSecurity = security === "WEP" || security === "nopass" ? security : "WPA";
  return {
    title: clip(d.title, 80),
    kind: kind as Kind,
    url: raw(d.url, 2000),
    whatsappPhone: raw(d.whatsappPhone, 20),
    whatsappMessage: raw(d.whatsappMessage, 300),
    wifiSsid: raw(d.wifiSsid, 64),
    wifiPassword: raw(d.wifiPassword, 64),
    wifiSecurity,
    vcardName: clip(d.vcardName, 80),
    vcardOrg: clip(d.vcardOrg, 80),
    vcardPhone: raw(d.vcardPhone, 20),
    vcardEmail: raw(d.vcardEmail, 120),
    text: raw(d.text, 800),
    phone: raw(d.phone, 20),
    email: raw(d.email, 120),
    emailSubject: clip(d.emailSubject, 120),
    emailBody: raw(d.emailBody, 400),
    fg: fg.toLowerCase(),
    bg: bg.toLowerCase(),
    accent: accent.toLowerCase(),
    dotStyle: dotStyle as DotStyle,
    cornerStyle: cornerStyle as CornerStyle,
    logoData,
  };
}

function escWifi(value: string) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export type Composed = { destination: string; summary: string };

export function compose(input: QrInput): Composed {
  switch (input.kind) {
    case "url": {
      let url = input.url.trim();
      if (!url) throw new UserError("Escribe un enlace.");
      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        throw new UserError("Ese enlace no es válido.");
      }
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new UserError("El enlace debe empezar por http o https.");
      }
      return { destination: parsed.toString(), summary: parsed.toString() };
    }
    case "whatsapp": {
      const digits = input.whatsappPhone.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) {
        throw new UserError("Escribe el WhatsApp con indicativo. Ejemplo: 573001112233.");
      }
      const text = input.whatsappMessage.trim();
      const destination = text
        ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
        : `https://wa.me/${digits}`;
      return { destination, summary: `WhatsApp ${digits}` };
    }
    case "wifi": {
      if (!input.wifiSsid) throw new UserError("Escribe el nombre de la red.");
      if (input.wifiSecurity !== "nopass" && !input.wifiPassword) {
        throw new UserError("Escribe la clave de la red, o marca la red como abierta.");
      }
      const pass =
        input.wifiSecurity === "nopass" ? "" : `P:${escWifi(input.wifiPassword)};`;
      const destination = `WIFI:T:${input.wifiSecurity};S:${escWifi(input.wifiSsid)};${pass};`;
      return { destination, summary: input.wifiSsid };
    }
    case "vcard": {
      if (!input.vcardName) throw new UserError("Escribe el nombre del contacto.");
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${input.vcardName}`,
        input.vcardOrg ? `ORG:${input.vcardOrg}` : "",
        input.vcardPhone ? `TEL:${input.vcardPhone}` : "",
        input.vcardEmail ? `EMAIL:${input.vcardEmail}` : "",
        "END:VCARD",
      ].filter(Boolean);
      return { destination: lines.join("\n"), summary: input.vcardName };
    }
    case "text": {
      if (!input.text) throw new UserError("Escribe el texto del código.");
      return { destination: input.text, summary: input.text.slice(0, 80) };
    }
    case "phone": {
      const digits = input.phone.replace(/[^\d+]/g, "");
      if (digits.replace(/\D/g, "").length < 7) throw new UserError("Escribe un teléfono válido.");
      return { destination: `tel:${digits}`, summary: digits };
    }
    case "email": {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
        throw new UserError("Escribe un correo válido.");
      }
      const params = new URLSearchParams();
      if (input.emailSubject) params.set("subject", input.emailSubject);
      if (input.emailBody) params.set("body", input.emailBody);
      const q = params.toString();
      return {
        destination: `mailto:${input.email}${q ? `?${q}` : ""}`,
        summary: input.email,
      };
    }
    default:
      throw new UserError("Tipo de código inválido.");
  }
}

export function payloadOf(input: QrInput) {
  const { fg, bg, accent, dotStyle, cornerStyle, logoData, title, ...content } = input;
  void fg;
  void bg;
  void accent;
  void dotStyle;
  void cornerStyle;
  void logoData;
  void title;
  return content;
}

export function inputFromParts(parts: {
  title: string;
  kind: string;
  payload: string;
  fg: string;
  bg: string;
  accent: string;
  dotStyle: string;
  cornerStyle: string;
  logoData: string | null;
}): QrInput {
  let stored: Partial<QrInput> = {};
  try {
    stored = JSON.parse(parts.payload) as Partial<QrInput>;
  } catch {
    stored = {};
  }
  return parseInput({ ...EMPTY_INPUT, ...stored, ...parts, logoData: parts.logoData });
}

export function safeHttp(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.toString();
  } catch {
    /* not a url */
  }
  return null;
}
