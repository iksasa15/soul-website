"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

type Tag = "div" | "li" | "ul" | "ol" | "section" | "span" | "article" | "p" | "h2" | "h3";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
};

/** Fades and slides its content in once it scrolls into view. */
export function Reveal({ children, className, as = "div", delay = 0, y = 26, x = 0, scale = 1 }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Reveals its <StaggerItem> children one after another. */
export function Stagger({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  stagger?: number;
  delay?: number;
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={container(stagger, delay)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}
