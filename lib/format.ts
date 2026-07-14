/** Formatting helpers — currency in Francs (F), French dates, initials. */

/** Format an integer amount in Francs, e.g. 6000 → "6 000 F". */
export function formatPrice(
  amount: number | null | undefined,
  currency = "F",
): string {
  if (amount == null) return "—";
  return `${amount.toLocaleString("fr-FR").replace(/ /g, " ")} ${currency}`;
}

const MONTHS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

/** "12 juil." style label from an ISO date string. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/**
 * Human relative day label relative to a reference "today":
 * "Auj." / "Demain" / "12 juil.".
 */
export function relativeDay(
  iso: string | null | undefined,
  today: Date = new Date(),
): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  const ref = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const target = new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),
  );
  const diff = Math.round((target.getTime() - ref.getTime()) / 86_400_000);
  if (diff === 0) return "Auj.";
  if (diff === 1) return "Demain";
  return formatDate(iso);
}

/** Up to 2 uppercase initials from a name. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Today's date as YYYY-MM-DD (local). */
export function todayISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
