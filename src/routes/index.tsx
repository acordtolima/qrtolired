import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing";
import { listPublicPackages } from "@/lib/qr/server";

export const Route = createFileRoute("/")({
  loader: () => listPublicPackages(),
  head: () => ({
    meta: [
      { title: "Sello — Códigos QR con tu marca" },
      {
        name: "description",
        content: "Crea códigos QR con color, forma y logo. Tres gratis si entras cada mes. Paquetes de 10 a 30 con pago por Wompi.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const packages = Route.useLoaderData();
  return <Landing packages={packages} />;
}
