import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { cop, fecha, statusLabel } from "@/lib/qr/format";
import { adminOverview } from "@/lib/qr/server";
import type { AdminOverview } from "@/lib/qr/types";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Administración · Sello" }] }),
  component: AdminHome,
});

function AdminHome() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminOverview()
      .then(setData)
      .catch(() => setError("No tienes acceso de administración o no se pudo cargar."));
  }, []);

  if (error) return <p className="text-stamp">{error}</p>;
  if (!data) return <div className="h-40 animate-pulse rounded-3xl bg-paper-deep" />;

  const stats = [
    ["Cuentas", data.users],
    ["Códigos", data.qrs],
    ["Escaneos", data.scans],
    ["Paquetes activos", data.activePacks],
  ] as const;

  return (
    <div>
      <h1 className="font-display text-4xl">Administración</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        La primera cuenta que entra queda como administración. Desde aquí ves vencimientos, creas paquetes y conectas Wompi.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <article key={label} className="rounded-3xl border border-line bg-card p-4">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 font-display text-3xl tabular-nums">{value}</p>
          </article>
        ))}
      </div>
      <h2 className="mt-8 font-display text-2xl">Vencen en 7 días</h2>
      {data.expiring.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Nadie tiene un paquete por vencer esta semana.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-3xl border border-line bg-card">
          {data.expiring.map((row) => (
            <li key={`${row.email}-${row.expiresAt}`} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm">
              <span>{row.name || row.email} · {row.packageName}</span>
              <span className="text-stamp">{fecha(row.expiresAt)}</span>
            </li>
          ))}
        </ul>
      )}
      <h2 className="mt-8 font-display text-2xl">Pagos recientes</h2>
      <ul className="mt-3 divide-y divide-line rounded-3xl border border-line bg-card">
        {data.recent.map((row) => (
          <li key={`${row.email}-${row.createdAt}-${row.packageName}`} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm">
            <span>{row.name || row.email || "Cuenta"} · {row.packageName}</span>
            <span className="text-muted tabular-nums">{statusLabel(row.status)} · {cop(row.priceCop)} · {fecha(row.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
