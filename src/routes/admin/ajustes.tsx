import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getAdminSettings, saveSettings } from "@/lib/qr/server";
import type { AdminSettings } from "@/lib/qr/types";

export const Route = createFileRoute("/admin/ajustes")({
  head: () => ({ meta: [{ title: "Wompi · Sello" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [form, setForm] = useState<AdminSettings | null>(null);
  const [integrity, setIntegrity] = useState("");
  const [events, setEvents] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    getAdminSettings()
      .then(setForm)
      .catch(() => setError("No se pudo abrir la configuración."));
  }, []);

  if (!form && !error) return <div className="h-40 animate-pulse rounded-3xl bg-paper-deep" />;
  if (!form) return <p className="text-stamp">{error}</p>;

  return (
    <form
      className="max-w-xl space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void saveSettings({
          data: {
            wompiPublicKey: form.wompiPublicKey,
            wompiIntegritySecret: integrity,
            wompiEventsSecret: events,
            wompiEnv: form.wompiEnv,
            allowDemoCheckout: form.allowDemoCheckout,
            freeQrLimit: form.freeQrLimit,
            freeGraceDays: form.freeGraceDays,
          },
        }).then((result) => {
          if (!result.ok) setError(result.error);
          else {
            setError("");
            setNote("Guardado. Los secretos no se vuelven a mostrar completos.");
            setIntegrity("");
            setEvents("");
            void getAdminSettings().then(setForm);
          }
        });
      }}
    >
      <h1 className="font-display text-4xl">Wompi</h1>
      <p className="text-sm leading-relaxed text-muted">
        En el dashboard de comercios de Wompi copia la llave pública, el secreto de integridad y el secreto de eventos.
        Sandbox usa llaves <span className="font-medium text-ink">pub_test_</span>. Producción usa <span className="font-medium text-ink">pub_prod_</span>.
        El widget cobra en COP y, al volver, Sello verifica la transacción con Wompi antes de activar el paquete.
      </p>
      <label className="block text-sm font-medium">
        Llave pública
        <input className="mt-2 h-11 w-full rounded-lg border border-line px-3" value={form.wompiPublicKey} onChange={(event) => setForm({ ...form, wompiPublicKey: event.target.value })} />
      </label>
      <label className="block text-sm font-medium">
        Secreto de integridad {form.integrityHint ? `(${form.integrityHint})` : ""}
        <input className="mt-2 h-11 w-full rounded-lg border border-line px-3" type="password" value={integrity} placeholder={form.hasIntegrity ? "Dejar vacío para no cambiar" : "test_integrity_…"} onChange={(event) => setIntegrity(event.target.value)} autoComplete="off" />
      </label>
      <label className="block text-sm font-medium">
        Secreto de eventos {form.eventsHint ? `(${form.eventsHint})` : ""}
        <input className="mt-2 h-11 w-full rounded-lg border border-line px-3" type="password" value={events} placeholder={form.hasEvents ? "Dejar vacío para no cambiar" : "test_events_…"} onChange={(event) => setEvents(event.target.value)} autoComplete="off" />
      </label>
      <label className="block text-sm font-medium">
        Ambiente
        <select className="mt-2 h-11 w-full rounded-lg border border-line bg-card px-3" value={form.wompiEnv} onChange={(event) => setForm({ ...form, wompiEnv: event.target.value === "production" ? "production" : "sandbox" })}>
          <option value="sandbox">Sandbox</option>
          <option value="production">Producción</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.allowDemoCheckout} onChange={(event) => setForm({ ...form, allowDemoCheckout: event.target.checked })} />
        Permitir pago de prueba si no hay llave pública
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-medium">
          Códigos gratis
          <input className="mt-2 h-11 w-full rounded-lg border border-line px-3" type="number" value={form.freeQrLimit} onChange={(event) => setForm({ ...form, freeQrLimit: Number(event.target.value) })} />
        </label>
        <label className="text-sm font-medium">
          Días sin entrar
          <input className="mt-2 h-11 w-full rounded-lg border border-line px-3" type="number" value={form.freeGraceDays} onChange={(event) => setForm({ ...form, freeGraceDays: Number(event.target.value) })} />
        </label>
      </div>
      <p className="text-sm text-muted">
        URL de eventos para el comercio: {origin ? `${origin}/api/wompi/events` : "…"}. Si Wompi no puede llamarla, igual se confirma el pago cuando la persona regresa del widget.
      </p>
      {error ? <p className="text-sm text-stamp">{error}</p> : null}
      {note ? <p className="text-sm text-moss">{note}</p> : null}
      <button type="submit" className="h-11 rounded-full bg-stamp px-5 text-sm font-medium text-card">Guardar</button>
    </form>
  );
}
