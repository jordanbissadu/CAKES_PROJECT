import { cn } from "@/lib/utils";

const controlBase =
  "w-full bg-blush border-[1.5px] border-rose-bonbon rounded-input px-3.5 " +
  "text-texte font-body outline-none transition-colors duration-200 " +
  "placeholder:text-texte-doux/70 focus:border-prune " +
  // 16px min font-size prevents iOS zoom (DS §8.3); 48px min height (DS §8.6)
  "text-base min-h-[48px]";

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-bold text-texte">
        {label}
      </label>
      {children}
      {error ? (
        <span className="text-[13px] font-semibold text-framboise">{error}</span>
      ) : null}
    </div>
  );
}

export const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={cn(controlBase, "py-3", className)} {...props} />
);

export const Select = ({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={cn(controlBase, "py-3", className)} {...props}>
    {children}
  </select>
);

export const Textarea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(controlBase, "py-3 min-h-[92px] resize-y", className)}
    {...props}
  />
);
