import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 font-body font-bold rounded-pill " +
  "cursor-pointer no-underline leading-none whitespace-nowrap select-none " +
  "transition-[transform,box-shadow,background,color,border-color] duration-200 ease-soft " +
  "disabled:opacity-50 disabled:pointer-events-none active:translate-y-0";

const variants: Record<Variant, string> = {
  // CTA — framboise → collapses to vin on hover (DS §7)
  primary:
    "bg-framboise text-white shadow-[0_8px_20px_rgba(214,51,91,0.28)] " +
    "hover:bg-vin hover:-translate-y-0.5 hover:shadow-hover",
  outline:
    "bg-transparent text-prune border-2 border-prune " +
    "hover:bg-prune hover:text-white hover:-translate-y-0.5",
  secondary:
    "bg-rose-bonbon text-vin hover:bg-rose-mauve hover:text-white",
  ghost: "bg-transparent text-prune hover:bg-rose-bonbon-clair",
};

const sizes: Record<Size, string> = {
  // min tactile target 44px (DS §8.4)
  sm: "text-[15px] px-5 min-h-[44px] py-2.5",
  md: "text-base px-6 min-h-[48px] py-3",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", fullWidth, className, children, ...props },
    ref,
  ) {
    const classes = cn(
      base,
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      className,
    );

    if ("href" in props && props.href !== undefined) {
      const { href, ...rest } = props as ButtonAsLink;
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <Link
            href={href}
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={classes}
            {...rest}
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(props as ButtonAsButton)}
      >
        {children}
      </button>
    );
  },
);
