import Image from "next/image";
import Link from "next/link";
import { Check, Droplet, Printer } from "lucide-react";
import { TopicLink } from "@/components/contact/TopicLink";
import { DirArrow } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projectMedia, projectSlugs, type ProjectSlug } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/cn";
import { LivePotassium, MiniScan, MiniVitals } from "./LiveWidgets";
import { nb } from "@/lib/nobreak";

function Visual({ slug, dict }: { slug: ProjectSlug; dict: Dictionary }) {
  const media = projectMedia[slug];
  const isSensor = slug === "cardio-k";
  return (
    <div className="relative grid h-full min-h-[18rem] place-items-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_50%,rgb(0_174_239/0.22),transparent_70%)]" aria-hidden />
      <div className="absolute inset-0 bg-grid opacity-40 mask-radial" aria-hidden />
      {isSensor && (
        <>
          <span className="absolute size-[70%] rounded-full border border-sky/20" aria-hidden />
          <span className="absolute size-[52%] animate-spin-slow rounded-full border border-dashed border-sky/30" aria-hidden />
        </>
      )}
      <Image
        src={media.image}
        alt={dict.projects.items[slug].name}
        width={media.width}
        height={media.height}
        sizes="(min-width: 1024px) 40vw, 90vw"
        className={cn(
          "relative h-auto transition-transform duration-700 group-hover:scale-[1.03]",
          isSensor
            ? "w-[52%] animate-float drop-shadow-[0_30px_40px_rgb(0_0_0/0.55)]"
            : "w-full [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_55%,transparent_100%)]",
        )}
      />
      <div className="absolute bottom-5 start-5">
        {slug === "cardio-k" && <LivePotassium label={dict.hero.floatReading} />}
        {slug === "neomove" && <MiniVitals connected={dict.neoMove.monitor.connected} />}
        {slug === "omnisense" && <MiniScan label={dict.omniSense.dashboard.scanned} />}
      </div>
    </div>
  );
}

export function Projects({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { projects } = dict;
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading kicker={projects.kicker} title={projects.title} highlight={projects.titleHighlight} intro={projects.intro} align="center" />

        <div className="mt-16 space-y-8 lg:space-y-0">
          {projectSlugs.map((slug, i) => {
            const p = projects.items[slug];
            return (
              <div key={slug} className="lg:sticky lg:pb-10" style={{ top: `${6.5 + i * 1.5}rem` }}>
                <Reveal>
                  <article className="stage group grid overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_80px_-30px_rgb(2_10_26/0.65)] lg:min-h-[34rem] lg:grid-cols-2">
                    <div className="relative flex flex-col p-7 sm:p-10 lg:p-12">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-display font-semibold text-sky tabular-nums" dir="ltr">
                          {projectMedia[slug].number}
                        </span>
                        <span className="h-px w-8 bg-white/25" />
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">{p.badge}</span>
                      </div>
                      <h3 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl" dir="ltr">
                        <span className={cn(locale === "ar" && "block text-right")}>{p.name}</span>
                      </h3>
                      <p className="mt-3 text-lg text-sky">{p.tagline}</p>
                      <p className="mt-5 leading-relaxed text-white/70">{nb(p.paragraphs[0])}</p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {p.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/85">
                            <Check className="size-3.5 text-sky" aria-hidden />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                        <Link
                          href={`/${locale}/projects/${slug}`}
                          className="group/btn inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#052340] transition-transform hover:-translate-y-0.5"
                        >
                          {projects.discover} <span dir="ltr">{p.name}</span>
                          <DirArrow className="size-4" />
                        </Link>
                        <TopicLink
                          locale={locale}
                          topic={slug}
                          className="inline-flex h-12 items-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white/90 transition-colors hover:border-sky hover:text-white"
                        >
                          {projects.contactAbout}
                        </TopicLink>
                      </div>
                    </div>
                    <Visual slug={slug} dict={dict} />
                  </article>
                </Reveal>
              </div>
            );
          })}
        </div>

        <div className="mt-16 lg:mt-10">
          <Reveal className="flex items-center gap-3">
            <span className="rounded-full bg-sky/15 px-3 py-1 text-xs font-semibold text-accent">{projects.comingSoon.label}</span>
            <h3 className="font-display text-xl font-semibold">{projects.comingSoon.title}</h3>
          </Reveal>
          <Stagger className="mt-6 grid gap-4 md:grid-cols-2">
            {projects.comingSoon.items.map((item, i) => {
              const Icon = i === 0 ? Printer : Droplet;
              return (
                <StaggerItem key={item.title}>
                  <article className="group relative flex h-full items-start gap-5 overflow-hidden rounded-3xl border border-dashed border-line-strong p-6 sm:p-7">
                    <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,transparent_0_12px,rgb(0_174_239/0.04)_12px_24px)]" aria-hidden />
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky/10 text-accent ring-1 ring-sky/20">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <div>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                        <span className="size-1.5 animate-blink rounded-full bg-sky" />
                        {projects.comingSoon.label}
                      </span>
                      <h4 className="mt-1.5 text-lg font-semibold">{item.title}</h4>
                      <p className="mt-1.5 text-sm text-muted">{item.text}</p>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
