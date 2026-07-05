import type { Lang } from "@/i18n/dictionary";

export type OrderStatus =
  | "pending_quote"
  | "quoted"
  | "paid"
  | "in_progress"
  | "review"
  | "delivered"
  | "cancelled";

export type MilestoneStatus = "pending" | "active" | "done";

export const STATUS_META: Record<
  OrderStatus,
  { es: string; en: string; tone: "amber" | "orange" | "green" | "blue" | "gray" }
> = {
  pending_quote: { es: "Esperando cotización", en: "Awaiting quote", tone: "amber" },
  quoted: { es: "Cotizado · por pagar", en: "Quoted · to pay", tone: "orange" },
  paid: { es: "Pagado", en: "Paid", tone: "green" },
  in_progress: { es: "En progreso", en: "In progress", tone: "blue" },
  review: { es: "En revisión", en: "In review", tone: "blue" },
  delivered: { es: "Entregado", en: "Delivered", tone: "green" },
  cancelled: { es: "Cancelado", en: "Cancelled", tone: "gray" },
};

export const TONE_CLASSES: Record<string, string> = {
  amber: "bg-warning/15 text-warning",
  orange: "bg-orange-soft text-orange",
  green: "bg-success/15 text-success",
  blue: "bg-[rgba(96,165,250,0.15)] text-[#93c5fd]",
  gray: "bg-glass text-fg-dim",
};

export function statusLabel(status: OrderStatus, lang: Lang): string {
  return STATUS_META[status][lang];
}

export function formatCentsMXN(cents: number | null): string {
  if (cents == null) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export type OrderRow = {
  id: string;
  service_name: string;
  category: string | null;
  pricing_type: "fixed" | "quote";
  status: OrderStatus;
  amount_total: number | null;
  currency: string;
  brief: string | null;
  created_at: string;
};

export type Milestone = {
  id: string;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  position: number;
};
