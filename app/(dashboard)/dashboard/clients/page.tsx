import { getOrders } from "@/lib/orders-data";
import { deriveClients } from "@/lib/clients";
import { todayISO } from "@/lib/format";
import { ClientsView } from "@/components/dashboard/ClientsView";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const orders = await getOrders();
  const clients = deriveClients(orders);
  return <ClientsView clients={clients} todayIso={todayISO()} />;
}
