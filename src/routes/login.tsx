import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Mark } from "@/components/mark";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar · Sello" }] }),
  component: Login,
});

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-card p-6 shadow-sheet">
        <Link to="/" className="flex items-center gap-2 text-ink">
          <Mark className="h-8 w-8" />
          <span className="font-display text-xl">Sello</span>
        </Link>
        <h1 className="mt-6 font-display text-3xl">Entra para crear tus códigos</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Con Google quedas registrado. La primera cuenta que entre administra paquetes, precios y vencimientos.
        </p>
        <div className="mt-6 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                onClick={() => signIn(provider.providerId, { callbackURL: "/panel" })}
                className={
                  provider.providerId === "grok-google"
                    ? "h-12 w-full rounded-full bg-stamp text-sm font-medium text-card"
                    : "h-12 w-full rounded-full border border-line text-sm font-medium"
                }
              >
                Continuar con {provider.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">El ingreso está desactivado.</p>
          )}
        </div>
      </div>
    </main>
  );
}
