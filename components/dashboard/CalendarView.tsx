"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Order } from "@/lib/orders";
import { STATUS } from "@/lib/orders";
import { buildMonth, MONTH_NAMES, WEEKDAYS } from "@/lib/calendar";
import { PageHeader } from "./PageHeader";
import { OrderDetailDrawer } from "./OrderDetailDrawer";

export function CalendarView({
  orders,
  todayIso,
}: {
  orders: Order[];
  todayIso: string;
}) {
  const today = useMemo(() => new Date(`${todayIso}T00:00:00`), [todayIso]);
  const [cursor, setCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const days = useMemo(
    () => buildMonth(cursor.year, cursor.month, orders, todayIso),
    [cursor, orders, todayIso],
  );

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  const shift = (delta: number) =>
    setCursor((c) => {
      const m = c.month + delta;
      return {
        year: c.year + Math.floor(m / 12),
        month: ((m % 12) + 12) % 12,
      };
    });

  const monthTotal = days
    .filter((d) => d.inMonth)
    .reduce((n, d) => n + d.orders.filter((o) => o.status !== "annulee").length, 0);

  return (
    <main className="flex-1 overflow-y-auto px-4 pb-28 pt-6 nav:px-8">
      <PageHeader
        eyebrow="✦ AGENDA"
        title="Calendrier"
        subtitle="Les commandes positionnées par date de retrait / livraison."
        actions={
          <div className="flex items-center gap-2 rounded-pill border-[1.5px] border-rose-bonbon bg-blanc px-2 py-1">
            <button
              onClick={() => shift(-1)}
              aria-label="Mois précédent"
              className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-prune hover:bg-rose-bonbon-clair"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-[150px] text-center font-display text-[17px] font-bold text-vin">
              {MONTH_NAMES[cursor.month]} {cursor.year}
            </span>
            <button
              onClick={() => shift(1)}
              aria-label="Mois suivant"
              className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-prune hover:bg-rose-bonbon-clair"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        }
      />

      <div className="mb-3 text-[13px] text-texte-doux">
        {monthTotal} commande{monthTotal > 1 ? "s" : ""} ce mois-ci.
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px] overflow-hidden rounded-card bg-blanc shadow-card">
          {/* Weekday header */}
          <div className="grid grid-cols-7 border-b border-vin/10 bg-rose-bonbon-clair">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="px-3 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.05em] text-prune"
              >
                {w}
              </div>
            ))}
          </div>
          {/* 6 weeks */}
          <div className="grid grid-cols-7">
            {days.map((d) => (
              <div
                key={d.iso}
                className={`min-h-[104px] border-b border-r border-vin/[0.06] p-1.5 ${
                  d.inMonth ? "bg-blanc" : "bg-blush/60"
                }`}
              >
                <div
                  className={`mb-1 flex h-6 w-6 items-center justify-center rounded-pill text-[13px] font-bold ${
                    d.isToday
                      ? "bg-framboise text-white"
                      : d.inMonth
                        ? "text-texte"
                        : "text-texte-doux/60"
                  }`}
                >
                  {d.day}
                </div>
                <div className="flex flex-col gap-1">
                  {d.orders.slice(0, 3).map((o) => {
                    const meta = STATUS[o.status];
                    return (
                      <button
                        key={o.id}
                        onClick={() => setSelectedId(o.id)}
                        className="flex items-center gap-1.5 truncate rounded-md px-1.5 py-1 text-left text-[12px] font-semibold hover:brightness-95"
                        style={{ background: meta.bg, color: meta.text }}
                        title={`${o.customer_name} — ${o.cake}`}
                      >
                        <span
                          className="h-1.5 w-1.5 flex-none rounded-pill"
                          style={{ background: meta.dot }}
                        />
                        <span className="truncate">
                          {o.fulfillment_time ? `${o.fulfillment_time} ` : ""}
                          {o.customer_name}
                        </span>
                      </button>
                    );
                  })}
                  {d.orders.length > 3 ? (
                    <span className="px-1.5 text-[11px] font-bold text-texte-doux">
                      +{d.orders.length - 3} autre{d.orders.length - 3 > 1 ? "s" : ""}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <OrderDetailDrawer
        order={selected}
        today={today}
        readOnly
        onClose={() => setSelectedId(null)}
      />
    </main>
  );
}
