"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SectionLink } from "@/components/layout/SectionLink";
import type { Locale } from "@/i18n/config";

export const TOPIC_EVENT = "soul:topic";

/** Links to the contact form with an inquiry type pre-selected. */
export function TopicLink({
  locale,
  topic,
  className,
  children,
}: {
  locale: Locale;
  topic: string;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const onHome = pathname === `/${locale}`;
  return (
    <SectionLink
      href={onHome ? "#contact" : `/${locale}?topic=${topic}#contact`}
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(TOPIC_EVENT, { detail: topic }))}
    >
      {children}
    </SectionLink>
  );
}
