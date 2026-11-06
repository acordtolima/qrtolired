import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { cop, fecha, statusLabel } from "@/lib/qr/format";
import { adminUsers, grantPackage, setExpiry, setRole } from "@/lib/qr/server";
import type { AdminPackage, AdminUser } from "@/lib/qr/types";

export const Route = createFileRoute("/admin/usuarios")({
  head: () => ({ meta: [{ title: "Usuarios · Sello" }] }),
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [error, setError] = useState("");

  function load() {
    adminUsers()
      .then((data) => {
        setUsers(data.users);
        setPackages(data.packages);
      })
      .catch(() => setError("No se pudo cargar la lista."));
  }

  useEffect(() => {
    load();
  }, []);

  if (!users.length && !error) return <div className="h-40 animate-pulse rounded-3xl bg-paper-deep" />;

  return (
    <div>
      <h1 className="font-display text-4xl">Usuarios</h1>
      <p className="mt-2 text-sm text-muted">Última entrada, cupo gratis y vencimiento de cada paquete.</p>
      {error ? <p className="mt-3 text-sm text-stamp">{error}</p> : null}
      <ul className="mt-5 space-y-4">
        {users.map((person) => (
          <UserCard key={person.userId} person={person} packages={packages} onDone={load} onError={setError} />
        ))}
      </ul>
    </div>
  );
}

function UserCard({
  person,
  packages,
  onDone,
  onError,
}: {
  person: AdminUser;
  packages: AdminPackage[];
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const [packageId, setPackageId] = useState(String(packages[0]?.id ?? ""));
  const [day, setDay] = useState("");
  const [entitlementId, setEntitlementId] = useState(String(person.entitlements[0]?.id ?? ""));

  async function run(task: Promise<{ ok: boolean; error?: string }>) {
    const result = await task;
    if (!result.ok) onError(result.error || "No se pudo guardar.");
    else onDone();
  }

  return (
    <li className="rounded-3xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">{person.name || "Sin nombre"}</h2>
          <p className="text-sm text-muted">{person.email}</p>
          <p className="mt-1 text-sm">
            {person.role === "admin" ? "Administración" : "Cuenta"} · {person.qrCount} códigos · última entrada {fecha(person.lastSeenAt)}
          </p>
          <p className={person.freeLive ? "text-sm text-moss" : "text-sm text-stamp"}>
            Gratis {person.freeLive ? `activos hasta ${fecha(person.freeUntil)}` : `en pausa desde antes del ${fecha(person.freeUntil)}`}
          </p>
        </div>
        <button
          type="button"
          className="h-10 rounded-full border border-line px-4 text-sm"
          onClick={() =>
            void run(setRole({ data: { userId: person.userId, role: person.role === "admin" ? "user" : "admin" } }))
          }
        >
          {person.role === "admin" ? "Quitar admin" : "Hacer admin"}
        </button>
      </div>
      <ul className="mt-3 space-y-1 text-sm">
        {person.entitlements.length === 0 ? <li className="text-muted">Sin paquetes.</li> : null}
        {person.entitlements.map((item) => (
          <li key={item.id} className="flex flex-wrap justify-between gap-2">
            <span>{item.packageName} · {item.qrQuota} · {cop(item.priceCop)}</span>
            <span className="text-muted">{statusLabel(item.status)}{item.expiresAt ? ` · ${fecha(item.expiresAt)}` : ""}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <select className="h-11 rounded-lg border border-line bg-card px-2 text-sm" value={packageId} onChange={(event) => setPackageId(event.target.value)}>
          {packages.map((pack) => (
            <option key={pack.id} value={pack.id}>{pack.name}</option>
          ))}
        </select>
        <button
          type="button"
          className="h-11 rounded-full bg-ink px-4 text-sm text-card"
          onClick={() => void run(grantPackage({ data: { userId: person.userId, packageId: Number(packageId) } }))}
        >
          Asignar paquete
        </button>
      </div>
      {person.entitlements.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <select className="h-11 rounded-lg border border-line bg-card px-2 text-sm" value={entitlementId} onChange={(event) => setEntitlementId(event.target.value)}>
            {person.entitlements.map((item) => (
              <option key={item.id} value={item.id}>{item.packageName}</option>
            ))}
          </select>
          <input type="date" className="h-11 rounded-lg border border-line bg-card px-2 text-sm" value={day} onChange={(event) => setDay(event.target.value)} />
          <button
            type="button"
            className="h-11 rounded-full border border-line px-4 text-sm"
            onClick={() => void run(setExpiry({ data: { entitlementId: Number(entitlementId), day } }))}
          >
            Cambiar vencimiento
          </button>
        </div>
      ) : null}
    </li>
  );
}
