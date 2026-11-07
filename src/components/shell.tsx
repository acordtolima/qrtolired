import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMe } from "@/lib/qr/server";
import type { Me } from "@/lib/qr/types";
import { Mark } from "./mark";

const links = [
  { to: "/panel", label: "Mis códigos", exact: true },
  { to: "/panel/nuevo", label: "Crear", exact: false },
  { to: "/panel/planes", label: "Paquetes", exact: false },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    if (!user) return;
    let dead = false;
    getMe()
      .then((next) => {
        if (!dead) setMe(next);
      })
      .catch(() => {
        if (!dead) setMe(null);
      });
    return () => {
      dead = true;
    };
  }, [user?.id]);

  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-paper">
        <div className="h-12 w-40 animate-pulse rounded-full bg-paper-deep" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/panel" className="flex items-center gap-2 text-ink">
            <Mark className="h-8 w-8 text-ink" />
            <span className="font-display text-xl leading-none">Sello</span>
          </Link>
          <nav className="flex flex-1 gap-1 overflow-x-auto">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.exact }}
                className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-muted"
                activeProps={{ className: "shrink-0 rounded-full bg-ink px-3 py-2 text-sm font-medium text-card" }}
              >
                {link.label}
              </Link>
            ))}
            {me?.role === "admin" ? (
              <Link
                to="/admin"
                className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-muted"
                activeProps={{ className: "shrink-0 rounded-full bg-ink px-3 py-2 text-sm font-medium text-card" }}
              >
                Administración
              </Link>
            ) : null}
          </nav>
          <div className="hidden sm:block">
            <UserButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6 pb-24">
        {me ? (
          me.role === "admin" ? (
            <p className="mb-5 text-sm text-muted">Administrador · códigos sin límite</p>
          ) : (
            <p className="mb-5 text-sm text-muted tabular-nums">
              Cupo: {me.freeUsed}/{me.freeLimit} gratis
              {me.paidCapacity ? ` · ${me.paidUsed}/${me.paidCapacity} de paquetes` : ""} · {me.remaining} disponibles
            </p>
          )
        ) : (
          <div className="mb-5 h-5 w-64 animate-pulse rounded-full bg-paper-deep" />
        )}
        {children ?? <Outlet />}
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-card px-4 py-3 sm:hidden">
        <UserButton />
      </div>
    </div>
  );
}
