"use client";

import type { Order } from "@/lib/orders";
import { STATUS, PIPELINE, type OrderStatus } from "@/lib/orders";
import { formatPrice, initials, relativeDay } from "@/lib/format";
import { Avatar, ModeTag } from "./shared";
import { useCurrency } from "./CurrencyContext";

/** Preparation kanban — columns À préparer / En préparation / Prête. */
export function OrdersBoard({
  orders,
  today,
  onOpen,
}: {
  orders: Order[];
  today: Date;
  onOpen: (id: string) => void;
}) {
  const currency = useCurrency();
  return (
    <div className="flex items-start gap-4 overflow-x-auto pb-2.5">
      {PIPELINE.map((key) => {
        const meta = STATUS[key as OrderStatus];
        const items = orders.filter((o) => o.status === key);
        return (
          <div
            key={key}
            className="min-w-[288px] flex-1 rounded-card bg-rose-bonbon-clair p-3.5"
          >
            <div className="flex items-center gap-2.5 px-1 pb-3.5 pt-0.5">
              <span
                className="h-2.5 w-2.5 rounded-pill"
                style={{ background: meta.dot }}
              />
              <span className="font-display text-[17px] font-semibold text-vin">
                {meta.label}
              </span>
              <span
                className="ml-auto rounded-pill px-2.5 py-0.5 text-xs font-extrabold"
                style={{ background: meta.bg, color: meta.text }}
              >
                {items.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((o, i) => (
                <button
                  key={o.id}
                  onClick={() => onOpen(o.id)}
                  className="w-full rounded-[16px] bg-blanc p-3.5 text-left shadow-card transition-[transform,box-shadow] duration-200 ease-soft hover:-translate-y-0.5 hover:shadow-hover"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-extrabold text-vin">
                      {o.order_number}
                    </span>
                    <span className="text-[13px] font-extrabold text-prune">
                      {formatPrice(o.amount, currency)}
                    </span>
                  </div>
                  <div className="mb-0.5 font-display text-base font-semibold leading-tight text-texte">
                    {o.cake}
                  </div>
                  <div className="mb-3 text-xs text-texte-doux">{o.cake_sub}</div>
                  <div className="flex items-center gap-2 border-t border-dashed border-rose-bonbon pt-2.5">
                    <Avatar initials={initials(o.customer_name)} index={i} />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-texte">
                      {o.customer_name}
                    </span>
                    <ModeTag mode={o.mode} />
                  </div>
                  <div className="mt-2 text-xs font-semibold text-texte-doux">
                    📅 {relativeDay(o.fulfillment_date, today)}
                    {o.fulfillment_time ? ` · ${o.fulfillment_time}` : ""}
                  </div>
                </button>
              ))}
              {items.length === 0 ? (
                <div className="rounded-[14px] border-[1.5px] border-dashed border-rose-bonbon p-5 text-center text-[13px] text-rose-mauve">
                  Rien pour l&apos;instant
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
