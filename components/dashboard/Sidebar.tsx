"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  CalendarDays,
  Cake,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/(dashboard)/actions";

const SECTIONS: {
  title: string;
  items: { href: string; label: string; icon: React.ElementType }[];
}[] = [
  {
    title: "Pilotage",
    items: [
      { href: "/dashboard", label: "Tableau de bord", icon: Home },
      { href: "/dashboard/commandes", label: "Commandes", icon: ShoppingBag },
      { href: "/dashboard/calendrier", label: "Calendrier", icon: CalendarDays },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { href: "/dashboard/gateaux", label: "Nos gâteaux", icon: Cake },
      { href: "/dashboard/clients", label: "Clients", icon: Users },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 hidden h-screen w-[252px] flex-shrink-0 flex-col border-r border-vin/10 bg-blanc px-4 py-5 nav:flex">
      <div className="flex items-center gap-2.5 px-2 pb-5 pt-1">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-pill border-[1.5px] border-vin bg-rose-bonbon-clair font-display text-base font-bold text-vin">
          ID
        </span>
        <span className="font-display text-xl font-bold tracking-tight text-vin">
          IDI&apos;s <span className="text-framboise">Cakes</span>
        </span>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title}>
          <div className="px-3 pb-1.5 pt-4 text-[11px] font-extrabold uppercase tracking-wider text-rose-mauve/70">
            {section.title}
          </div>
          {section.items.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-input px-3 py-2.5 text-[15px] font-semibold no-underline transition-colors",
                  active
                    ? "bg-rose-bonbon-clair text-vin shadow-[inset_3px_0_0_var(--framboise)]"
                    : "text-texte-doux hover:bg-blush hover:text-vin",
                )}
              >
                <Icon
                  size={20}
                  className={active ? "text-framboise" : "text-prune"}
                  strokeWidth={1.9}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}

      <div className="flex-1" />

      <Link
        href="/dashboard/reglages"
        className="flex items-center gap-3 rounded-input px-3 py-2.5 text-[15px] font-semibold text-texte-doux no-underline transition-colors hover:bg-blush hover:text-vin"
      >
        <Settings size={20} className="text-prune" strokeWidth={1.9} />
        Réglages
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-input px-3 py-2.5 text-[15px] font-semibold text-texte-doux transition-colors hover:bg-blush hover:text-vin"
        >
          <LogOut size={20} className="text-prune" strokeWidth={1.9} />
          Déconnexion
        </button>
      </form>

      <div className="mt-3 rounded-image bg-vin p-3.5 text-blush">
        <div className="mb-0.5 font-display text-[15px] font-semibold">
          Une question ?
        </div>
        <a
          href="tel:96628864"
          className="text-[15px] font-bold text-rose-bonbon no-underline"
        >
          ☎ 96 62 88 64
        </a>
      </div>
    </aside>
  );
}
