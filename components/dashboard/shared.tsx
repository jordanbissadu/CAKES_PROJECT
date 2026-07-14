import type { OrderMode } from "@/lib/orders";

/** Soft avatar background palette (cycled by index). */
export const AVA = [
  "#FEE3EB",
  "#FBEFD6",
  "#F3E4EC",
  "#FADDE6",
  "#F6E8D5",
  "#EFE1EF",
];

export function Avatar({
  initials,
  index,
  size = "md",
}: {
  initials: string;
  index: number;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? 48 : 34;
  return (
    <span
      className="inline-flex flex-shrink-0 items-center justify-center rounded-pill font-extrabold text-prune"
      style={{
        width: dim,
        height: dim,
        fontSize: size === "lg" ? 17 : 13,
        background: AVA[index % AVA.length],
      }}
    >
      {initials}
    </span>
  );
}

export function ModeTag({ mode }: { mode: OrderMode }) {
  const livraison = mode === "livraison";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-[3px] text-xs font-extrabold uppercase tracking-[0.02em]"
      style={{
        color: livraison ? "#8A5A00" : "var(--prune)",
        background: livraison ? "var(--creme)" : "var(--rose-bonbon-clair)",
      }}
    >
      {livraison ? "Livraison" : "Retrait"}
    </span>
  );
}
