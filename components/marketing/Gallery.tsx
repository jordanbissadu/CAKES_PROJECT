"use client";

import { useState } from "react";
import { GALLERY } from "@/lib/gallery";
import { useOrderModel } from "./OrderModelContext";

export function Gallery() {
  const [index, setIndex] = useState(0);
  const { selectCake } = useOrderModel();
  const n = GALLERY.length;
  const cake = GALLERY[index];

  const go = (delta: number) => setIndex((i) => (i + delta + n) % n);
  const cakeDesc = `Fait main chez IDI's Cakes — ${cake.cream.toLowerCase()}, goût ${cake.sweet.toLowerCase()}. Personnalisable avec ton nom, ta déco et ta saveur.`;

  return (
    <section
      id="specialites"
      className="mx-auto max-w-container px-5 py-16 nav:px-6 nav:py-20"
    >
      <div className="mx-auto mb-12 max-w-[36em] text-center">
        <span className="mb-3.5 block text-[13px] font-bold uppercase tracking-[2px] text-rose-mauve">
          Nos vraies créations
        </span>
        <h2 className="font-display text-[30px] font-bold leading-[1.1] text-vin nav:text-[38px]">
          Nos gâteaux, un par un
        </h2>
        <p className="mt-3 text-[17px] leading-relaxed text-texte-doux">
          Explore nos réalisations une à une — clique à droite pour faire
          défiler, et commande d&apos;un clic celui qui te fait envie.
        </p>
      </div>

      <div className="grid grid-cols-1 overflow-hidden rounded-[28px] bg-blanc shadow-[0_14px_40px_rgba(100,29,52,.10)] nav:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* Photo */}
        <div className="relative min-h-[320px] bg-[#F6E4E9] nav:min-h-[440px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={index}
            src={cake.img}
            alt={cake.name}
            onClick={() => go(1)}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full cursor-pointer object-cover motion-safe:[animation:idiFade_.5s_cubic-bezier(0.22,1,0.36,1)]"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-pill bg-[rgba(52,13,26,.72)] px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              {index + 1} / {n}
            </span>
            <span className="rounded-pill bg-framboise px-3 py-1.5 text-xs font-bold text-white">
              {cake.tag}
            </span>
          </div>
          <button
            onClick={() => go(-1)}
            aria-label="Précédent"
            className="absolute left-3.5 top-1/2 grid h-[46px] w-[46px] -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[22px] text-vin shadow-[0_4px_14px_rgba(52,13,26,.16)] transition hover:bg-white"
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Suivant"
            className="absolute right-3.5 top-1/2 grid h-[46px] w-[46px] -translate-y-1/2 place-items-center rounded-full bg-framboise text-[22px] text-white shadow-[0_5px_16px_rgba(214,51,91,.28)] transition hover:bg-vin"
          >
            ›
          </button>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4 p-7 nav:p-10">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[2px] text-rose-mauve">
              Réf. {cake.ref}
            </div>
            <h3 className="font-display text-[26px] font-bold leading-[1.12] text-vin nav:text-[29px]">
              {cake.name}
            </h3>
          </div>
          <p className="text-[15.5px] leading-relaxed text-texte-doux">
            {cakeDesc}
          </p>
          <div className="flex flex-wrap gap-2.5">
            <span className="rounded-pill bg-creme px-3.5 py-2 text-[13px] font-bold text-[#7A4A24]">
              🍦 {cake.cream}
            </span>
            <span className="rounded-pill bg-[#FEEAF0] px-3.5 py-2 text-[13px] font-bold text-prune">
              🍬 {cake.sweet}
            </span>
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-end gap-4">
            <button
              onClick={() => selectCake(cake)}
              className="rounded-pill bg-framboise px-6 py-3.5 text-base font-bold text-white shadow-[0_6px_18px_rgba(214,51,91,.24)] transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:bg-vin"
            >
              Commander ce gâteau
            </button>
          </div>
          <div className="text-[13px] text-[#B79AA4]">
            Astuce : clique sur la photo ou sur › pour explorer les autres.
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex gap-2.5 overflow-x-auto px-0.5 pb-1.5 pt-4">
        {GALLERY.map((t, i) => (
          <button
            key={t.ref}
            onClick={() => setIndex(i)}
            aria-label={t.name}
            style={{
              borderColor: i === index ? "#D6335B" : "transparent",
              opacity: i === index ? 1 : 0.55,
            }}
            className="h-[74px] w-[74px] flex-none overflow-hidden rounded-[14px] border-[3px] p-0 transition hover:opacity-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.img}
              alt=""
              loading="lazy"
              className="block h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
