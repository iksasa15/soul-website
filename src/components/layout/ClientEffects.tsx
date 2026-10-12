"use client";

import { MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

/** Global client behaviour: reduced-motion support, the card spotlight glow and URL tidying. */
export function ClientEffects({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // After arriving at a section (e.g. /ar#contact or ?topic=…), drop the hash and topic
  // from the URL so a reload or a reopened tab starts at the hero again.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.hash && !url.searchParams.has("topic")) return;
    const t = window.setTimeout(() => {
      url.hash = "";
      url.searchParams.delete("topic");
      window.history.replaceState(null, "", url.pathname + url.search);
    }, 1500);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!el) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
