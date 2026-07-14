import { createClient } from "@/lib/supabase/server";
import { getOrders } from "@/lib/orders-data";
import { todayISO } from "@/lib/format";
import { CommandesView } from "@/components/dashboard/CommandesView";

export const dynamic = "force-dynamic";

async function getUserEmail(): Promise<string> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.email ?? "atelier";
  } catch {
    return "atelier";
  }
}

export default async function CommandesPage() {
  const [orders, userEmail] = await Promise.all([getOrders(), getUserEmail()]);

  return (
    <CommandesView orders={orders} todayIso={todayISO()} userEmail={userEmail} />
  );
}
