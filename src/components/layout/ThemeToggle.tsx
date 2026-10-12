"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

export const THEME_KEY = "soul-theme";

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}
const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => null;

/** Reads the current theme (null during SSR). */
export function useIsDark() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

export function ThemeToggle({ toLight, toDark, className }: { toLight: string; toDark: string; className?: string }) {
  const isDark = useIsDark();
  const [, force] = useState(0);

  // Follow the OS setting until the visitor picks a theme explicitly.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      try {
        if (localStorage.getItem(THEME_KEY)) return;
      } catch {}
      applyTheme(mq.matches);
      force((n) => n + 1);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = !document.documentElement.classList.contains("dark");
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      applyTheme(next);
      return;
    }
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || 40;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const t = document.startViewTransition(() => applyTheme(next));
    t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  const label = isDark ? toLight : toDark;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-full border border-line text-fg transition-colors hover:border-sky/60 hover:text-accent",
        className,
      )}
    >
      <Sun className={cn("absolute size-[18px] transition-all duration-500", isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0")} />
      <Moon className={cn("absolute size-[18px] transition-all duration-500", isDark === false ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-90 opacity-0")} />
    </button>
  );
}
