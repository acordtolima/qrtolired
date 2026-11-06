import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { cop, fecha, statusLabel } from "@/lib/qr/format";
import { confirmPayment, getPlans, startCheckout } from "@/lib/qr/server";
import { openWompi } from "@/lib/qr/wompi-client";
import type { PlansPayload } from "@/lib/qr/types";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/panel/planes")({
  head: () => ({ meta: [{ title: "Paquetes · Sello" }] }),
  component: Plans,
});

function Plans() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [data, setData] = useState<PlansPayload | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const [demo, setDemo] = useState<{ reference: string; priceCop: number; packageName: string } | null>(null);

  function load() {
    getPlans().then(setData).catch(() => setError("No se pudieron cargar los paquetes."));
  }

  useEffect(() => {
    load();
  }, []);

  async function buy(packageId: number) {
    setError("");
    setBusy(packageId);
    const started = await startCheckout({ data: packageId });
    setBusy(null);
    if (!started.ok) {
      setError(started.error);
      return;
    }
    if (started.mode === "activated") {
      await navigate({ to: "/panel/pago/$reference", params: { reference: started.reference }, search: { id: "" } });
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
        email: user?.primaryEmail ?? undefined,
      });
      await navigate({
        to: "/panel/pago/$reference",
        params: { reference: started.reference },
        search: { id: tx ?? "" },
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se abrió Wompi.");
    }
  }

  async function simulate() {
    if (!demo) return;
    setBusy(-1);
    const result = await confirmPayment({ data: { reference: demo.reference, transactionId: "demo" } });
    setBusy(null);
    if (!("status" in result) || !result.ok) {
      setError("error" in result ? result.error : "No se pudo simular el pago.");
      return;
    }
    setDemo(null);
    load();
    setError("");
    await navigate({ to: "/panel/pago/$reference", params: { reference: demo.reference }, search: { id: "demo" } });
  }

  if (!data) return <div className="h-40 animate-pulse rounded-3xl bg-paper-deep" />;

  return (
    <div>
      <h1 className="font-display text-4xl">Paquetes</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Cada compra suma cupo durante el periodo del paquete. No hay cobro automático: cuando vence, los códigos de ese paquete se pausan hasta un nuevo pago.
      </p>
      {data.demoCheckout ? (
        <p className="mt-4 rounded-lg bg-paper-deep px-4 py-3 text-sm">
          Wompi todavía no tiene llaves. Puedes simular un pago aprobado para probar el cupo. En Administración pegas la llave pública y el secreto de integridad para cobrar de verdad.
        </p>
      ) : null}
      {!data.wompiReady && !data.demoCheckout ? (
        <p className="mt-4 text-sm text-stamp">Los pagos están cerrados hasta que se configure Wompi.</p>
      ) : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.packages.map((pack) => (
          <article key={pack.id} className="flex flex-col rounded-3xl border border-line bg-card p-4">
            <h2 className="font-display text-2xl">{pack.name}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{pack.description}</p>
            <p className="mt-4 font-display text-3xl tabular-nums">{cop(pack.priceCop)}</p>
            <p className="text-sm text-muted">{pack.qrQuota} códigos · {pack.durationDays} días</p>
            <button
              type="button"
              disabled={busy === pack.id}
              onClick={() => void buy(pack.id)}
              className="mt-4 h-11 rounded-full bg-stamp text-sm font-medium text-card disabled:opacity-60"
            >
              {busy === pack.id ? "Abriendo pago…" : pack.priceCop === 0 ? "Activar" : "Pagar con Wompi"}
            </button>
          </article>
        ))}
      </div>
      {demo ? (
        <div className="mt-4 rounded-3xl border border-line bg-card p-4">
          <h2 className="font-display text-2xl">Pago de prueba</h2>
          <p className="mt-2 text-sm text-muted">
            {demo.packageName} por {cop(demo.priceCop)}. Esto no cobra nada: marca el paquete como pagado para que veas el vencimiento y el cupo.
          </p>
          <button type="button" disabled={busy === -1} onClick={() => void simulate()} className="mt-4 h-11 rounded-full bg-ink px-5 text-sm text-card">
            Simular aprobación
          </button>
        </div>
      ) : null}
      {error ? <p className="mt-4 text-sm text-stamp">{error}</p> : null}
      <h2 className="mt-10 font-display text-2xl">Tus paquetes</h2>
      {data.entitlements.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Aún no compras ni te asignan un paquete.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-3xl border border-line bg-card">
          {data.entitlements.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <span>{item.packageName} · {item.qrQuota} códigos{item.granted ? " · asignado" : ""}</span>
              <span className="text-muted">{statusLabel(item.status)}{item.expiresAt ? ` · hasta ${fecha(item.expiresAt)}` : ""}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
