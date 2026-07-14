"use client";

import { X, Check, MessageCircle, Phone } from "lucide-react";
import type { Order } from "@/lib/orders";
import { digits, whatsappLink } from "@/lib/contact";
import {
  STATUS,
  PIPELINE,
  advanceLabel,
  canAdvance,
  canCancel,
} from "@/lib/orders";
import { formatPrice, initials, relativeDay } from "@/lib/format";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar } from "./shared";
import { useCurrency } from "./CurrencyContext";

export function OrderDetailDrawer({
  order,
  today,
  pending = false,
  readOnly = false,
  onClose,
  onAdvance,
  onCancel,
}: {
  order: Order | null;
  today: Date;
  pending?: boolean;
  readOnly?: boolean;
  onClose: () => void;
  onAdvance?: (order: Order) => void;
  onCancel?: (order: Order) => void;
}) {
  const currency = useCurrency();
  return (
    <Drawer open={!!order} onClose={onClose} labelledBy="drawer-title">
      {order ? (
        <>
          <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-vin/10 px-6 py-5">
            <div>
              <div className="mb-1.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-rose-mauve">
                Commande {order.order_number}
              </div>
              <div
                id="drawer-title"
                className="font-display text-2xl font-bold leading-tight text-vin"
              >
                {order.cake}
              </div>
              <div className="mt-3">
                <StatusBadge status={order.status} />
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-pill border-[1.5px] border-rose-bonbon bg-blanc text-prune hover:bg-rose-bonbon-clair"
            >
              <X size={20} strokeWidth={2.2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Client */}
            <div className="mb-4 rounded-[16px] bg-rose-bonbon-clair p-3.5">
              <div className="flex items-center gap-3">
                <Avatar initials={initials(order.customer_name)} index={0} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="text-base font-extrabold text-texte">
                    {order.customer_name}
                  </div>
                  <a
                    href={`tel:${digits(order.customer_phone)}`}
                    className="text-sm font-bold text-prune no-underline"
                  >
                    ☎ {order.customer_phone}
                  </a>
                </div>
              </div>
              {digits(order.customer_phone).length >= 6 ? (
                <div className="mt-3 flex gap-2">
                  <a
                    href={whatsappLink(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-pill bg-[#25D366] text-[14px] font-bold text-white no-underline"
                  >
                    <MessageCircle size={17} />
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${digits(order.customer_phone)}`}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-pill border-[1.5px] border-prune text-[14px] font-bold text-prune no-underline"
                  >
                    <Phone size={16} />
                    Appeler
                  </a>
                </div>
              ) : null}
            </div>

            {/* Facts */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <Fact label="Retrait / Livraison">
                <div className="text-[15px] font-bold text-vin">
                  {order.mode === "livraison" ? "Livraison" : "Retrait"}
                </div>
                <div className="mt-0.5 text-[13px] text-texte-doux">
                  {relativeDay(order.fulfillment_date, today)}
                  {order.fulfillment_time ? ` · ${order.fulfillment_time}` : ""}
                </div>
              </Fact>
              <Fact label="Montant">
                <div className="font-display text-lg font-extrabold text-vin">
                  {formatPrice(order.amount, currency)}
                </div>
                <div className="mt-0.5 text-[13px] text-texte-doux">
                  {order.cake_sub}
                </div>
              </Fact>
            </div>

            {/* Personalisation */}
            {order.message ? (
              <div className="mb-5 rounded-[16px] bg-creme p-4">
                <div className="mb-1.5 text-[12px] font-extrabold uppercase tracking-[0.04em] text-[#8A5A00]">
                  💌 Personnalisation
                </div>
                <div className="text-sm leading-relaxed text-texte">
                  {order.message}
                </div>
                {order.allergenes && order.allergenes.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.allergenes.map((a) => (
                      <span
                        key={a}
                        className="rounded-pill border-[1.5px] border-rose-bonbon bg-blanc px-3 py-1 text-xs font-bold text-prune"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Timeline */}
            <div className="mb-3.5 text-[12px] font-extrabold uppercase tracking-[0.04em] text-rose-mauve">
              Suivi de préparation
            </div>
            {order.status === "annulee" ? (
              <div className="rounded-[14px] bg-[#F1E9EC] px-4 py-3.5 text-sm font-bold text-texte-doux">
                Cette commande a été annulée.
              </div>
            ) : (
              <Timeline order={order} />
            )}
          </div>

          {/* Footer actions */}
          {readOnly ? null : (
            <div className="flex flex-shrink-0 gap-2.5 border-t border-vin/10 bg-blanc px-6 py-4">
              {canCancel(order.status) ? (
                <Button
                  variant="outline"
                  onClick={() => onCancel?.(order)}
                  disabled={pending}
                >
                  Annuler
                </Button>
              ) : null}
              <div className="flex-1">
                <Button
                  fullWidth
                  disabled={!canAdvance(order.status) || pending}
                  onClick={() => onAdvance?.(order)}
                >
                  {pending ? "…" : advanceLabel(order.status)}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </Drawer>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border-[1.5px] border-rose-bonbon px-4 py-3.5">
      <div className="mb-1.5 text-[12px] font-extrabold uppercase tracking-[0.04em] text-rose-mauve">
        {label}
      </div>
      {children}
    </div>
  );
}

function Timeline({ order }: { order: Order }) {
  const cur = PIPELINE.indexOf(
    order.status === "nouvelle" ? "apreparer" : (order.status as never),
  );
  const notStarted = order.status === "nouvelle";

  return (
    <div className="flex flex-col gap-0.5">
      {PIPELINE.map((step, i) => {
        const done = !notStarted && i < cur;
        const current = !notStarted && i === cur;
        return (
          <div key={step} className="flex items-center gap-3.5">
            <span
              className="my-[7px] inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-pill"
              style={{
                background: done
                  ? "#3F9E6A"
                  : current
                    ? "var(--framboise)"
                    : "#EAD7DE",
                boxShadow: current ? "0 0 0 4px rgba(214,51,91,.16)" : "none",
              }}
            >
              {done ? <Check size={13} strokeWidth={3} color="#fff" /> : null}
            </span>
            <span
              className="text-[15px]"
              style={{
                fontWeight: current ? 800 : 700,
                color: done
                  ? "#2E7150"
                  : current
                    ? "var(--vin)"
                    : "var(--rose-mauve)",
              }}
            >
              {STATUS[step].label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
