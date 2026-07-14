export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="mb-1.5 text-[12px] font-extrabold tracking-[0.1em] text-rose-mauve">
          {eyebrow}
        </div>
        <h1 className="font-display text-[28px] font-bold leading-tight text-vin nav:text-[40px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-[15px] text-texte-doux">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
      ) : null}
    </div>
  );
}
