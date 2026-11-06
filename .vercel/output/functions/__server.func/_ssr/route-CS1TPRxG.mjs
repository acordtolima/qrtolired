import { C as require_jsx_runtime, h as Outlet, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./shell-Cd3MAzil.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CS1TPRxG.js
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5 flex gap-2 overflow-x-auto text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin",
				activeOptions: { exact: true },
				className: "rounded-full px-3 py-2 text-muted",
				activeProps: { className: "rounded-full bg-paper-deep px-3 py-2 text-ink" },
				children: "Resumen"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/usuarios",
				className: "rounded-full px-3 py-2 text-muted",
				activeProps: { className: "rounded-full bg-paper-deep px-3 py-2 text-ink" },
				children: "Usuarios"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/paquetes",
				className: "rounded-full px-3 py-2 text-muted",
				activeProps: { className: "rounded-full bg-paper-deep px-3 py-2 text-ink" },
				children: "Paquetes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/ajustes",
				className: "rounded-full px-3 py-2 text-muted",
				activeProps: { className: "rounded-full bg-paper-deep px-3 py-2 text-ink" },
				children: "Wompi"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})] });
}
//#endregion
export { AdminLayout as component };
