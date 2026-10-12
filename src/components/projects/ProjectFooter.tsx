import Image from "next/image";
import Link from "next/link";
import { TopicLink } from "@/components/contact/TopicLink";
import { DirArrow } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { nextProject, projectMedia, type ProjectSlug } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { nb } from "@/lib/nobreak";

export function ProjectFooter({ locale, slug, dict }: { locale: Locale; slug: ProjectSlug; dict: Dictionary }) {
  const p = dict.projects.items[slug];
  const next = nextProject(slug);
  const n = dict.projects.items[next];
  const media = projectMedia[next];
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="h-full">
          <div className="stage relative flex h-full flex-col justify-center overflow-hidden rounded-[2rem] border border-white/10 p-8 sm:p-12">
            <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
            <h2 className="relative text-3xl font-semibold sm:text-4xl">
              {dict.projectPage.ctaTitle.split("{name}")[0]}
              <span className="text-gradient" dir="ltr">
                {p.name}
              </span>
              {dict.projectPage.ctaTitle.split("{name}")[1]}
            </h2>
            <p className="relative mt-3 max-w-lg text-white/70">{dict.projectPage.ctaText}</p>
            <div className="relative mt-8">
              <TopicLink
                locale={locale}
                topic={slug}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#052340] transition-transform hover:-translate-y-0.5"
              >
                {dict.projectPage.ctaButton}
                <DirArrow className="size-4" />
              </TopicLink>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <Link
            href={`/${locale}/projects/${next}`}
            className="group spotlight glass relative flex h-full min-h-72 flex-col overflow-hidden rounded-[2rem] p-8"
          >
            <span className="text-sm text-muted">{dict.projectPage.nextProject}</span>
            <span className="mt-2 font-display text-3xl font-semibold" dir="ltr">
              {n.name}
            </span>
            <span className="mt-1 text-sm text-accent">{nb(n.tagline)}</span>
            <Image
              src={media.image}
              alt=""
              width={media.width}
              height={media.height}
              sizes="30vw"
              className="pointer-events-none absolute -bottom-6 h-40 w-auto opacity-90 transition-transform duration-700 group-hover:scale-105 ltr:-right-4 rtl:-left-4 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_75%)]"
            />
            <span className="mt-auto grid size-12 place-items-center rounded-full bg-sky text-white transition-transform group-hover:scale-110">
              <DirArrow className="size-5" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
