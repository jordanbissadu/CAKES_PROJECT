"use client";

import { useEffect, useRef } from "react";
import type { Settings } from "@/lib/settings";

export function Hero({ settings }: { settings: Settings }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleLines = settings.hero_title.split("\n");

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play?.().catch(() => {});
    }
  }, []);

  return (
    <header
      id="top"
      className="relative flex min-h-[92vh] items-center overflow-hidden [isolation:isolate]"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(52,13,26,.88) 0%, rgba(72,18,38,.72) 42%, rgba(100,29,52,.34) 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(52,13,26,.45) 0%, transparent 30%, transparent 60%, rgba(52,13,26,.55) 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-5 nav:px-6">
        <div className="max-w-[620px] py-16 text-white nav:py-20">
          <span className="mb-5 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[2px] text-rose-bonbon">
            <span className="h-0.5 w-6 rounded bg-rose-bonbon" />
            Pâtisserie artisanale
          </span>
          <h1
            className="mb-5 font-display text-[40px] font-bold leading-[1.04] tracking-[-0.5px] text-white nav:text-[60px]"
            style={{ textShadow: "0 2px 24px rgba(52,13,26,.4)" }}
          >
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
            {settings.hero_accent ? (
              <em className="italic text-rose-bonbon">{settings.hero_accent}</em>
            ) : null}
          </h1>
          <p className="mb-8 max-w-[30em] text-[17px] leading-relaxed text-blush/90 nav:text-[19px]">
            {settings.hero_subtitle}
          </p>
          <div className="mb-8 flex flex-wrap gap-4">
            <a
              href="#commander"
              className="rounded-pill bg-framboise px-7 py-4 text-base font-bold text-white no-underline shadow-[0_6px_20px_rgba(214,51,91,.32)] transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:bg-vin"
            >
              Commander un gâteau
            </a>
            <a
              href="#specialites"
              className="rounded-pill border-2 border-white/60 bg-white/10 px-7 py-3.5 text-base font-bold text-white no-underline backdrop-blur-sm transition-all duration-200 ease-soft hover:border-white/90 hover:bg-white/20"
            >
              Voir nos gâteaux
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-blush/90">
            <span className="flex">
              <i className="block h-[26px] w-[26px] rounded-full border-2 border-blush/50 bg-rose-bonbon" />
              <i className="-ml-2 block h-[26px] w-[26px] rounded-full border-2 border-blush/50 bg-rose-mauve" />
              <i className="-ml-2 block h-[26px] w-[26px] rounded-full border-2 border-blush/50 bg-creme" />
            </span>
            Fait maison · frais du jour · sur commande
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 right-8 z-[2] rounded-image bg-white px-[18px] py-3 shadow-[0_12px_32px_rgba(52,13,26,.35)] motion-safe:[animation:idiFloat_5s_ease-in-out_infinite]"
      >
        <small className="block text-[11px] font-semibold text-texte-doux">
          Gâteau anniversaire
        </small>
        <b className="font-display text-lg text-vin">dès 6 000F</b>
      </div>
      <span className="absolute right-[34px] top-24 z-[2] rotate-6 rounded-pill bg-framboise px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_6px_16px_rgba(214,51,91,.4)]">
        Nouveau ✦
      </span>
    </header>
  );
}
