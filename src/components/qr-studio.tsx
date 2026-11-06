import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { compose, CORNER_LABEL, DOT_LABEL, KIND_LABEL, UserError } from "@/lib/qr/content";
import { createQr, removeQr, updateQr } from "@/lib/qr/server";
import { CORNER_STYLES, DOT_STYLES, KINDS, type QrInput } from "@/lib/qr/types";
import { QrPreview } from "./qr-preview";

const field = "h-11 w-full rounded-lg border border-line bg-card px-3 text-sm text-ink";
const area = "min-h-28 w-full rounded-lg border border-line bg-card px-3 py-3 text-sm text-ink";

export function QrStudio({
  qrId,
  publicId,
  initial,
  scans,
  sourceLabel,
  live,
  pauseReason,
}: {
  qrId?: number;
  publicId?: string;
  initial: QrInput;
  scans?: number;
  sourceLabel?: string;
  live?: boolean;
  pauseReason?: string | null;
}) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [downloader, setDownloader] = useState<{ download: (ext: "png" | "svg") => Promise<void> } | null>(null);

  const composed = useMemo(() => {
    try {
      return { ok: true as const, value: compose(draft) };
    } catch (caught) {
      return { ok: false as const, error: caught instanceof UserError ? caught.message : "Revisa los datos." };
    }
  }, [draft]);

  const encoded =
    publicId && typeof window !== "undefined"
      ? `${window.location.origin}/q/${publicId}`
      : composed.ok
        ? composed.value.destination
        : "Sello";

  function set<K extends keyof QrInput>(key: K, value: QrInput[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setNote("");
  }

  async function save() {
    setError("");
    setNote("");
    if (!composed.ok) {
      setError(composed.error);
      return;
    }
    setBusy(true);
    const result = qrId ? await updateQr({ data: { id: qrId, draft } }) : await createQr({ data: draft });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (!qrId && "id" in result) {
      await navigate({ to: "/panel/$id", params: { id: String(result.id) } });
      return;
    }
    setNote("Guardado. El código impreso sigue igual.");
  }

  async function destroy() {
    if (!qrId) return;
    setBusy(true);
    const result = await removeQr({ data: qrId });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await navigate({ to: "/panel" });
  }

  function onLogo(file: File | undefined) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 100 * 1024) {
      setError("Usa un PNG, JPG o WebP de menos de 100 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("logoData", String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <form
        className="rounded-3xl border border-line bg-card p-4 shadow-sheet"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <label className="block text-sm font-medium">
          Nombre interno
          <input className={`${field} mt-2`} value={draft.title} maxLength={80} placeholder="Menú del local" onChange={(event) => set("title", event.target.value)} />
        </label>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => set("kind", kind)}
              className={
                draft.kind === kind
                  ? "shrink-0 rounded-full bg-ink px-3 py-2 text-sm text-card"
                  : "shrink-0 rounded-full border border-line px-3 py-2 text-sm text-ink"
              }
            >
              {KIND_LABEL[kind]}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {draft.kind === "url" ? (
            <Field label="Enlace de destino">
              <input className={field} value={draft.url} placeholder="https://tutienda.com/menu" onChange={(event) => set("url", event.target.value)} />
            </Field>
          ) : null}
          {draft.kind === "whatsapp" ? (
            <>
              <Field label="Celular con indicativo">
                <input className={field} value={draft.whatsappPhone} placeholder="573001112233" onChange={(event) => set("whatsappPhone", event.target.value)} />
              </Field>
              <Field label="Mensaje opcional">
                <input className={field} value={draft.whatsappMessage} onChange={(event) => set("whatsappMessage", event.target.value)} />
              </Field>
            </>
          ) : null}
          {draft.kind === "wifi" ? (
            <>
              <Field label="Nombre de la red">
                <input className={field} value={draft.wifiSsid} onChange={(event) => set("wifiSsid", event.target.value)} />
              </Field>
              <Field label="Seguridad">
                <select className={field} value={draft.wifiSecurity} onChange={(event) => set("wifiSecurity", event.target.value as QrInput["wifiSecurity"])}>
                  <option value="WPA">WPA / WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Red abierta</option>
                </select>
              </Field>
              {draft.wifiSecurity !== "nopass" ? (
                <Field label="Clave">
                  <input className={field} value={draft.wifiPassword} onChange={(event) => set("wifiPassword", event.target.value)} />
                </Field>
              ) : null}
            </>
          ) : null}
          {draft.kind === "vcard" ? (
            <>
              <Field label="Nombre">
                <input className={field} value={draft.vcardName} onChange={(event) => set("vcardName", event.target.value)} />
              </Field>
              <Field label="Organización">
                <input className={field} value={draft.vcardOrg} onChange={(event) => set("vcardOrg", event.target.value)} />
              </Field>
              <Field label="Teléfono">
                <input className={field} value={draft.vcardPhone} onChange={(event) => set("vcardPhone", event.target.value)} />
              </Field>
              <Field label="Correo">
                <input className={field} value={draft.vcardEmail} onChange={(event) => set("vcardEmail", event.target.value)} />
              </Field>
            </>
          ) : null}
          {draft.kind === "phone" ? (
            <Field label="Teléfono">
              <input className={field} value={draft.phone} placeholder="+57 300 111 2233" onChange={(event) => set("phone", event.target.value)} />
            </Field>
          ) : null}
          {draft.kind === "email" ? (
            <>
              <Field label="Correo">
                <input className={field} value={draft.email} onChange={(event) => set("email", event.target.value)} />
              </Field>
              <Field label="Asunto">
                <input className={field} value={draft.emailSubject} onChange={(event) => set("emailSubject", event.target.value)} />
              </Field>
              <Field label="Mensaje">
                <textarea className={area} value={draft.emailBody} onChange={(event) => set("emailBody", event.target.value)} />
              </Field>
            </>
          ) : null}
          {draft.kind === "text" ? (
            <Field label="Texto">
              <textarea className={area} value={draft.text} onChange={(event) => set("text", event.target.value)} />
            </Field>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Color label="Tinta" value={draft.fg} onChange={(value) => set("fg", value)} />
          <Color label="Fondo" value={draft.bg} onChange={(value) => set("bg", value)} />
          <Color label="Esquinas" value={draft.accent} onChange={(value) => set("accent", value)} />
        </div>

        <p className="mt-6 text-sm font-medium">Forma de los módulos</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DOT_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => set("dotStyle", style)}
              className={chip(draft.dotStyle === style)}
            >
              {DOT_LABEL[style]}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm font-medium">Esquinas</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CORNER_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => set("cornerStyle", style)}
              className={chip(draft.cornerStyle === style)}
            >
              {CORNER_LABEL[style]}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm font-medium">
            {draft.logoData ? "Cambiar logo" : "Agregar logo"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => onLogo(event.target.files?.[0])}
            />
          </label>
          {draft.logoData ? (
            <button type="button" className="text-sm text-stamp" onClick={() => set("logoData", null)}>
              Quitar logo
            </button>
          ) : (
            <span className="text-sm text-muted">PNG, JPG o WebP, menos de 100 KB.</span>
          )}
        </div>

        {error ? <p className="mt-4 text-sm text-stamp">{error}</p> : null}
        {note ? <p className="mt-4 text-sm text-moss">{note}</p> : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className="h-11 rounded-full bg-stamp px-5 text-sm font-medium text-card disabled:opacity-60">
            {busy ? "Guardando…" : qrId ? "Guardar cambios" : "Crear código"}
          </button>
          {qrId ? (
            confirmDelete ? (
              <button type="button" className="h-11 rounded-full border border-stamp px-5 text-sm text-stamp" onClick={() => void destroy()}>
                Confirmar eliminación
              </button>
            ) : (
              <button type="button" className="h-11 rounded-full px-4 text-sm text-muted" onClick={() => setConfirmDelete(true)}>
                Eliminar
              </button>
            )
          ) : null}
        </div>
      </form>

      <aside className="rounded-3xl border border-line bg-card p-4 lg:sticky lg:top-20">
        <div className="rounded-lg bg-paper p-3">
          <QrPreview
            data={encoded}
            fg={draft.fg}
            bg={draft.bg}
            accent={draft.accent}
            dotStyle={draft.dotStyle}
            cornerStyle={draft.cornerStyle}
            logo={draft.logoData}
            onReady={setDownloader}
          />
        </div>
        <p className="mt-3 text-sm text-muted">
          {publicId
            ? "Este es el código para imprimir. Puedes cambiar el destino sin reimprimirlo."
            : "Vista previa. Al guardarlo, el impreso apuntará a Sello para que puedas editarlo después."}
        </p>
        {sourceLabel ? <p className="mt-2 text-sm">{sourceLabel}</p> : null}
        {typeof live === "boolean" ? (
          <p className={live ? "mt-1 text-sm text-moss" : "mt-1 text-sm text-stamp"}>
            {live ? "Activo" : pauseReason || "En pausa"}
          </p>
        ) : null}
        {typeof scans === "number" ? <p className="mt-1 text-sm tabular-nums text-muted">{scans} escaneos</p> : null}
        {publicId ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="h-11 rounded-full bg-ink px-4 text-sm text-card" onClick={() => void downloader?.download("png")}>
              Descargar PNG
            </button>
            <button type="button" className="h-11 rounded-full border border-line px-4 text-sm" onClick={() => void downloader?.download("svg")}>
              SVG
            </button>
            <button
              type="button"
              className="h-11 rounded-full border border-line px-4 text-sm"
              onClick={() => void navigator.clipboard.writeText(`${window.location.origin}/q/${publicId}`)}
            >
              Copiar enlace
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-2 font-normal">{children}</div>
    </label>
  );
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <span className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-line bg-card px-2">
        <input type="color" value={value} aria-label={label} onChange={(event) => onChange(event.target.value)} className="h-8 w-8 border-0 bg-transparent" />
        <span className="font-mono text-xs uppercase text-muted">{value}</span>
      </span>
    </label>
  );
}

function chip(active: boolean) {
  return active
    ? "h-10 rounded-full bg-ink px-3 text-sm text-card"
    : "h-10 rounded-full border border-line px-3 text-sm text-ink";
}
