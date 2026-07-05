"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full whitespace-nowrap select-none transition-colors focus-visible:outline-2 focus-visible:outline-orange disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-orange text-white hover:bg-orange-mid shadow-[0_8px_30px_-8px_rgba(255,107,41,0.6)]",
  outline: "border border-line-strong text-fg hover:bg-glass",
  ghost: "text-fg-muted hover:text-fg hover:bg-glass",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 h-9",
  md: "text-sm px-5 h-11",
  lg: "text-base px-7 h-13 min-h-[52px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & { href: string; external?: boolean };

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { external, href } = props;
    const inner = (
      <motion.span
        whileTap={{ scale: 0.96 }}
        className="inline-flex items-center gap-2"
      >
        {children}
      </motion.span>
    );
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noreferrer">
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as AsButton;
  return (
    <button className={classes} {...rest}>
      <motion.span
        whileTap={{ scale: 0.96 }}
        className="inline-flex items-center gap-2"
      >
        {children}
      </motion.span>
    </button>
  );
}
