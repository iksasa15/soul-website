"use client";

import { useEffect, useRef } from "react";

/** setInterval that only fires while the returned ref's element is on screen and the tab is visible. */
export function useVisibleInterval<T extends HTMLElement = HTMLDivElement>(cb: () => void, ms: number, { respectReducedMotion = true } = {}) {
  const ref = useRef<T>(null);
  const saved = useRef(cb);
  useEffect(() => {
    saved.current = cb;
  });
  useEffect(() => {
    if (respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    const id = window.setInterval(() => {
      if (visible && !document.hidden) saved.current();
    }, ms);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [ms, respectReducedMotion]);
  return ref;
}
