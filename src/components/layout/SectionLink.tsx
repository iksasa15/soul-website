"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Scrolls to the target section (or the top of the page) without writing `#…` into the URL. */
export function scrollToSection(id: string | null) {
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = id ? document.getElementById(id) : null;
  if (id && !el) return false;
  // Short delay lets a closing menu release its scroll lock first.
  window.setTimeout(() => {
    if (!el) {
      window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
      return;
    }
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }, 40);
  return true;
}

/**
 * Link to a page section. On the current page it scrolls in place and keeps the
 * URL clean, so reopening the site always starts at the hero; on other pages it
 * navigates normally (the hash is tidied up after arrival by ClientEffects).
 */
export function SectionLink({ href, onClick, ...props }: Props) {
  const pathname = usePathname();
  const [path, hash = null] = href.split("#") as [string, string?];
  const samePage = path === "" || path === pathname;

  return (
    <Link
      {...props}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || !samePage || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (scrollToSection(hash || null)) e.preventDefault();
      }}
    />
  );
}
