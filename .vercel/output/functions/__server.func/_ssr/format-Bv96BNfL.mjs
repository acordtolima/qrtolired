import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-Bv96BNfL.js
var format_exports = /* @__PURE__ */ __exportAll({
	cop: () => cop,
	fecha: () => fecha,
	statusLabel: () => statusLabel
});
function cop(value) {
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0
	}).format(value);
}
function fecha(iso) {
	if (!iso) return "—";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat("es-CO", {
		dateStyle: "medium",
		timeZone: "America/Bogota"
	}).format(date);
}
function statusLabel(status) {
	switch (status) {
		case "active": return "Activo";
		case "pending": return "Pendiente";
		case "expired": return "Vencido";
		case "declined": return "Rechazado";
		case "cancelled": return "Cancelado";
		default: return status;
	}
}
//#endregion
export { statusLabel as i, fecha as n, format_exports as r, cop as t };
