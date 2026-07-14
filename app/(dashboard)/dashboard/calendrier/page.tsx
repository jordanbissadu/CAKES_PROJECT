import { getOrders } from "@/lib/orders-data";
import { todayISO } from "@/lib/format";
import { CalendarView } from "@/components/dashboard/CalendarView";

export const dynamic = "force-dynamic";

export default async function CalendrierPage() {
  const orders = await getOrders();
  return <CalendarView orders={orders} todayIso={todayISO()} />;
}
