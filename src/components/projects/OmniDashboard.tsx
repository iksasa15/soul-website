"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CalendarClock, LayoutDashboard, Nfc, ScanLine } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/cn";
import { useVisibleInterval } from "@/lib/use-visible-interval";

type T = Dictionary["omniSense"]["dashboard"];
type Status = "ok" | "low" | "expiring";

const BASE: { stock: number; min: number; max: number; expiring?: boolean }[] = [
  { stock: 86, min: 30, max: 120 },
  { stock: 24, min: 40, max: 150 },
  { stock: 61, min: 25, max: 90 },
  { stock: 38, min: 20, max: 60, expiring: true },
  { stock: 112, min: 40, max: 160 },
  { stock: 17, min: 20, max: 50 },
];
const WEEK = [62, 78, 55, 90, 70, 84, 66];

function statusOf(i: number, stock: number): Status {
  if (stock < BASE[i].min) return "low";
  if (BASE[i].expiring) return "expiring";
  return "ok";
}

export function OmniDashboard({ t, simulated }: { t: T; simulated: string }) {
  const [stocks, setStocks] = useState(() => BASE.map((b) => b.stock));
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(0);
  const timer = useRef<number | null>(null);

  const scan = useCallback(() => {
    if (timer.current) return;
    setScanning(true);
    setFound(0);
    let n = 0;
    timer.current = window.setInterval(() => {
      n += 7 + Math.floor(Math.random() * 9);
      if (n >= 312) {
        n = 312;
        window.clearInterval(timer.current!);
        timer.current = null;
        setScanning(false);
        setStocks((s) => s.map((v, i) => Math.max(5, Math.min(BASE[i].max, v + Math.round((Math.random() - 0.55) * 6)))));
      }
      setFound(n);
    }, 60);
  }, []);

  useEffect(() => () => void (timer.current && window.clearInterval(timer.current)), []);
  const ref = useVisibleInterval(scan, 9000);

  const statuses = stocks.map((s, i) => statusOf(i, s));
  const alerts = statuses.map((s, i) => ({ s, i })).filter((a) => a.s !== "ok");

  return (
    <div ref={ref} className="glass overflow-hidden rounded-[2rem] shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <span className="flex items-center gap-2 font-display font-semibold">
          <LayoutDashboard className="size-5 text-accent" aria-hidden />
          <span dir="ltr">OmniSense</span>
          <span className="rounded-full bg-sky/10 px-2 py-0.5 text-xs text-accent">{t.unit}</span>
        </span>
        <button
          type="button"
          onClick={scan}
          disabled={scanning}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-sky to-[#0a6fd6] px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-80"
        >
          <ScanLine className={cn("size-4", scanning && "animate-pulse")} aria-hidden />
          {scanning ? t.scanning : t.scan}
        </button>
      </div>

      <div className="grid gap-px bg-line lg:grid-cols-[1.5fr_1fr]">
        <div className="relative bg-card/80 p-5 sm:p-7">
          {scanning && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <div className="h-1/3 w-full bg-gradient-to-b from-transparent via-sky/15 to-transparent" style={{ animation: "scan-line 1.2s linear infinite" }} />
            </div>
          )}
          <div className="mb-4 flex items-center justify-between text-xs text-muted">
            <span>{t.stock}</span>
            <span>
              {t.lastScan}: {scanning ? "…" : t.justNow}
            </span>
          </div>
          <ul className="space-y-4">
            {t.items.map((name, i) => {
              const st = statuses[i];
              const pct = Math.min(100, (stocks[i] / BASE[i].max) * 100);
              return (
                <li key={name}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <Nfc className="size-3.5 text-subtle" aria-hidden />
                      {name}
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          st === "ok" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                          st === "low" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                          st === "expiring" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                        )}
                      >
                        {st === "ok" ? t.ok : st === "low" ? t.lowStock : t.expiring}
                      </span>
                      <span className="w-9 text-end font-semibold tabular-nums" dir="ltr">
                        {stocks[i]}
                      </span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
                    <motion.div
                      className={cn("h-full rounded-full", st === "low" ? "bg-rose-400" : st === "expiring" ? "bg-amber-400" : "bg-gradient-to-r from-sky to-[#3b8cff]")}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      animate={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid gap-px bg-line">
          <div className="bg-card/80 p-5 sm:p-7">
            <div className="flex items-center gap-4">
              <span className="relative grid size-14 place-items-center">
                <span className={cn("absolute inset-0 rounded-full border border-sky/60", scanning && "animate-wave")} />
                <span className={cn("absolute inset-0 rounded-full border border-sky/60", scanning && "animate-wave [animation-delay:0.8s]")} />
                <Nfc className="size-6 text-accent" aria-hidden />
              </span>
              <div>
                <p className="font-display text-4xl font-semibold tabular-nums" dir="ltr">
                  {found || 312}
                </p>
                <p className="text-sm text-muted">{t.scanned}</p>
              </div>
            </div>
            <div className="mt-6 flex h-20 items-end gap-2" aria-hidden>
              {WEEK.map((v, i) => (
                <motion.span
                  key={i}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-sky/30 to-sky"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${v}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </div>
          </div>
          <div className="bg-card/80 p-5 sm:p-7">
            <p className="text-sm font-semibold">{t.alerts}</p>
            <ul className="mt-3 space-y-2">
              <AnimatePresence initial={false}>
                {alerts.map(({ s, i }) => (
                  <motion.li
                    key={`${i}-${s}`}
                    layout
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border p-2.5 text-sm",
                      s === "low" ? "border-rose-400/30 bg-rose-500/5" : "border-amber-400/30 bg-amber-500/5",
                    )}
                  >
                    {s === "low" ? (
                      <AlertTriangle className="size-4 shrink-0 text-rose-500" aria-hidden />
                    ) : (
                      <CalendarClock className="size-4 shrink-0 text-amber-500" aria-hidden />
                    )}
                    <span className="min-w-0 truncate">
                      <b className="font-semibold">{s === "low" ? t.lowStock : t.expiring}</b> · {t.items[i]}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
      <p className="border-t border-line px-5 py-2.5 text-[11px] text-subtle sm:px-7">{simulated}</p>
    </div>
  );
}
