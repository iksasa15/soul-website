import Link from "next/link";
import { ArrowUp, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CircuitTraces } from "@/components/ui/CircuitTraces";
import { CONTACT_EMAIL, projectSlugs } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { currentYear } from "@/lib/year";

export async function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { footer, nav, contact, projects } = dict;
  const home = `/${locale}`;
  const links = [
    { id: "", label: nav.home },
    { id: "about", label: nav.about },
    { id: "projects", label: nav.projects },
    { id: "initiatives", label: nav.initiatives },
    { id: "achievements", label: nav.achievements },
    { id: "partnerships", label: nav.partnerships },
    { id: "contact", label: nav.contact },
  ];
  const year = await currentYear();

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-bg-soft">
      <CircuitTraces className="absolute inset-x-0 bottom-0 h-64 w-full opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 font-display text-[22vw] leading-none font-bold tracking-tighter text-fg/[0.035] select-none"
        dir="ltr"
      >
        SOUL
      </div>
      <div className="container-x relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="h-12 w-auto" />
            <p className="mt-6 max-w-sm font-display text-lg font-medium">{footer.tagline}</p>
            <p className="mt-2 text-muted">{footer.sub}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-accent">{footer.linksTitle}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.id || "home"}>
                  <Link href={l.id ? `${home}#${l.id}` : home} className="text-muted transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-accent">{footer.projectsTitle}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {projectSlugs.map((slug) => (
                <li key={slug}>
                  <Link href={`${home}/projects/${slug}`} className="text-muted transition-colors hover:text-fg" dir="ltr">
                    {projects.items[slug].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-accent">{footer.contactTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-muted transition-colors hover:text-fg">
                  <Mail className="size-4 shrink-0 text-accent" aria-hidden />
                  <span dir="ltr" className="break-all">
                    {CONTACT_EMAIL}
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted">
                <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
                {contact.location}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            <bdi dir="ltr">© {year} SOUL</bdi> — {footer.rights}
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 transition-colors hover:border-sky/60 hover:text-fg"
          >
            {footer.backToTop}
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
