import { Medal } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/get-dictionary";

export function Snapshot({ snapshot }: { snapshot: Dictionary["snapshot"] }) {
  return (
    <section id="snapshot" aria-label="SOUL" className="relative z-10 -mt-6 sm:-mt-10">
      <div className="container-x">
        <Reveal className="glass grid grid-cols-2 overflow-hidden rounded-3xl shadow-soft lg:grid-cols-5">
          {snapshot.items.map((item, i) => (
            <div
              key={item.label}
              className="relative border-line p-6 sm:p-8 [&:not(:last-child)]:border-e max-lg:[&:nth-child(2)]:border-e-0 max-lg:[&:nth-child(-n+2)]:border-b"
            >
              <Counter
                value={item.value}
                grouping={item.value !== 2019}
                duration={i === 0 ? 1.4 : 1.8}
                className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
              />
              <p className="mt-2 text-sm text-muted">{item.label}</p>
            </div>
          ))}
          <div className="col-span-2 flex items-center gap-4 border-t border-line bg-gradient-to-br from-sky/10 to-transparent p-6 sm:p-8 lg:col-span-1 lg:border-t-0">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-400 text-slate-700 shadow-inner">
              <Medal className="size-6" aria-hidden />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">{snapshot.award}</p>
              <p className="text-sm text-muted">{snapshot.awardSub}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
