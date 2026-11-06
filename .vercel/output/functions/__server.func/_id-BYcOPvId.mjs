import { o as __toESM } from "./_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react } from "./_libs/@tanstack/react-router+[...].mjs";
import { g as getQr, i as Route$6 } from "./_ssr/router-pyGeqgNY.mjs";
import { t as QrStudio } from "./_ssr/qr-studio-3H1b5FbW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BYcOPvId.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditQr() {
	const { id } = Route$6.useParams();
	const [qr, setQr] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getQr({ data: Number(id) }).then(setQr).catch(() => setError("No encontramos ese código."));
	}, [id]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-stamp",
		children: error
	});
	if (!qr) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-80 animate-pulse rounded-3xl bg-paper-deep" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "mb-5 font-display text-4xl",
		children: qr.input.title || "Editar código"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrStudio, {
		qrId: qr.id,
		publicId: qr.publicId,
		initial: qr.input,
		scans: qr.scans,
		live: qr.live,
		pauseReason: qr.pauseReason,
		sourceLabel: qr.sourceLabel
	})] });
}
//#endregion
export { EditQr as component };
