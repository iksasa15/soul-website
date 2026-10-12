"use client";

import { useState } from "react";
import { Activity, Satellite } from "lucide-react";
import { cn } from "@/lib/cn";
import { useVisibleInterval } from "@/lib/use-visible-interval";

const SPARK_POINTS = 18;

function sparkPath(values: number[], w: number, h: number, min: number, max: number) {
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/** Small "K⁺ 4.2 mmol/L" card with a drifting sparkline (simulated). */
export function LivePotassium({ label, className }: { label: string; className?: string }) {
  const [values, setValues] = useState(() => Array.from({ length: SPARK_POINTS }, (_, i) => 4.2 + Math.sin(i / 2) * 0.08));
  const ref = useVisibleInterval(() => {
    setValues((v) => {
      const last = v[v.length - 1];
      const next = Math.min(4.45, Math.max(3.95, last + (Math.random() - 0.5) * 0.12 + (4.2 - last) * 0.25));
      return [...v.slice(1), next];
    });
  }, 1400);
  const current = values[values.length - 1];
  return (
    <div ref={ref} className={cn("glass rounded-2xl p-3.5 shadow-soft", className)}>
      <div className="flex items-baseline gap-2" dir="ltr">
        <span className="text-xs font-semibold text-accent">K⁺</span>
        <span className="font-display text-2xl font-semibold tabular-nums">{current.toFixed(1)}</span>
        <span className="text-xs text-muted">mmol/L</span>
      </div>
      <svg viewBox="0 0 120 30" className="mt-1 h-8 w-32" aria-hidden>
        <path d={sparkPath(values, 120, 30, 3.8, 4.6)} fill="none" stroke="#00aeef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
        <span className="size-1.5 rounded-full bg-emerald-400" /> {label}
      </p>
    </div>
  );
}

/** Heart-rate chip with an ECG trace sweeping across (simulated). */
export function MiniVitals({ connected, className }: { connected: string; className?: string }) {
  const [hr, setHr] = useState(92);
  const ref = useVisibleInterval(() => setHr((v) => Math.round(Math.min(104, Math.max(84, v + (Math.random() - 0.5) * 5)))), 1100);
  return (
    <div ref={ref} className={cn("glass rounded-2xl p-3.5 text-fg shadow-soft", className)}>
      <div className="flex items-center gap-3" dir="ltr">
        <Activity className="size-4 text-rose-400" aria-hidden />
        <span className="font-display text-2xl font-semibold tabular-nums">{hr}</span>
        <span className="text-xs text-muted">bpm</span>
      </div>
      <svg viewBox="0 0 160 36" className="mt-1 h-9 w-40 overflow-hidden" aria-hidden>
        <path
          d="M0 20 H30 L36 20 L40 8 L45 30 L50 4 L55 20 H90 L96 20 L100 8 L105 30 L110 4 L115 20 H160"
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
          strokeLinejoin="round"
          pathLength={1000}
          className="trace-pulse"
          style={{ strokeDasharray: "420 580", animationDuration: "2.2s" }}
        />
      </svg>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
        <Satellite className="size-3.5 text-accent" aria-hidden /> {connected}
      </p>
    </div>
  );
}

/** RFID reader waves with a count of tagged items detected (simulated). */
export function MiniScan({ label, className }: { label: string; className?: string }) {
  const [count, setCount] = useState(248);
  const ref = useVisibleInterval(() => setCount((c) => (c >= 312 ? 248 : c + Math.ceil(Math.random() * 6))), 700);
  return (
    <div ref={ref} className={cn("glass flex items-center gap-3 rounded-2xl p-3.5 shadow-soft", className)}>
      <span className="relative grid size-10 place-items-center">
        <span className="animate-wave absolute inset-0 rounded-full border border-sky/70" />
        <span className="animate-wave absolute inset-0 rounded-full border border-sky/70 [animation-delay:0.8s]" />
        <span className="size-2.5 rounded-full bg-sky" />
      </span>
      <div>
        <p className="font-display text-2xl leading-none font-semibold tabular-nums" dir="ltr">
          {count}
        </p>
        <p className="mt-1 text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}
