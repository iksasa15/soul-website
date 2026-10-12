import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-sky to-[#0a6fd6] text-white shadow-[0_10px_30px_-10px_rgb(0_174_239/0.7)] hover:shadow-[0_14px_40px_-10px_rgb(0_174_239/0.9)] hover:-translate-y-0.5",
  secondary: "glass text-fg hover:border-sky/50 hover:-translate-y-0.5",
  ghost: "text-accent hover:text-fg px-1",
};

type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  className?: string;
  icon?: boolean;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", className, icon = true, children, ...props }: Props) {
  return (
    <Link
      {...props}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 ease-out-expo",
        variant !== "ghost" && "h-12 px-6",
        styles[variant],
        className,
      )}
    >
      {children}
      {icon && <DirArrow className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />}
    </Link>
  );
}

/** Up-right arrow that points up-left in RTL. */
export function DirArrow({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex rtl:-scale-x-100", className)} aria-hidden>
      <ArrowUpRight className="size-full" />
    </span>
  );
}
