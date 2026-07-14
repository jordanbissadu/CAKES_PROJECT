"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Check } from "lucide-react";
import { trackOrder, type TrackState } from "@/app/(marketing)/tracking-actions";
import type { OrderStatus } from "@/lib/orders";
import { formatDate } from "@/lib/format";

const initial: TrackState = { status: "idle" };

const controlCls =
  "w-full rounded-input border-[1.5px] border-rose-bonbon bg-blush px-3.5 py-3 text-base text-texte outline-none focus:border-prune";

// Customer-facing 3-step view.
const STEPS = ["Reçue", "En préparation", "Prête"] as const;
function stepIndex(s: OrderStatus): number {
  if (s === "nouvelle") return 0;
  if (s === "apreparer" || s === "enpreparation") return 1;
  if (s === "prete") return 2;
  return -1; // annulee
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-pill bg-framboise px-6 py-3.5 text-base font-bold text-white shadow-[0_5px_16px_rgba(214,51,91,.22)] transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:bg-vin disabled:opacity-50"
    >
      {pending ? "Recherche…" : "Suivre ma commande"}
    </button>
  );
}

export function TrackForm() {
  const [state, formAction] = useFormState(trackOrder, initial);

  return (
    <div className="flex flex-col gap-5">
      <form
        action={formAction}
        className="flex flex-col gap-3.5 rounded-[22px] bg-blanc p-7 shadow-card"
        aria-label="Suivi de commande"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="t-num" className="text-[13px] font-bold text-texte">
            Numéro de commande
          </label>
          <input
            id="t-num"
            name="order_number"
            placeholder="Ex. #C-2052"
            required
            className={controlCls}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="t-tel" className="text-[13px] font-bold text-texte">
            Téléphone (celui de la commande)
          </label>
          <input
            id="t-tel"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="96 628 864"
            required
            className={controlCls}
          />
        </div>

        {state.status === "error" || state.status === "notfound" ? (
          <p className="text-[14px] font-semibold text-framboise">{state.message}</p>
        ) : null}

        <SubmitButton />
      </form>

      {state.status === "found" && state.order ? (
        <Result order={state.order} />
      ) : null}
    </div>
  );
}

function Result({ order }: { order: NonNullable<TrackState["order"]> }) {
  const cancelled = order.orderStatus === "annulee";
  const cur = stepIndex(order.orderStatus);

  return (
    <div className="rounded-[22px] bg-blanc p-7 shadow-card">
      <div className="mb-1 text-[12px] font-extrabold uppercase tracking-[0.08em] text-rose-mauve">
        Commande {order.order_number}
      </div>
      <h3 className="font-display text-[23px] font-bold text-vin">{order.cake}</h3>
      <p className="mb-5 mt-1 text-[14px] text-texte-doux">
        {order.mode === "livraison" ? "Livraison" : "Retrait"}
        {order.fulfillment_date ? ` · ${formatDate(order.fulfillment_date)}` : ""}
      </p>

      {cancelled ? (
        <div className="rounded-[14px] bg-[#F1E9EC] px-4 py-3.5 text-sm font-bold text-texte-doux">
          Cette commande a été annulée. Appelle-nous si c&apos;est une erreur.
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {STEPS.map((label, i) => {
            const done = i < cur;
            const current = i === cur;
            return (
              <div key={label} className="flex items-center gap-3.5">
                <span
                  className="my-[6px] inline-flex h-6 w-6 flex-none items-center justify-center rounded-pill"
                  style={{
                    background: done ? "#3F9E6A" : current ? "var(--framboise)" : "#EAD7DE",
                    boxShadow: current ? "0 0 0 4px rgba(214,51,91,.16)" : "none",
                  }}
                >
                  {done ? <Check size={13} strokeWidth={3} color="#fff" /> : null}
                </span>
                <span
                  className="text-[15px]"
                  style={{
                    fontWeight: current ? 800 : 700,
                    color: done ? "#2E7150" : current ? "var(--vin)" : "var(--rose-mauve)",
                  }}
                >
                  {label}
                  {current ? " — en cours" : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-5 text-[13px] text-texte-doux">
        Une question ? Appelle-nous, on est là pour toi. 🎂
      </p>
    </div>
  );
}
