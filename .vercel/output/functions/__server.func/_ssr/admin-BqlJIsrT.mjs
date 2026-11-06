import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as adminOverview } from "./router-pyGeqgNY.mjs";
import { i as statusLabel, n as fecha, t as cop } from "./format-Bv96BNfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BqlJIsrT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminHome() {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminOverview().then(setData).catch(() => setError("No tienes acceso de administración o no se pudo cargar."));
	}, []);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-stamp",
		children: error
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-3xl bg-paper-deep" });
	const stats = [
		["Cuentas", data.users],
		["Códigos", data.qrs],
		["Escaneos", data.scans],
		["Paquetes activos", data.activePacks]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Administración"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-sm text-muted",
			children: "La primera cuenta que entra queda como administración. Desde aquí ves vencimientos, creas paquetes y conectas Wompi."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: stats.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-3xl border border-line bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-3xl tabular-nums",
					children: value
				})]
			}, label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-2xl",
			children: "Vencen en 7 días"
		}),
		data.expiring.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Nadie tiene un paquete por vencer esta semana."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-line rounded-3xl border border-line bg-card",
			children: data.expiring.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap justify-between gap-2 px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					row.name || row.email,
					" · ",
					row.packageName
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-stamp",
					children: fecha(row.expiresAt)
				})]
			}, `${row.email}-${row.expiresAt}`))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-2xl",
			children: "Pagos recientes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-line rounded-3xl border border-line bg-card",
			children: data.recent.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap justify-between gap-2 px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					row.name || row.email || "Cuenta",
					" · ",
					row.packageName
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted tabular-nums",
					children: [
						statusLabel(row.status),
						" · ",
						cop(row.priceCop),
						" · ",
						fecha(row.createdAt)
					]
				})]
			}, `${row.email}-${row.createdAt}-${row.packageName}`))
		})
	] });
}
//#endregion
export { AdminHome as component };
