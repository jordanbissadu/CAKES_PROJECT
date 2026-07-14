"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus, OrderMode } from "@/lib/orders";

export interface TrackState {
  status: "idle" | "found" | "notfound" | "error";
  message?: string;
  order?: {
    order_number: string;
    firstName: string;
    cake: string;
    orderStatus: OrderStatus;
    mode: OrderMode;
    fulfillment_date: string | null;
  };
}

const onlyDigits = (s: string) => s.replace(/[^\d]/g, "");

/** Normalise loose user input to the stored "#C-2052" order-number format. */
function normalizeNumber(input: string): string {
  const t = input.trim().toUpperCase().replace(/\s/g, "");
  if (t.startsWith("#")) return t;
  if (t.startsWith("C-")) return `#${t}`;
  if (/^\d+$/.test(t)) return `#C-${t}`;
  return t;
}

/**
 * Public order tracking. Requires BOTH the order number AND a matching phone
 * (weak shared secret) so orders can't be enumerated. Returns only safe fields.
 */
export async function trackOrder(
  _prev: TrackState,
  formData: FormData,
): Promise<TrackState> {
  const numberRaw = String(formData.get("order_number") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();

  if (!numberRaw || !phoneRaw) {
    return { status: "error", message: "Renseigne ton numéro de commande et ton téléphone." };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return { status: "error", message: "Le suivi n'est pas encore disponible." };
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("order_number,customer_name,customer_phone,cake,status,mode,fulfillment_date")
      .eq("order_number", normalizeNumber(numberRaw))
      .maybeSingle();

    // Same generic response whether not found or phone mismatch (no leak).
    if (error || !data || onlyDigits(data.customer_phone) !== onlyDigits(phoneRaw)) {
      return {
        status: "notfound",
        message:
          "Aucune commande trouvée avec ce numéro et ce téléphone. Vérifie et réessaie, ou appelle-nous.",
      };
    }

    return {
      status: "found",
      order: {
        order_number: data.order_number,
        firstName: (data.customer_name ?? "").split(/\s+/)[0] ?? "",
        cake: data.cake,
        orderStatus: data.status as OrderStatus,
        mode: data.mode as OrderMode,
        fulfillment_date: data.fulfillment_date,
      },
    };
  } catch {
    return { status: "error", message: "Oups, le suivi a échoué. Réessaie plus tard." };
  }
}
