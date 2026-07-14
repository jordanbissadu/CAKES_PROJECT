"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { orderRequestSchema } from "@/lib/validation";
import { notifyNewOrder } from "@/lib/notify";
import { getSettings } from "@/lib/settings";

export interface OrderFormState {
  status: "idle" | "success" | "error";
  message?: string;
  orderNumber?: string;
  customerName?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Public order-request submission. Validates input and inserts an `order`
 * in status "nouvelle" using the service-role client (RLS blocks anon).
 * The rich customization fields are composed into the order `message`.
 */
export async function createOrderRequest(
  _prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const parsed = orderRequestSchema.safeParse({
    customer_name: formData.get("customer_name"),
    customer_phone: formData.get("customer_phone"),
    order_type: formData.get("order_type"),
    fulfillment_date: formData.get("fulfillment_date"),
    cake_message: formData.get("cake_message"),
    sucre: formData.get("sucre"),
    creme: formData.get("creme"),
    details: formData.get("details"),
    model_ref: formData.get("model_ref"),
    model_name: formData.get("model_name"),
    company: formData.get("company"), // honeypot
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Vérifie les champs en rouge.",
      fieldErrors,
    };
  }

  const d = parsed.data;

  // Honeypot filled → silently pretend success (bot).
  if (d.company) {
    return { status: "success", message: "Merci !", customerName: d.customer_name };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return {
      status: "error",
      message:
        "La prise de commande n'est pas encore configurée. Appelle-nous au +228 96 628 864.",
    };
  }

  // Compose a readable customization message for the workshop.
  const parts: string[] = [];
  if (d.cake_message) parts.push(`À écrire : ${d.cake_message}`);
  if (d.sucre) parts.push(`Sucre : ${d.sucre}`);
  if (d.creme) parts.push(`Crème : ${d.creme}`);
  if (d.model_name)
    parts.push(`Modèle : ${d.model_name}${d.model_ref ? ` (réf. ${d.model_ref})` : ""}`);
  if (d.details) parts.push(d.details);
  const message = parts.join("\n") || null;

  try {
    const supabase = createAdminClient();
    const { data: inserted, error } = await supabase
      .from("orders")
      .insert({
        customer_name: d.customer_name,
        customer_phone: d.customer_phone,
        cake: d.model_name || d.order_type,
        cake_sub: d.model_name ? d.order_type : "Sur mesure",
        fulfillment_date: d.fulfillment_date || null,
        message,
        status: "nouvelle",
        source: "web",
        mode: "retrait",
      })
      .select("order_number")
      .single();

    if (error) {
      return {
        status: "error",
        message:
          "Oups, l'envoi a échoué. Réessaie ou appelle-nous au +228 96 628 864.",
      };
    }

    // Fire-and-forget email to the bakery (uses the Réglages email if set).
    try {
      const settings = await getSettings();
      await notifyNewOrder(
        {
          orderNumber: inserted?.order_number ?? "—",
          customerName: d.customer_name,
          customerPhone: d.customer_phone,
          cake: d.model_name || d.order_type,
          fulfillmentDate: d.fulfillment_date || null,
          message,
        },
        settings.email || undefined,
      );
    } catch {
      // notifications never block the order
    }

    return {
      status: "success",
      message: "Ta demande est bien reçue 🎂",
      orderNumber: inserted?.order_number,
      customerName: d.customer_name,
    };
  } catch {
    return {
      status: "error",
      message: "Oups, l'envoi a échoué. Appelle-nous au +228 96 628 864.",
    };
  }
}
