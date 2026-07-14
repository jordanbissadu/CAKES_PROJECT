/**
 * Order domain model, status map and transitions.
 * Mirrors the STATUS logic from the dashboard mockup, extended with a
 * `nouvelle` state for unconfirmed web requests.
 */

export type OrderStatus =
  | "nouvelle"
  | "apreparer"
  | "enpreparation"
  | "prete"
  | "annulee";

export type OrderMode = "retrait" | "livraison";
export type OrderSource = "web" | "manuel";

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  cake: string;
  cake_sub: string | null;
  portions: string | null;
  mode: OrderMode;
  delivery_address: string | null;
  fulfillment_date: string | null; // ISO date (YYYY-MM-DD)
  fulfillment_time: string | null;
  status: OrderStatus;
  amount: number | null; // integer, in F
  message: string | null;
  allergenes: string[] | null;
  source: OrderSource;
  created_at: string;
  updated_at: string;
}

export interface StatusMeta {
  label: string;
  dot: string;
  text: string;
  bg: string;
}

/** Visual + label metadata per status (colors from the DS + harmonious derivations). */
export const STATUS: Record<OrderStatus, StatusMeta> = {
  nouvelle: { label: "Nouvelle", dot: "#B15272", text: "#8F3C5A", bg: "#FDECF0" },
  apreparer: { label: "À préparer", dot: "#B15272", text: "#8F3C5A", bg: "#FFF0F3" },
  enpreparation: {
    label: "En préparation",
    dot: "#B4801A",
    text: "#8A5A00",
    bg: "#FAEED6",
  },
  prete: { label: "Prête", dot: "#3F9E6A", text: "#2E7150", bg: "#E7F4EC" },
  annulee: { label: "Annulée", dot: "#A08790", text: "#7A5560", bg: "#F1E9EC" },
};

/** Ordered pipeline used for the preparation board + detail timeline. */
export const PIPELINE: OrderStatus[] = ["apreparer", "enpreparation", "prete"];

/** Next status when advancing an order, or null if it cannot advance. */
export function nextStatus(status: OrderStatus): OrderStatus | null {
  switch (status) {
    case "nouvelle":
      return "apreparer";
    case "apreparer":
      return "enpreparation";
    case "enpreparation":
      return "prete";
    default:
      return null;
  }
}

/** Primary action label for the detail drawer, given the current status. */
export function advanceLabel(status: OrderStatus): string {
  switch (status) {
    case "nouvelle":
      return "Confirmer la commande";
    case "apreparer":
      return "Démarrer la préparation";
    case "enpreparation":
      return "Marquer comme prête";
    case "prete":
      return "Commande prête ✓";
    default:
      return "Commande annulée";
  }
}

export function canAdvance(status: OrderStatus): boolean {
  return nextStatus(status) !== null;
}

export function canCancel(status: OrderStatus): boolean {
  return status !== "annulee" && status !== "prete";
}
