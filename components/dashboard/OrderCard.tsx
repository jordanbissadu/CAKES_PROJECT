"use client";

import type { Order } from "@/lib/orders";
import { formatPrice, initials, relativeDay } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar, ModeTag } from "./shared";
import { useCurrency } from "./CurrencyContext";

/** Mobile list card (Liste view on small screens). */
export function OrderCard({
  order,
  index,
  today,
  onOpen,
}: {
  order: Order;
  index: number;
  today: Date;
  onOpen: (id: string) => void;
}) {
  const currency = useCurrency();
  return (
    <button
      onClick={() => onOpen(order.id)}
      className="w-full rounded-[18px] bg-blanc p-4 text-left shadow-card"
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="text-sm font-extrabold text-vin">
          {order.order_number}
        </span>
        <StatusBadge status={order.status} />
      </div>
      <div className="mb-3 flex items-center gap-3">
        <Avatar initials={initials(order.customer_name)} index={index} />
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold text-texte">
            {order.customer_name}
          </div>
          <div className="truncate text-[13px] font-semibold text-prune">
            {order.cake}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-rose-bonbon pt-3 text-[13px]">
        <span className="flex items-center gap-2 text-texte-doux">
          <ModeTag mode={order.mode} />
          {relativeDay(order.fulfillment_date, today)}
          {order.fulfillment_time ? ` · ${order.fulfillment_time}` : ""}
        </span>
        <span className="font-extrabold text-vin">
          {formatPrice(order.amount, currency)}
        </span>
      </div>
    </button>
  );
}
