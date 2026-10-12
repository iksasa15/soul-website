import { cn } from "@/lib/cn";

// Circuit-board traces with light pulses travelling along them (CSS only).
const TRACES = [
  "M0 260 H180 L230 210 H420 L470 160 H760",
  "M0 300 H240 L290 250 H520 L560 290 H900",
  "M120 340 H360 L400 300 H640 L700 240 H1000",
  "M300 380 H520 L560 340 H820 L860 300 H1200",
  "M520 230 H700 L760 170 H1000 L1040 210 H1200",
  "M0 220 H90 L140 170 H300",
  "M860 380 H1040 L1090 330 H1200",
];

const NODES: [number, number][] = [
  [230, 210], [470, 160], [290, 250], [560, 290], [400, 300], [700, 240], [560, 340], [860, 300], [760, 170], [1040, 210], [140, 170], [1090, 330],
];

export function CircuitTraces({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className={cn("pointer-events-none", className)} aria-hidden>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {TRACES.map((d, i) => (
          <path key={i} d={d} stroke="#00aeef" strokeWidth="1.2" opacity="0.28" />
        ))}
        {TRACES.map((d, i) => (
          <path
            key={`p${i}`}
            d={d}
            pathLength={1000}
            stroke="#5fd4ff"
            strokeWidth="2"
            className="trace-pulse"
            style={{ animationDelay: `${i * 0.9}s`, animationDuration: `${5 + (i % 3)}s`, filter: "drop-shadow(0 0 4px #00aeef)" }}
          />
        ))}
      </g>
      {NODES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#00aeef" opacity="0.7" />
      ))}
    </svg>
  );
}
