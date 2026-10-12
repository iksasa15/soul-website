import { Award, CalendarDays, ChevronDown } from "lucide-react";
import { HeroGlobe } from "@/components/globe/HeroGlobe";
import { SectionLink } from "@/components/layout/SectionLink";
import { ButtonLink } from "@/components/ui/Button";
import { CircuitTraces } from "@/components/ui/CircuitTraces";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LivePotassium } from "./LiveWidgets";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export function Hero({ hero }: { hero: Dictionary["hero"] }) {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-28 lg:pb-24">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-grid mask-radial opacity-80" />
        <div className="absolute -top-56 left-1/2 size-[64rem] -translate-x-1/2 rounded-full bg-sky/[0.09] blur-3xl" />
        <div className="absolute top-1/4 -end-48 size-[36rem] rounded-full bg-[#3b8cff]/10 blur-3xl" />
        <CircuitTraces className="absolute inset-x-0 bottom-0 h-48 w-full opacity-70 sm:h-64" />
      </div>

      <div className="container-x grid items-center gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="relative z-10">
          <p className="hero-anim glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium text-muted sm:text-sm" style={d(0)}>
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky opacity-70" />
              <span className="relative size-2 rounded-full bg-sky" />
            </span>
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 text-[2.5rem] leading-[1.2] font-semibold tracking-tight sm:text-6xl lg:text-[4.1rem] xl:text-[4.5rem] ltr:leading-[1.08] ltr:lg:text-[3.6rem] ltr:xl:text-[4rem]">
            {hero.titleLines.map((line, i) => (
              <span key={line} className="hero-anim block" style={d(0.08 + i * 0.08)}>
                {line}
              </span>
            ))}
            <span className="hero-anim block pb-2 text-gradient" style={d(0.24)}>
              {hero.titleHighlight}
            </span>
          </h1>
          <p className="hero-anim mt-5 max-w-xl text-lg text-fg/85 sm:text-xl" style={d(0.32)}>
            {hero.lead}
          </p>
          <p className="hero-anim mt-3 max-w-xl text-muted" style={d(0.38)}>
            {hero.body}
          </p>
          <div className="hero-anim mt-8 flex flex-wrap items-center gap-3" style={d(0.46)}>
            <ButtonLink href="#projects">{hero.ctaProjects}</ButtonLink>
            <ButtonLink href="#about" variant="secondary" icon={false}>
              {hero.ctaAbout}
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost">
              {hero.ctaPartner}
            </ButtonLink>
          </div>
          <ul className="hero-anim mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" style={d(0.54)}>
            {hero.pills.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-sky" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* The globe is never mirrored, so these cards use physical left/right to sit near their cities. */}
        <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-[40rem]">
          <HeroGlobe label={hero.globeLabel} className="absolute inset-0" />
          <div className="hero-anim absolute right-[-2%] bottom-[24%] hidden sm:block" style={d(0.9)}>
            <div className="glass animate-float flex items-center gap-3 rounded-2xl p-3 pe-4 shadow-soft">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-700 shadow-inner">
                <Award className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold">{hero.floatMedal}</span>
                <span className="block text-xs text-muted" dir="auto">
                  {hero.floatMedalSub}
                </span>
              </span>
            </div>
          </div>
          <div className="hero-anim absolute bottom-[4%] left-[0%]" style={d(1.05)}>
            <LivePotassium label={hero.floatReading} className="animate-float [animation-delay:-2s]" />
          </div>
          <div className="hero-anim absolute top-[6%] right-[0%] hidden md:block" style={d(1.2)}>
            <div className="glass animate-float flex items-center gap-3 rounded-2xl p-3 pe-4 shadow-soft [animation-delay:-4s]">
              <span className="grid size-10 place-items-center rounded-xl bg-sky/15 text-accent">
                <CalendarDays className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold">{hero.floatEvent}</span>
                <span className="block text-xs text-muted">{hero.floatEventSub}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <SectionLink
        href="#snapshot"
        className="hero-anim absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-muted transition-colors hover:text-fg lg:flex"
        style={d(1.3)}
      >
        {hero.scroll}
        <ChevronDown className="size-4 animate-bounce" aria-hidden />
      </SectionLink>
    </section>
  );
}
