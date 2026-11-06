import { o as __toESM } from "./_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { l as confirmPayment, n as Route } from "./_ssr/router-pyGeqgNY.mjs";
import { n as fecha } from "./_ssr/format-Bv96BNfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_reference-BcvWFw9Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PaymentResult() {
	const { reference } = Route.useParams();
	const { id } = Route.useSearch();
	const [state, setState] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let dead = false;
		confirmPayment({ data: {
			reference,
			transactionId: id
		} }).then((result) => {
			if (dead) return;
			if ("status" in result && result.ok) setState(result);
			else setError("error" in result ? result.error : "No se pudo confirmar el pago.");
		});
		return () => {
			dead = true;
		};
	}, [reference, id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg rounded-3xl border border-line bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Resultado del pago"
			}),
			!state && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Confirmando con Wompi…"
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-stamp",
				children: error
			}) : null,
			state ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm",
				children: state.detail
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [state.packageName, state.expiresAt ? ` · activo hasta ${fecha(state.expiresAt)}` : ""]
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/panel",
				className: "mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-card",
				children: "Volver a mis códigos"
			})
		]
	});
}
//#endregion
export { PaymentResult as component };
