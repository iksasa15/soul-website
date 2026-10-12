"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Compass, FlaskConical, PenTool, Sparkles, Users } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

const ICONS = [Compass, PenTool, FlaskConical, Users];

type Step = { title: string; text: string };

/** The four-step innovation journey; its connecting line fills as the visitor scrolls. */
export function Journey({ steps, outcome }: { steps: Step[]; outcome: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [reached, setReached] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(Math.floor(v * (steps.length + 0.6)));
  });

  return (
    <div ref={ref} className="relative">
      {/* line: vertical on mobile, horizontal on desktop */}
      <div className="absolute top-[1.375rem] bottom-[1.375rem] start-[1.375rem] w-px bg-line lg:bottom-auto lg:h-px lg:w-auto lg:end-[calc((100%-6rem)/5-1.375rem)]" aria-hidden>
        <motion.div
          style={{ scaleY: progress }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-sky to-[#3b8cff] lg:hidden"
        />
        <motion.div
          style={{ scaleX: progress }}
          className="absolute inset-0 hidden bg-gradient-to-r from-sky to-[#3b8cff] ltr:origin-left rtl:origin-right rtl:bg-gradient-to-l lg:block"
        />
      </div>
      <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
        {steps.map((step, i) => {
          const Icon = ICONS[i];
          const on = reached >= i;
          return (
            <li key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-4">
              <span
                className={cn(
                  "relative z-10 grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500",
                  on ? "border-sky bg-sky text-white shadow-[0_0_24px_rgb(0_174_239/0.6)]" : "border-line-strong bg-bg text-muted",
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <div className={cn("transition-opacity duration-500", on ? "opacity-100" : "opacity-60")}>
                <span className="text-xs font-semibold text-accent tabular-nums" dir="ltr">
                  0{i + 1}
                </span>
                <h4 className="mt-1 text-lg font-semibold">{step.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          );
        })}
        <li className="relative flex gap-5 lg:flex-col lg:gap-4">
          <span
            className={cn(
              "relative z-10 grid size-11 shrink-0 place-items-center rounded-full transition-all duration-700",
              reached >= steps.length
                ? "scale-110 bg-gradient-to-br from-sky to-[#3b8cff] text-white shadow-[0_0_40px_rgb(0_174_239/0.75)]"
                : "border border-line-strong bg-bg text-muted",
            )}
          >
            <Sparkles className="size-5" aria-hidden />
          </span>
          <p
            className={cn(
              "self-center font-display text-xl font-semibold transition-all duration-700 lg:self-start",
              reached >= steps.length ? "text-gradient" : "text-muted",
            )}
          >
            {outcome}
          </p>
        </li>
      </ol>
    </div>
  );
}
