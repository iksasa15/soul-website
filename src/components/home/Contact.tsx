import { Building2, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmail } from "@/components/contact/CopyEmail";
import { Hexagon } from "@/components/ui/Hexagon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT_EMAIL } from "@/data/projects";
import type { Dictionary } from "@/i18n/get-dictionary";

export function Contact({ contact }: { contact: Dictionary["contact"] }) {
  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute top-0 left-1/2 -z-10 size-[50rem] -translate-x-1/2 rounded-full bg-sky/[0.07] blur-3xl" aria-hidden />
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <SectionHeading kicker={contact.kicker} title={contact.title} highlight={contact.titleHighlight} intro={contact.text} />
          <div className="mt-10 space-y-4">
            <Reveal>
              <div className="glass flex flex-wrap items-center gap-4 rounded-2xl p-5">
                <Hexagon size="sm">
                  <Mail />
                </Hexagon>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted">{contact.emailLabel}</p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="block truncate font-semibold hover:text-accent" dir="ltr">
                    {CONTACT_EMAIL}
                  </a>
                </div>
                <CopyEmail email={CONTACT_EMAIL} copy={contact.copy} copied={contact.copied} />
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="glass flex items-center gap-4 rounded-2xl p-5">
                <Hexagon size="sm">
                  <MapPin />
                </Hexagon>
                <div>
                  <p className="text-xs text-muted">{contact.locationLabel}</p>
                  <p className="font-semibold">{contact.location}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="glass flex items-center gap-4 rounded-2xl p-5">
                <Hexagon size="sm">
                  <Building2 />
                </Hexagon>
                <div>
                  <p className="text-xs text-muted">{contact.sectorLabel}</p>
                  <p className="font-semibold">{contact.sector}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal delay={0.1}>
          <ContactForm t={contact.form} />
        </Reveal>
      </div>
    </section>
  );
}
