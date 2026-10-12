import Image from "next/image";
import { TopicLink } from "@/components/contact/TopicLink";
import { DirArrow } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export function Partnerships({ locale, partnerships }: { locale: Locale; partnerships: Dictionary["partnerships"] }) {
  const p = partnerships;
  const marquee = [...p.partnerTypes, ...p.partnerTypes];
  return (
    <section id="partnerships" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal y={40}>
          <div className="stage relative overflow-hidden rounded-[2.25rem] border border-white/10 shadow-[0_50px_100px_-40px_rgb(2_10_26/0.7)]">
            <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
            <Image
              src="/images/products/products-collage.jpg"
              alt=""
              width={1186}
              height={1828}
              sizes="40vw"
              className="pointer-events-none absolute top-0 hidden h-full w-auto object-cover opacity-35 [mask-image:linear-gradient(to_left,black_30%,transparent)] ltr:right-0 rtl:left-0 rtl:[mask-image:linear-gradient(to_right,black_30%,transparent)] lg:block"
            />
            <div className="relative grid gap-12 p-7 sm:p-12 lg:grid-cols-[1.25fr_1fr] lg:p-16">
              <div className="min-w-0">
                <p className="flex items-center gap-3 text-sm font-semibold text-sky">
                  <span className="h-px w-8 bg-sky" aria-hidden />
                  {p.kicker}
                </p>
                <h2 className="mt-4 text-3xl leading-[1.25] font-semibold sm:text-5xl">
                  {p.title} <span className="text-gradient">{p.titleHighlight}</span>
                </h2>
                <p className="mt-5 max-w-xl text-lg text-white/75">{p.text}</p>

                <div className="marquee relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                  <ul className="marquee-track flex w-max gap-3">
                    {marquee.map((t, i) => (
                      <li key={i} aria-hidden={i >= p.partnerTypes.length} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm whitespace-nowrap text-white/85">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="mt-12 text-sm font-semibold text-sky">{p.areasTitle}</h3>
                <Stagger as="ol" className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2" stagger={0.05}>
                  {p.areas.map((a, i) => (
                    <StaggerItem as="li" key={a} className="flex items-start gap-3 border-b border-white/10 pb-3 text-white/85">
                      <span className="font-display text-sm font-semibold text-sky tabular-nums" dir="ltr">
                        0{i + 1}
                      </span>
                      <span className="text-sm sm:text-base">{a}</span>
                    </StaggerItem>
                  ))}
                </Stagger>

                <p className="mt-8 max-w-xl text-white/65">{p.closing}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <TopicLink
                    locale={locale}
                    topic="partnership"
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#052340] transition-transform hover:-translate-y-0.5"
                  >
                    {p.ctaPartner}
                    <DirArrow className="size-4" />
                  </TopicLink>
                  <TopicLink
                    locale={locale}
                    topic="investment"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:border-sky"
                  >
                    {p.ctaInvest}
                  </TopicLink>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
