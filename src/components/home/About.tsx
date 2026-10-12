import { Eye, Target } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Hexagon } from "@/components/ui/Hexagon";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/i18n/get-dictionary";

export function About({ about }: { about: Dictionary["about"] }) {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32">
      <Logo
        variant="mark"
        className="pointer-events-none absolute -end-40 top-10 size-[34rem] animate-spin-slow opacity-[0.04] dark:opacity-[0.06]"
      />
      <div className="container-x relative grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading kicker={about.kicker} title={about.title} highlight={about.titleHighlight} />
          <div className="mt-8 space-y-5 text-lg text-muted">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p className={i === 0 ? "text-fg/90" : undefined}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="grid content-center gap-5">
          {[
            { icon: <Eye />, ...about.vision },
            { icon: <Target />, ...about.mission },
          ].map((card, i) => (
            <Reveal key={card.title} delay={0.1 + i * 0.1} x={i ? -20 : 20} y={0}>
              <article className="spotlight glass rounded-3xl p-7 shadow-soft sm:p-8">
                <div className="flex items-center gap-4">
                  <Hexagon>{card.icon}</Hexagon>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                </div>
                <p className="mt-4 leading-relaxed text-muted">{card.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container-x relative mt-20">
        <Reveal>
          <h3 className="text-center text-sm font-semibold text-accent">{about.valuesTitle}</h3>
        </Reveal>
        <Stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" stagger={0.07}>
          {about.values.map((v, i) => (
            <StaggerItem as="li" key={v.title}>
              <div className="spotlight group h-full rounded-2xl border border-line bg-card/60 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-sky/40">
                <span className="font-display text-sm font-semibold text-accent tabular-nums" dir="ltr">
                  0{i + 1}
                </span>
                <h4 className="mt-3 text-lg font-semibold">{v.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
                <span className="mt-5 block h-px w-10 bg-sky/50 transition-all duration-500 group-hover:w-full" aria-hidden />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
