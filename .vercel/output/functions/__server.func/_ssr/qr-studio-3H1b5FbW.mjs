import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as updateQr, u as createQr, y as removeQr } from "./router-pyGeqgNY.mjs";
import { t as QrPreview } from "./qr-preview-DKpVK8DE.mjs";
import { c as UserError, i as DOT_STYLES, l as compose, n as CORNER_STYLES, o as KINDS, r as DOT_LABEL, s as KIND_LABEL, t as CORNER_LABEL } from "./content-B_3bvPxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/qr-studio-3H1b5FbW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var field = "h-11 w-full rounded-lg border border-line bg-card px-3 text-sm text-ink";
var area = "min-h-28 w-full rounded-lg border border-line bg-card px-3 py-3 text-sm text-ink";
function QrStudio({ qrId, publicId, initial, scans, sourceLabel, live, pauseReason }) {
	const navigate = useNavigate();
	const [draft, setDraft] = (0, import_react.useState)(initial);
	const [error, setError] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [downloader, setDownloader] = (0, import_react.useState)(null);
	const composed = (0, import_react.useMemo)(() => {
		try {
			return {
				ok: true,
				value: compose(draft)
			};
		} catch (caught) {
			return {
				ok: false,
				error: caught instanceof UserError ? caught.message : "Revisa los datos."
			};
		}
	}, [draft]);
	const encoded = publicId && typeof window !== "undefined" ? `${window.location.origin}/q/${publicId}` : composed.ok ? composed.value.destination : "Sello";
	function set(key, value) {
		setDraft((current) => ({
			...current,
			[key]: value
		}));
		setNote("");
	}
	async function save() {
		setError("");
		setNote("");
		if (!composed.ok) {
			setError(composed.error);
			return;
		}
		setBusy(true);
		const result = qrId ? await updateQr({ data: {
			id: qrId,
			draft
		} }) : await createQr({ data: draft });
		setBusy(false);
		if (!result.ok) {
			setError(result.error);
			return;
		}
		if (!qrId && "id" in result) {
			await navigate({
				to: "/panel/$id",
				params: { id: String(result.id) }
			});
			return;
		}
		setNote("Guardado. El código impreso sigue igual.");
	}
	async function destroy() {
		if (!qrId) return;
		setBusy(true);
		const result = await removeQr({ data: qrId });
		setBusy(false);
		if (!result.ok) {
			setError(result.error);
			return;
		}
		await navigate({ to: "/panel" });
	}
	function onLogo(file) {
		if (!file) return;
		if (![
			"image/png",
			"image/jpeg",
			"image/webp"
		].includes(file.type) || file.size > 102400) {
			setError("Usa un PNG, JPG o WebP de menos de 100 KB.");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => set("logoData", String(reader.result));
		reader.readAsDataURL(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "rounded-3xl border border-line bg-card p-4 shadow-sheet",
			onSubmit: (event) => {
				event.preventDefault();
				save();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-medium",
					children: ["Nombre interno", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${field} mt-2`,
						value: draft.title,
						maxLength: 80,
						placeholder: "Menú del local",
						onChange: (event) => set("title", event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex gap-2 overflow-x-auto pb-1",
					children: KINDS.map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => set("kind", kind),
						className: draft.kind === kind ? "shrink-0 rounded-full bg-ink px-3 py-2 text-sm text-card" : "shrink-0 rounded-full border border-line px-3 py-2 text-sm text-ink",
						children: KIND_LABEL[kind]
					}, kind))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						draft.kind === "url" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Enlace de destino",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field,
								value: draft.url,
								placeholder: "https://tutienda.com/menu",
								onChange: (event) => set("url", event.target.value)
							})
						}) : null,
						draft.kind === "whatsapp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Celular con indicativo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field,
								value: draft.whatsappPhone,
								placeholder: "573001112233",
								onChange: (event) => set("whatsappPhone", event.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mensaje opcional",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field,
								value: draft.whatsappMessage,
								onChange: (event) => set("whatsappMessage", event.target.value)
							})
						})] }) : null,
						draft.kind === "wifi" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nombre de la red",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field,
									value: draft.wifiSsid,
									onChange: (event) => set("wifiSsid", event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Seguridad",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: field,
									value: draft.wifiSecurity,
									onChange: (event) => set("wifiSecurity", event.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "WPA",
											children: "WPA / WPA2"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "WEP",
											children: "WEP"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "nopass",
											children: "Red abierta"
										})
									]
								})
							}),
							draft.wifiSecurity !== "nopass" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Clave",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field,
									value: draft.wifiPassword,
									onChange: (event) => set("wifiPassword", event.target.value)
								})
							}) : null
						] }) : null,
						draft.kind === "vcard" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nombre",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field,
									value: draft.vcardName,
									onChange: (event) => set("vcardName", event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Organización",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field,
									value: draft.vcardOrg,
									onChange: (event) => set("vcardOrg", event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Teléfono",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field,
									value: draft.vcardPhone,
									onChange: (event) => set("vcardPhone", event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Correo",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field,
									value: draft.vcardEmail,
									onChange: (event) => set("vcardEmail", event.target.value)
								})
							})
						] }) : null,
						draft.kind === "phone" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Teléfono",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field,
								value: draft.phone,
								placeholder: "+57 300 111 2233",
								onChange: (event) => set("phone", event.target.value)
							})
						}) : null,
						draft.kind === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Correo",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field,
									value: draft.email,
									onChange: (event) => set("email", event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Asunto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field,
									value: draft.emailSubject,
									onChange: (event) => set("emailSubject", event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Mensaje",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: area,
									value: draft.emailBody,
									onChange: (event) => set("emailBody", event.target.value)
								})
							})
						] }) : null,
						draft.kind === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Texto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: area,
								value: draft.text,
								onChange: (event) => set("text", event.target.value)
							})
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Color, {
							label: "Tinta",
							value: draft.fg,
							onChange: (value) => set("fg", value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Color, {
							label: "Fondo",
							value: draft.bg,
							onChange: (value) => set("bg", value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Color, {
							label: "Esquinas",
							value: draft.accent,
							onChange: (value) => set("accent", value)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm font-medium",
					children: "Forma de los módulos"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: DOT_STYLES.map((style) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => set("dotStyle", style),
						className: chip(draft.dotStyle === style),
						children: DOT_LABEL[style]
					}, style))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm font-medium",
					children: "Esquinas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: CORNER_STYLES.map((style) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => set("cornerStyle", style),
						className: chip(draft.cornerStyle === style),
						children: CORNER_LABEL[style]
					}, style))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm font-medium",
						children: [draft.logoData ? "Cambiar logo" : "Agregar logo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/png,image/jpeg,image/webp",
							className: "sr-only",
							onChange: (event) => onLogo(event.target.files?.[0])
						})]
					}), draft.logoData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-stamp",
						onClick: () => set("logoData", null),
						children: "Quitar logo"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: "PNG, JPG o WebP, menos de 100 KB."
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-stamp",
					children: error
				}) : null,
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-moss",
					children: note
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "h-11 rounded-full bg-stamp px-5 text-sm font-medium text-card disabled:opacity-60",
						children: busy ? "Guardando…" : qrId ? "Guardar cambios" : "Crear código"
					}), qrId ? confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 rounded-full border border-stamp px-5 text-sm text-stamp",
						onClick: () => void destroy(),
						children: "Confirmar eliminación"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 rounded-full px-4 text-sm text-muted",
						onClick: () => setConfirmDelete(true),
						children: "Eliminar"
					}) : null]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-3xl border border-line bg-card p-4 lg:sticky lg:top-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg bg-paper p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrPreview, {
						data: encoded,
						fg: draft.fg,
						bg: draft.bg,
						accent: draft.accent,
						dotStyle: draft.dotStyle,
						cornerStyle: draft.cornerStyle,
						logo: draft.logoData,
						onReady: setDownloader
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: publicId ? "Este es el código para imprimir. Puedes cambiar el destino sin reimprimirlo." : "Vista previa. Al guardarlo, el impreso apuntará a Sello para que puedas editarlo después."
				}),
				sourceLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: sourceLabel
				}) : null,
				typeof live === "boolean" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: live ? "mt-1 text-sm text-moss" : "mt-1 text-sm text-stamp",
					children: live ? "Activo" : pauseReason || "En pausa"
				}) : null,
				typeof scans === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm tabular-nums text-muted",
					children: [scans, " escaneos"]
				}) : null,
				publicId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-full bg-ink px-4 text-sm text-card",
							onClick: () => void downloader?.download("png"),
							children: "Descargar PNG"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-full border border-line px-4 text-sm",
							onClick: () => void downloader?.download("svg"),
							children: "SVG"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-full border border-line px-4 text-sm",
							onClick: () => void navigator.clipboard.writeText(`${window.location.origin}/q/${publicId}`),
							children: "Copiar enlace"
						})
					]
				}) : null
			]
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm font-medium",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-normal",
			children
		})]
	});
}
function Color({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm font-medium",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mt-2 flex h-11 items-center gap-2 rounded-lg border border-line bg-card px-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "color",
				value,
				"aria-label": label,
				onChange: (event) => onChange(event.target.value),
				className: "h-8 w-8 border-0 bg-transparent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs uppercase text-muted",
				children: value
			})]
		})]
	});
}
function chip(active) {
	return active ? "h-10 rounded-full bg-ink px-3 text-sm text-card" : "h-10 rounded-full border border-line px-3 text-sm text-ink";
}
//#endregion
export { QrStudio as t };
