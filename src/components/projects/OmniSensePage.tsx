import Image from "next/image";
import { BarChart3, Bell, CalendarClock, FileBarChart, LayoutDashboard, Nfc, ShieldCheck } from "lucide-react";
import { MiniScan } from "@/components/home/LiveWidgets";
import { Counter } from "@/components/ui/Counter";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { FeatureGrid } from "./FeatureGrid";
import { OmniDashboard } from "./OmniDashboard";
import { ProjectFooter } from "./ProjectFooter";
import { ProjectHero } from "./ProjectHero";
import { SavingsCalculator } from "./SavingsCalculator";

const COMPONENT_IMAGES = [
  { src: "/images/products/omnisense-laundry.jpg", w: 498, h: 242 },
  { src: "/images/products/omnisense-cabletie.jpg", w: 472, h: 262 },
  { src: "/images/products/omnisense-labels.jpg", w: 298, h: 308 },
  { src: "/images/products/omnisense-reader.jpg", w: 518, h: 708 },
];

export function OmniSensePage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const o = dict.omniSense;
  return (
    <>
      <ProjectHero
        locale={locale}
        slug="omnisense"
        dict={dict}
        subtitle={o.subtitle}
        lead={o.lead}
        demoHref="#dashboard"
        demoLabel={o.dashboard.kicker}
        visual={
          <div className="stage relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_50px_100px_-40px_rgb(2_10_26/0.7)]">
            <Image
              src="/images/products/omnisense-hero.jpg"
              alt={dict.projects.items.omnisense.name}
              width={1188}
              height={1028}
              priority
              sizes="(min-width: 1024px) 45vw, 95vw"
              className="h-auto w-full [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_60%,transparent_100%)]"
            />
            <div className="absolute start-4 bottom-4">
              <MiniScan label={o.dashboard.scanned} />
            </div>
          </div>
        }
      />

      <section className="py-12 sm:py-16">
        <div className="container-x grid gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="stage relative h-full overflow-hidden rounded-[2rem] border border-white/10 p-8 sm:p-10">
              <div className="absolute inset-0 bg-grid opacity-25" aria-hidden />
              <Counter value={13104} className="relative font-display text-6xl font-semibold tracking-tight text-gradient sm:text-7xl" />
              <p className="relative mt-3 max-w-sm text-lg text-white/75">{o.stats.hours}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <div className="glass h-full rounded-[2rem] p-8 shadow-soft sm:p-10">
              <p className="text-muted">{o.stats.fteLead}</p>
              <Counter value={6.3} decimals={1} className="font-display text-6xl font-semibold tracking-tight sm:text-7xl" />
              <p className="mt-3 max-w-sm text-lg text-muted">{o.stats.fte}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="dashboard" className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading kicker={o.dashboard.kicker} title={o.dashboard.title} highlight={o.dashboard.titleHighlight} intro={o.dashboard.text} />
          <Reveal className="mt-12">
            <OmniDashboard t={o.dashboard} simulated={dict.projectPage.simulated} />
          </Reveal>
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-bg-soft" aria-hidden />
        <div className="container-x">
          <SectionHeading kicker={o.calculator.kicker} title={o.calculator.title} highlight={o.calculator.titleHighlight} intro={o.calculator.text} />
          <Reveal className="mt-12">
            <SavingsCalculator t={o.calculator} />
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading kicker={dict.projects.items.omnisense.name} title={dict.projectPage.componentsTitle} />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {o.components.map((comp, i) => (
              <StaggerItem key={comp.title} className="h-full">
                <article className="group stage h-full overflow-hidden rounded-[2rem] border border-white/10">
                  <div className="relative grid h-52 place-items-center overflow-hidden p-4">
                    <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_50%,rgb(0_174_239/0.22),transparent_70%)]" aria-hidden />
                    <Image
                      src={COMPONENT_IMAGES[i].src}
                      alt={comp.title}
                      width={COMPONENT_IMAGES[i].w}
                      height={COMPONENT_IMAGES[i].h}
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="relative max-h-44 w-auto rounded-xl object-contain transition-transform duration-700 group-hover:scale-105 [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_100%)]"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-sky">{comp.title}</h3>
                    <p className="mt-1.5 text-sm text-white/70">{comp.text}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <FeatureGrid
        kicker={dict.projects.items.omnisense.name}
        title={dict.projectPage.featuresTitle}
        items={o.features}
        icons={[Nfc, LayoutDashboard, Bell, CalendarClock, FileBarChart, ShieldCheck]}
      />

      <section className="py-10">
        <div className="container-x">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <BarChart3 className="mx-auto mb-4 size-8 text-sky" aria-hidden />
              <p className="font-display text-3xl leading-snug font-semibold sm:text-5xl">
                {o.closing.map((line, i) => (
                  <span key={line} className={i === 1 ? "block text-gradient" : "block"}>
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <ProjectFooter locale={locale} slug="omnisense" dict={dict} />
    </>
  );
}
