import Image from "next/image";
import { Activity, BellRing, BrainCircuit, ChartSpline, Gauge, HeartPulse, Medal, Microscope, Presentation, Syringe } from "lucide-react";
import { LivePotassium } from "@/components/home/LiveWidgets";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CardioKDemo } from "./CardioKDemo";
import { FeatureGrid } from "./FeatureGrid";
import { ProjectFooter } from "./ProjectFooter";
import { ProjectHero } from "./ProjectHero";
import { nb } from "@/lib/nobreak";

const COMPONENT_IMAGES = [
  { src: "/images/products/cardiok-sensor.png", w: 552, h: 602 },
  { src: "/images/products/cardiok-pump.jpg", w: 360, h: 314 },
  { src: "/images/products/cardiok-phone.jpg", w: 554, h: 1048 },
];

export function CardioKPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.cardioK;
  return (
    <>
      <ProjectHero
        locale={locale}
        slug="cardio-k"
        dict={dict}
        subtitle={c.subtitle}
        demoHref="#demo"
        demoLabel={c.demo.kicker}
        visual={
          <div className="relative mx-auto grid aspect-square w-full max-w-[32rem] place-items-center">
            <span className="absolute size-[92%] rounded-full border border-sky/15" aria-hidden />
            <span className="absolute size-[74%] animate-spin-slow rounded-full border border-dashed border-sky/30" aria-hidden />
            <span className="absolute size-[56%] rounded-full bg-sky/15 blur-3xl" aria-hidden />
            <Image
              src="/images/products/cardiok-sensor.png"
              alt={dict.projects.items["cardio-k"].name}
              width={552}
              height={602}
              priority
              sizes="(min-width: 1024px) 26rem, 70vw"
              className="relative w-[56%] animate-float drop-shadow-[0_40px_50px_rgb(0_20_60/0.45)]"
            />
            <div className="absolute end-0 bottom-[10%]">
              <LivePotassium label={dict.hero.floatReading} />
            </div>
            <div className="glass absolute start-0 top-[12%] flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-semibold shadow-soft">
              <Medal className="size-5 text-slate-400" aria-hidden />
              {dict.hero.floatMedal}
            </div>
          </div>
        }
      />

      <section id="demo" className="relative py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-bg-soft" aria-hidden />
        <div className="container-x">
          <SectionHeading kicker={c.demo.kicker} title={c.demo.title} highlight={c.demo.titleHighlight} intro={c.demo.text} />
          <div className="mt-12">
            <CardioKDemo t={c.demo} simulated={dict.projectPage.simulated} />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading kicker={dict.projects.items["cardio-k"].name} title={c.flowTitle} align="center" />
          <Stagger as="ol" className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
            <span className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-sky/10 via-sky to-sky/10 lg:block" aria-hidden />
            {c.flow.map((step, i) => {
              const Icon = [Activity, HeartPulse, BrainCircuit, BellRing][i];
              return (
                <StaggerItem as="li" key={step} className="relative flex flex-col items-center text-center">
                  <span className="relative grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-sky to-[#0a6fd6] text-white shadow-[0_0_30px_rgb(0_174_239/0.45)]">
                    <span className="animate-wave absolute inset-0 rounded-2xl border border-sky" style={{ animationDelay: `${i * 0.5}s` }} aria-hidden />
                    <Icon className="size-7" aria-hidden />
                  </span>
                  <span className="mt-4 text-xs font-semibold text-accent tabular-nums" dir="ltr">
                    0{i + 1}
                  </span>
                  <span className="mt-1 font-semibold">{step}</span>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <FeatureGrid
        kicker={dict.projects.items["cardio-k"].name}
        title={dict.projectPage.featuresTitle}
        items={c.features}
        icons={[Activity, Gauge, ChartSpline, BrainCircuit, Syringe, HeartPulse]}
      />

      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading kicker={dict.projects.items["cardio-k"].name} title={dict.projectPage.componentsTitle} />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.1}>
            {c.components.map((comp, i) => (
              <StaggerItem key={comp.title} className="h-full">
                <article className="group stage h-full overflow-hidden rounded-[2rem] border border-white/10">
                  <div className="relative grid h-64 place-items-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_50%,rgb(0_174_239/0.25),transparent_70%)]" aria-hidden />
                    <Image
                      src={COMPONENT_IMAGES[i].src}
                      alt={comp.title}
                      width={COMPONENT_IMAGES[i].w}
                      height={COMPONENT_IMAGES[i].h}
                      sizes="(min-width: 768px) 30vw, 90vw"
                      className="relative max-h-56 w-auto transition-transform duration-700 group-hover:scale-105 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_85%)]"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-sky">{comp.title}</h3>
                    <p className="mt-1.5 text-sm text-white/70">{comp.text}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x grid gap-5 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="glass h-full rounded-[2rem] p-8 shadow-soft">
              <p className="text-sm font-semibold text-accent">{dict.projects.targetLabel}</p>
              <p className="mt-3 text-lg leading-relaxed">{dict.projects.items["cardio-k"].target}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <div className="stage h-full rounded-[2rem] border border-white/10 p-8">
              <HeartPulse className="size-9 text-sky" aria-hidden />
              <p className="mt-4 font-display text-2xl font-semibold">{c.impactTitle}</p>
              <p className="mt-3 leading-relaxed text-white/70">{nb(c.impactText)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">{c.milestonesTitle}</h2>
          </Reveal>
          <Stagger className="mt-6 grid gap-4 md:grid-cols-3" stagger={0.08}>
            {c.milestones.map((m, i) => {
              const Icon = [Medal, Presentation, Microscope][i];
              return (
                <StaggerItem key={m.title}>
                  <div className="spotlight glass flex items-center gap-4 rounded-2xl p-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky to-[#0a6fd6] text-white">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-semibold">{m.title}</span>
                      <span className="block text-sm text-muted">{m.place}</span>
                    </span>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <ProjectFooter locale={locale} slug="cardio-k" dict={dict} />
    </>
  );
}
