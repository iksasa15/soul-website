"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/cn";

// Hotspot positions as % of the bed image (screen, IV pole, mattress, equipment bay, frame).
const SPOTS: [number, number][] = [
  [79, 24],
  [62, 12],
  [40, 34],
  [45, 52],
  [61, 64],
];

type Spot = { title: string; text: string };

export function NeoMoveExplorer({ spots, alt }: { spots: Spot[]; alt: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="stage relative overflow-hidden rounded-[2rem] border border-white/10">
        <div className="absolute inset-0 bg-grid opacity-25" aria-hidden />
        <div className="relative">
          <Image
            src="/images/products/neomove-bed.jpg"
            alt={alt}
            width={1468}
            height={1192}
            sizes="(min-width: 1024px) 55vw, 95vw"
            className="h-auto w-full [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,black_60%,transparent_100%)]"
          />
          {SPOTS.map(([x, y], i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-label={spots[i].title}
              aria-pressed={active === i}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span className={cn("absolute inset-0 rounded-full bg-sky/60", active === i ? "animate-pulse-ring" : "animate-wave")} aria-hidden />
              <span
                className={cn(
                  "relative grid size-8 place-items-center rounded-full border-2 text-xs font-bold transition-all duration-300 sm:size-9",
                  active === i ? "scale-110 border-white bg-sky text-white" : "border-sky bg-[#020a1a]/80 text-sky group-hover:bg-sky group-hover:text-white",
                )}
              >
                {i + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-3xl p-7 shadow-soft"
            aria-live="polite"
          >
            <span className="font-display text-5xl font-semibold text-gradient tabular-nums" dir="ltr">
              0{active + 1}
            </span>
            <h3 className="mt-3 text-2xl font-semibold">{spots[active].title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{spots[active].text}</p>
          </motion.div>
        </AnimatePresence>
        <ol className="mt-4 grid grid-cols-5 gap-2">
          {spots.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={cn("h-1.5 w-full rounded-full transition-colors", active === i ? "bg-sky" : "bg-line-strong hover:bg-sky/50")}
                aria-label={s.title}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
