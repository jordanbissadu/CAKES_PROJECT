/**
 * Order notifications. Sends an email to the bakery when a new web order
 * arrives, via the Resend REST API. Entirely optional and non-blocking:
 * if the env vars are missing or the call fails, it silently no-ops so the
 * order is never lost.
 *
 * Required env to enable:
 *   RESEND_API_KEY     — your Resend API key
 *   ORDER_FROM_EMAIL   — a verified sender (e.g. "IDI's Cakes <no-reply@ton-domaine>")
 *   ORDER_NOTIFY_EMAIL — recipient (the bakery inbox); falls back to a settings value
 */

export interface NewOrderNotice {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  cake: string;
  fulfillmentDate: string | null;
  message: string | null;
}

export async function notifyNewOrder(
  notice: NewOrderNotice,
  recipientOverride?: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_FROM_EMAIL;
  const to = recipientOverride || process.env.ORDER_NOTIFY_EMAIL;

  if (!apiKey || !from || !to) return; // notifications disabled

  const lines = [
    `Nouvelle commande ${notice.orderNumber}`,
    ``,
    `Client : ${notice.customerName}`,
    `Téléphone : ${notice.customerPhone}`,
    `Gâteau : ${notice.cake}`,
    `Date souhaitée : ${notice.fulfillmentDate ?? "à préciser"}`,
    notice.message ? `\nDétails :\n${notice.message}` : "",
  ];
  const text = lines.join("\n");
  const html = `<div style="font-family:system-ui,sans-serif;color:#3A1420">
    <h2 style="color:#641D34;margin:0 0 8px">Nouvelle commande ${escapeHtml(notice.orderNumber)} 🎂</h2>
    <p><b>Client :</b> ${escapeHtml(notice.customerName)}<br>
    <b>Téléphone :</b> ${escapeHtml(notice.customerPhone)}<br>
    <b>Gâteau :</b> ${escapeHtml(notice.cake)}<br>
    <b>Date souhaitée :</b> ${escapeHtml(notice.fulfillmentDate ?? "à préciser")}</p>
    ${notice.message ? `<p><b>Détails :</b><br>${escapeHtml(notice.message).replace(/\n/g, "<br>")}</p>` : ""}
  </div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `🎂 Nouvelle commande ${notice.orderNumber} — ${notice.customerName}`,
        text,
        html,
      }),
    });
  } catch {
    // Never let a notification failure break the order.
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
