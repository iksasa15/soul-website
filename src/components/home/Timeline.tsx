"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { Award, Globe2, Medal, Microscope, Presentation } from "lucide-react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { nb } from "@/lib/nobreak";

const ICONS = [Medal, Presentation, Award, Globe2, Microscope];

type Item = { title: string; place: string; text: string };

export function Timeline({ items, upcomingLabel, upcomingIndex }: { items: Item[]; upcomingLabel: string; upcomingIndex: number }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative mx-auto max-w-5xl">
      <span className="absolute top-2 bottom-2 start-6 w-px bg-line lg:start-1/2" aria-hidden>
        <motion.span style={{ scaleY }} className="absolute inset-0 origin-top bg-gradient-to-b from-sky via-[#3b8cff] to-sky" />
      </span>
      {items.map((item, i) => {
        const Icon = ICONS[i] ?? Award;
        const upcoming = i === upcomingIndex;
        const right = i % 2 === 1;
        return (
          <li key={item.title} className="relative grid grid-cols-[3rem_1fr] gap-5 pb-12 last:pb-0 lg:grid-cols-[1fr_4rem_1fr] lg:gap-0">
            <div className={cn("hidden lg:block", right && "lg:order-3")} />
            <div className="relative z-10 flex justify-center lg:order-2">
              <span
                className={cn(
                  "relative grid size-12 place-items-center rounded-full border-4 border-bg shadow-[0_0_0_1px_var(--line-strong)]",
                  upcoming ? "bg-bg text-accent" : "bg-gradient-to-br from-sky to-[#0a6fd6] text-white",
                )}
              >
                {upcoming && <span className="absolute -inset-1 animate-pulse-ring rounded-full border border-sky" aria-hidden />}
                <Icon className="size-5" aria-hidden />
              </span>
            </div>
            <Reveal className={cn(right ? "lg:order-1 lg:pe-8 lg:text-end" : "lg:order-3 lg:ps-8")} x={right ? 30 : -30} y={0}>
              <article className="spotlight glass rounded-3xl p-6 shadow-soft sm:p-7">
                <div className={cn("flex flex-wrap items-center gap-2", right && "lg:justify-end")}>
                  <span className="rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold text-accent">{item.place}</span>
                  {upcoming && (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
                      <span className="size-1.5 animate-blink rounded-full bg-amber-400" />
                      {upcomingLabel}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold sm:text-xl">{nb(item.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{nb(item.text)}</p>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
