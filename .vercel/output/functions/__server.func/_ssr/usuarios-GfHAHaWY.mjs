import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as setRole, S as setExpiry, _ as grantPackage, c as adminUsers } from "./router-pyGeqgNY.mjs";
import { i as statusLabel, n as fecha, t as cop } from "./format-Bv96BNfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/usuarios-GfHAHaWY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UsersPage() {
	const [users, setUsers] = (0, import_react.useState)([]);
	const [packages, setPackages] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		adminUsers().then((data) => {
			setUsers(data.users);
			setPackages(data.packages);
		}).catch(() => setError("No se pudo cargar la lista."));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	if (!users.length && !error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-3xl bg-paper-deep" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Usuarios"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Última entrada, cupo gratis y vencimiento de cada paquete."
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-stamp",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 space-y-4",
			children: users.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCard, {
				person,
				packages,
				onDone: load,
				onError: setError
			}, person.userId))
		})
	] });
}
function UserCard({ person, packages, onDone, onError }) {
	const [packageId, setPackageId] = (0, import_react.useState)(String(packages[0]?.id ?? ""));
	const [day, setDay] = (0, import_react.useState)("");
	const [entitlementId, setEntitlementId] = (0, import_react.useState)(String(person.entitlements[0]?.id ?? ""));
	async function run(task) {
		const result = await task;
		if (!result.ok) onError(result.error || "No se pudo guardar.");
		else onDone();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-3xl border border-line bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: person.name || "Sin nombre"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: person.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm",
						children: [
							person.role === "admin" ? "Administración" : "Cuenta",
							" · ",
							person.qrCount,
							" códigos · última entrada ",
							fecha(person.lastSeenAt)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: person.freeLive ? "text-sm text-moss" : "text-sm text-stamp",
						children: ["Gratis ", person.freeLive ? `activos hasta ${fecha(person.freeUntil)}` : `en pausa desde antes del ${fecha(person.freeUntil)}`]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-10 rounded-full border border-line px-4 text-sm",
					onClick: () => void run(setRole({ data: {
						userId: person.userId,
						role: person.role === "admin" ? "user" : "admin"
					} })),
					children: person.role === "admin" ? "Quitar admin" : "Hacer admin"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 space-y-1 text-sm",
				children: [person.entitlements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted",
					children: "Sin paquetes."
				}) : null, person.entitlements.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						item.packageName,
						" · ",
						item.qrQuota,
						" · ",
						cop(item.priceCop)
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [statusLabel(item.status), item.expiresAt ? ` · ${fecha(item.expiresAt)}` : ""]
					})]
				}, item.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "h-11 rounded-lg border border-line bg-card px-2 text-sm",
					value: packageId,
					onChange: (event) => setPackageId(event.target.value),
					children: packages.map((pack) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: pack.id,
						children: pack.name
					}, pack.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 rounded-full bg-ink px-4 text-sm text-card",
					onClick: () => void run(grantPackage({ data: {
						userId: person.userId,
						packageId: Number(packageId)
					} })),
					children: "Asignar paquete"
				})]
			}),
			person.entitlements.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-11 rounded-lg border border-line bg-card px-2 text-sm",
						value: entitlementId,
						onChange: (event) => setEntitlementId(event.target.value),
						children: person.entitlements.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.id,
							children: item.packageName
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						className: "h-11 rounded-lg border border-line bg-card px-2 text-sm",
						value: day,
						onChange: (event) => setDay(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 rounded-full border border-line px-4 text-sm",
						onClick: () => void run(setExpiry({ data: {
							entitlementId: Number(entitlementId),
							day
						} })),
						children: "Cambiar vencimiento"
					})
				]
			}) : null
		]
	});
}
//#endregion
export { UsersPage as component };
