import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient, authEnabled } from "@/lib/auth/client";
import { Mark } from "@/components/mark";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar · Sello" }] }),
  component: Login,
});

type Mode = "signin" | "signup";

function Login() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res =
        mode === "signup"
          ? await authClient.signUp.email({
              name: name.trim() || email.split("@")[0],
              email: email.trim(),
              password,
              callbackURL: "/panel",
            })
          : await authClient.signIn.email({
              email: email.trim(),
              password,
              callbackURL: "/panel",
            });
      if (res.error) {
        setError(
          res.error.message ??
            (mode === "signup" ? "No se pudo crear la cuenta." : "Correo o contraseña incorrectos."),
        );
        return;
      }
      window.location.href = "/panel";
    } catch {
      setError("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "h-12 w-full rounded-2xl border border-line bg-paper px-4 text-sm outline-none focus:border-stamp";

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-card p-6 shadow-sheet">
        <Link to="/" className="flex items-center gap-2 text-ink">
          <Mark className="h-8 w-8" />
          <span className="font-display text-xl">Sello</span>
        </Link>
        <h1 className="mt-6 font-display text-3xl">
          {mode === "signin" ? "Entra para crear tus códigos" : "Crea tu cuenta"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          La primera cuenta que se registre administra paquetes, precios y vencimientos.
        </p>
        {authEnabled ? (
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            {mode === "signup" && (
              <input
                className={input}
                type="text"
                placeholder="Nombre"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              className={input}
              type="email"
              placeholder="Correo electrónico"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={input}
              type="password"
              placeholder="Contraseña (mínimo 8 caracteres)"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-stamp text-sm font-medium text-card disabled:opacity-60"
            >
              {loading ? "Un momento…" : mode === "signin" ? "Entrar" : "Crear cuenta"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
              }}
              className="h-10 w-full text-sm text-muted underline-offset-4 hover:underline"
            >
              {mode === "signin" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Entra"}
            </button>
          </form>
        ) : (
          <p className="mt-6 text-sm text-muted">El ingreso está desactivado.</p>
        )}
      </div>
    </main>
  );
}
