import { STATUS, type OrderStatus } from "@/lib/orders";

/** Status pill for the dashboard — uses the STATUS color map. */
export function StatusBadge({
  status,
  size = "md",
}: {
  status: OrderStatus;
  size?: "sm" | "md";
}) {
  const meta = STATUS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-pill font-bold whitespace-nowrap"
      style={{
        background: meta.bg,
        color: meta.text,
        fontSize: size === "sm" ? 12 : 13,
        padding: size === "sm" ? "4px 11px 4px 9px" : "5px 12px 5px 10px",
      }}
    >
      <span
        className="rounded-pill shrink-0"
        style={{ width: 7, height: 7, background: meta.dot }}
      />
      {meta.label}
    </span>
  );
}
