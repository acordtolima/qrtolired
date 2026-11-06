import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/qr-preview-DKpVK8DE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QrPreview({ data, fg, bg, accent, dotStyle, cornerStyle, logo, size = 280, type = "canvas", onReady }) {
	const host = (0, import_react.useRef)(null);
	const ready = (0, import_react.useRef)(onReady);
	ready.current = onReady;
	(0, import_react.useEffect)(() => {
		const node = host.current;
		if (!node) return;
		let dead = false;
		node.replaceChildren();
		(async () => {
			const { default: QRCodeStyling } = await import("../_libs/qr-code-styling.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			if (dead || !host.current) return;
			const qr = new QRCodeStyling({
				width: size,
				height: size,
				type,
				data: data || "Sello",
				margin: 8,
				image: logo || void 0,
				qrOptions: { errorCorrectionLevel: logo ? "H" : "Q" },
				dotsOptions: {
					type: dotStyle,
					color: fg
				},
				backgroundOptions: { color: bg },
				cornersSquareOptions: {
					type: cornerStyle,
					color: accent
				},
				cornersDotOptions: {
					type: cornerStyle === "dot" ? "dot" : "square",
					color: accent
				},
				imageOptions: {
					hideBackgroundDots: true,
					imageSize: .38,
					margin: 4,
					crossOrigin: "anonymous"
				}
			});
			host.current.replaceChildren();
			qr.append(host.current);
			ready.current?.({ download: (ext) => qr.download({
				name: "sello",
				extension: ext
			}) });
		})();
		return () => {
			dead = true;
			ready.current?.(null);
		};
	}, [
		data,
		fg,
		bg,
		accent,
		dotStyle,
		cornerStyle,
		logo,
		size,
		type
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: host,
		className: "grid place-items-center [&_canvas]:h-auto [&_canvas]:max-w-full [&_svg]:h-auto [&_svg]:max-w-full"
	});
}
//#endregion
export { QrPreview as t };
