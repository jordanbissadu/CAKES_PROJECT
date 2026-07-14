"use client";

import { Search, Bell } from "lucide-react";

/** Dashboard header: brand chip (mobile), search, notifications, user avatar. */
export function TopBar({
  query,
  onQuery,
  userInitials = "ID",
  userName,
}: {
  query: string;
  onQuery: (v: string) => void;
  userInitials?: string;
  userName?: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3.5 border-b border-vin/10 bg-blush/85 px-4 py-3.5 backdrop-blur-md nav:px-6">
      <span className="inline-flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-pill border-[1.5px] border-vin bg-rose-bonbon-clair font-display text-[15px] font-bold text-vin nav:hidden">
        ID
      </span>

      <div className="relative max-w-[520px] flex-1">
        <Search
          size={18}
          strokeWidth={2}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-mauve"
        />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Rechercher une commande, un client, un gâteau…"
          className="h-11 w-full rounded-pill border-[1.5px] border-rose-bonbon bg-blanc pl-10 pr-4 text-[15px] text-texte outline-none focus:border-prune"
        />
      </div>

      <div className="flex-1" />

      <button
        type="button"
        aria-label="Notifications"
        className="relative hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-pill border-[1.5px] border-rose-bonbon bg-blanc text-prune hover:bg-rose-bonbon-clair nav:inline-flex"
      >
        <Bell size={20} strokeWidth={1.8} />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-pill border-[1.5px] border-blush bg-framboise" />
      </button>

      <div className="flex flex-shrink-0 items-center gap-2.5 rounded-pill border-[1.5px] border-rose-bonbon bg-blanc py-1 pl-1 pr-1 nav:pr-1.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-pill bg-vin text-sm font-extrabold text-rose-bonbon-clair">
          {userInitials}
        </span>
        {userName ? (
          <span className="hidden pr-1.5 text-sm font-bold text-vin nav:inline">
            {userName}
          </span>
        ) : null}
      </div>
    </header>
  );
}
