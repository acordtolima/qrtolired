import { o as __toESM } from "./_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as Route$3 } from "./_ssr/router-pyGeqgNY.mjs";
import { t as Mark } from "./_ssr/mark-BN24REUI.mjs";
import { t as QrPreview } from "./_ssr/qr-preview-DKpVK8DE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_code-B3OWQUFN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicCode() {
	const view = Route$3.useLoaderData();
	if (view.kind === "missing") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, {
		title: "No encontramos este sello",
		body: "El enlace no corresponde a un código de Sello."
	});
	if (view.kind === "paused") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, {
		title: "Este código está en pausa",
		body: "Quien lo creó debe entrar a su panel de Sello. Si es un código gratis, basta con abrir el panel. Si es de un paquete, el pago tiene que estar vigente."
	});
	if (view.kind !== "card") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { view });
}
function Frame({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl border border-line bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "h-8 w-8 text-ink" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-3xl",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: body
				})
			]
		})
	});
}
function Card({ view }) {
	const [copied, setCopied] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl border border-line bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "h-8 w-8 text-ink" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-3xl",
					children: view.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 space-y-3",
					children: view.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-sm text-muted",
						children: line.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "mt-1 flex items-center justify-between gap-3 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "break-all",
							children: line.value
						}), line.copy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-10 shrink-0 rounded-full border border-line px-3 text-sm",
							onClick: () => {
								navigator.clipboard.writeText(line.value);
								setCopied(line.label);
							},
							children: copied === line.label ? "Copiado" : "Copiar"
						}) : null]
					})] }, line.label))
				}),
				view.presentation !== "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 rounded-lg bg-paper p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrPreview, {
						data: view.raw,
						fg: "#1c1612",
						bg: "#fffaf3",
						accent: "#1c1612",
						dotStyle: "square",
						cornerStyle: "square",
						logo: null,
						size: 220
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: view.presentation === "wifi" ? "Ese segundo código lo puede escanear otro celular para unirse a la red." : "Ese segundo código guarda el contacto en otro celular."
					})]
				}) : null,
				view.presentation === "vcard" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 h-11 w-full rounded-full bg-ink text-sm text-card",
					onClick: () => {
						const blob = new Blob([view.raw], { type: "text/vcard" });
						const url = URL.createObjectURL(blob);
						const link = document.createElement("a");
						link.href = url;
						link.download = "contacto.vcf";
						link.click();
						URL.revokeObjectURL(url);
					},
					children: "Descargar contacto"
				}) : null
			]
		})
	});
}
//#endregion
export { PublicCode as component };
