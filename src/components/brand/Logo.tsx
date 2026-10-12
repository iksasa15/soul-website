import { cn } from "@/lib/cn";
import { LOGO_VIEWBOX, MARK_PIECES, MARK_VIEWBOX, TAGLINE_PATH, WORDMARK_PATH } from "./logo-paths";

type LogoProps = {
  className?: string;
  /** "full" = wordmark + tagline + mark, "mark" = the cross only. */
  variant?: "full" | "mark";
  title?: string;
};

/** Official SOUL logo as inline SVG. Colours follow the active theme via CSS variables. */
export function Logo({ className, variant = "full", title = "SOUL" }: LogoProps) {
  const pieces = MARK_PIECES.map((p) => (
    <path key={p.id} d={p.d} fill={p.tone === "sky" ? "var(--logo-sky)" : "var(--logo-navy)"} />
  ));
  if (variant === "mark") {
    return (
      <svg viewBox={MARK_VIEWBOX} className={className} role="img" aria-label={title}>
        {pieces}
      </svg>
    );
  }
  return (
    <svg viewBox={LOGO_VIEWBOX} className={cn("overflow-visible", className)} role="img" aria-label={title}>
      <path d={WORDMARK_PATH} fill="var(--logo-text)" />
      <path d={TAGLINE_PATH} fill="var(--logo-tagline)" />
      {pieces}
    </svg>
  );
}
