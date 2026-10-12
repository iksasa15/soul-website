import Image from "next/image";
import { BookOpen, ClipboardList, CodeXml, Megaphone, PenTool } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/i18n/get-dictionary";

const CORE_ICONS = [ClipboardList, CodeXml, PenTool, BookOpen, Megaphone];

export function Team({ team }: { team: Dictionary["team"] }) {
  const { founder } = team;
  return (
    <section id="team" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-bg-soft" aria-hidden />
      <div className="container-x">
        <SectionHeading kicker={team.kicker} title={team.title} highlight={team.titleHighlight} />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-md" scale={0.96} y={10}>
            <div className="stage relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_80px_-30px_rgb(2_10_26/0.6)]">
              <svg viewBox="0 0 400 400" className="absolute -top-10 -end-10 size-72 opacity-60" aria-hidden>
                <g fill="none" stroke="#00aeef" strokeOpacity="0.35">
                  <circle cx="200" cy="200" r="80" />
                  <circle cx="200" cy="200" r="130" strokeDasharray="4 8" className="origin-center animate-spin-slow" />
                  <circle cx="200" cy="200" r="180" />
                </g>
                {[
                  [120, 150],
                  [260, 110],
                  [300, 230],
                  [170, 300],
                  [90, 240],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#5fd4ff" className="animate-blink" style={{ animationDelay: `${i * 0.3}s` }} />
                ))}
              </svg>
              <Image
                src="/images/team/founder.jpg"
                alt={founder.photoAlt}
                width={734}
                height={1504}
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="relative h-auto w-full [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h3 className="font-display text-3xl font-semibold">{founder.name}</h3>
              <p className="mt-1 text-lg text-accent">{founder.role}</p>
            </Reveal>
            <div className="mt-6 space-y-4 text-muted">
              {founder.bio.map((p, i) => (
                <Reveal key={i} delay={0.06 * i}>
                  <p className={i === 0 ? "text-lg text-fg/90" : undefined}>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <h3 className="font-display text-2xl font-semibold">{team.teamTitle}</h3>
            <p className="mt-4 leading-relaxed text-muted">{team.teamText}</p>
          </Reveal>
          <div className="space-y-10">
            <div>
              <Reveal className="flex items-baseline justify-between">
                <h4 className="font-semibold">{team.coreTitle}</h4>
                <span className="text-sm font-semibold text-accent">{team.coreCount}</span>
              </Reveal>
              <Stagger as="ul" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" stagger={0.06}>
                {team.core.map((role, i) => {
                  const Icon = CORE_ICONS[i];
                  return (
                    <StaggerItem as="li" key={role}>
                      <div className="spotlight glass flex h-full flex-col items-center gap-3 rounded-2xl p-4 text-center text-sm font-medium transition-transform duration-500 hover:-translate-y-1">
                        <Icon className="size-6 text-accent" aria-hidden />
                        {role}
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
            <div>
              <Reveal className="flex items-baseline justify-between">
                <h4 className="font-semibold">{team.advisoryTitle}</h4>
                <span className="text-sm font-semibold text-accent">{team.advisoryCount}</span>
              </Reveal>
              <div className="relative mt-6">
                <span className="absolute inset-x-6 top-7 hidden h-px bg-gradient-to-r from-transparent via-sky/50 to-transparent sm:block" aria-hidden />
                <Stagger as="ul" className="relative grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-7" stagger={0.06}>
                  {team.advisory.map((field) => (
                    <StaggerItem as="li" key={field} className="flex flex-col items-center gap-3 text-center">
                      <svg viewBox="0 0 100 100" className="size-14 overflow-visible" aria-hidden>
                        <path
                          d="M50 4 L90 27 L90 73 L50 96 L10 73 L10 27 Z"
                          className="fill-bg stroke-sky transition-all duration-500 hover:fill-sky/20"
                          strokeWidth="3"
                          style={{ filter: "drop-shadow(0 0 8px rgb(0 174 239 / 0.45))" }}
                        />
                        <circle cx="50" cy="50" r="6" className="fill-sky" />
                      </svg>
                      <span className="text-xs leading-snug text-muted sm:text-sm">{field}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
