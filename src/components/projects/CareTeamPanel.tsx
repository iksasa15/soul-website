"use client";

import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, LoaderCircle, Send, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";

export type CareRequest = { text: string; role?: string; state: "pending" | "done" };

type Props = {
  title: string;
  status: string;
  roles: string[];
  requestsTitle: string;
  requests: CareRequest[];
  idle: string;
  pendingLabel?: string;
  doneLabel: string;
  className?: string;
};

/** Doctors and experts connected to the device, and the essentials they request when the data changes. */
export function CareTeamPanel({ title, status, roles, requestsTitle, requests, idle, pendingLabel, doneLabel, className }: Props) {
  return (
    <div className={cn("glass rounded-2xl p-4 sm:p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-sky/15 text-accent">
            <Stethoscope className="size-5" aria-hidden />
          </span>
          <span className="font-semibold">{title}</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 dark:text-emerald-400">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative size-2 rounded-full bg-emerald-400" />
          </span>
          {status}
        </span>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {roles.map((role) => (
          <li key={role} className="flex items-center gap-2 rounded-full border border-line bg-bg/40 py-1 ps-1 pe-3 text-xs">
            <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-sky to-[#0a6fd6] text-white">
              <UserRound className="size-3.5" aria-hidden />
            </span>
            {role}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs font-semibold text-muted">{requestsTitle}</p>
      <ul className="mt-2 space-y-2" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          {requests.length === 0 ? (
            <motion.li
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-xl border border-dashed border-line p-3 text-sm text-muted"
            >
              <ShieldCheck className="size-4 shrink-0 text-emerald-500" aria-hidden />
              {idle}
            </motion.li>
          ) : (
            requests.map((r) => (
              <motion.li
                key={r.text}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3 rounded-xl border border-sky/25 bg-sky/[0.06] p-3"
              >
                <Send className="mt-0.5 size-4 shrink-0 text-accent rtl:-scale-x-100" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{r.text}</span>
                  {r.role && <span className="mt-0.5 block text-xs text-muted">{r.role}</span>}
                </span>
                <span
                  className={cn(
                    "flex shrink-0 items-center gap-1 text-xs font-semibold",
                    r.state === "done" ? "text-emerald-500 dark:text-emerald-400" : "text-amber-500 dark:text-amber-300",
                  )}
                >
                  {r.state === "done" ? <CircleCheck className="size-3.5" aria-hidden /> : <LoaderCircle className="size-3.5 animate-spin" aria-hidden />}
                  {r.state === "done" ? doneLabel : pendingLabel}
                </span>
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}
