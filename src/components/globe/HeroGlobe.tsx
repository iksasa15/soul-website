"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";

function GlobeFallback({ className }: { className?: string }) {
  return (
    <div className={cn("grid place-items-center", className)} aria-hidden>
      <div className="aspect-square w-[78%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(0_174_239/0.35),rgb(3_22_58/0.15)_55%,transparent_70%)] shadow-[0_0_120px_-20px_rgb(0_174_239/0.6)]" />
    </div>
  );
}

const Globe = dynamic(() => import("./Globe"), { ssr: false });

export function HeroGlobe({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <GlobeFallback className="absolute inset-0" />
      <Globe label={label} className="absolute inset-0" />
    </div>
  );
}
