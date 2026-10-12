export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/** Returns the same page in another language, e.g. `/ar/projects/neomove` → `/en/projects/neomove`. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && hasLocale(segments[1])) {
    segments[1] = to;
    return segments.join("/") || `/${to}`;
  }
  return `/${to}${pathname === "/" ? "" : pathname}`;
}

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
