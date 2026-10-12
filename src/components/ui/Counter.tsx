"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = { value: number; decimals?: number; duration?: number; className?: string; grouping?: boolean };

/** Counts up to `value` the first time it scrolls into view. Uses Western digits in both languages. */
export function Counter({ value, decimals = 0, duration = 1.8, className, grouping = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [display, setDisplay] = useState(value);
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouping });

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const from = value >= 1000 ? Math.round(value * 0.9) : 0;
    const controls = animate(from, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setDisplay });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className} dir="ltr">
      {fmt(display)}
    </span>
  );
}
