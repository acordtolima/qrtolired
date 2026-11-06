import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as getAdminSettings, x as saveSettings } from "./router-pyGeqgNY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ajustes-C8Dd1TBn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const [form, setForm] = (0, import_react.useState)(null);
	const [integrity, setIntegrity] = (0, import_react.useState)("");
	const [events, setEvents] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [origin, setOrigin] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setOrigin(window.location.origin);
		getAdminSettings().then(setForm).catch(() => setError("No se pudo abrir la configuración."));
	}, []);
	if (!form && !error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-3xl bg-paper-deep" });
	if (!form) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-stamp",
		children: error
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "max-w-xl space-y-4",
		onSubmit: (event) => {
			event.preventDefault();
			saveSettings({ data: {
				wompiPublicKey: form.wompiPublicKey,
				wompiIntegritySecret: integrity,
				wompiEventsSecret: events,
				wompiEnv: form.wompiEnv,
				allowDemoCheckout: form.allowDemoCheckout,
				freeQrLimit: form.freeQrLimit,
				freeGraceDays: form.freeGraceDays
			} }).then((result) => {
				if (!result.ok) setError(result.error);
				else {
					setError("");
					setNote("Guardado. Los secretos no se vuelven a mostrar completos.");
					setIntegrity("");
					setEvents("");
					getAdminSettings().then(setForm);
				}
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Wompi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: [
					"En el dashboard de comercios de Wompi copia la llave pública, el secreto de integridad y el secreto de eventos. Sandbox usa llaves ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-ink",
						children: "pub_test_"
					}),
					". Producción usa ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-ink",
						children: "pub_prod_"
					}),
					". El widget cobra en COP y, al volver, Sello verifica la transacción con Wompi antes de activar el paquete."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm font-medium",
				children: ["Llave pública", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-2 h-11 w-full rounded-lg border border-line px-3",
					value: form.wompiPublicKey,
					onChange: (event) => setForm({
						...form,
						wompiPublicKey: event.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm font-medium",
				children: [
					"Secreto de integridad ",
					form.integrityHint ? `(${form.integrityHint})` : "",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "mt-2 h-11 w-full rounded-lg border border-line px-3",
						type: "password",
						value: integrity,
						placeholder: form.hasIntegrity ? "Dejar vacío para no cambiar" : "test_integrity_…",
						onChange: (event) => setIntegrity(event.target.value),
						autoComplete: "off"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm font-medium",
				children: [
					"Secreto de eventos ",
					form.eventsHint ? `(${form.eventsHint})` : "",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "mt-2 h-11 w-full rounded-lg border border-line px-3",
						type: "password",
						value: events,
						placeholder: form.hasEvents ? "Dejar vacío para no cambiar" : "test_events_…",
						onChange: (event) => setEvents(event.target.value),
						autoComplete: "off"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm font-medium",
				children: ["Ambiente", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-2 h-11 w-full rounded-lg border border-line bg-card px-3",
					value: form.wompiEnv,
					onChange: (event) => setForm({
						...form,
						wompiEnv: event.target.value === "production" ? "production" : "sandbox"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "sandbox",
						children: "Sandbox"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "production",
						children: "Producción"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: form.allowDemoCheckout,
					onChange: (event) => setForm({
						...form,
						allowDemoCheckout: event.target.checked
					})
				}), "Permitir pago de prueba si no hay llave pública"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm font-medium",
					children: ["Códigos gratis", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "mt-2 h-11 w-full rounded-lg border border-line px-3",
						type: "number",
						value: form.freeQrLimit,
						onChange: (event) => setForm({
							...form,
							freeQrLimit: Number(event.target.value)
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm font-medium",
					children: ["Días sin entrar", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "mt-2 h-11 w-full rounded-lg border border-line px-3",
						type: "number",
						value: form.freeGraceDays,
						onChange: (event) => setForm({
							...form,
							freeGraceDays: Number(event.target.value)
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"URL de eventos para el comercio: ",
					origin ? `${origin}/api/wompi/events` : "…",
					". Si Wompi no puede llamarla, igual se confirma el pago cuando la persona regresa del widget."
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-stamp",
				children: error
			}) : null,
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-moss",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				className: "h-11 rounded-full bg-stamp px-5 text-sm font-medium text-card",
				children: "Guardar"
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
