import type { Order } from "@/lib/orders";

export interface CalendarDay {
  iso: string; // YYYY-MM-DD
  day: number; // day of month
  inMonth: boolean;
  isToday: boolean;
  orders: Order[];
}

export const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/**
 * Build a 6-row (42-cell) month grid starting on Monday, with orders
 * bucketed by fulfillment_date. `year`/`month` are 0-indexed month.
 */
export function buildMonth(
  year: number,
  month: number,
  orders: Order[],
  todayIso: string,
): CalendarDay[] {
  const byDate = new Map<string, Order[]>();
  for (const o of orders) {
    if (!o.fulfillment_date) continue;
    const list = byDate.get(o.fulfillment_date) ?? [];
    list.push(o);
    byDate.set(o.fulfillment_date, list);
  }

  const first = new Date(Date.UTC(year, month, 1));
  // JS getUTCDay: 0=Sun..6=Sat → shift so Monday=0
  const offset = (first.getUTCDay() + 6) % 7;
  const start = new Date(first);
  start.setUTCDate(1 - offset);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const dd = d.getUTCDate();
    const key = iso(y, m, dd);
    days.push({
      iso: key,
      day: dd,
      inMonth: m === month,
      isToday: key === todayIso,
      orders: (byDate.get(key) ?? []).sort((a, b) =>
        (a.fulfillment_time ?? "").localeCompare(b.fulfillment_time ?? ""),
      ),
    });
  }
  return days;
}
