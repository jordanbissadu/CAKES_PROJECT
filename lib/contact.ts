import type { Order } from "@/lib/orders";

/** Digits only, for tel: / wa.me links. */
export function digits(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

/** A status-aware WhatsApp message to send the customer about their order. */
export function orderWhatsappText(order: Order): string {
  const base = `Bonjour ${order.customer_name}, c'est IDI's Cakes 🎂`;
  switch (order.status) {
    case "prete":
      return `${base} Ta commande ${order.order_number} (${order.cake}) est prête ! Tu peux venir la récupérer.`;
    case "enpreparation":
      return `${base} On prépare ta commande ${order.order_number} (${order.cake}). On te tient au courant !`;
    case "annulee":
      return `${base} Au sujet de ta commande ${order.order_number}.`;
    default:
      return `${base} On a bien reçu ta demande ${order.order_number} (${order.cake}). On confirme les détails avec toi.`;
  }
}

/** wa.me link with a prefilled message. */
export function whatsappLink(order: Order): string {
  return `https://wa.me/${digits(order.customer_phone)}?text=${encodeURIComponent(orderWhatsappText(order))}`;
}
