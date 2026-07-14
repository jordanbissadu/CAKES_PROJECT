"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import type { Settings } from "@/lib/settings";

const LINKS = [
  { href: "/#specialites", label: "Nos gâteaux" },
  { href: "/#carte", label: "Notre carte" },
  { href: "/#commander", label: "Commander" },
  { href: "/suivi", label: "Suivi" },
];

export function Nav({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const PHONE_PRETTY = settings.phone_pretty;
  const PHONE_TEL = settings.phone_tel;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav className="sticky top-0 z-40 border-b border-vin/10 bg-blush/85 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] max-w-container items-center justify-between px-5 nav:h-[74px] nav:px-6">
        <a
          href="/"
          className="flex items-center gap-2.5 font-display text-[22px] font-bold text-vin no-underline nav:text-2xl"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-rose-mauve" />
          IDI&apos;s Cakes
        </a>

        <ul className="hidden list-none items-center gap-[30px] nav:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[15px] font-semibold text-prune no-underline hover:text-rose-mauve"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 nav:flex">
          <a
            href={`tel:${PHONE_TEL}`}
            className="whitespace-nowrap text-[15px] font-bold text-vin no-underline"
          >
            <span className="font-semibold text-texte-doux">Appelez : </span>
            {PHONE_PRETTY}
          </a>
          <a
            href="/#commander"
            className="rounded-pill bg-framboise px-5 py-2.5 text-[15px] font-bold text-white no-underline shadow-[0_5px_16px_rgba(214,51,91,.22)] transition-all duration-200 ease-soft hover:-translate-y-px hover:bg-vin"
          >
            Commander
          </a>
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-2 nav:hidden">
          <a
            href={`tel:${PHONE_TEL}`}
            aria-label={`Appeler le ${PHONE_PRETTY}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill border-[1.5px] border-rose-bonbon bg-blanc text-prune"
          >
            <Phone size={20} />
          </a>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill border-[1.5px] border-rose-bonbon bg-blanc text-vin"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-blush nav:hidden">
          <div className="flex h-[64px] items-center justify-between px-5">
            <span className="font-display text-[22px] font-bold text-vin">
              IDI&apos;s Cakes
            </span>
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill border-[1.5px] border-rose-bonbon bg-blanc text-vin"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-1 px-5 pt-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-rose-bonbon py-4 font-display text-[22px] font-semibold text-vin no-underline"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="px-5 pb-8">
            <a
              href="/#commander"
              onClick={() => setOpen(false)}
              className="block rounded-pill bg-framboise px-6 py-3.5 text-center text-base font-bold text-white no-underline"
            >
              Commander un gâteau
            </a>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
