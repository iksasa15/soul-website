import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { TopicLink } from "@/components/contact/TopicLink";
import { DirArrow } from "@/components/ui/Button";
import { CircuitTraces } from "@/components/ui/CircuitTraces";
import type { ProjectSlug } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { nb } from "@/lib/nobreak";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export function ProjectHero({
  locale,
  slug,
  dict,
  subtitle,
  lead,
  demoHref,
  demoLabel,
  visual,
}: {
  locale: Locale;
  slug: ProjectSlug;
  dict: Dictionary;
  subtitle: string;
  lead?: string;
  demoHref?: string;
  demoLabel?: string;
  visual: ReactNode;
}) {
  const p = dict.projects.items[slug];
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:pb-24">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-grid mask-radial opacity-70" />
        <div className="absolute -top-40 end-0 size-[48rem] rounded-full bg-sky/10 blur-3xl" />
        <CircuitTraces className="absolute inset-x-0 bottom-0 h-48 w-full opacity-50" />
      </div>
      <div className="container-x">
        <Link
          href={`/${locale}#projects`}
          className="hero-anim inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          style={d(0)}
        >
          <ArrowLeft className="size-4 ltr:rotate-0 rtl:rotate-180" aria-hidden />
          {dict.projectPage.back}
        </Link>
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <span className="hero-anim inline-flex rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold text-accent" style={d(0.05)}>
              {p.badge}
            </span>
            <h1 className="hero-anim mt-5 font-display text-5xl font-semibold tracking-tight sm:text-7xl" style={d(0.1)} dir="ltr">
              <span className={locale === "ar" ? "block text-right" : undefined}>{p.name}</span>
            </h1>
            <p className="hero-anim mt-4 text-xl font-medium text-gradient sm:text-2xl" style={d(0.18)}>
              {p.tagline}
            </p>
            <p className="hero-anim mt-2 text-muted" style={d(0.22)}>
              {subtitle}
            </p>
            <div className="hero-anim mt-6 space-y-3 text-fg/80" style={d(0.28)}>
              {lead && <p className="text-lg">{nb(lead)}</p>}
              {p.paragraphs.map((para, i) => (
                <p key={i}>{nb(para)}</p>
              ))}
            </div>
            <div className="hero-anim mt-8 flex flex-wrap gap-3" style={d(0.36)}>
              {demoHref && (
                <a
                  href={demoHref}
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-br from-sky to-[#0a6fd6] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(0_174_239/0.7)] transition-transform hover:-translate-y-0.5"
                >
                  {demoLabel}
                  <DirArrow className="size-4" />
                </a>
              )}
              <TopicLink
                locale={locale}
                topic={slug}
                className="glass inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold transition-colors hover:border-sky/50"
              >
                {dict.projects.contactAbout}
              </TopicLink>
            </div>
          </div>
          <div className="hero-anim relative" style={d(0.2)}>
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}
