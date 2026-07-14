import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  warm?: boolean;
}

/** Surface card — blanc (or crème) background, rose-tinted soft shadow. */
export function Card({
  interactive,
  warm,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card shadow-card",
        warm ? "bg-creme" : "bg-blanc",
        interactive &&
          "transition-[transform,box-shadow] duration-200 ease-soft hover:-translate-y-1.5 hover:shadow-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
