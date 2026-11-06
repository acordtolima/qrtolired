import { createFileRoute } from "@tanstack/react-router";
import { QrStudio } from "@/components/qr-studio";
import { EMPTY_INPUT } from "@/lib/qr/content";

export const Route = createFileRoute("/panel/nuevo")({
  head: () => ({ meta: [{ title: "Crear código · Sello" }] }),
  component: () => (
    <div>
      <h1 className="mb-5 font-display text-4xl">Nuevo código</h1>
      <QrStudio initial={EMPTY_INPUT} />
    </div>
  ),
});
