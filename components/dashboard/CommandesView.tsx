"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChefHat, Download, List, Columns, Plus, ShoppingBag } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/orders";
import { ordersToCsv, downloadCsv } from "@/lib/export";
import { todayISO } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { TopBar } from "./TopBar";
import { KpiTile } from "./KpiTile";
import { OrdersTable } from "./OrdersTable";
import { OrderCard } from "./OrderCard";
import { OrdersBoard } from "./OrdersBoard";
import { OrderDetailDrawer } from "./OrderDetailDrawer";
import { NewOrderModal, type NewOrderValues } from "./NewOrderModal";
import {
  advanceOrder,
  cancelOrder,
  createOrder,
} from "@/app/(dashboard)/actions";

type View = "liste" | "preparation";
type Filter = OrderStatus | "toutes";

const TABS: { key: Filter; label: string }[] = [
  { key: "toutes", label: "Toutes" },
  { key: "nouvelle", label: "Nouvelles" },
  { key: "apreparer", label: "À préparer" },
  { key: "enpreparation", label: "En préparation" },
  { key: "prete", label: "Prête" },
  { key: "annulee", label: "Annulée" },
];

export function CommandesView({
  orders,
  todayIso,
  userEmail,
}: {
  orders: Order[];
  todayIso: string;
  userEmail: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [view, setView] = useState<View>("liste");
  const [filter, setFilter] = useState<Filter>("toutes");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  const today = useMemo(() => new Date(`${todayIso}T00:00:00`), [todayIso]);

  const byQuery = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.cake.toLowerCase().includes(q),
    );
  }, [orders, query]);

  const filtered = useMemo(
    () => byQuery.filter((o) => filter === "toutes" || o.status === filter),
    [byQuery, filter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { toutes: byQuery.length };
    for (const t of TABS) if (t.key !== "toutes") c[t.key] = 0;
    for (const o of byQuery) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [byQuery]);

  const kpi = useMemo(() => {
    const day = orders.filter(
      (o) => o.fulfillment_date === todayIso && o.status !== "annulee",
    ).length;
    const prep = orders.filter((o) => o.status === "apreparer").length;
    const retrait = orders.filter(
      (o) => o.fulfillment_date === todayIso && o.status === "prete",
    ).length;
    return { day, prep, retrait };
  }, [orders, todayIso]);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  function run(fn: () => Promise<{ ok: boolean; message?: string }>, ok: string) {
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        toast(ok);
        router.refresh();
      } else {
        toast(res.message ?? "Une erreur est survenue.");
      }
    });
  }

  const onAdvance = (o: Order) =>
    run(
      () => advanceOrder(o.id, o.status),
      o.status === "enpreparation"
        ? `${o.order_number} est prête ✓`
        : `${o.order_number} avance 🧑‍🍳`,
    );

  const onCancel = (o: Order) => {
    run(() => cancelOrder(o.id), `${o.order_number} annulée`);
    setSelectedId(null);
  };

  const onExport = () => {
    if (filtered.length === 0) {
      toast("Aucune commande à exporter.");
      return;
    }
    const csv = ordersToCsv(filtered);
    downloadCsv(`commandes-idis-cakes-${todayISO()}.csv`, csv);
    toast(`${filtered.length} commande${filtered.length > 1 ? "s" : ""} exportée${filtered.length > 1 ? "s" : ""} ✓`);
  };

  const onCreate = (values: NewOrderValues) => {
    if (!values.customer_name.trim() || !values.cake.trim()) {
      toast("Renseigne au moins le client et le gâteau.");
      return;
    }
    startTransition(async () => {
      const res = await createOrder(values);
      if (res.ok) {
        toast("Commande créée 🎂");
        setNewOpen(false);
        setFilter("toutes");
        router.refresh();
      } else {
        toast(res.message ?? "Échec de la création.");
      }
    });
  };

  const segStyle = (active: boolean) =>
    cn(
      "inline-flex h-10 items-center gap-1.5 rounded-[10px] px-4 text-sm font-bold transition-colors",
      active ? "bg-vin text-blanc" : "text-texte-doux",
    );

  return (
    <>
      <TopBar
        query={query}
        onQuery={setQuery}
        userInitials={(userEmail[0] ?? "I").toUpperCase() + "D"}
        userName={userEmail.split("@")[0]}
      />

      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-6 nav:px-8">
        {/* Header row */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1.5 text-[12px] font-extrabold tracking-[0.1em] text-rose-mauve">
              ✦ ATELIER
            </div>
            <h1 className="font-display text-[28px] font-bold leading-tight text-vin nav:text-[40px]">
              Commandes
            </h1>
            <p className="mt-1 text-[15px] text-texte-doux">
              Suis, prépare et remets les douceurs de la semaine.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="md"
              className="hidden nav:inline-flex"
              onClick={onExport}
            >
              <Download size={18} />
              Exporter
            </Button>
            <Button onClick={() => setNewOpen(true)}>
              <Plus size={18} strokeWidth={2.2} />
              Nouvelle commande
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-5 grid grid-cols-1 gap-3.5 min-[520px]:grid-cols-2 nav:grid-cols-3">
          <KpiTile
            label="Commandes du jour"
            value={kpi.day}
            hint={<>à honorer aujourd&apos;hui</>}
            iconBg="var(--rose-bonbon-clair)"
            icon={<CalendarDays size={18} className="text-rose-mauve" strokeWidth={1.9} />}
          />
          <KpiTile
            label="À préparer"
            value={kpi.prep}
            hint="dans la file de l'atelier"
            iconBg="var(--creme)"
            icon={<ChefHat size={18} style={{ color: "#B4801A" }} strokeWidth={1.9} />}
          />
          <KpiTile
            label="À récupérer aujourd'hui"
            value={kpi.retrait}
            hint="prêtes pour retrait ou livraison"
            iconBg="#E7F4EC"
            icon={<ShoppingBag size={18} style={{ color: "#2E7150" }} strokeWidth={1.9} />}
          />
        </div>

        {/* View toggle */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-[13px] border-[1.5px] border-rose-bonbon bg-blanc p-1">
            <button onClick={() => setView("liste")} className={segStyle(view === "liste")}>
              <List size={17} />
              Liste
            </button>
            <button
              onClick={() => setView("preparation")}
              className={segStyle(view === "preparation")}
            >
              <Columns size={17} />
              Préparation
            </button>
          </div>
        </div>

        {/* Status tabs (liste view only) */}
        {view === "liste" ? (
          <div className="mb-4 flex items-center gap-1.5 overflow-x-auto rounded-[14px] bg-rose-bonbon-clair p-1.5">
            {TABS.map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[10px] px-3.5 py-2.5 text-sm font-bold transition-colors",
                    active ? "bg-blanc text-vin shadow-card" : "text-texte-doux",
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "rounded-pill px-2 py-px text-xs font-extrabold",
                      active
                        ? "bg-[#FFE1E9] text-framboise"
                        : "bg-vin/[0.07] text-texte-doux",
                    )}
                  >
                    {counts[tab.key] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Content */}
        {view === "preparation" ? (
          <OrdersBoard orders={byQuery} today={today} onOpen={setSelectedId} />
        ) : (
          <>
            <div className="hidden nav:block">
              <OrdersTable orders={filtered} today={today} onOpen={setSelectedId} />
            </div>
            <div className="flex flex-col gap-3 nav:hidden">
              {filtered.length === 0 ? (
                <div className="rounded-[18px] bg-blanc py-12 text-center text-texte-doux shadow-card">
                  <div className="mb-2 text-[32px]">🎂</div>
                  <div className="font-display text-[18px] text-vin">
                    Aucune commande ici
                  </div>
                </div>
              ) : (
                filtered.map((o, i) => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    index={i}
                    today={today}
                    onOpen={setSelectedId}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      <OrderDetailDrawer
        order={selected}
        today={today}
        pending={pending}
        onClose={() => setSelectedId(null)}
        onAdvance={onAdvance}
        onCancel={onCancel}
      />

      <NewOrderModal
        open={newOpen}
        pending={pending}
        onClose={() => setNewOpen(false)}
        onCreate={onCreate}
      />
    </>
  );
}
