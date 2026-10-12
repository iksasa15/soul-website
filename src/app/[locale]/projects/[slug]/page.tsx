import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardioKPage } from "@/components/projects/CardioKPage";
import { NeoMovePage } from "@/components/projects/NeoMovePage";
import { OmniSensePage } from "@/components/projects/OmniSensePage";
import { isProjectSlug, projectSlugs } from "@/data/projects";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale) || !isProjectSlug(slug)) return {};
  const p = getDictionary(locale).projects.items[slug];
  const title = `${p.name} — ${p.tagline}`;
  return {
    title,
    description: p.paragraphs[0],
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: { ar: `/ar/projects/${slug}`, en: `/en/projects/${slug}`, "x-default": `/ar/projects/${slug}` },
    },
    openGraph: { title, description: p.paragraphs[0], url: `/${locale}/projects/${slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale) || !isProjectSlug(slug)) notFound();
  const dict = getDictionary(locale);
  if (slug === "cardio-k") return <CardioKPage locale={locale} dict={dict} />;
  if (slug === "neomove") return <NeoMovePage locale={locale} dict={dict} />;
  return <OmniSensePage locale={locale} dict={dict} />;
}
