"use client";

import { BrainCircuit, Headset, Satellite } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/cn";
import { useVisibleInterval } from "@/lib/use-visible-interval";

type T = Dictionary["neoMove"]["monitor"];

/** One heartbeat-shaped ECG sample for phase p in [0,1). */
function ecg(p: number) {
  const g = (c: number, w: number, a: number) => a * Math.exp(-((p - c) ** 2) / (2 * w * w));
  return g(0.18, 0.025, 0.12) - g(0.36, 0.008, 0.15) + g(0.4, 0.012, 1) - g(0.44, 0.01, 0.28) + g(0.66, 0.045, 0.28);
}
const pleth = (p: number) => Math.max(0, Math.sin(p * Math.PI * 2 - 0.6)) ** 1.6 * 0.9 + Math.sin(p * Math.PI * 4) * 0.04;

/** Sweeping bedside-monitor waveforms drawn on a canvas. */
function Waves({ hr }: { hr: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hrRef = useRef(hr);
  useEffect(() => {
    hrRef.current = hr;
  }, [hr]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let x = 0;
    let phaseE = 0;
    let phaseP = 0;
    let prev: [number, number] | null = null;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const speed = 120; // px per second

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      const beat = hrRef.current / 60;
      const steps = Math.max(1, Math.round(dt * speed));
      for (let s = 0; s < steps; s++) {
        phaseE = (phaseE + beat / speed) % 1;
        phaseP = (phaseP + beat / speed) % 1;
        const half = h / 2;
        const ye = half * 0.55 - ecg(phaseE) * half * 0.45;
        const yp = half + half * 0.8 - pleth(phaseP) * half * 0.55;
        ctx.clearRect(x, 0, 14, h);
        if (prev) {
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.strokeStyle = "#34d399";
          ctx.shadowColor = "#34d399";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(x - 1, prev[0]);
          ctx.lineTo(x, ye);
          ctx.stroke();
          ctx.strokeStyle = "#38bdf8";
          ctx.shadowColor = "#38bdf8";
          ctx.beginPath();
          ctx.moveTo(x - 1, prev[1]);
          ctx.lineTo(x, yp);
          ctx.stroke();
        }
        prev = [ye, yp];
        x += 1;
        if (x > w) {
          x = 0;
          prev = null;
        }
      }
    };
    if (reduce) {
      // Draw one static strip.
      for (let i = 0; i < w; i++) {
        const p = (i / 120) % 1;
        ctx.fillStyle = "#34d399";
        ctx.fillRect(i, h / 4 - ecg(p) * h * 0.22, 1.5, 1.5);
      }
    } else {
      raf = requestAnimationFrame(draw);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}

export function VitalsMonitor({ t, simulated }: { t: T; simulated: string }) {
  const [tick, setTick] = useState(0);
  const ref = useVisibleInterval(() => setTick((n) => n + 1), 1000);

  // A short heart-rate excursion every ~14 s lets the AI flag a change.
  const cycle = tick % 14;
  const watch = cycle >= 8 && cycle < 12;
  const wobble = (seed: number, amp: number) => Math.sin(tick * 1.7 + seed) * amp;
  const hr = Math.round((watch ? 112 : 94) + wobble(1, 2.5));
  const spo2 = Math.round(97 + wobble(2, 1));
  const sys = Math.round(118 + wobble(3, 3));
  const dia = Math.round(76 + wobble(4, 2));
  const rr = Math.round(17 + wobble(5, 1.4));
  const temp = (36.9 + wobble(6, 0.1)).toFixed(1);
  const eta = 12 - (Math.floor(tick / 5) % 12);

  return (
    <div ref={ref} className="stage overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_50px_100px_-40px_rgb(2_10_26/0.7)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 text-xs sm:px-7">
        <span className="flex items-center gap-2 font-semibold">
          <span className="size-2 animate-blink rounded-full bg-rose-400" />
          {t.transfer}
        </span>
        <span className="flex items-center gap-4 text-white/70">
          <span>
            {t.eta}{" "}
            <b className="text-white tabular-nums" dir="ltr">
              {eta}
            </b>{" "}
            {t.minutes}
          </span>
          <span className="flex items-center gap-1.5">
            <Satellite className="size-4 text-sky" aria-hidden />
            {t.satellite}
            <span className="flex items-end gap-0.5" aria-hidden>
              {[1, 2, 3, 4].map((b) => (
                <span key={b} className={cn("w-1 rounded-sm bg-emerald-400", b === 4 && tick % 3 === 0 && "opacity-40")} style={{ height: `${b * 3 + 2}px` }} />
              ))}
            </span>
          </span>
        </span>
      </div>
      <div className="grid gap-px bg-white/10 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative h-56 bg-[#030d22] sm:h-72" dir="ltr">
          <span className="absolute top-3 left-4 text-[10px] font-semibold tracking-wider text-emerald-400">ECG II</span>
          <span className="absolute top-1/2 left-4 mt-2 text-[10px] font-semibold tracking-wider text-sky-400">PLETH</span>
          <Waves hr={hr} />
        </div>
        <div className="grid grid-cols-2 gap-px bg-white/10">
          {[
            { label: t.hr, value: hr, unit: "bpm", color: watch ? "text-amber-300" : "text-emerald-400", big: true },
            { label: t.spo2, value: spo2, unit: "%", color: "text-sky-400", big: true },
            { label: t.bp, value: `${sys}/${dia}`, unit: "mmHg", color: "text-rose-300" },
            { label: t.rr, value: rr, unit: "/min", color: "text-amber-200" },
            { label: t.temp, value: temp, unit: "°C", color: "text-white" },
            { label: t.satellite, value: t.connected, unit: "", color: "text-emerald-400" },
          ].map((v) => (
            <div key={v.label} className="bg-[#030d22] p-4">
              <p className="text-[11px] text-white/55">{v.label}</p>
              <p className={cn("mt-1 font-display font-semibold tabular-nums rtl:text-right", v.color, v.big ? "text-3xl" : "text-xl")} dir={v.unit ? "ltr" : undefined}>
                {v.value}
                {v.unit && <span className="ms-1 text-[10px] font-normal text-white/45">{v.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <span className={cn("flex items-center gap-2 font-medium transition-colors", watch ? "text-amber-300" : "text-emerald-300")} aria-live="polite">
          <BrainCircuit className="size-4" aria-hidden />
          {watch ? t.aiWatch : t.aiOk}
        </span>
        <span className="flex items-center gap-2 text-white/60">
          <Headset className="size-4 text-sky" aria-hidden />
          {t.remote}
        </span>
      </div>
      <p className="border-t border-white/10 px-5 py-2.5 text-[11px] text-white/45 sm:px-7">{simulated}</p>
    </div>
  );
}
