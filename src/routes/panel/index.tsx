import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { QrPreview } from "@/components/qr-preview";
import { fecha } from "@/lib/qr/format";
import { getDashboard, reactivateQr } from "@/lib/qr/server";
import { KIND_LABEL } from "@/lib/qr/content";
import type { Dashboard } from "@/lib/qr/types";

export const Route = createFileRoute("/panel/")({
  head: () => ({ meta: [{ title: "Mis códigos · Sello" }] }),
  component: PanelHome,
});

function PanelHome() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  function load() {
    getDashboard()
      .then(setData)
      .catch(() => setError("No se pudo cargar el panel."));
  }

  useEffect(() => {
    load();
  }, []);

  if (!data) {
    return error ? <p className="text-stamp">{error}</p> : <div className="h-40 animate-pulse rounded-3xl bg-paper-deep" />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Mis códigos</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Los gratis siguen activos hasta el {fecha(data.freeUntil)}. Entra al menos una vez cada {data.graceDays} días.
          </p>
        </div>
        <Link to="/panel/nuevo" className="inline-flex h-11 items-center rounded-full bg-stamp px-5 text-sm font-medium text-card">
          Crear código
        </Link>
      </div>
      {data.wasLapsed ? (
        <p className="mt-4 rounded-lg bg-moss-soft px-4 py-3 text-sm text-moss">
          Tus códigos gratis estaban en pausa. Ya quedaron activos de nuevo.
        </p>
      ) : null}
      {data.qrs.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-line bg-card p-8">
          <h2 className="font-display text-2xl">Todavía no hay sellos</h2>
          <p className="mt-2 max-w-md text-sm text-muted">El primero puede ser un menú, un WhatsApp o la clave del Wi-Fi del local.</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {data.qrs.map((qr) => (
            <li key={qr.id} className="rounded-3xl border border-line bg-card p-4">
              <div className="flex gap-3">
                <div className="w-24 shrink-0 rounded-lg bg-paper p-1">
                  <QrPreview
                    data={`${typeof window !== "undefined" ? window.location.origin : ""}/q/${qr.publicId}`}
                    fg={qr.fg}
                    bg={qr.bg}
                    accent={qr.accent}
                    dotStyle={qr.dotStyle}
                    cornerStyle={qr.cornerStyle}
                    logo={null}
                    size={96}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-xl">{qr.title}</h2>
                  <p className="text-sm text-muted">{KIND_LABEL[qr.kind]} · {qr.scans} escaneos</p>
                  <p className="mt-1 truncate text-sm">{qr.summary}</p>
                  <p className={qr.live ? "mt-1 text-sm text-moss" : "mt-1 text-sm text-stamp"}>{qr.live ? qr.sourceLabel : "En pausa"}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to="/panel/$id" params={{ id: String(qr.id) }} className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm text-card">
                  Editar
                </Link>
                {!qr.live && qr.slot === "paid" ? (
                  <button
                    type="button"
                    className="h-10 rounded-full border border-line px-4 text-sm"
                    onClick={() => {
                      void reactivateQr({ data: qr.id }).then((result) => {
                        if (!result.ok) setError(result.error);
                        else load();
                      });
                    }}
                  >
                    Reactivar con cupo
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      {error ? <p className="mt-4 text-sm text-stamp">{error}</p> : null}
    </div>
  );
}
