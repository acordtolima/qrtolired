import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/wompi/events")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleWompiEvent } = await import("@/lib/qr/logic.server");
        return handleWompiEvent(request);
      },
    },
  },
});
