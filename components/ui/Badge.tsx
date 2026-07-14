import { cn } from "@/lib/utils";

type BadgeTone = "framboise" | "prune" | "rose-mauve" | "creme";

const tones: Record<BadgeTone, string> = {
  framboise: "bg-framboise text-white",
  prune: "bg-prune text-white",
  "rose-mauve": "bg-rose-mauve text-white",
  creme: "bg-creme text-vin",
};

/** Rounded pill badge — "Nouveau", "Best-seller", "Sur commande" (DS §7). */
export function Badge({
  tone = "framboise",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1.5 text-xs font-bold leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
