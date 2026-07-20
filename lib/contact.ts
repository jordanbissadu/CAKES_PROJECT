import type { Order } from "@/lib/orders";

/** Digits only, for tel: / wa.me links. */
export function digits(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

/**
 * A status-aware WhatsApp message to send the customer about their order.
 *
 * @param order   The order to reference.
 * @param siteUrl Optional site origin (e.g. window.location.origin). When set,
 *                a clickable tracking link (…/suivi) is added where relevant.
 */
export function orderWhatsappText(order: Order, siteUrl?: string): string {
  const base = `Bonjour ${order.customer_name}, c'est IDI's Cakes 🎂`;
  const track = siteUrl ? ` sur ${siteUrl}/suivi` : "";
  switch (order.status) {
    case "prete":
      return `${base} Bonne nouvelle : ta commande ${order.order_number} (${order.cake}) est prête ! 🎉 Tu peux venir la récupérer. Merci de ta confiance 💕`;
    case "enpreparation":
      return `${base} On prépare ta commande ${order.order_number} (${order.cake}) avec soin 🧑‍🍳. Tu peux suivre son avancement${track} avec ton numéro ${order.order_number}. On te tient au courant !`;
    case "annulee":
      return `${base} Au sujet de ta commande ${order.order_number} (${order.cake}), peux-tu nous rappeler ? Merci 🙏`;
    default:
      return `${base} On a bien reçu ta demande ${order.order_number} (${order.cake}). On confirme les détails avec toi. 📝 Pense à bien noter ton numéro de commande ${order.order_number} : il te permettra de suivre l'avancement de ta commande à tout moment${track}. À très vite ! 🍰`;
  }
}

/** wa.me link with a prefilled message. */
export function whatsappLink(order: Order, siteUrl?: string): string {
  return `https://wa.me/${digits(order.customer_phone)}?text=${encodeURIComponent(orderWhatsappText(order, siteUrl))}`;
}
