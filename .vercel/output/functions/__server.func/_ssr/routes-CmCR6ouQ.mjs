import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route$15 } from "./router-pyGeqgNY.mjs";
import { t as Mark } from "./mark-BN24REUI.mjs";
import { t as QrPreview } from "./qr-preview-DKpVK8DE.mjs";
import { t as cop } from "./format-Bv96BNfL.mjs";
import { n as useCurrentUserState } from "./use-current-user-LXzd1evx.mjs";
import { n as SignedIn, r as SignedOut } from "./gates-Dh4J-7y3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CmCR6ouQ.js
var import_jsx_runtime = require_jsx_runtime();
function Landing({ packages }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl items-center gap-4 px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "h-8 w-8 text-ink" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl",
						children: "Sello"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "ml-auto flex items-center gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#reglas",
							className: "hidden px-3 py-2 text-muted sm:inline",
							children: "Reglas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#precios",
							className: "hidden px-3 py-2 text-muted sm:inline",
							children: "Paquetes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLink, {})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-8 lg:grid-cols-[minmax(0,1.1fr)_22rem] lg:py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium tracking-wide text-stamp",
						children: "Códigos QR para Colombia"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-xl font-display text-4xl leading-tight text-ink sm:text-6xl",
						children: "Tu marca en el código. El destino lo cambias tú."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl text-lg leading-relaxed text-muted",
						children: "Crea hasta 3 códigos gratis con color, forma y logo. Siguen activos si entras al panel al menos una vez al mes. Si necesitas más, compra paquetes de 10 a 30 y págalos con Wompi."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLink, { large: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#precios",
							className: "inline-flex h-12 items-center rounded-full border border-line bg-card px-5 text-sm font-medium",
							children: "Ver paquetes"
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-line bg-card p-4 shadow-sheet",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg bg-paper p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrPreview, {
							data: "Sello",
							fg: "#1c1612",
							bg: "#fffaf3",
							accent: "#b4331e",
							dotStyle: "rounded",
							cornerStyle: "extra-rounded",
							logo: null,
							type: "svg"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Color, esquinas y logo. El impreso no cambia aunque edites el destino."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "reglas",
				className: "mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						title: "Tres gratis",
						body: "Cada cuenta puede crear 3 códigos personalizados sin pagar. El cupo lo puedes ajustar desde administración."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						title: "Entra cada mes",
						body: "Esos tres no se borran. Se pausan solo si pasan más de 30 días sin abrir el panel. Al volver, se reactivan."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
						title: "Pago activo",
						body: "Un paquete dura el periodo que definas (30 días por defecto). Mientras esa fecha no pase, sus códigos funcionan."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Qué puedes personalizar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
							title: "Color",
							body: "Tinta, fondo y esquinas. El contraste lo marcas tú, para que se lea sobre la mesa o el empaque."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
							title: "Forma",
							body: "Módulos cuadrados, redondos, puntos o clásicos. Las esquinas pueden ir rectas, suaves o en punto."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
							title: "Logo",
							body: "Sube el isotipo en PNG, JPG o WebP. Queda al centro, con corrección de error alta para que igual se escanee."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "precios",
				className: "mx-auto max-w-6xl px-4 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "Paquetes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-muted",
						children: "Precios en pesos. El cobro es por el periodo del paquete, no es un débito automático: al vencer, renuevas con otro pago en Wompi."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: packages.map((pack) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "flex flex-col rounded-3xl border border-line bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-2xl",
									children: pack.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
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
								})
							]
						}, pack.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 py-8 pb-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Preguntas frecuentes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
							title: "¿El QR impreso deja de servir?",
							body: "El dibujo no cambia. Apunta a un enlace de Sello. Si el código está en pausa, quien lo escanea ve un aviso en lugar del destino."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
							title: "¿Puedo cambiar el enlace?",
							body: "Sí. Menú, WhatsApp, Wi-Fi, contacto o texto. Guardas y el mismo impreso abre lo nuevo."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
							title: "¿Qué pasa si no entro en un mes?",
							body: "Los 3 gratis se pausan, no se borran. Entras al panel y vuelven a funcionar desde ese momento."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
							title: "¿Y si se vence el paquete?",
							body: "Esos códigos se pausan hasta que pagues de nuevo o alguien de administración extienda la fecha. Los datos se conservan."
						})
					]
				})]
			})
		]
	});
}
function Rule({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-3xl border border-line bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-xl",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-muted",
			children: body
		})]
	});
}
function AuthLink({ large = false }) {
	const { user, isPending } = useCurrentUserState();
	const size = large ? "h-12 px-5" : "h-10 px-4";
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block ${size} w-36 animate-pulse rounded-full bg-paper-deep` });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/panel",
		className: `inline-flex ${size} items-center rounded-full bg-stamp text-sm font-medium text-card`,
		children: "Ir al panel"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: `inline-flex ${size} items-center rounded-full bg-stamp text-sm font-medium text-card`,
		children: "Entrar con Google"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/panel",
		className: `inline-flex ${size} items-center rounded-full bg-stamp text-sm font-medium text-card`,
		children: "Ir al panel"
	}) })] });
}
function Home() {
	const packages = Route$15.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landing, { packages });
}
//#endregion
export { Home as component };
