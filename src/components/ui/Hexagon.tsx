import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Glowing hexagon frame for icons, echoing the company profile's visual language. */
export function Hexagon({ children, className, size = "md" }: { children: ReactNode; className?: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "size-11" : size === "lg" ? "size-20" : "size-14";
  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center text-accent", dim, className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <path
          d="M50 3 L91 26.5 L91 73.5 L50 97 L9 73.5 L9 26.5 Z"
          fill="rgb(0 174 239 / 0.08)"
          stroke="#00aeef"
          strokeOpacity="0.75"
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 6px rgb(0 174 239 / 0.35))" }}
        />
      </svg>
      <span className="relative [&>svg]:size-[45%] grid size-full place-items-center">{children}</span>
    </span>
  );
}
