"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, CalendarDays, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/dashboard/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/dashboard/calendrier", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/reglages", label: "Réglages", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-[66px] items-center justify-around border-t border-vin/10 bg-blanc nav:hidden"
      style={{
        boxShadow: "0 -8px 24px rgba(100,29,52,.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {ITEMS.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 text-[11px] font-bold no-underline",
              active ? "text-framboise" : "text-rose-mauve",
            )}
          >
            <Icon size={22} strokeWidth={1.9} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
