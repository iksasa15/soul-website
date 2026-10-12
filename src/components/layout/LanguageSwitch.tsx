"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { otherLocale, switchLocalePath, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

export function LanguageSwitch({
  locale,
  label,
  short,
  ariaLabel,
  full = false,
  className,
}: {
  locale: Locale;
  label: string;
  short: string;
  ariaLabel: string;
  full?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const to = otherLocale(locale);
  return (
    <Link
      href={switchLocalePath(pathname, to)}
      hrefLang={to}
      lang={to}
      aria-label={ariaLabel}
      scroll={false}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border border-line px-3.5 text-sm font-semibold text-fg transition-colors hover:border-sky/60 hover:text-accent",
        className,
      )}
    >
      <Languages className="size-4" aria-hidden />
      <span>{full ? label : short}</span>
    </Link>
  );
}
