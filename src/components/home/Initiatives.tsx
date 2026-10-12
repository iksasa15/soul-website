import { ArrowRight, Baby, HeartPulse, Rocket } from "lucide-react";
import { TopicLink } from "@/components/contact/TopicLink";
import { DirArrow } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

function HeartTrace() {
  return (
    <svg viewBox="0 0 400 120" className="h-24 w-full" aria-hidden>
      <path d="M0 70 H120 L140 70 L155 30 L170 100 L185 15 L200 70 H400" fill="none" stroke="#00aeef" strokeOpacity="0.18" strokeWidth="2" />
      <path
        d="M0 70 H120 L140 70 L155 30 L170 100 L185 15 L200 70 H400"
        fill="none"
        stroke="#5fd4ff"
        strokeWidth="2.5"
        strokeLinejoin="round"
        pathLength={1000}
        className="trace-pulse"
        style={{ strokeDasharray: "250 750", animationDuration: "3s", filter: "drop-shadow(0 0 6px #00aeef)" }}
      />
    </svg>
  );
}

export function Initiatives({ locale, initiatives }: { locale: Locale; initiatives: Dictionary["initiatives"] }) {
  const [hackathon, noor] = initiatives.items;
  return (
    <section id="initiatives" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-bg-soft" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-grid opacity-60 mask-fade-y" aria-hidden />
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-20">
          <SectionHeading kicker={initiatives.kicker} title={initiatives.title} highlight={initiatives.titleHighlight} />
          <div className="space-y-4 text-muted">
            {initiatives.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Stagger className="mt-14 grid gap-5 lg:grid-cols-2" stagger={0.12}>
          <StaggerItem className="h-full">
            <article className="spotlight glass flex h-full flex-col overflow-hidden rounded-3xl shadow-soft">
              <div className="stage relative px-7 pt-7 pb-2">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-rose-300 ring-1 ring-white/15">
                    <HeartPulse className="size-6" aria-hidden />
                  </span>
                  <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-sky ring-1 ring-white/15">
                    <Baby className="size-6" aria-hidden />
                  </span>
                </div>
                <HeartTrace />
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl font-semibold" dir="ltr">
                  <span className={locale === "ar" ? "block text-right" : undefined}>{hackathon.name}</span>
                </h3>
                <p className="mt-1 font-medium text-accent">{hackathon.tagline}</p>
                <p className="mt-4 leading-relaxed text-muted">{hackathon.text}</p>
              </div>
            </article>
          </StaggerItem>
          <StaggerItem className="h-full">
            <article className="spotlight glass flex h-full flex-col overflow-hidden rounded-3xl shadow-soft">
              <div className="stage relative px-7 pt-7 pb-8">
                <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-sky ring-1 ring-white/15">
                  <Rocket className="size-6" aria-hidden />
                </span>
                <ol className="mt-6 flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
                  {noor.steps.map((step, i) => (
                    <li key={step} className="flex flex-1 items-center gap-1.5 sm:gap-2">
                      <span
                        className="w-full rounded-full border border-white/15 bg-white/5 px-2 py-1.5 text-center text-white/85 animate-blink"
                        style={{ animationDelay: `${i * 0.4}s`, animationDuration: "3.2s" }}
                      >
                        {step}
                      </span>
                      {i < noor.steps.length - 1 && <ArrowRight className="size-3.5 shrink-0 text-sky rtl:-scale-x-100" aria-hidden />}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl font-semibold" dir="ltr">
                  <span className={locale === "ar" ? "block text-right" : undefined}>{noor.name}</span>
                </h3>
                <p className="mt-1 font-medium text-accent">{noor.tagline}</p>
                <p className="mt-4 leading-relaxed text-muted">{noor.text}</p>
              </div>
            </article>
          </StaggerItem>
        </Stagger>

        <Reveal className="mt-10 flex justify-center">
          <TopicLink
            locale={locale}
            topic="initiatives"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-semibold transition-colors hover:border-sky hover:text-accent"
          >
            {initiatives.cta}
            <DirArrow className="size-4" />
          </TopicLink>
        </Reveal>
      </div>
    </section>
  );
}
