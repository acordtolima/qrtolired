import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { cop } from "@/lib/qr/format";
import { adminPackages, deletePackage, savePackage } from "@/lib/qr/server";
import type { AdminPackage } from "@/lib/qr/types";

export const Route = createFileRoute("/admin/paquetes")({
  head: () => ({ meta: [{ title: "Paquetes · Administración" }] }),
  component: PackagesPage,
});

const empty = {
  name: "",
  qrQuota: 10,
  priceCop: 49000,
  durationDays: 30,
  description: "",
  active: true,
  sortOrder: 40,
};

function PackagesPage() {
  const [rows, setRows] = useState<AdminPackage[]>([]);
  const [draft, setDraft] = useState(empty);
  const [error, setError] = useState("");

  function load() {
    adminPackages().then(setRows).catch(() => setError("No se pudieron cargar los paquetes."));
  }

  useEffect(() => {
    load();
  }, []);

  async function save(input: Parameters<typeof savePackage>[0]["data"]) {
    const result = await savePackage({ data: input });
    if (!result.ok) setError(result.error);
    else {
      setError("");
      setDraft(empty);
      load();
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Paquetes y precios</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        El precio es en pesos colombianos y la duración es el tiempo que el pago se considera activo. Los de 10, 15, 20, 25 y 30 ya vienen creados; puedes cambiarles el precio o sumar otros.
      </p>
      {error ? <p className="mt-3 text-sm text-stamp">{error}</p> : null}
      <ul className="mt-5 space-y-3">
        {rows.map((pack) => (
          <PackageRow
            key={pack.id}
            pack={pack}
            onSave={(next) => void save(next)}
            onDelete={async () => {
              const result = await deletePackage({ data: pack.id });
              if (!result.ok) setError(result.error);
              else load();
            }}
          />
        ))}
      </ul>
      <form
        className="mt-6 grid gap-3 rounded-3xl border border-line bg-card p-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void save(draft);
        }}
      >
        <h2 className="font-display text-2xl sm:col-span-2">Nuevo paquete</h2>
        <input className="h-11 rounded-lg border border-line px-3" placeholder="Nombre" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <input className="h-11 rounded-lg border border-line px-3" type="number" placeholder="Códigos" value={draft.qrQuota} onChange={(event) => setDraft({ ...draft, qrQuota: Number(event.target.value) })} />
        <input className="h-11 rounded-lg border border-line px-3" type="number" placeholder="Precio COP" value={draft.priceCop} onChange={(event) => setDraft({ ...draft, priceCop: Number(event.target.value) })} />
        <input className="h-11 rounded-lg border border-line px-3" type="number" placeholder="Días" value={draft.durationDays} onChange={(event) => setDraft({ ...draft, durationDays: Number(event.target.value) })} />
        <input className="h-11 rounded-lg border border-line px-3 sm:col-span-2" placeholder="Descripción" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
        <button type="submit" className="h-11 rounded-full bg-stamp text-sm font-medium text-card sm:col-span-2">
          Crear paquete · {draft.priceCop ? cop(draft.priceCop) : "gratis"}
        </button>
      </form>
    </div>
  );
}

function PackageRow({
  pack,
  onSave,
  onDelete,
}: {
  pack: AdminPackage;
  onSave: (input: AdminPackage) => void;
  onDelete: () => void;
}) {
  const [row, setRow] = useState(pack);
  return (
    <li className="grid gap-2 rounded-3xl border border-line bg-card p-4 sm:grid-cols-6">
      <input className="h-11 rounded-lg border border-line px-2 sm:col-span-2" value={row.name} onChange={(event) => setRow({ ...row, name: event.target.value })} />
      <input className="h-11 rounded-lg border border-line px-2" type="number" aria-label="Códigos" value={row.qrQuota} onChange={(event) => setRow({ ...row, qrQuota: Number(event.target.value) })} />
      <input className="h-11 rounded-lg border border-line px-2" type="number" aria-label="Precio" value={row.priceCop} onChange={(event) => setRow({ ...row, priceCop: Number(event.target.value) })} />
      <input className="h-11 rounded-lg border border-line px-2" type="number" aria-label="Días" value={row.durationDays} onChange={(event) => setRow({ ...row, durationDays: Number(event.target.value) })} />
      <label className="flex h-11 items-center gap-2 text-sm">
        <input type="checkbox" checked={row.active} onChange={(event) => setRow({ ...row, active: event.target.checked })} />
        Visible
      </label>
      <input className="h-11 rounded-lg border border-line px-2 sm:col-span-4" value={row.description} onChange={(event) => setRow({ ...row, description: event.target.value })} />
      <button type="button" className="h-11 rounded-full bg-ink text-sm text-card" onClick={() => onSave(row)}>Guardar</button>
      <button type="button" className="h-11 rounded-full text-sm text-stamp" onClick={onDelete}>Eliminar</button>
    </li>
  );
}
