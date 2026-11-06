type WidgetResult = { transaction?: { id?: string; status?: string } };

declare global {
  interface Window {
    WidgetCheckout?: new (config: Record<string, unknown>) => {
      open: (callback: (result: WidgetResult) => void) => void;
    };
  }
}

export function loadWompi() {
  if (typeof window === "undefined") return Promise.reject(new Error("Sin ventana."));
  if (window.WidgetCheckout) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el checkout de Wompi."));
    document.body.appendChild(script);
  });
}

export async function openWompi(session: {
  publicKey: string;
  amountInCents: number;
  reference: string;
  integrity: string;
  email?: string;
}) {
  await loadWompi();
  if (!window.WidgetCheckout) throw new Error("Wompi no quedó listo.");
  const redirectUrl = `${window.location.origin}/panel/pago/${session.reference}`;
  const checkout = new window.WidgetCheckout({
    currency: "COP",
    amountInCents: session.amountInCents,
    reference: session.reference,
    publicKey: session.publicKey,
    signature: { integrity: session.integrity },
    redirectUrl,
    customerData: session.email ? { email: session.email } : undefined,
  });
  return new Promise<string | null>((resolve) => {
    checkout.open((result) => {
      resolve(result?.transaction?.id ?? null);
    });
  });
}
