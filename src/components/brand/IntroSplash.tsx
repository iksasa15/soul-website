"use client";

import { useEffect, useState } from "react";
import { MARK_PIECES, TAGLINE_PATH, WORDMARK_PATH } from "./logo-paths";

const FLAG = "soul-intro";
const TOTAL_MS = 2400;

// Where each cross piece flies in from (SVG user units) before snapping into place.
const ORIGINS: Record<string, { dx: number; dy: number; r: number; delay: number }> = {
  sky_top: { dx: -60, dy: -90, r: -30, delay: 0.04 },
  sky_left_up: { dx: -110, dy: -30, r: 24, delay: 0.12 },
  sky_left_down: { dx: -110, dy: 30, r: -24, delay: 0.2 },
  sky_bottom: { dx: -60, dy: 90, r: 30, delay: 0.28 },
  navy_top: { dx: 60, dy: -90, r: 30, delay: 0.08 },
  navy_right_up: { dx: 110, dy: -30, r: -24, delay: 0.16 },
  navy_right_down: { dx: 110, dy: 30, r: 24, delay: 0.24 },
  navy_bottom: { dx: 60, dy: 90, r: -30, delay: 0.32 },
};

function finish() {
  document.documentElement.dataset.intro = "done";
}

/**
 * First-visit splash: the logo's cross assembles, then the wordmark appears.
 * Pure CSS animation (runs before hydration). A head script hides it for the
 * rest of the session; reduced-motion users never see it.
 */
export function IntroSplash({ label }: { label: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(FLAG, "1");
    } catch {}
    if (document.documentElement.dataset.intro === "done") return;
    const t = window.setTimeout(() => {
      finish();
      setGone(true);
    }, TOTAL_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro" aria-hidden="true" onClick={finish}>
      <span className="sr-only">{label}</span>
      <div className="relative flex flex-col items-center">
        <span className="intro-ring absolute top-1/2 left-1/2 -mt-24 -ml-24 h-48 w-48 rounded-full border border-sky/60" />
        <svg viewBox="30 34 741 276" className="w-[min(78vw,420px)] overflow-visible">
          <g className="intro-word">
            <path d={WORDMARK_PATH} fill="#ffffff" />
          </g>
          <g className="intro-tag">
            <path d={TAGLINE_PATH} fill="#29b6f0" />
          </g>
          {MARK_PIECES.map((p) => {
            const o = ORIGINS[p.id];
            return (
              <path
                key={p.id}
                d={p.d}
                className="intro-piece"
                fill={p.tone === "sky" ? "#00aeef" : "#1166a8"}
                style={
                  {
                    "--dx": `${o.dx}px`,
                    "--dy": `${o.dy}px`,
                    "--r": `${o.r}deg`,
                    "--delay": `${o.delay}s`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
