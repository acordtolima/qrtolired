import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as getDashboard, v as reactivateQr } from "./router-pyGeqgNY.mjs";
import { t as QrPreview } from "./qr-preview-DKpVK8DE.mjs";
import { s as KIND_LABEL } from "./content-B_3bvPxl.mjs";
import { n as fecha } from "./format-Bv96BNfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/panel-Boa07RfR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PanelHome() {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		getDashboard().then(setData).catch(() => setError("No se pudo cargar el panel."));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	if (!data) return error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-stamp",
		children: error
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-3xl bg-paper-deep" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Mis códigos"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 max-w-xl text-sm text-muted",
				children: [
					"Los gratis siguen activos hasta el ",
					fecha(data.freeUntil),
					". Entra al menos una vez cada ",
					data.graceDays,
					" días."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/panel/nuevo",
				className: "inline-flex h-11 items-center rounded-full bg-stamp px-5 text-sm font-medium text-card",
				children: "Crear código"
			})]
		}),
		data.wasLapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 rounded-lg bg-moss-soft px-4 py-3 text-sm text-moss",
			children: "Tus códigos gratis estaban en pausa. Ya quedaron activos de nuevo."
		}) : null,
		data.qrs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 rounded-3xl border border-dashed border-line bg-card p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Todavía no hay sellos"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm text-muted",
				children: "El primero puede ser un menú, un WhatsApp o la clave del Wi-Fi del local."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 grid gap-4 sm:grid-cols-2",
			children: data.qrs.map((qr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-3xl border border-line bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-24 shrink-0 rounded-lg bg-paper p-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrPreview, {
							data: `${typeof window !== "undefined" ? window.location.origin : ""}/q/${qr.publicId}`,
							fg: qr.fg,
							bg: qr.bg,
							accent: qr.accent,
							dotStyle: qr.dotStyle,
							cornerStyle: qr.cornerStyle,
							logo: null,
							size: 96
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "truncate font-display text-xl",
								children: qr.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									KIND_LABEL[qr.kind],
									" · ",
									qr.scans,
									" escaneos"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 truncate text-sm",
								children: qr.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: qr.live ? "mt-1 text-sm text-moss" : "mt-1 text-sm text-stamp",
								children: qr.live ? qr.sourceLabel : "En pausa"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/panel/$id",
						params: { id: String(qr.id) },
						className: "inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm text-card",
						children: "Editar"
					}), !qr.live && qr.slot === "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 rounded-full border border-line px-4 text-sm",
						onClick: () => {
							reactivateQr({ data: qr.id }).then((result) => {
								if (!result.ok) setError(result.error);
								else load();
							});
						},
						children: "Reactivar con cupo"
					}) : null]
				})]
			}, qr.id))
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-stamp",
			children: error
		}) : null
	] });
}
//#endregion
export { PanelHome as component };
