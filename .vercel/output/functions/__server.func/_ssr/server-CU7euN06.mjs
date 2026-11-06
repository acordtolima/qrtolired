import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DgD7Ax1O.mjs";
import { c as UserError, d as parseInput } from "./content-B_3bvPxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-CU7euN06.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function failure(error) {
	if (error instanceof UserError) return {
		ok: false,
		error: error.message
	};
	console.error(error);
	return {
		ok: false,
		error: "No se pudo completar. Intenta de nuevo."
	};
}
function positive(id) {
	const value = typeof id === "number" ? id : Number(id);
	if (!Number.isInteger(value) || value <= 0) throw new UserError("Identificador inválido.");
	return value;
}
var listPublicPackages_createServerFn_handler = createServerRpc({
	id: "cd4c92c6bad9b69dc6bfbf3f7be059420c5fd36e4f42b752086756e7cc790625",
	name: "listPublicPackages",
	filename: "src/lib/qr/server.ts"
}, (opts) => listPublicPackages.__executeServer(opts));
var listPublicPackages = createServerFn({ method: "GET" }).handler(listPublicPackages_createServerFn_handler, async () => {
	const { publicPackages } = await import("./logic.server-f5Dz6u3U.mjs");
	return publicPackages();
});
var resolvePublicQr_createServerFn_handler = createServerRpc({
	id: "ca7fd74507b7048efa82262eab5f0b46ea2a193dae4fa40985171a38f85fee00",
	name: "resolvePublicQr",
	filename: "src/lib/qr/server.ts"
}, (opts) => resolvePublicQr.__executeServer(opts));
var resolvePublicQr = createServerFn({ method: "GET" }).validator((code) => String(code ?? "")).handler(resolvePublicQr_createServerFn_handler, async ({ data }) => {
	const { resolvePublic } = await import("./logic.server-f5Dz6u3U.mjs");
	return resolvePublic(data);
});
var getMe_createServerFn_handler = createServerRpc({
	id: "6a1f1bc89406aa111c634d0b8c81b4b1c0262cb62a9adac2d2d92f2a631f555a",
	name: "getMe",
	filename: "src/lib/qr/server.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMe_createServerFn_handler, async ({ context }) => {
	const { getMeFor } = await import("./logic.server-f5Dz6u3U.mjs");
	return getMeFor(context.userId);
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "50fb2620cd78493f3d33197ba8b3dccce45e17b8a978b13602f7174fc055d3e9",
	name: "getDashboard",
	filename: "src/lib/qr/server.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const { dashboardFor } = await import("./logic.server-f5Dz6u3U.mjs");
	return dashboardFor(context.userId);
});
var getQr_createServerFn_handler = createServerRpc({
	id: "2f0b49f4efbc898ee6a8a9219a741fe476b5ea7f1f56228ebe4357848dcca5bd",
	name: "getQr",
	filename: "src/lib/qr/server.ts"
}, (opts) => getQr.__executeServer(opts));
var getQr = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getQr_createServerFn_handler, async ({ context, data }) => {
	const { qrFor } = await import("./logic.server-f5Dz6u3U.mjs");
	return qrFor(context.userId, positive(data));
});
var createQr_createServerFn_handler = createServerRpc({
	id: "5fd34927b8e00f2bee53a13fd53a45325bf1e6a0d8eb626439a2f6a9a6691767",
	name: "createQr",
	filename: "src/lib/qr/server.ts"
}, (opts) => createQr.__executeServer(opts));
var createQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createQr_createServerFn_handler, async ({ context, data }) => {
	try {
		const { createQrFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await createQrFor(context.userId, parseInput(data));
	} catch (error) {
		return failure(error);
	}
});
var updateQr_createServerFn_handler = createServerRpc({
	id: "6caf351681a5719faadcb4525cd015902fe5782a214eda77dbe6e73bb463b881",
	name: "updateQr",
	filename: "src/lib/qr/server.ts"
}, (opts) => updateQr.__executeServer(opts));
var updateQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateQr_createServerFn_handler, async ({ context, data }) => {
	try {
		const { updateQrFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await updateQrFor(context.userId, positive(data?.id), parseInput(data?.draft));
	} catch (error) {
		return failure(error);
	}
});
var removeQr_createServerFn_handler = createServerRpc({
	id: "bc1f35eb3dd5c623c3abcaa10459a157217c9aa3a8158cd55fae70fd72d1cf52",
	name: "removeQr",
	filename: "src/lib/qr/server.ts"
}, (opts) => removeQr.__executeServer(opts));
var removeQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(removeQr_createServerFn_handler, async ({ context, data }) => {
	try {
		const { deleteQrFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await deleteQrFor(context.userId, positive(data));
	} catch (error) {
		return failure(error);
	}
});
var reactivateQr_createServerFn_handler = createServerRpc({
	id: "0a2d4fbfb3503dee821574d5946d0d2c1d535193963d466d0bd88a7e48f44f5b",
	name: "reactivateQr",
	filename: "src/lib/qr/server.ts"
}, (opts) => reactivateQr.__executeServer(opts));
var reactivateQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(reactivateQr_createServerFn_handler, async ({ context, data }) => {
	try {
		const { reactivateQrFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await reactivateQrFor(context.userId, positive(data));
	} catch (error) {
		return failure(error);
	}
});
var getPlans_createServerFn_handler = createServerRpc({
	id: "cb04fc3ee12929e9016e96c67afd122a171de1f9fe5e8bd784d2e03eb4c5cf9a",
	name: "getPlans",
	filename: "src/lib/qr/server.ts"
}, (opts) => getPlans.__executeServer(opts));
var getPlans = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getPlans_createServerFn_handler, async ({ context }) => {
	const { plansFor } = await import("./logic.server-f5Dz6u3U.mjs");
	return plansFor(context.userId);
});
var startCheckout_createServerFn_handler = createServerRpc({
	id: "adc298ecc7680a3707c5883a525227164ae109a4ad504bff24d7ff53641ec3a2",
	name: "startCheckout",
	filename: "src/lib/qr/server.ts"
}, (opts) => startCheckout.__executeServer(opts));
var startCheckout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((packageId) => packageId).handler(startCheckout_createServerFn_handler, async ({ context, data }) => {
	try {
		const { startCheckoutFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await startCheckoutFor(context.userId, positive(data));
	} catch (error) {
		return failure(error);
	}
});
var confirmPayment_createServerFn_handler = createServerRpc({
	id: "bcb455261a61e2d47768e940afe6f145b4f81110e5f36afddffd668d49ad8b35",
	name: "confirmPayment",
	filename: "src/lib/qr/server.ts"
}, (opts) => confirmPayment.__executeServer(opts));
var confirmPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	reference: String(input?.reference ?? ""),
	transactionId: String(input?.transactionId ?? "")
})).handler(confirmPayment_createServerFn_handler, async ({ context, data }) => {
	try {
		const reference = data.reference.trim();
		if (!/^[A-Z0-9]{6,40}$/.test(reference)) throw new UserError("Referencia inválida.");
		const { confirmPaymentFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await confirmPaymentFor(context.userId, reference, data.transactionId.slice(0, 80));
	} catch (error) {
		return failure(error);
	}
});
var adminOverview_createServerFn_handler = createServerRpc({
	id: "5efa8cac55ef6d255b20bbb4064c5c8572e9c1a21da5d9e048c180ad2b20e1da",
	name: "adminOverview",
	filename: "src/lib/qr/server.ts"
}, (opts) => adminOverview.__executeServer(opts));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminOverview_createServerFn_handler, async ({ context }) => {
	const { adminOverviewFor } = await import("./logic.server-f5Dz6u3U.mjs");
	return adminOverviewFor(context.userId);
});
var adminUsers_createServerFn_handler = createServerRpc({
	id: "c762883374b38706003ff16aae2fad07fdfbafe2771ced1adedd45c27aa3bd5d",
	name: "adminUsers",
	filename: "src/lib/qr/server.ts"
}, (opts) => adminUsers.__executeServer(opts));
var adminUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminUsers_createServerFn_handler, async ({ context }) => {
	const { adminUsersFor } = await import("./logic.server-f5Dz6u3U.mjs");
	return adminUsersFor(context.userId);
});
var adminPackages_createServerFn_handler = createServerRpc({
	id: "e4f605592826d066d7cbe01907f2028101c32c1fe0a58450a002b42ecf70e973",
	name: "adminPackages",
	filename: "src/lib/qr/server.ts"
}, (opts) => adminPackages.__executeServer(opts));
var adminPackages = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminPackages_createServerFn_handler, async ({ context }) => {
	const { adminPackagesFor } = await import("./logic.server-f5Dz6u3U.mjs");
	return adminPackagesFor(context.userId);
});
var savePackage_createServerFn_handler = createServerRpc({
	id: "481d1fb53048e75362e3d2324fa822c96695073f3a4c8942d75b2e1000e03b23",
	name: "savePackage",
	filename: "src/lib/qr/server.ts"
}, (opts) => savePackage.__executeServer(opts));
var savePackage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(savePackage_createServerFn_handler, async ({ context, data }) => {
	try {
		const { savePackageFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await savePackageFor(context.userId, {
			...data,
			id: data.id ? positive(data.id) : void 0,
			qrQuota: Number(data.qrQuota),
			priceCop: Number(data.priceCop),
			durationDays: Number(data.durationDays),
			sortOrder: Number(data.sortOrder),
			active: Boolean(data.active)
		});
	} catch (error) {
		return failure(error);
	}
});
var deletePackage_createServerFn_handler = createServerRpc({
	id: "f15e705afa375a301fbbf71f0b77e5a5e0115082910e16421e6f4d60ecaf5a7c",
	name: "deletePackage",
	filename: "src/lib/qr/server.ts"
}, (opts) => deletePackage.__executeServer(opts));
var deletePackage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deletePackage_createServerFn_handler, async ({ context, data }) => {
	try {
		const { deletePackageFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await deletePackageFor(context.userId, positive(data));
	} catch (error) {
		return failure(error);
	}
});
var grantPackage_createServerFn_handler = createServerRpc({
	id: "5dc2b4060fb3d49b4d38d351ea73410b6fbfbc49d7bc874ec03c58fe3ff78d34",
	name: "grantPackage",
	filename: "src/lib/qr/server.ts"
}, (opts) => grantPackage.__executeServer(opts));
var grantPackage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(grantPackage_createServerFn_handler, async ({ context, data }) => {
	try {
		const { grantPackageFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await grantPackageFor(context.userId, String(data.userId), positive(data.packageId));
	} catch (error) {
		return failure(error);
	}
});
var setExpiry_createServerFn_handler = createServerRpc({
	id: "94860247e0e71d619bb0765efcef5f9b90a1596119361d3ee70324d5e36ebc69",
	name: "setExpiry",
	filename: "src/lib/qr/server.ts"
}, (opts) => setExpiry.__executeServer(opts));
var setExpiry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setExpiry_createServerFn_handler, async ({ context, data }) => {
	try {
		const { setExpiryFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await setExpiryFor(context.userId, positive(data.entitlementId), String(data.day));
	} catch (error) {
		return failure(error);
	}
});
var setRole_createServerFn_handler = createServerRpc({
	id: "7fa092e82bad9a2192b6a7c9f1fa14e2988ad44245251801262c0dc19ae381c8",
	name: "setRole",
	filename: "src/lib/qr/server.ts"
}, (opts) => setRole.__executeServer(opts));
var setRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setRole_createServerFn_handler, async ({ context, data }) => {
	try {
		const { setRoleFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await setRoleFor(context.userId, String(data.userId), data.role === "admin" ? "admin" : "user");
	} catch (error) {
		return failure(error);
	}
});
var getAdminSettings_createServerFn_handler = createServerRpc({
	id: "2245308c0a93c26c7bcbf128de0338c959f04d16a3f1bb57c2d0f68aeae86239",
	name: "getAdminSettings",
	filename: "src/lib/qr/server.ts"
}, (opts) => getAdminSettings.__executeServer(opts));
var getAdminSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminSettings_createServerFn_handler, async ({ context }) => {
	const { adminSettingsFor } = await import("./logic.server-f5Dz6u3U.mjs");
	return adminSettingsFor(context.userId);
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "026c80622c71aee21434911158ccff6f876ee569116e803400cd7ed7c0ea8b26",
	name: "saveSettings",
	filename: "src/lib/qr/server.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveSettings_createServerFn_handler, async ({ context, data }) => {
	try {
		const { saveSettingsFor } = await import("./logic.server-f5Dz6u3U.mjs");
		return await saveSettingsFor(context.userId, {
			...data,
			freeQrLimit: Number(data.freeQrLimit),
			freeGraceDays: Number(data.freeGraceDays),
			allowDemoCheckout: Boolean(data.allowDemoCheckout)
		});
	} catch (error) {
		return failure(error);
	}
});
//#endregion
export { adminOverview_createServerFn_handler, adminPackages_createServerFn_handler, adminUsers_createServerFn_handler, confirmPayment_createServerFn_handler, createQr_createServerFn_handler, deletePackage_createServerFn_handler, getAdminSettings_createServerFn_handler, getDashboard_createServerFn_handler, getMe_createServerFn_handler, getPlans_createServerFn_handler, getQr_createServerFn_handler, grantPackage_createServerFn_handler, listPublicPackages_createServerFn_handler, reactivateQr_createServerFn_handler, removeQr_createServerFn_handler, resolvePublicQr_createServerFn_handler, savePackage_createServerFn_handler, saveSettings_createServerFn_handler, setExpiry_createServerFn_handler, setRole_createServerFn_handler, startCheckout_createServerFn_handler, updateQr_createServerFn_handler };
