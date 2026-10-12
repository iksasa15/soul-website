import type { MetadataRoute } from "next";
import { projectSlugs } from "@/data/projects";
import { locales, siteUrl } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...projectSlugs.map((s) => `/projects/${s}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path ? 0.8 : 1,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])) },
    })),
  );
}
