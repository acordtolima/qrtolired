export function cop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function fecha(iso: string | null | undefined) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeZone: "America/Bogota",
  }).format(date);
}

export function statusLabel(status: string) {
  switch (status) {
    case "active":
      return "Activo";
    case "pending":
      return "Pendiente";
    case "expired":
      return "Vencido";
    case "declined":
      return "Rechazado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}
