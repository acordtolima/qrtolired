import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, h as Outlet, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as getMe } from "./router-pyGeqgNY.mjs";
import { t as Mark } from "./mark-BN24REUI.mjs";
import { n as useCurrentUserState } from "./use-current-user-LXzd1evx.mjs";
import { i as UserButton, t as RedirectToSignIn } from "./gates-Dh4J-7y3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-Cd3MAzil.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var links = [
	{
		to: "/panel",
		label: "Mis códigos",
		exact: true
	},
	{
		to: "/panel/nuevo",
		label: "Crear",
		exact: false
	},
	{
		to: "/panel/planes",
		label: "Paquetes",
		exact: false
	}
];
function AppShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const [me, setMe] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let dead = false;
		getMe().then((next) => {
			if (!dead) setMe(next);
		}).catch(() => {
			if (!dead) setMe(null);
		});
		return () => {
			dead = true;
		};
	}, [user?.id]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-40 animate-pulse rounded-full bg-paper-deep" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-line bg-paper/95",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-4 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/panel",
							className: "flex items-center gap-2 text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "h-8 w-8 text-ink" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl leading-none",
								children: "Sello"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex flex-1 gap-1 overflow-x-auto",
							children: [links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: link.to,
								activeOptions: { exact: link.exact },
								className: "shrink-0 rounded-full px-3 py-2 text-sm font-medium text-muted",
								activeProps: { className: "shrink-0 rounded-full bg-ink px-3 py-2 text-sm font-medium text-card" },
								children: link.label
							}, link.to)), me?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								className: "shrink-0 rounded-full px-3 py-2 text-sm font-medium text-muted",
								activeProps: { className: "shrink-0 rounded-full bg-ink px-3 py-2 text-sm font-medium text-card" },
								children: "Administración"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden sm:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-6 pb-24",
				children: [me ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-5 text-sm text-muted tabular-nums",
					children: [
						"Cupo: ",
						me.freeUsed,
						"/",
						me.freeLimit,
						" gratis",
						me.paidCapacity ? ` · ${me.paidUsed}/${me.paidCapacity} de paquetes` : "",
						" · ",
						me.remaining,
						" disponibles"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-5 h-5 w-64 animate-pulse rounded-full bg-paper-deep" }), children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 border-t border-line bg-card px-4 py-3 sm:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
			})
		]
	});
}
//#endregion
export { AppShell as t };
