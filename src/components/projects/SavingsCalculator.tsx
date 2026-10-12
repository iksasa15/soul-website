"use client";

import { RotateCcw, UserRound } from "lucide-react";
import { useId, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { countingImpact, DEFAULT_COUNTING, type CountingInputs } from "@/lib/omnisense";

type T = Dictionary["omniSense"]["calculator"];

const SLIDERS: { key: keyof CountingInputs; min: number; max: number; step: number }[] = [
  { key: "units", min: 1, max: 20, step: 1 },
  { key: "countsPerDay", min: 1, max: 6, step: 1 },
  { key: "nursesPerCount", min: 1, max: 12, step: 1 },
  { key: "hoursPerCount", min: 0.5, max: 6, step: 0.5 },
];

const fmt = (n: number, d = 0) => n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d });

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <output htmlFor={id} className="rounded-lg bg-sky/10 px-2.5 py-0.5 font-display font-semibold text-accent tabular-nums" dir="ltr">
          {fmt(value, step < 1 ? 1 : 0)}
          {suffix}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3 w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

export function SavingsCalculator({ t }: { t: T }) {
  const uid = useId();
  const [inputs, setInputs] = useState<CountingInputs>(DEFAULT_COUNTING);
  const { annualHours, fte, reclaimedHours } = countingImpact(inputs);
  const set = (k: keyof CountingInputs) => (v: number) => setInputs((s) => ({ ...s, [k]: v }));
  const labels: Record<string, string> = {
    units: t.units,
    countsPerDay: t.countsPerDay,
    nursesPerCount: t.nursesPerCount,
    hoursPerCount: t.hoursPerCount,
  };
  const people = Math.min(24, Math.ceil(fte));

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <div className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="space-y-6">
          {SLIDERS.map((s) => (
            <Slider key={s.key} id={`${uid}-${s.key}`} label={labels[s.key]} value={inputs[s.key]} min={s.min} max={s.max} step={s.step} onChange={set(s.key)} />
          ))}
          <div className="border-t border-line pt-6">
            <Slider
              id={`${uid}-reduction`}
              label={t.reduction}
              value={inputs.reductionPercent}
              min={0}
              max={100}
              step={5}
              suffix="%"
              onChange={set("reductionPercent")}
            />
            <p className="mt-1.5 text-xs text-subtle">{t.reductionNote}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setInputs(DEFAULT_COUNTING)}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent"
        >
          <RotateCcw className="size-4" aria-hidden /> {t.reset}
        </button>
      </div>

      <div className="stage relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 p-6 sm:p-8" aria-live="polite">
        <div className="absolute inset-0 bg-grid opacity-25" aria-hidden />
        <div className="relative">
          <p className="font-display text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl" dir="ltr">
            <span className="text-gradient">{fmt(annualHours)}</span>
          </p>
          <p className="mt-2 text-white/70">{t.annualHours}</p>
        </div>
        <div className="relative mt-8">
          <div className="flex items-baseline gap-3">
            <p className="font-display text-4xl font-semibold tabular-nums" dir="ltr">
              {fmt(fte, 1)}
            </p>
            <p className="text-white/70">{t.fte}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden>
            {Array.from({ length: people }, (_, i) => {
              const fill = Math.min(1, Math.max(0, fte - i));
              return (
                <span key={i} className="relative grid size-8 place-items-center rounded-lg bg-white/5 text-white/25">
                  <UserRound className="size-5" />
                  <span className="absolute inset-0 grid place-items-center overflow-hidden text-sky" style={{ clipPath: `inset(${(1 - fill) * 100}% 0 0 0)` }}>
                    <UserRound className="size-5" />
                  </span>
                </span>
              );
            })}
          </div>
        </div>
        <div className="relative mt-8 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-5">
          <p className="font-display text-3xl font-semibold text-emerald-300 tabular-nums" dir="ltr">
            +{fmt(reclaimedHours)}
          </p>
          <p className="mt-1 text-sm text-white/75">{t.reclaimed}</p>
        </div>
        <p className="relative mt-6 text-[11px] leading-relaxed text-white/45">{t.assumption}</p>
      </div>
    </div>
  );
}

