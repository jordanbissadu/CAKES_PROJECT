import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/orders";

/** Fetch all orders (most recent first) for the authenticated dashboard. */
export async function getOrders(): Promise<Order[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as Order[];
  } catch {
    return [];
  }
}
