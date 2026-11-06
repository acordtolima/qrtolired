import { t as GROK_PROVIDERS } from "./server-DJS1GQ19.mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Mark } from "./mark-BN24REUI.mjs";
import { r as signIn } from "./client-IWHfIGH2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CJnoAwgH.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-3xl border border-line bg-card p-6 shadow-sheet",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 text-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl",
						children: "Sello"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 font-display text-3xl",
					children: "Entra para crear tus códigos"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: "Con Google quedas registrado. La primera cuenta que entre administra paquetes, precios y vencimientos."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-2",
					children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => signIn(provider.providerId, { callbackURL: "/panel" }),
						className: provider.providerId === "grok-google" ? "h-12 w-full rounded-full bg-stamp text-sm font-medium text-card" : "h-12 w-full rounded-full border border-line text-sm font-medium",
						children: ["Continuar con ", provider.label]
					}, provider.providerId))
				})
			]
		})
	});
}
//#endregion
export { Login as component };
