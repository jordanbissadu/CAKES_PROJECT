export function KpiTile({
  label,
  value,
  hint,
  icon,
  iconBg,
}: {
  label: string;
  value: number | string;
  hint: React.ReactNode;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="rounded-card bg-blanc p-5 shadow-card">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[13px] font-bold text-texte-doux">{label}</span>
        <span
          className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[11px]"
          style={{ background: iconBg }}
        >
          {icon}
        </span>
      </div>
      <div className="font-display text-4xl font-bold leading-none text-vin">
        {value}
      </div>
      <div className="mt-2 text-[13px] text-texte-doux">{hint}</div>
    </div>
  );
}
