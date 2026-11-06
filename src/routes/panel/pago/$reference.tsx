import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { fecha } from "@/lib/qr/format";
import { confirmPayment } from "@/lib/qr/server";
import type { PaymentState } from "@/lib/qr/types";

export const Route = createFileRoute("/panel/pago/$reference")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : "",
  }),
  head: () => ({ meta: [{ title: "Pago · Sello" }] }),
  component: PaymentResult,
});

function PaymentResult() {
  const { reference } = Route.useParams();
  const { id } = Route.useSearch();
  const [state, setState] = useState<PaymentState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let dead = false;
    confirmPayment({ data: { reference, transactionId: id } }).then((result) => {
      if (dead) return;
      if ("status" in result && result.ok) setState(result);
      else setError("error" in result ? result.error : "No se pudo confirmar el pago.");
    });
    return () => {
      dead = true;
    };
  }, [reference, id]);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-line bg-card p-6">
      <h1 className="font-display text-3xl">Resultado del pago</h1>
      {!state && !error ? <p className="mt-3 text-sm text-muted">Confirmando con Wompi…</p> : null}
      {error ? <p className="mt-3 text-sm text-stamp">{error}</p> : null}
      {state ? (
        <>
          <p className="mt-3 text-sm">{state.detail}</p>
          <p className="mt-2 text-sm text-muted">
            {state.packageName}
            {state.expiresAt ? ` · activo hasta ${fecha(state.expiresAt)}` : ""}
          </p>
        </>
      ) : null}
      <Link to="/panel" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-card">
        Volver a mis códigos
      </Link>
    </div>
  );
}
