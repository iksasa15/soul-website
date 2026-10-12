import { Ambulance, Headset, Satellite } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/** NeoMove ⇄ satellite ⇄ medical support team, with signals travelling along the links. */
export function SatelliteLink({ title, text, nodes }: { title: string; text: string; nodes: string[] }) {
  const icons = [Ambulance, Satellite, Headset];
  return (
    <Reveal>
      <div className="glass relative overflow-hidden rounded-[2rem] p-8 shadow-soft sm:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 className="font-display text-3xl font-semibold">{title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{text}</p>
          </div>
          <div className="relative">
            <svg viewBox="0 0 600 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
              <path d="M90 150 Q 200 20 300 50" fill="none" stroke="#00aeef" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="6 8" />
              <path d="M300 50 Q 400 20 510 150" fill="none" stroke="#00aeef" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="6 8" />
              <path d="M90 150 Q 200 20 300 50" fill="none" stroke="#5fd4ff" strokeWidth="3" pathLength={1000} className="trace-pulse" style={{ animationDuration: "2.6s", strokeDasharray: "120 880" }} />
              <path d="M300 50 Q 400 20 510 150" fill="none" stroke="#5fd4ff" strokeWidth="3" pathLength={1000} className="trace-pulse" style={{ animationDuration: "2.6s", animationDelay: "1.3s", strokeDasharray: "120 880" }} />
            </svg>
            <ol className="relative grid grid-cols-3 items-start gap-2 pt-2">
              {nodes.map((n, i) => {
                const Icon = icons[i];
                return (
                  <li key={n} className={i === 1 ? "flex flex-col items-center gap-3 text-center" : "flex flex-col items-center gap-3 pt-20 text-center"}>
                    <span className="relative grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-sky to-[#0a6fd6] text-white shadow-[0_0_30px_rgb(0_174_239/0.5)]">
                      <span className="animate-wave absolute inset-0 rounded-2xl border border-sky" aria-hidden />
                      <Icon className="size-7" aria-hidden />
                    </span>
                    <span className="text-sm font-semibold">{n}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
