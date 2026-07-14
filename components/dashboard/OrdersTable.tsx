"use client";

import { ChevronRight } from "lucide-react";
import type { Order } from "@/lib/orders";
import { formatPrice, initials, relativeDay } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar, ModeTag } from "./shared";
import { useCurrency } from "./CurrencyContext";

const GRID = "grid-cols-[104px_1.5fr_1.7fr_1.4fr_150px_40px]";

export function OrdersTable({
  orders,
  today,
  onOpen,
}: {
  orders: Order[];
  today: Date;
  onOpen: (id: string) => void;
}) {
  const currency = useCurrency();
  if (orders.length === 0) return <EmptyState />;

  return (
    <div className="overflow-hidden rounded-card bg-blanc shadow-card">
      <div
        className={`grid ${GRID} gap-3 border-b border-vin/10 bg-rose-bonbon-clair px-5 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.05em] text-prune`}
      >
        <span>Commande</span>
        <span>Client</span>
        <span>Gâteau</span>
        <span>Retrait / Livraison</span>
        <span>Préparation</span>
        <span />
      </div>
      {orders.map((o, i) => (
        <button
          key={o.id}
          onClick={() => onOpen(o.id)}
          className={`grid ${GRID} w-full items-center gap-3 border-t border-vin/[0.07] px-5 py-[15px] text-left first:border-t-0 hover:bg-blush`}
        >
          <span className="text-sm font-extrabold text-vin">{o.order_number}</span>
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar initials={initials(o.customer_name)} index={i} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-texte">
                {o.customer_name}
              </span>
              <span className="text-xs text-texte-doux">
                {formatPrice(o.amount, currency)}
              </span>
            </span>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-texte">
              {o.cake}
            </span>
            <span className="block truncate text-xs text-texte-doux">
              {o.cake_sub}
            </span>
          </span>
          <span className="min-w-0">
            <ModeTag mode={o.mode} />
            <span className="mt-1.5 block text-[13px] font-semibold text-texte">
              {relativeDay(o.fulfillment_date, today)}
              {o.fulfillment_time ? ` · ${o.fulfillment_time}` : ""}
            </span>
          </span>
          <span>
            <StatusBadge status={o.status} />
          </span>
          <span className="inline-flex items-center justify-center text-rose-mauve">
            <ChevronRight size={18} strokeWidth={2.2} />
          </span>
        </button>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-card bg-blanc py-14 text-center text-texte-doux shadow-card">
      <div className="mb-2 text-[34px]">🎂</div>
      <div className="font-display text-[19px] text-vin">Aucune commande ici</div>
      <div className="mt-1 text-sm">Change de filtre ou ajuste ta recherche.</div>
    </div>
  );
}
