import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-DJS1GQ19.mjs";
import { C as require_jsx_runtime, J as redirect, S as useRouter, Z as require_react, _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DgD7Ax1O.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-ChJbPLt_.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listPublicPackages = createServerFn({ method: "GET" }).handler(createSsrRpc("cd4c92c6bad9b69dc6bfbf3f7be059420c5fd36e4f42b752086756e7cc790625"));
var resolvePublicQr = createServerFn({ method: "GET" }).validator((code) => String(code ?? "")).handler(createSsrRpc("ca7fd74507b7048efa82262eab5f0b46ea2a193dae4fa40985171a38f85fee00"));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6a1f1bc89406aa111c634d0b8c81b4b1c0262cb62a9adac2d2d92f2a631f555a"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("50fb2620cd78493f3d33197ba8b3dccce45e17b8a978b13602f7174fc055d3e9"));
var getQr = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("2f0b49f4efbc898ee6a8a9219a741fe476b5ea7f1f56228ebe4357848dcca5bd"));
var createQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5fd34927b8e00f2bee53a13fd53a45325bf1e6a0d8eb626439a2f6a9a6691767"));
var updateQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6caf351681a5719faadcb4525cd015902fe5782a214eda77dbe6e73bb463b881"));
var removeQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("bc1f35eb3dd5c623c3abcaa10459a157217c9aa3a8158cd55fae70fd72d1cf52"));
var reactivateQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("0a2d4fbfb3503dee821574d5946d0d2c1d535193963d466d0bd88a7e48f44f5b"));
var getPlans = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cb04fc3ee12929e9016e96c67afd122a171de1f9fe5e8bd784d2e03eb4c5cf9a"));
var startCheckout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((packageId) => packageId).handler(createSsrRpc("adc298ecc7680a3707c5883a525227164ae109a4ad504bff24d7ff53641ec3a2"));
var confirmPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	reference: String(input?.reference ?? ""),
	transactionId: String(input?.transactionId ?? "")
})).handler(createSsrRpc("bcb455261a61e2d47768e940afe6f145b4f81110e5f36afddffd668d49ad8b35"));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5efa8cac55ef6d255b20bbb4064c5c8572e9c1a21da5d9e048c180ad2b20e1da"));
var adminUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c762883374b38706003ff16aae2fad07fdfbafe2771ced1adedd45c27aa3bd5d"));
var adminPackages = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e4f605592826d066d7cbe01907f2028101c32c1fe0a58450a002b42ecf70e973"));
var savePackage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("481d1fb53048e75362e3d2324fa822c96695073f3a4c8942d75b2e1000e03b23"));
var deletePackage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("f15e705afa375a301fbbf71f0b77e5a5e0115082910e16421e6f4d60ecaf5a7c"));
var grantPackage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5dc2b4060fb3d49b4d38d351ea73410b6fbfbc49d7bc874ec03c58fe3ff78d34"));
var setExpiry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("94860247e0e71d619bb0765efcef5f9b90a1596119361d3ee70324d5e36ebc69"));
var setRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("7fa092e82bad9a2192b6a7c9f1fa14e2988ad44245251801262c0dc19ae381c8"));
var getAdminSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2245308c0a93c26c7bcbf128de0338c959f04d16a3f1bb57c2d0f68aeae86239"));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("026c80622c71aee21434911158ccff6f876ee569116e803400cd7ed7c0ea8b26"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-pyGeqgNY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-B3IdofYT.css";
var Route$16 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Sello" },
			{
				name: "theme-color",
				content: "#f3ecdf"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,520;9..144,640&family=Outfit:wght@400;500;600&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$13 = () => import("./routes-CmCR6ouQ.mjs");
var Route$15 = createFileRoute("/")({
	loader: () => listPublicPackages(),
	head: () => ({ meta: [{ title: "Sello — Códigos QR con tu marca" }, {
		name: "description",
		content: "Crea códigos QR con color, forma y logo. Tres gratis si entras cada mes. Paquetes de 10 a 30 con pago por Wompi."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./route-CS1TPRxG.mjs");
var Route$14 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./login-CJnoAwgH.mjs");
var Route$13 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Entrar · Sello" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./route-BRJbjjCf.mjs");
var Route$12 = createFileRoute("/panel")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin-BqlJIsrT.mjs");
var Route$11 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "Administración · Sello" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./ajustes-C8Dd1TBn.mjs");
var Route$10 = createFileRoute("/admin/ajustes")({
	head: () => ({ meta: [{ title: "Wompi · Sello" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./paquetes-tI8bBqzd.mjs");
var Route$9 = createFileRoute("/admin/paquetes")({
	head: () => ({ meta: [{ title: "Paquetes · Administración" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./usuarios-GfHAHaWY.mjs");
var Route$8 = createFileRoute("/admin/usuarios")({
	head: () => ({ meta: [{ title: "Usuarios · Sello" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./panel-Boa07RfR.mjs");
var Route$7 = createFileRoute("/panel/")({
	head: () => ({ meta: [{ title: "Mis códigos · Sello" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("../_id-BYcOPvId.mjs");
var Route$6 = createFileRoute("/panel/$id")({
	head: () => ({ meta: [{ title: "Editar código · Sello" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./nuevo--UQBY8S4.mjs");
var Route$5 = createFileRoute("/panel/nuevo")({
	head: () => ({ meta: [{ title: "Crear código · Sello" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./planes-Cj9BBXsA.mjs");
var Route$4 = createFileRoute("/panel/planes")({
	head: () => ({ meta: [{ title: "Paquetes · Sello" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_code-B3OWQUFN.mjs");
var Route$3 = createFileRoute("/q/$code")({
	loader: async ({ params }) => {
		const view = await resolvePublicQr({ data: params.code });
		if (view.kind === "redirect") throw redirect({ href: view.href });
		return view;
	},
	head: () => ({ meta: [{ title: "Sello" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var Route$2 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var Route$1 = createFileRoute("/api/wompi/events")({ server: { handlers: { POST: async ({ request }) => {
	const { handleWompiEvent } = await import("./logic.server-f5Dz6u3U.mjs");
	return handleWompiEvent(request);
} } } });
var $$splitComponentImporter = () => import("../_reference-BcvWFw9Q.mjs");
var Route = createFileRoute("/panel/pago/$reference")({
	validateSearch: (search) => ({ id: typeof search.id === "string" ? search.id : "" }),
	head: () => ({ meta: [{ title: "Pago · Sello" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$15.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$16
});
var AdminRouteRoute = Route$14.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$16
});
var LoginRoute = Route$13.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$16
});
var PanelRouteRoute = Route$12.update({
	id: "/panel",
	path: "/panel",
	getParentRoute: () => Route$16
});
var AdminIndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRouteRoute
});
var AdminAjustesRoute = Route$10.update({
	id: "/ajustes",
	path: "/ajustes",
	getParentRoute: () => AdminRouteRoute
});
var AdminPaquetesRoute = Route$9.update({
	id: "/paquetes",
	path: "/paquetes",
	getParentRoute: () => AdminRouteRoute
});
var AdminUsuariosRoute = Route$8.update({
	id: "/usuarios",
	path: "/usuarios",
	getParentRoute: () => AdminRouteRoute
});
var PanelIndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => PanelRouteRoute
});
var PanelIdRoute = Route$6.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => PanelRouteRoute
});
var PanelNuevoRoute = Route$5.update({
	id: "/nuevo",
	path: "/nuevo",
	getParentRoute: () => PanelRouteRoute
});
var PanelPlanesRoute = Route$4.update({
	id: "/planes",
	path: "/planes",
	getParentRoute: () => PanelRouteRoute
});
var QCodeRoute = Route$3.update({
	id: "/q/$code",
	path: "/q/$code",
	getParentRoute: () => Route$16
});
var ApiAuthSplatRoute = Route$2.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$16
});
var ApiWompiEventsRoute = Route$1.update({
	id: "/api/wompi/events",
	path: "/api/wompi/events",
	getParentRoute: () => Route$16
});
var PanelPagoReferenceRoute = Route.update({
	id: "/pago/$reference",
	path: "/pago/$reference",
	getParentRoute: () => PanelRouteRoute
});
var AdminRouteRouteChildren = {
	AdminAjustesRoute,
	AdminPaquetesRoute,
	AdminUsuariosRoute,
	AdminIndexRoute
};
var AdminRouteRouteWithChildren = AdminRouteRoute._addFileChildren(AdminRouteRouteChildren);
var PanelRouteRouteChildren = {
	PanelIdRoute,
	PanelNuevoRoute,
	PanelPlanesRoute,
	PanelIndexRoute,
	PanelPagoReferenceRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRouteRoute: AdminRouteRouteWithChildren,
	PanelRouteRoute: PanelRouteRoute._addFileChildren(PanelRouteRouteChildren),
	LoginRoute,
	QCodeRoute,
	ApiAuthSplatRoute,
	ApiWompiEventsRoute
};
var routeTree = Route$16._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { setRole as C, setExpiry as S, updateQr as T, grantPackage as _, Route$15 as a, savePackage as b, adminUsers as c, deletePackage as d, getAdminSettings as f, getQr as g, getPlans as h, Route$6 as i, confirmPayment as l, getMe as m, Route as n, adminOverview as o, getDashboard as p, Route$3 as r, adminPackages as s, router_exports as t, createQr as u, reactivateQr as v, startCheckout as w, saveSettings as x, removeQr as y };
