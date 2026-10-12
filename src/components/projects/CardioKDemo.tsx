"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bell, BrainCircuit, ChartLine, Cpu, House, ShieldAlert, ShieldCheck, User, UserRound, Wifi } from "lucide-react";
import { useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/cn";
import { useVisibleInterval } from "@/lib/use-visible-interval";

type Scenario = "normal" | "high" | "low";
type Risk = "low" | "medium" | "high";
type T = Dictionary["cardioK"]["demo"];

const POINTS = 28;
const MIN = 2.5;
const MAX = 6.5;
const NORMAL: [number, number] = [3.5, 5.0];
const TARGET: Record<Scenario, number> = { normal: 4.2, high: 6.1, low: 2.95 };

const initialSeries = () => Array.from({ length: POINTS }, (_, i) => 4.2 + Math.sin(i / 2.5) * 0.07 + Math.cos(i / 1.3) * 0.03);

function riskOf(v: number): Risk {
  if (v >= NORMAL[0] && v <= NORMAL[1]) return "low";
  if (v >= 3.0 && v <= 5.5) return "medium";
  return "high";
}

const RISK_STYLE: Record<Risk, { text: string; bg: string; stroke: string }> = {
  low: { text: "text-emerald-400", bg: "bg-emerald-400", stroke: "#34d399" },
  medium: { text: "text-amber-400", bg: "bg-amber-400", stroke: "#fbbf24" },
  high: { text: "text-rose-400", bg: "bg-rose-400", stroke: "#fb7185" },
};

// Gauge geometry: 240° arc.
const CX = 100;
const CY = 100;
const R = 78;
const START = 150;
const SWEEP = 240;
const angleFor = (v: number) => START + ((Math.min(MAX, Math.max(MIN, v)) - MIN) / (MAX - MIN)) * SWEEP;
const pt = (deg: number, r = R) => [CX + r * Math.cos((deg * Math.PI) / 180), CY + r * Math.sin((deg * Math.PI) / 180)] as const;
function arc(a0: number, a1: number, r = R) {
  const [x0, y0] = pt(a0, r);
  const [x1, y1] = pt(a1, r);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function Gauge({ value, risk }: { value: number; risk: Risk }) {
  const a = angleFor(value);
  const [nx, ny] = pt(a);
  return (
    <svg viewBox="0 0 200 175" className="w-full">
      <path d={arc(START, START + SWEEP)} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="12" strokeLinecap="round" />
      <path d={arc(angleFor(NORMAL[0]), angleFor(NORMAL[1]))} fill="none" stroke="rgb(52 211 153 / 0.25)" strokeWidth="12" strokeLinecap="round" />
      <motion.path
        d={arc(START, Math.max(START + 0.5, a))}
        fill="none"
        stroke={RISK_STYLE[risk].stroke}
        strokeWidth="12"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 8px ${RISK_STYLE[risk].stroke})` }}
        animate={{ d: arc(START, Math.max(START + 0.5, a)) }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.circle r="7" fill="#fff" animate={{ cx: nx, cy: ny }} transition={{ duration: 0.8, ease: "easeOut" }} />
    </svg>
  );
}

function Trend({ series, risk }: { series: number[]; risk: Risk }) {
  const W = 260;
  const H = 90;
  const y = (v: number) => H - ((v - MIN) / (MAX - MIN)) * H;
  const line = series.map((v, i) => `${i ? "L" : "M"}${((i / (POINTS - 1)) * W).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const color = RISK_STYLE[risk].stroke;
  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} className="w-full">
      <defs>
        <linearGradient id="ck-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y={y(NORMAL[1])} width={W} height={y(NORMAL[0]) - y(NORMAL[1])} fill="rgb(52 211 153 / 0.08)" />
      {[NORMAL[0], NORMAL[1]].map((v) => (
        <line key={v} x1="0" x2={W} y1={y(v)} y2={y(v)} stroke="rgb(52 211 153 / 0.35)" strokeDasharray="3 4" />
      ))}
      <path d={`${line} L${W} ${H} L0 ${H} Z`} fill="url(#ck-area)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={W} cy={y(series[series.length - 1])} r="4" fill={color} />
      {["00:00", "06:00", "12:00", "18:00", "24:00"].map((t, i) => (
        <text key={t} x={(i / 4) * (W - 24) + 2} y={H + 12} fontSize="8" fill="rgb(255 255 255 / 0.4)">
          {t}
        </text>
      ))}
    </svg>
  );
}

export function CardioKDemo({ t, simulated }: { t: T; simulated: string }) {
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [series, setSeries] = useState(initialSeries);

  const ref = useVisibleInterval(
    () => {
      setSeries((s) => {
        const last = s[s.length - 1];
        const target = TARGET[scenario];
        const pull = scenario === "normal" ? 0.22 : 0.07;
        const noise = (Math.random() - 0.5) * (scenario === "normal" ? 0.08 : 0.06);
        const next = last + (target - last) * pull + noise;
        return [...s.slice(1), Math.min(MAX - 0.05, Math.max(MIN + 0.05, next))];
      });
    },
    700,
    { respectReducedMotion: false },
  );

  const value = series[series.length - 1];
  const risk = riskOf(value);
  const drifting = scenario !== "normal" && Math.abs(value - 4.2) > 0.35;
  const statusKey: Scenario = drifting ? scenario : "normal";
  const alertTone: Risk = drifting ? (risk === "low" ? "medium" : risk) : "low";
  const style = RISK_STYLE[alertTone];

  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      {/* Controls + system status */}
      <div className="order-2 lg:order-1">
        <div role="radiogroup" aria-label={t.kicker} className="glass inline-flex flex-wrap gap-1 rounded-2xl p-1.5">
          {(["normal", "high", "low"] as Scenario[]).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={scenario === s}
              onClick={() => setScenario(s)}
              className={cn(
                "relative rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                scenario === s ? "text-white" : "text-muted hover:text-fg",
              )}
            >
              {scenario === s && (
                <motion.span layoutId="ck-scenario" className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky to-[#0a6fd6]" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
              )}
              <span className="relative">{t.scenarios[s]}</span>
            </button>
          ))}
        </div>

        <ul className="mt-8 space-y-3">
          <li className="glass flex items-center gap-4 rounded-2xl p-4">
            <span className="relative grid size-10 place-items-center rounded-xl bg-sky/15 text-accent">
              <Wifi className="size-5" aria-hidden />
              <span className="absolute -top-0.5 -end-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-card" />
            </span>
            <span className="font-medium">{t.sensorLabel}</span>
          </li>
          <li className="glass flex items-center gap-4 rounded-2xl p-4">
            <span className={cn("grid size-10 place-items-center rounded-xl bg-sky/15", drifting ? style.text : "text-accent")}>
              <BrainCircuit className="size-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-muted">{t.aiLabel}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={statusKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="block font-medium"
                  aria-live="polite"
                >
                  {t.alerts[statusKey]}
                </motion.span>
              </AnimatePresence>
            </span>
          </li>
          <li className="glass flex items-center gap-4 rounded-2xl p-4">
            <span className={cn("grid size-10 place-items-center rounded-xl transition-colors", drifting ? "bg-amber-400/15 text-amber-500" : "bg-sky/15 text-accent")}>
              <UserRound className="size-5" aria-hidden />
            </span>
            <span className="flex flex-1 items-center justify-between gap-3">
              <span className="font-medium">{t.risk}</span>
              <span className={cn("flex items-center gap-2 text-sm font-semibold", RISK_STYLE[risk].text)}>
                <span className={cn("size-2 rounded-full", RISK_STYLE[risk].bg, risk !== "low" && "animate-blink")} />
                {t.riskLevels[risk]}
              </span>
            </span>
          </li>
        </ul>
        <p className="mt-6 text-xs text-subtle">{simulated}</p>
      </div>

      {/* Phone */}
      <div className="order-1 mx-auto lg:order-2">
        <div className="relative w-[18.5rem] rounded-[3rem] border border-white/15 bg-[#0b1220] p-3 shadow-[0_50px_100px_-30px_rgb(0_20_60/0.8),inset_0_0_0_2px_rgb(255_255_255/0.04)] sm:w-[20rem]">
          <div className="absolute top-5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden />
          <div className="relative overflow-hidden rounded-[2.4rem] bg-[radial-gradient(120%_70%_at_50%_0%,#0d2d5e,#050b18_70%)] px-4 pt-12 pb-3 text-white">
            <div className="flex items-center justify-between text-sm">
              <span className="font-display font-semibold" dir="ltr">
                {t.appTitle}
              </span>
              <span className="relative">
                <Bell className="size-4 text-white/70" aria-hidden />
                {drifting && <span className={cn("absolute -top-1 -end-1 size-2 rounded-full", style.bg)} />}
              </span>
            </div>

            <div className="relative mx-auto mt-2 w-48">
              <Gauge value={value} risk={risk} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="text-xs text-white/60" dir="ltr">
                  K⁺
                </span>
                <span className="font-display text-4xl font-semibold tabular-nums" dir="ltr">
                  {value.toFixed(1)}
                </span>
                <span className="text-[10px] text-white/50" dir="ltr">
                  mmol/L
                </span>
              </div>
            </div>
            <p className="-mt-3 text-center text-[11px] text-white/55">{t.normalRange}</p>
            <p className={cn("mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold", RISK_STYLE[risk].text)}>
              <span className={cn("size-1.5 rounded-full", RISK_STYLE[risk].bg)} />
              {t.status[statusKey]}
            </p>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold">{t.trend}</span>
                <span className="text-white/45">{t.last}</span>
              </div>
              <div className="mt-2" dir="ltr">
                <Trend series={series} risk={risk} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={statusKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "mt-3 flex items-start gap-2.5 rounded-2xl border p-3 text-[11px] leading-relaxed",
                  drifting ? "border-amber-400/30 bg-amber-400/10" : "border-emerald-400/25 bg-emerald-400/10",
                )}
              >
                {drifting ? (
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden />
                ) : (
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                )}
                <span>
                  <span className="block font-semibold">
                    {t.risk}: {t.riskLevels[risk]}
                  </span>
                  <span className="text-white/70">{t.alerts[statusKey]}</span>
                </span>
              </motion.div>
            </AnimatePresence>

            <nav className="mt-3 flex justify-between border-t border-white/10 px-1 pt-2.5 text-[9px] text-white/45" aria-hidden>
              {[House, ChartLine, Bell, Cpu, User].map((Icon, i) => (
                <span key={i} className={cn("flex flex-col items-center gap-1", i === 0 && "text-sky")}>
                  <Icon className="size-4" />
                  {t.tabs[i]}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
