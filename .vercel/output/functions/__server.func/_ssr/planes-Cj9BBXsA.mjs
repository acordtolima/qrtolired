import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as getPlans, l as confirmPayment, w as startCheckout } from "./router-pyGeqgNY.mjs";
import { i as statusLabel, n as fecha, t as cop } from "./format-Bv96BNfL.mjs";
import { t as useCurrentUser } from "./use-current-user-LXzd1evx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/planes-Cj9BBXsA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function loadWompi() {
	if (typeof window === "undefined") return Promise.reject(/* @__PURE__ */ new Error("Sin ventana."));
	if (window.WidgetCheckout) return Promise.resolve();
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://checkout.wompi.co/widget.js";
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(/* @__PURE__ */ new Error("No se pudo cargar el checkout de Wompi."));
		document.body.appendChild(script);
	});
}
async function openWompi(session) {
	await loadWompi();
	if (!window.WidgetCheckout) throw new Error("Wompi no quedó listo.");
	const redirectUrl = `${window.location.origin}/panel/pago/${session.reference}`;
	const checkout = new window.WidgetCheckout({
		currency: "COP",
		amountInCents: session.amountInCents,
		reference: session.reference,
		publicKey: session.publicKey,
		signature: { integrity: session.integrity },
		redirectUrl,
		customerData: session.email ? { email: session.email } : void 0
	});
	return new Promise((resolve) => {
		checkout.open((result) => {
			resolve(result?.transaction?.id ?? null);
		});
	});
}
function Plans() {
	const user = useCurrentUser();
	const navigate = useNavigate();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [demo, setDemo] = (0, import_react.useState)(null);
	function load() {
		getPlans().then(setData).catch(() => setError("No se pudieron cargar los paquetes."));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function buy(packageId) {
		setError("");
		setBusy(packageId);
		const started = await startCheckout({ data: packageId });
		setBusy(null);
		if (!started.ok) {
			setError(started.error);
			return;
		}
		if (started.mode === "activated") {
			await navigate({
				to: "/panel/pago/$reference",
				params: { reference: started.reference },
				search: { id: "" }
			});
			return;
		}
		if (started.mode === "demo") {
			setDemo(started);
			return;
		}
		try {
			const tx = await openWompi({
				publicKey: started.publicKey,
				amountInCents: started.amountInCents,
				reference: started.reference,
				integrity: started.integrity,
				email: user?.primaryEmail ?? void 0
			});
			await navigate({
				to: "/panel/pago/$reference",
				params: { reference: started.reference },
				search: { id: tx ?? "" }
			});
		} catch (caught) {
			setError(caught instanceof Error ? caught.message : "No se abrió Wompi.");
		}
	}
	async function simulate() {
		if (!demo) return;
		setBusy(-1);
		const result = await confirmPayment({ data: {
			reference: demo.reference,
			transactionId: "demo"
		} });
		setBusy(null);
		if (!("status" in result) || !result.ok) {
			setError("error" in result ? result.error : "No se pudo simular el pago.");
			return;
		}
		setDemo(null);
		load();
		setError("");
		await navigate({
			to: "/panel/pago/$reference",
			params: { reference: demo.reference },
			search: { id: "demo" }
		});
	}
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-3xl bg-paper-deep" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Paquetes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-sm text-muted",
			children: "Cada compra suma cupo durante el periodo del paquete. No hay cobro automático: cuando vence, los códigos de ese paquete se pausan hasta un nuevo pago."
		}),
		data.demoCheckout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 rounded-lg bg-paper-deep px-4 py-3 text-sm",
			children: "Wompi todavía no tiene llaves. Puedes simular un pago aprobado para probar el cupo. En Administración pegas la llave pública y el secreto de integridad para cobrar de verdad."
		}) : null,
		!data.wompiReady && !data.demoCheckout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-stamp",
			children: "Los pagos están cerrados hasta que se configure Wompi."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: data.packages.map((pack) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex flex-col rounded-3xl border border-line bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: pack.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 flex-1 text-sm text-muted",
						children: pack.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-display text-3xl tabular-nums",
						children: cop(pack.priceCop)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							pack.qrQuota,
							" códigos · ",
							pack.durationDays,
							" días"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy === pack.id,
						onClick: () => void buy(pack.id),
						className: "mt-4 h-11 rounded-full bg-stamp text-sm font-medium text-card disabled:opacity-60",
						children: busy === pack.id ? "Abriendo pago…" : pack.priceCop === 0 ? "Activar" : "Pagar con Wompi"
					})
				]
			}, pack.id))
		}),
		demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-3xl border border-line bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Pago de prueba"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						demo.packageName,
						" por ",
						cop(demo.priceCop),
						". Esto no cobra nada: marca el paquete como pagado para que veas el vencimiento y el cupo."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy === -1,
					onClick: () => void simulate(),
					className: "mt-4 h-11 rounded-full bg-ink px-5 text-sm text-card",
					children: "Simular aprobación"
				})
			]
		}) : null,
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-stamp",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-display text-2xl",
			children: "Tus paquetes"
		}),
		data.entitlements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Aún no compras ni te asignan un paquete."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-line rounded-3xl border border-line bg-card",
			children: data.entitlements.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					item.packageName,
					" · ",
					item.qrQuota,
					" códigos",
					item.granted ? " · asignado" : ""
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted",
					children: [statusLabel(item.status), item.expiresAt ? ` · hasta ${fecha(item.expiresAt)}` : ""]
				})]
			}, item.id))
		})
	] });
}
//#endregion
export { Plans as component };
