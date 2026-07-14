"use client";

import { useMemo, useState } from "react";
import { Search, X, Phone } from "lucide-react";
import type { Client } from "@/lib/clients";
import { formatPrice, initials, relativeDay, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Drawer } from "@/components/ui/Drawer";
import { PageHeader } from "./PageHeader";
import { Avatar } from "./shared";
import { useCurrency } from "./CurrencyContext";

export function ClientsView({
  clients,
  todayIso,
}: {
  clients: Client[];
  todayIso: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const today = useMemo(() => new Date(`${todayIso}T00:00:00`), [todayIso]);
  const currency = useCurrency();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q),
    );
  }, [clients, query]);

  const selected = clients.find((c) => c.key === selectedKey) ?? null;

  return (
    <main className="flex-1 overflow-y-auto px-4 pb-28 pt-6 nav:px-8">
      <PageHeader
        eyebrow="✦ CARNET"
        title="Clients"
        subtitle={`${clients.length} client${clients.length > 1 ? "s" : ""} · issus des commandes reçues.`}
      />

      <div className="relative mb-4 max-w-[420px]">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-mauve"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un client, un numéro…"
          className="h-11 w-full rounded-pill border-[1.5px] border-rose-bonbon bg-blanc pl-10 pr-4 text-[15px] outline-none focus:border-prune"
        />
      </div>

      <div className="overflow-hidden rounded-card bg-blanc shadow-card">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-texte-doux">
            <div className="mb-2 text-[32px]">🧁</div>
            <div className="font-display text-[18px] text-vin">Aucun client</div>
            <div className="mt-1 text-sm">Les clients apparaîtront ici dès la première commande.</div>
          </div>
        ) : (
          filtered.map((c, i) => (
            <button
              key={c.key}
              onClick={() => setSelectedKey(c.key)}
              className="flex w-full items-center gap-3.5 border-t border-vin/[0.07] px-4 py-3.5 text-left first:border-t-0 hover:bg-blush nav:px-5"
            >
              <Avatar initials={initials(c.name)} index={i} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-bold text-texte">
                  {c.name}
                </div>
                <div className="truncate text-[13px] text-texte-doux">
                  {c.phone} · dernière : {formatDate(c.lastOrderDate.slice(0, 10))}
                </div>
              </div>
              <div className="flex flex-none flex-col items-end">
                <span className="text-[13px] font-extrabold text-vin">
                  {c.orderCount} cmd{c.orderCount > 1 ? "s" : ""}
                </span>
                <span className="text-[13px] font-semibold text-prune">
                  {formatPrice(c.totalAmount, currency)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelectedKey(null)}
        labelledBy="client-title"
      >
        {selected ? (
          <>
            <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-vin/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <Avatar initials={initials(selected.name)} index={0} size="lg" />
                <div>
                  <div id="client-title" className="font-display text-2xl font-bold text-vin">
                    {selected.name}
                  </div>
                  <a
                    href={`tel:${selected.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-prune no-underline"
                  >
                    <Phone size={14} /> {selected.phone}
                  </a>
                </div>
              </div>
              <button
                onClick={() => setSelectedKey(null)}
                aria-label="Fermer"
                className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-pill border-[1.5px] border-rose-bonbon bg-blanc text-prune hover:bg-rose-bonbon-clair"
              >
                <X size={20} strokeWidth={2.2} />
              </button>
            </div>

            <div className="flex gap-3 border-b border-vin/10 px-6 py-4">
              <Stat label="Commandes" value={String(selected.orderCount)} />
              <Stat label="Total dépensé" value={formatPrice(selected.totalAmount, currency)} />
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.04em] text-rose-mauve">
                Historique
              </div>
              <div className="flex flex-col gap-2.5">
                {selected.orders.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-[14px] border-[1.5px] border-rose-bonbon px-4 py-3"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-[13px] font-extrabold text-vin">
                        {o.order_number}
                      </span>
                      <StatusBadge status={o.status} size="sm" />
                    </div>
                    <div className="text-[15px] font-bold text-texte">{o.cake}</div>
                    <div className="mt-0.5 flex items-center justify-between text-[13px] text-texte-doux">
                      <span>
                        {o.mode === "livraison" ? "Livraison" : "Retrait"} ·{" "}
                        {relativeDay(o.fulfillment_date, today)}
                      </span>
                      <span className="font-bold text-vin">
                        {formatPrice(o.amount, currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </Drawer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-[14px] bg-rose-bonbon-clair px-4 py-3">
      <div className="text-[12px] font-bold text-texte-doux">{label}</div>
      <div className="font-display text-xl font-bold text-vin">{value}</div>
    </div>
  );
}
