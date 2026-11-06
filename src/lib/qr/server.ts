import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { parseInput, UserError } from "@/lib/qr/content";
import type {
  AdminOverview,
  AdminPackage,
  AdminSettings,
  AdminUser,
  CheckoutStart,
  Dashboard,
  Me,
  Mutation,
  PaymentState,
  PlansPayload,
  PublicQr,
  QrDetail,
} from "@/lib/qr/types";

function failure(error: unknown): { ok: false; error: string } {
  if (error instanceof UserError) return { ok: false, error: error.message };
  console.error(error);
  return { ok: false, error: "No se pudo completar. Intenta de nuevo." };
}

function positive(id: unknown) {
  const value = typeof id === "number" ? id : Number(id);
  if (!Number.isInteger(value) || value <= 0) throw new UserError("Identificador inválido.");
  return value;
}

export const listPublicPackages = createServerFn({ method: "GET" }).handler(async () => {
  const { publicPackages } = await import("./logic.server");
  return publicPackages();
});

export const resolvePublicQr = createServerFn({ method: "GET" })
  .validator((code: string) => String(code ?? ""))
  .handler(async ({ data }): Promise<PublicQr> => {
    const { resolvePublic } = await import("./logic.server");
    return resolvePublic(data);
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Me> => {
    const { getMeFor } = await import("./logic.server");
    return getMeFor(context.userId);
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Dashboard> => {
    const { dashboardFor } = await import("./logic.server");
    return dashboardFor(context.userId);
  });

export const getQr = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data }): Promise<QrDetail> => {
    const { qrFor } = await import("./logic.server");
    return qrFor(context.userId, positive(data));
  });

export const createQr = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => input)
  .handler(async ({ context, data }): Promise<{ ok: true; id: number } | Mutation> => {
    try {
      const { createQrFor } = await import("./logic.server");
      return await createQrFor(context.userId, parseInput(data));
    } catch (error) {
      return failure(error);
    }
  });

export const updateQr = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; draft: unknown }) => input)
  .handler(async ({ context, data }): Promise<Mutation> => {
    try {
      const { updateQrFor } = await import("./logic.server");
      return await updateQrFor(context.userId, positive(data?.id), parseInput(data?.draft));
    } catch (error) {
      return failure(error);
    }
  });

export const removeQr = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data }): Promise<Mutation> => {
    try {
      const { deleteQrFor } = await import("./logic.server");
      return await deleteQrFor(context.userId, positive(data));
    } catch (error) {
      return failure(error);
    }
  });

export const reactivateQr = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data }): Promise<Mutation> => {
    try {
      const { reactivateQrFor } = await import("./logic.server");
      return await reactivateQrFor(context.userId, positive(data));
    } catch (error) {
      return failure(error);
    }
  });

export const getPlans = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<PlansPayload> => {
    const { plansFor } = await import("./logic.server");
    return plansFor(context.userId);
  });

export const startCheckout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((packageId: number) => packageId)
  .handler(async ({ context, data }): Promise<CheckoutStart> => {
    try {
      const { startCheckoutFor } = await import("./logic.server");
      return await startCheckoutFor(context.userId, positive(data));
    } catch (error) {
      return failure(error);
    }
  });

export const confirmPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { reference: string; transactionId?: string }) => ({
    reference: String(input?.reference ?? ""),
    transactionId: String(input?.transactionId ?? ""),
  }))
  .handler(async ({ context, data }): Promise<PaymentState | Mutation> => {
    try {
      const reference = data.reference.trim();
      if (!/^[A-Z0-9]{6,40}$/.test(reference)) throw new UserError("Referencia inválida.");
      const { confirmPaymentFor } = await import("./logic.server");
      return await confirmPaymentFor(context.userId, reference, data.transactionId.slice(0, 80));
    } catch (error) {
      return failure(error);
    }
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AdminOverview> => {
    const { adminOverviewFor } = await import("./logic.server");
    return adminOverviewFor(context.userId);
  });

export const adminUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ users: AdminUser[]; packages: AdminPackage[] }> => {
    const { adminUsersFor } = await import("./logic.server");
    return adminUsersFor(context.userId);
  });

export const adminPackages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AdminPackage[]> => {
    const { adminPackagesFor } = await import("./logic.server");
    return adminPackagesFor(context.userId);
  });

export const savePackage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id?: number;
    name: string;
    qrQuota: number;
    priceCop: number;
    durationDays: number;
    description: string;
    active: boolean;
    sortOrder: number;
  }) => input)
  .handler(async ({ context, data }): Promise<Mutation> => {
    try {
      const { savePackageFor } = await import("./logic.server");
      return await savePackageFor(context.userId, {
        ...data,
        id: data.id ? positive(data.id) : undefined,
        qrQuota: Number(data.qrQuota),
        priceCop: Number(data.priceCop),
        durationDays: Number(data.durationDays),
        sortOrder: Number(data.sortOrder),
        active: Boolean(data.active),
      });
    } catch (error) {
      return failure(error);
    }
  });

export const deletePackage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data }): Promise<Mutation> => {
    try {
      const { deletePackageFor } = await import("./logic.server");
      return await deletePackageFor(context.userId, positive(data));
    } catch (error) {
      return failure(error);
    }
  });

export const grantPackage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; packageId: number }) => input)
  .handler(async ({ context, data }): Promise<Mutation> => {
    try {
      const { grantPackageFor } = await import("./logic.server");
      return await grantPackageFor(context.userId, String(data.userId), positive(data.packageId));
    } catch (error) {
      return failure(error);
    }
  });

export const setExpiry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { entitlementId: number; day: string }) => input)
  .handler(async ({ context, data }): Promise<Mutation> => {
    try {
      const { setExpiryFor } = await import("./logic.server");
      return await setExpiryFor(context.userId, positive(data.entitlementId), String(data.day));
    } catch (error) {
      return failure(error);
    }
  });

export const setRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; role: "admin" | "user" }) => input)
  .handler(async ({ context, data }): Promise<Mutation> => {
    try {
      const { setRoleFor } = await import("./logic.server");
      return await setRoleFor(context.userId, String(data.userId), data.role === "admin" ? "admin" : "user");
    } catch (error) {
      return failure(error);
    }
  });

export const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AdminSettings> => {
    const { adminSettingsFor } = await import("./logic.server");
    return adminSettingsFor(context.userId);
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    wompiPublicKey: string;
    wompiIntegritySecret: string;
    wompiEventsSecret: string;
    wompiEnv: string;
    allowDemoCheckout: boolean;
    freeQrLimit: number;
    freeGraceDays: number;
  }) => input)
  .handler(async ({ context, data }): Promise<Mutation> => {
    try {
      const { saveSettingsFor } = await import("./logic.server");
      return await saveSettingsFor(context.userId, {
        ...data,
        freeQrLimit: Number(data.freeQrLimit),
        freeGraceDays: Number(data.freeGraceDays),
        allowDemoCheckout: Boolean(data.allowDemoCheckout),
      });
    } catch (error) {
      return failure(error);
    }
  });
