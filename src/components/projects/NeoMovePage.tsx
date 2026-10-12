import Image from "next/image";
import { Activity, AlertTriangle, Ambulance, BrainCircuit, HeartPulse, Lightbulb, MonitorSmartphone, Syringe, Video, Wind } from "lucide-react";
import { MiniVitals } from "@/components/home/LiveWidgets";
import { Hexagon } from "@/components/ui/Hexagon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { FeatureGrid } from "./FeatureGrid";
import { NeoMoveExplorer } from "./NeoMoveExplorer";
import { ProjectFooter } from "./ProjectFooter";
import { ProjectHero } from "./ProjectHero";
import { SatelliteLink } from "./SatelliteLink";
import { VitalsMonitor } from "./VitalsMonitor";

export function NeoMovePage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const n = dict.neoMove;
  return (
    <>
      <ProjectHero
        locale={locale}
        slug="neomove"
        dict={dict}
        subtitle={n.subtitle}
        demoHref="#explore"
        demoLabel={n.explore.kicker}
        visual={
          <div className="stage relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_50px_100px_-40px_rgb(2_10_26/0.7)]">
            <div className="absolute inset-0 bg-grid opacity-25" aria-hidden />
            <Image
              src="/images/products/neomove-bed.jpg"
              alt={dict.projects.items.neomove.name}
              width={1468}
              height={1192}
              priority
              sizes="(min-width: 1024px) 45vw, 95vw"
              className="relative h-auto w-full [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,black_60%,transparent_100%)]"
            />
            <div className="absolute bottom-4 start-4">
              <MiniVitals connected={n.monitor.connected} />
            </div>
          </div>
        }
      />

      <section className="py-12 sm:py-16">
        <div className="container-x grid gap-5 md:grid-cols-2">
          {[
            { icon: <AlertTriangle />, title: n.problemTitle, text: n.problem },
            { icon: <Lightbulb />, title: n.solutionTitle, text: n.solution },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08} className="h-full">
              <article className="spotlight glass h-full rounded-[2rem] p-8 shadow-soft">
                <div className="flex items-center gap-4">
                  <Hexagon>{c.icon}</Hexagon>
                  <h2 className="text-2xl font-semibold">{c.title}</h2>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-muted">{c.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="explore" className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading kicker={n.explore.kicker} title={n.explore.title} highlight={n.explore.titleHighlight} intro={n.explore.text} />
          <div className="mt-12">
            <NeoMoveExplorer spots={n.explore.hotspots} alt={dict.projects.items.neomove.name} />
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-bg-soft" aria-hidden />
        <div className="container-x">
          <SectionHeading kicker={n.monitor.kicker} title={n.monitor.title} highlight={n.monitor.titleHighlight} intro={n.monitor.text} />
          <Reveal className="mt-12">
            <VitalsMonitor t={n.monitor} simulated={dict.projectPage.simulated} />
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SatelliteLink title={n.satellite.title} text={n.satellite.text} nodes={n.satellite.nodes} />
        </div>
      </section>

      <FeatureGrid
        kicker={dict.projects.items.neomove.name}
        title={dict.projectPage.featuresTitle}
        items={n.features}
        icons={[Ambulance, HeartPulse, Wind, Syringe, Video, MonitorSmartphone, BrainCircuit]}
      />

      <section className="py-10">
        <div className="container-x">
          <Reveal>
            <p className="mx-auto max-w-3xl text-center font-display text-2xl leading-snug font-semibold sm:text-4xl">
              <Activity className="mx-auto mb-4 size-8 text-sky" aria-hidden />
              <span className="text-gradient">{n.closing}</span>
            </p>
          </Reveal>
        </div>
      </section>

      <ProjectFooter locale={locale} slug="neomove" dict={dict} />
    </>
  );
}
