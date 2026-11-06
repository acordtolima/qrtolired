//#region node_modules/.nitro/vite/services/ssr/assets/content-B_3bvPxl.js
var KINDS = [
	"url",
	"whatsapp",
	"wifi",
	"vcard",
	"text",
	"phone",
	"email"
];
var DOT_STYLES = [
	"square",
	"rounded",
	"dots",
	"extra-rounded",
	"classy",
	"classy-rounded"
];
var CORNER_STYLES = [
	"square",
	"rounded",
	"extra-rounded",
	"dot"
];
var EMPTY_INPUT = {
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
	logoData: null
};
var KIND_LABEL = {
	url: "Enlace",
	whatsapp: "WhatsApp",
	wifi: "Wi-Fi",
	vcard: "Contacto",
	text: "Texto",
	phone: "Teléfono",
	email: "Correo"
};
var DOT_LABEL = {
	square: "Cuadrado",
	rounded: "Redondo",
	dots: "Puntos",
	"extra-rounded": "Suave",
	classy: "Clásico",
	"classy-rounded": "Clásico suave"
};
var CORNER_LABEL = {
	square: "Recta",
	rounded: "Media",
	"extra-rounded": "Redonda",
	dot: "Punto"
};
var HEX = /^#[0-9a-fA-F]{6}$/;
var LOGO = /^data:image\/(png|jpeg|jpg|webp);base64,[a-z0-9+/=\s]+$/i;
var MAX_LOGO = 15e4;
var UserError = class extends Error {};
function clip(value, max) {
	return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}
function raw(value, max) {
	return String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
}
function parseInput(data) {
	if (!data || typeof data !== "object") throw new UserError("Datos inválidos.");
	const d = data;
	const kind = d.kind;
	if (!KINDS.includes(kind)) throw new UserError("Tipo de código inválido.");
	const dotStyle = d.dotStyle;
	const cornerStyle = d.cornerStyle;
	if (!DOT_STYLES.includes(dotStyle)) throw new UserError("Forma inválida.");
	if (!CORNER_STYLES.includes(cornerStyle)) throw new UserError("Esquina inválida.");
	const fg = String(d.fg ?? "");
	const bg = String(d.bg ?? "");
	const accent = String(d.accent ?? "");
	if (!HEX.test(fg) || !HEX.test(bg) || !HEX.test(accent)) throw new UserError("Usa colores en formato #RRGGBB.");
	if (fg.toLowerCase() === bg.toLowerCase()) throw new UserError("La tinta y el fondo no pueden ser el mismo color.");
	let logoData = null;
	if (d.logoData != null && d.logoData !== "") {
		const logo = String(d.logoData);
		if (!LOGO.test(logo) || logo.length > MAX_LOGO) throw new UserError("El logo debe ser PNG, JPG o WebP de menos de 100 KB.");
		logoData = logo;
	}
	const security = d.wifiSecurity;
	const wifiSecurity = security === "WEP" || security === "nopass" ? security : "WPA";
	return {
		title: clip(d.title, 80),
		kind,
		url: raw(d.url, 2e3),
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
		dotStyle,
		cornerStyle,
		logoData
	};
}
function escWifi(value) {
	return value.replace(/([\\;,:"])/g, "\\$1");
}
function compose(input) {
	switch (input.kind) {
		case "url": {
			let url = input.url.trim();
			if (!url) throw new UserError("Escribe un enlace.");
			if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
			let parsed;
			try {
				parsed = new URL(url);
			} catch {
				throw new UserError("Ese enlace no es válido.");
			}
			if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new UserError("El enlace debe empezar por http o https.");
			return {
				destination: parsed.toString(),
				summary: parsed.toString()
			};
		}
		case "whatsapp": {
			const digits = input.whatsappPhone.replace(/\D/g, "");
			if (digits.length < 8 || digits.length > 15) throw new UserError("Escribe el WhatsApp con indicativo. Ejemplo: 573001112233.");
			const text = input.whatsappMessage.trim();
			return {
				destination: text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`,
				summary: `WhatsApp ${digits}`
			};
		}
		case "wifi": {
			if (!input.wifiSsid) throw new UserError("Escribe el nombre de la red.");
			if (input.wifiSecurity !== "nopass" && !input.wifiPassword) throw new UserError("Escribe la clave de la red, o marca la red como abierta.");
			const pass = input.wifiSecurity === "nopass" ? "" : `P:${escWifi(input.wifiPassword)};`;
			return {
				destination: `WIFI:T:${input.wifiSecurity};S:${escWifi(input.wifiSsid)};${pass};`,
				summary: input.wifiSsid
			};
		}
		case "vcard":
			if (!input.vcardName) throw new UserError("Escribe el nombre del contacto.");
			return {
				destination: [
					"BEGIN:VCARD",
					"VERSION:3.0",
					`FN:${input.vcardName}`,
					input.vcardOrg ? `ORG:${input.vcardOrg}` : "",
					input.vcardPhone ? `TEL:${input.vcardPhone}` : "",
					input.vcardEmail ? `EMAIL:${input.vcardEmail}` : "",
					"END:VCARD"
				].filter(Boolean).join("\n"),
				summary: input.vcardName
			};
		case "text":
			if (!input.text) throw new UserError("Escribe el texto del código.");
			return {
				destination: input.text,
				summary: input.text.slice(0, 80)
			};
		case "phone": {
			const digits = input.phone.replace(/[^\d+]/g, "");
			if (digits.replace(/\D/g, "").length < 7) throw new UserError("Escribe un teléfono válido.");
			return {
				destination: `tel:${digits}`,
				summary: digits
			};
		}
		case "email": {
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new UserError("Escribe un correo válido.");
			const params = new URLSearchParams();
			if (input.emailSubject) params.set("subject", input.emailSubject);
			if (input.emailBody) params.set("body", input.emailBody);
			const q = params.toString();
			return {
				destination: `mailto:${input.email}${q ? `?${q}` : ""}`,
				summary: input.email
			};
		}
		default: throw new UserError("Tipo de código inválido.");
	}
}
function payloadOf(input) {
	const { fg, bg, accent, dotStyle, cornerStyle, logoData, title, ...content } = input;
	return content;
}
function inputFromParts(parts) {
	let stored = {};
	try {
		stored = JSON.parse(parts.payload);
	} catch {
		stored = {};
	}
	return parseInput({
		...EMPTY_INPUT,
		...stored,
		...parts,
		logoData: parts.logoData
	});
}
function safeHttp(url) {
	try {
		const parsed = new URL(url);
		if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.toString();
	} catch {}
	return null;
}
//#endregion
export { EMPTY_INPUT as a, UserError as c, parseInput as d, payloadOf as f, DOT_STYLES as i, compose as l, CORNER_STYLES as n, KINDS as o, safeHttp as p, DOT_LABEL as r, KIND_LABEL as s, CORNER_LABEL as t, inputFromParts as u };
