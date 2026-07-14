import type { Order } from "@/lib/orders";

export interface Client {
  key: string;
  name: string;
  phone: string;
  orderCount: number;
  totalAmount: number; // sum of non-cancelled order amounts, in F
  lastOrderDate: string; // ISO (created_at) of most recent order
  orders: Order[];
}

const normPhone = (p: string) => p.replace(/\s+/g, "").trim();

/** Aggregate orders into clients keyed by phone number. */
export function deriveClients(orders: Order[]): Client[] {
  const map = new Map<string, Client>();

  for (const o of orders) {
    const key = normPhone(o.customer_phone) || o.customer_name.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.orders.push(o);
      existing.orderCount += 1;
      if (o.status !== "annulee") existing.totalAmount += o.amount ?? 0;
      if (o.created_at > existing.lastOrderDate) {
        existing.lastOrderDate = o.created_at;
        existing.name = o.customer_name;
      }
    } else {
      map.set(key, {
        key,
        name: o.customer_name,
        phone: o.customer_phone,
        orderCount: 1,
        totalAmount: o.status !== "annulee" ? o.amount ?? 0 : 0,
        lastOrderDate: o.created_at,
        orders: [o],
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.lastOrderDate.localeCompare(a.lastOrderDate),
  );
}
