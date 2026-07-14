import type { Order } from "@/lib/orders";
import { STATUS } from "@/lib/orders";

/** Quote a CSV field (RFC 4180): wrap in quotes, double internal quotes. */
function csvField(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

const HEADERS = [
  "N° commande",
  "Créée le",
  "Client",
  "Téléphone",
  "Gâteau",
  "Détail",
  "Mode",
  "Date retrait/livraison",
  "Heure",
  "Statut",
  "Montant",
  "Source",
  "Message",
];

/** Serialize orders to a CSV string (Excel-friendly, French labels). */
export function ordersToCsv(orders: Order[]): string {
  const rows = orders.map((o) =>
    [
      o.order_number,
      o.created_at?.slice(0, 10) ?? "",
      o.customer_name,
      o.customer_phone,
      o.cake,
      o.cake_sub ?? "",
      o.mode === "livraison" ? "Livraison" : "Retrait",
      o.fulfillment_date ?? "",
      o.fulfillment_time ?? "",
      STATUS[o.status]?.label ?? o.status,
      o.amount ?? "",
      o.source,
      (o.message ?? "").replace(/\r?\n/g, " · "),
    ]
      .map(csvField)
      .join(","),
  );
  // BOM so Excel opens UTF-8 (accents) correctly.
  return "﻿" + [HEADERS.map(csvField).join(","), ...rows].join("\r\n");
}

/** Trigger a client-side download of the given CSV content. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
