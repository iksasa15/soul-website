import { BrainCircuit, Cpu, Stethoscope, Users } from "lucide-react";
import { Hexagon } from "@/components/ui/Hexagon";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/i18n/get-dictionary";

const ICONS = [Stethoscope, BrainCircuit, Cpu, Users];

export function WhySoul({ why }: { why: Dictionary["why"] }) {
  return (
    <section id="why" className="relative py-24 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-bg-soft to-transparent" aria-hidden />
      <div className="container-x">
        <SectionHeading kicker={why.kicker} title={why.title} highlight={why.titleHighlight} align="center" />
        <Stagger className="mt-14 grid gap-5 md:grid-cols-2" stagger={0.1}>
          {why.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <StaggerItem key={item.title} className="h-full">
                <article className="spotlight group glass relative h-full overflow-hidden rounded-3xl p-7 shadow-soft sm:p-9">
                  <span
                    className="pointer-events-none absolute -top-6 font-display text-[7rem] leading-none font-bold text-fg/[0.04] transition-colors duration-500 group-hover:text-sky/10 ltr:right-4 rtl:left-4"
                    dir="ltr"
                    aria-hidden
                  >
                    0{i + 1}
                  </span>
                  <Hexagon size="lg" className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
                    <Icon />
                  </Hexagon>
                  <h3 className="mt-6 text-xl font-semibold sm:text-2xl">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
