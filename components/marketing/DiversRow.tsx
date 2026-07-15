"use client";

import { useOrderModel } from "./OrderModelContext";

/**
 * A single "divers" menu line (samoussa, mini pizza…) with an inline
 * "Commander" button that pre-fills the order form with this item.
 */
export function DiversRow({ name, price }: { name: string; price: string }) {
  const { selectDivers } = useOrderModel();

  return (
    <div className="border-b border-vin/[0.09] py-[15px] last:border-b-0">
      <div className="flex items-baseline gap-1.5">
        <span className="text-base font-bold text-texte">{name}</span>
        <span className="mt-[-3px] flex-1 border-b-2 border-dotted border-prune/35" />
        <span className="whitespace-nowrap font-display text-base font-bold text-vin">
          {price}
        </span>
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => selectDivers({ name, price })}
          className="rounded-pill bg-framboise px-4 py-1.5 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(214,51,91,.22)] transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:bg-vin"
        >
          Commander
        </button>
      </div>
    </div>
  );
}
