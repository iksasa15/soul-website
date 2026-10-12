import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Gallery } from "./Gallery";
import { Timeline } from "./Timeline";

export function Achievements({ locale, achievements }: { locale: Locale; achievements: Dictionary["achievements"] }) {
  return (
    <section id="achievements" className="relative overflow-x-clip py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading kicker={achievements.kicker} title={achievements.title} highlight={achievements.titleHighlight} align="center" />
        <div className="mt-16">
          <Timeline items={achievements.items} upcomingLabel={achievements.upcoming} upcomingIndex={achievements.items.length - 1} />
        </div>
        <div className="mt-24">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-display text-2xl font-semibold sm:text-3xl">{achievements.galleryTitle}</h3>
            <p className="text-sm text-muted">{achievements.galleryHint}</p>
          </Reveal>
          <Gallery items={achievements.gallery} labels={achievements.lightbox} rtl={locale === "ar"} />
        </div>
      </div>
    </section>
  );
}
