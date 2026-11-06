import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QrStudio } from "@/components/qr-studio";
import { getQr } from "@/lib/qr/server";
import type { QrDetail } from "@/lib/qr/types";

export const Route = createFileRoute("/panel/$id")({
  head: () => ({ meta: [{ title: "Editar código · Sello" }] }),
  component: EditQr,
});

function EditQr() {
  const { id } = Route.useParams();
  const [qr, setQr] = useState<QrDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getQr({ data: Number(id) })
      .then(setQr)
      .catch(() => setError("No encontramos ese código."));
  }, [id]);

  if (error) return <p className="text-stamp">{error}</p>;
  if (!qr) return <div className="h-80 animate-pulse rounded-3xl bg-paper-deep" />;
  return (
    <div>
      <h1 className="mb-5 font-display text-4xl">{qr.input.title || "Editar código"}</h1>
      <QrStudio
        qrId={qr.id}
        publicId={qr.publicId}
        initial={qr.input}
        scans={qr.scans}
        live={qr.live}
        pauseReason={qr.pauseReason}
        sourceLabel={qr.sourceLabel}
      />
    </div>
  );
}
