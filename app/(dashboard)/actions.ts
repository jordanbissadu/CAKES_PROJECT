"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { newOrderSchema } from "@/lib/validation";
import { nextStatus, type OrderStatus } from "@/lib/orders";

export interface ActionResult {
  ok: boolean;
  message?: string;
}

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");
  return supabase;
}

/** Advance an order along the pipeline (nouvelle → apreparer → … → prete). */
export async function advanceOrder(
  id: string,
  current: OrderStatus,
): Promise<ActionResult> {
  const next = nextStatus(current);
  if (!next) return { ok: false, message: "Impossible d'avancer cette commande." };

  const supabase = await requireUser();
  const { error } = await supabase
    .from("orders")
    .update({ status: next })
    .eq("id", id);
  if (error) return { ok: false, message: "Échec de la mise à jour." };

  revalidatePath("/dashboard/commandes");
  return { ok: true };
}

export async function cancelOrder(id: string): Promise<ActionResult> {
  const supabase = await requireUser();
  const { error } = await supabase
    .from("orders")
    .update({ status: "annulee" })
    .eq("id", id);
  if (error) return { ok: false, message: "Échec de l'annulation." };

  revalidatePath("/dashboard/commandes");
  return { ok: true };
}

/**
 * Permanently delete an order. Irreversible — used for spam, test or
 * mistaken orders. Auth is enforced in the app layer (requireUser); the
 * delete itself uses the admin client so it doesn't depend on an RLS
 * DELETE policy.
 */
export async function deleteOrder(id: string): Promise<ActionResult> {
  await requireUser();
  const admin = createAdminClient();
  const { error } = await admin.from("orders").delete().eq("id", id);
  if (error) return { ok: false, message: "Échec de la suppression." };

  revalidatePath("/dashboard/commandes");
  return { ok: true };
}

export async function createOrder(input: {
  customer_name: string;
  cake: string;
  mode: string;
  fulfillment_date: string;
}): Promise<ActionResult> {
  const parsed = newOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Champs invalides.",
    };
  }
  const data = parsed.data;

  const supabase = await requireUser();
  const { error } = await supabase.from("orders").insert({
    customer_name: data.customer_name,
    customer_phone: "—",
    cake: data.cake,
    cake_sub: "Sur mesure",
    mode: data.mode,
    fulfillment_date: data.fulfillment_date || null,
    status: "apreparer",
    source: "manuel",
    message: "Commande créée depuis l'atelier — détails à préciser.",
  });
  if (error) return { ok: false, message: "Échec de la création." };

  revalidatePath("/dashboard/commandes");
  return { ok: true };
}

/** Sign out (used by the dashboard header/sidebar). */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
