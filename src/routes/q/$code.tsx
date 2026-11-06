import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Mark } from "@/components/mark";
import { QrPreview } from "@/components/qr-preview";
import { resolvePublicQr } from "@/lib/qr/server";
import type { PublicQr } from "@/lib/qr/types";

export const Route = createFileRoute("/q/$code")({
  loader: async ({ params }) => {
    const view = await resolvePublicQr({ data: params.code });
    if (view.kind === "redirect") throw redirect({ href: view.href });
    return view;
  },
  head: () => ({ meta: [{ title: "Sello" }] }),
  component: PublicCode,
});

function PublicCode() {
  const view = Route.useLoaderData();
  if (view.kind === "missing") {
    return (
      <Frame title="No encontramos este sello" body="El enlace no corresponde a un código de Sello." />
    );
  }
  if (view.kind === "paused") {
    return (
      <Frame
        title="Este código está en pausa"
        body="Quien lo creó debe entrar a su panel de Sello. Si es un código gratis, basta con abrir el panel. Si es de un paquete, el pago tiene que estar vigente."
      />
    );
  }
  if (view.kind !== "card") return null;
  return <Card view={view} />;
}

function Frame({ title, body }: { title: string; body: string }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4">
      <div className="w-full max-w-md rounded-3xl border border-line bg-card p-6">
        <Mark className="h-8 w-8 text-ink" />
        <h1 className="mt-4 font-display text-3xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </main>
  );
}

function Card({ view }: { view: Extract<PublicQr, { kind: "card" }> }) {
  const [copied, setCopied] = useState("");
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-line bg-card p-6">
        <Mark className="h-8 w-8 text-ink" />
        <h1 className="mt-4 font-display text-3xl">{view.title}</h1>
        <dl className="mt-4 space-y-3">
          {view.lines.map((line) => (
            <div key={line.label}>
              <dt className="text-sm text-muted">{line.label}</dt>
              <dd className="mt-1 flex items-center justify-between gap-3 text-base">
                <span className="break-all">{line.value}</span>
                {line.copy ? (
                  <button
                    type="button"
                    className="h-10 shrink-0 rounded-full border border-line px-3 text-sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(line.value);
                      setCopied(line.label);
                    }}
                  >
                    {copied === line.label ? "Copiado" : "Copiar"}
                  </button>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
        {view.presentation !== "text" ? (
          <div className="mt-5 rounded-lg bg-paper p-3">
            <QrPreview data={view.raw} fg="#1c1612" bg="#fffaf3" accent="#1c1612" dotStyle="square" cornerStyle="square" logo={null} size={220} />
            <p className="mt-2 text-sm text-muted">
              {view.presentation === "wifi"
                ? "Ese segundo código lo puede escanear otro celular para unirse a la red."
                : "Ese segundo código guarda el contacto en otro celular."}
            </p>
          </div>
        ) : null}
        {view.presentation === "vcard" ? (
          <button
            type="button"
            className="mt-4 h-11 w-full rounded-full bg-ink text-sm text-card"
            onClick={() => {
              const blob = new Blob([view.raw], { type: "text/vcard" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "contacto.vcf";
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Descargar contacto
          </button>
        ) : null}
      </div>
    </main>
  );
}
