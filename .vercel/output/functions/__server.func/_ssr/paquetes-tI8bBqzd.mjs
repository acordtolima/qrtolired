import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as savePackage, d as deletePackage, s as adminPackages } from "./router-pyGeqgNY.mjs";
import { t as cop } from "./format-Bv96BNfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paquetes-tI8bBqzd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	name: "",
	qrQuota: 10,
	priceCop: 49e3,
	durationDays: 30,
	description: "",
	active: true,
	sortOrder: 40
};
function PackagesPage() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [draft, setDraft] = (0, import_react.useState)(empty);
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		adminPackages().then(setRows).catch(() => setError("No se pudieron cargar los paquetes."));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function save(input) {
		const result = await savePackage({ data: input });
		if (!result.ok) setError(result.error);
		else {
			setError("");
			setDraft(empty);
			load();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Paquetes y precios"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-sm text-muted",
			children: "El precio es en pesos colombianos y la duración es el tiempo que el pago se considera activo. Los de 10, 15, 20, 25 y 30 ya vienen creados; puedes cambiarles el precio o sumar otros."
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-stamp",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 space-y-3",
			children: rows.map((pack) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageRow, {
				pack,
				onSave: (next) => void save(next),
				onDelete: async () => {
					const result = await deletePackage({ data: pack.id });
					if (!result.ok) setError(result.error);
					else load();
				}
			}, pack.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 grid gap-3 rounded-3xl border border-line bg-card p-4 sm:grid-cols-2",
			onSubmit: (event) => {
				event.preventDefault();
				save(draft);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl sm:col-span-2",
					children: "Nuevo paquete"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "h-11 rounded-lg border border-line px-3",
					placeholder: "Nombre",
					value: draft.name,
					onChange: (event) => setDraft({
						...draft,
						name: event.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "h-11 rounded-lg border border-line px-3",
					type: "number",
					placeholder: "Códigos",
					value: draft.qrQuota,
					onChange: (event) => setDraft({
						...draft,
						qrQuota: Number(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "h-11 rounded-lg border border-line px-3",
					type: "number",
					placeholder: "Precio COP",
					value: draft.priceCop,
					onChange: (event) => setDraft({
						...draft,
						priceCop: Number(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "h-11 rounded-lg border border-line px-3",
					type: "number",
					placeholder: "Días",
					value: draft.durationDays,
					onChange: (event) => setDraft({
						...draft,
						durationDays: Number(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "h-11 rounded-lg border border-line px-3 sm:col-span-2",
					placeholder: "Descripción",
					value: draft.description,
					onChange: (event) => setDraft({
						...draft,
						description: event.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					className: "h-11 rounded-full bg-stamp text-sm font-medium text-card sm:col-span-2",
					children: ["Crear paquete · ", draft.priceCop ? cop(draft.priceCop) : "gratis"]
				})
			]
		})
	] });
}
function PackageRow({ pack, onSave, onDelete }) {
	const [row, setRow] = (0, import_react.useState)(pack);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "grid gap-2 rounded-3xl border border-line bg-card p-4 sm:grid-cols-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "h-11 rounded-lg border border-line px-2 sm:col-span-2",
				value: row.name,
				onChange: (event) => setRow({
					...row,
					name: event.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "h-11 rounded-lg border border-line px-2",
				type: "number",
				"aria-label": "Códigos",
				value: row.qrQuota,
				onChange: (event) => setRow({
					...row,
					qrQuota: Number(event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "h-11 rounded-lg border border-line px-2",
				type: "number",
				"aria-label": "Precio",
				value: row.priceCop,
				onChange: (event) => setRow({
					...row,
					priceCop: Number(event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "h-11 rounded-lg border border-line px-2",
				type: "number",
				"aria-label": "Días",
				value: row.durationDays,
				onChange: (event) => setRow({
					...row,
					durationDays: Number(event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex h-11 items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: row.active,
					onChange: (event) => setRow({
						...row,
						active: event.target.checked
					})
				}), "Visible"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "h-11 rounded-lg border border-line px-2 sm:col-span-4",
				value: row.description,
				onChange: (event) => setRow({
					...row,
					description: event.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-11 rounded-full bg-ink text-sm text-card",
				onClick: () => onSave(row),
				children: "Guardar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-11 rounded-full text-sm text-stamp",
				onClick: onDelete,
				children: "Eliminar"
			})
		]
	});
}
//#endregion
export { PackagesPage as component };
