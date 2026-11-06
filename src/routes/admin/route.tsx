import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/shell";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppShell>
      <div className="mb-5 flex gap-2 overflow-x-auto text-sm">
        <Link to="/admin" activeOptions={{ exact: true }} className="rounded-full px-3 py-2 text-muted" activeProps={{ className: "rounded-full bg-paper-deep px-3 py-2 text-ink" }}>
          Resumen
        </Link>
        <Link to="/admin/usuarios" className="rounded-full px-3 py-2 text-muted" activeProps={{ className: "rounded-full bg-paper-deep px-3 py-2 text-ink" }}>
          Usuarios
        </Link>
        <Link to="/admin/paquetes" className="rounded-full px-3 py-2 text-muted" activeProps={{ className: "rounded-full bg-paper-deep px-3 py-2 text-ink" }}>
          Paquetes
        </Link>
        <Link to="/admin/ajustes" className="rounded-full px-3 py-2 text-muted" activeProps={{ className: "rounded-full bg-paper-deep px-3 py-2 text-ink" }}>
          Wompi
        </Link>
      </div>
      <Outlet />
    </AppShell>
  );
}
