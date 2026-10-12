"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Mail, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { DirArrow } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CONTACT_EMAIL, projectSlugs } from "@/data/projects";
import { cn } from "@/lib/cn";
import { LanguageSwitch } from "./LanguageSwitch";
import { SectionLink } from "./SectionLink";
import { ThemeToggle } from "./ThemeToggle";
import { ProjectGlyph } from "./ProjectGlyph";

type Props = {
  locale: Locale;
  nav: Dictionary["nav"];
  projects: Dictionary["projects"]["items"];
  social: Dictionary["social"];
};

const SECTIONS = ["about", "projects", "initiatives", "achievements", "team", "partnerships"] as const;

export function Header({ locale, nav, projects, social }: Props) {
  const pathname = usePathname();
  const home = `/${locale}`;
  const isHome = pathname === home;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const labels: Record<(typeof SECTIONS)[number], string> = {
    about: nav.about,
    projects: nav.projects,
    initiatives: nav.initiatives,
    achievements: nav.achievements,
    team: nav.team,
    partnerships: nav.partnersShort,
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    if (!isHome) return;
    const els = [...SECTIONS, "contact"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome, pathname]);

  // Close the mobile menu after navigating (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  const current = isHome ? active : pathname.includes("/projects/") ? "projects" : null;

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (id: string) => `${home}#${id}`;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo",
          scrolled ? "py-2" : "py-4",
        )}
      >
        <div className="container-x">
          <div
            className={cn(
              "flex h-16 items-center justify-between gap-4 rounded-2xl px-3 transition-all duration-500 sm:px-4",
              scrolled ? "glass shadow-soft" : "border border-transparent",
            )}
          >
            <SectionLink href={home} className="flex shrink-0 items-center" aria-label={`SOUL — ${nav.home}`}>
              <Logo className="h-9 w-auto sm:h-10" />
            </SectionLink>

            <nav aria-label={nav.menu} className="hidden lg:block">
              <ul className="flex items-center gap-0.5 text-[0.9rem] font-medium">
                {SECTIONS.map((id) =>
                  id === "projects" ? (
                    <li key={id} className="group relative">
                      <SectionLink
                        href={href(id)}
                        className={cn(
                          "flex items-center gap-1 rounded-full px-3 py-2 transition-colors hover:text-accent",
                          current === id ? "text-accent" : "text-fg/80",
                        )}
                      >
                        {labels[id]}
                        <ChevronDown className="size-3.5 transition-transform duration-300 group-focus-within:rotate-180 group-hover:rotate-180" aria-hidden />
                      </SectionLink>
                      <div className="invisible absolute top-full pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2">
                        <div className="glass w-[22rem] rounded-2xl p-2 shadow-soft">
                          {projectSlugs.map((slug) => (
                            <Link
                              key={slug}
                              href={`${home}/projects/${slug}`}
                              className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-sky/10"
                            >
                              <ProjectGlyph slug={slug} />
                              <span className="min-w-0">
                                <span className="block font-semibold text-fg" dir="ltr">
                                  {projects[slug].name}
                                </span>
                                <span className="block truncate text-xs text-muted">{projects[slug].tagline}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li key={id}>
                      <SectionLink
                        href={href(id)}
                        className={cn(
                          "relative rounded-full px-3 py-2 transition-colors hover:text-accent",
                          current === id ? "text-accent" : "text-fg/80",
                        )}
                      >
                        {labels[id]}
                        {current === id && (
                          <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-sky" />
                        )}
                      </SectionLink>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <LanguageSwitch
                locale={locale}
                label={nav.switchLang}
                short={nav.switchLangShort}
                ariaLabel={nav.switchLangLabel}
                className="hidden sm:inline-flex"
              />
              <ThemeToggle toLight={nav.themeToLight} toDark={nav.themeToDark} />
              <SectionLink
                href={href("contact")}
                className="hidden h-10 items-center gap-2 rounded-full bg-gradient-to-br from-sky to-[#0a6fd6] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgb(0_174_239/0.8)] transition-transform hover:-translate-y-0.5 md:inline-flex"
              >
                {nav.cta}
              </SectionLink>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={nav.menu}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={nav.menu}
            className="fixed inset-0 z-[70] flex flex-col bg-bg/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-60" />
            <div className="container-x relative flex h-20 items-center justify-between">
              <Logo className="h-9 w-auto" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={nav.close}
                className="grid size-10 place-items-center rounded-full border border-line"
                autoFocus
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="container-x relative flex-1 overflow-y-auto pb-8">
              <motion.ul
                className="space-y-1 pt-4"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
              >
                {[...SECTIONS, "contact" as const].map((id) => (
                  <motion.li
                    key={id}
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                    className="border-b border-line"
                  >
                    <SectionLink
                      href={href(id)}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-4 font-display text-2xl font-medium"
                    >
                      {id === "contact" ? nav.contact : id === "partnerships" ? nav.partnerships : labels[id]}
                      <DirArrow className="size-5 text-accent" />
                    </SectionLink>
                    {id === "projects" && (
                      <div className="grid gap-2 pb-4">
                        {projectSlugs.map((slug) => (
                          <Link
                            key={slug}
                            href={`${home}/projects/${slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-xl border border-line p-3"
                          >
                            <ProjectGlyph slug={slug} />
                            <span className="min-w-0">
                              <span className="block font-semibold" dir="ltr">
                                {projects[slug].name}
                              </span>
                              <span className="block truncate text-xs text-muted">{projects[slug].tagline}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <LanguageSwitch locale={locale} label={nav.switchLang} short={nav.switchLangShort} ariaLabel={nav.switchLangLabel} full />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm"
                  dir="ltr"
                >
                  <Mail className="size-4 text-accent" />
                  {CONTACT_EMAIL}
                </a>
                <SocialLinks labels={social} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
