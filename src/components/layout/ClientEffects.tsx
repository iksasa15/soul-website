"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";

/** Global client behaviour: reduced-motion support and the card spotlight glow. */
export function ClientEffects({ children }: { children: ReactNode }) {
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
