import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Journey } from "./Journey";

export function Story({ story }: { story: Dictionary["story"] }) {
  return (
    <section id="story" className="relative py-24 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" aria-hidden />
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-20">
          <SectionHeading kicker={story.kicker} title={story.title} highlight={story.titleHighlight} />
          <div className="space-y-4 text-muted">
            {story.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="mt-16">
          <h3 className="mb-10 font-display text-xl font-semibold">{story.journeyTitle}</h3>
          <Journey steps={story.steps} outcome={story.outcome} />
        </Reveal>
      </div>
    </section>
  );
}
