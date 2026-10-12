import { BrainCircuit, FlaskConical, HeartPulse, Lightbulb, Nfc } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/cn";

const ICONS = [BrainCircuit, HeartPulse, Nfc, FlaskConical, Lightbulb];

/** Animated neural-network motif for the AI tile. */
function NeuralNet() {
  const layers = [
    [30, 70, 110, 150],
    [20, 60, 100, 140, 180],
    [50, 100, 150],
  ];
  const xs = [40, 160, 280];
  const edges: [number, number, number, number][] = [];
  layers.slice(0, -1).forEach((col, li) =>
    col.forEach((y1) => layers[li + 1].forEach((y2) => edges.push([xs[li], y1, xs[li + 1], y2]))),
  );
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00aeef" strokeOpacity="0.18" strokeWidth="1" />
      ))}
      {edges
        .filter((_, i) => i % 3 === 0)
        .map(([x1, y1, x2, y2], i) => (
          <line
            key={`p${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#5fd4ff"
            strokeWidth="1.6"
            pathLength={1000}
            className="trace-pulse"
            style={{ animationDuration: `${2.4 + (i % 4) * 0.5}s`, animationDelay: `${i * 0.35}s` }}
          />
        ))}
      {layers.map((col, li) =>
        col.map((y) => (
          <circle key={`${li}-${y}`} cx={xs[li]} cy={y} r="5" fill="#00aeef" className="animate-blink" style={{ animationDelay: `${(y + li * 40) / 200}s` }} />
        )),
      )}
    </svg>
  );
}

export function Fields({ fields }: { fields: Dictionary["fields"] }) {
  return (
    <section id="fields" className="relative py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading kicker={fields.kicker} title={fields.title} highlight={fields.titleHighlight} />
        <Stagger className="mt-14 grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {fields.items.map((item, i) => {
            const Icon = ICONS[i];
            const big = i === 0;
            return (
              <StaggerItem key={item.title} className={cn(big && "md:col-span-2 lg:col-span-1 lg:row-span-2")}>
                <article
                  className={cn(
                    "spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line p-7 transition-all duration-500 hover:-translate-y-1 hover:border-sky/40",
                    big ? "stage border-transparent" : "bg-card/70",
                  )}
                >
                  {big && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-90">
                      <NeuralNet />
                    </div>
                  )}
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-2xl ring-1 transition-colors duration-500",
                      big ? "bg-white/10 text-sky ring-white/15" : "bg-sky/10 text-accent ring-sky/20 group-hover:bg-sky group-hover:text-white",
                    )}
                  >
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className={cn("mt-5 font-semibold", big ? "text-2xl" : "text-lg")}>{item.title}</h3>
                  <p className={cn("mt-2 leading-relaxed", big ? "max-w-sm text-white/75" : "text-sm text-muted")}>{item.text}</p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
