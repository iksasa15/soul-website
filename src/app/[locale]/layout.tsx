import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Readex_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { IntroSplash } from "@/components/brand/IntroSplash";
import { ClientEffects } from "@/components/layout/ClientEffects";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { InlineScript } from "@/components/layout/InlineScript";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/data/projects";
import { dirOf, hasLocale, locales, siteUrl } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

const readex = Readex_Pro({ subsets: ["arabic", "latin"], variable: "--font-readex", display: "swap" });
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const ensureStatic = "navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { meta } = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: meta.title, template: "%s | SOUL" },
    description: meta.description,
    applicationName: "SOUL",
    alternates: { canonical: `/${locale}`, languages: { ar: "/ar", en: "/en", "x-default": "/ar" } },
    openGraph: {
      type: "website",
      siteName: "SOUL",
      locale: locale === "ar" ? "ar_OM" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_OM",
      title: meta.title,
      description: meta.description,
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f7fc" },
    { media: "(prefers-color-scheme: dark)", color: "#020a1a" },
  ],
  colorScheme: "light dark",
};

// Runs before first paint: applies the saved/system theme, skips the intro for the rest of the
// session, and (unless the URL targets a section or it's a back/forward visit) opens at the hero
// instead of the browser's remembered scroll position.
const bootScript = `(function(){try{var e=document.documentElement,t=localStorage.getItem("soul-theme"),d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";if(sessionStorage.getItem("soul-intro"))e.dataset.intro="done"}catch(_){}try{var h=history,n=performance.getEntriesByType("navigation")[0];if("scrollRestoration"in h){addEventListener("pagehide",function(){h.scrollRestoration="manual"});if(!location.hash&&(!n||n.type!=="back_forward")){h.scrollRestoration="manual";addEventListener("load",function(){setTimeout(function(){h.scrollRestoration="auto"},400)})}}}catch(_){}})()`;

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SOUL",
    alternateName: "SOUL Company",
    slogan: "believers of miracles",
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/logo.svg`,
    email: CONTACT_EMAIL,
    sameAs: Object.values(SOCIAL_LINKS),
    foundingDate: "2019",
    founder: { "@type": "Person", name: dict.team.founder.name },
    address: { "@type": "PostalAddress", addressCountry: "OM" },
    description: dict.meta.description,
  };

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${readex.variable} ${plex.variable}`} suppressHydrationWarning>
      <head>
        <InlineScript html={bootScript} />
      </head>
      <body id="top" className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[80] rounded-full bg-sky font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:px-4 focus:py-2"
        >
          {dict.nav.skip}
        </a>
        <IntroSplash label={dict.intro.label} />
        <ClientEffects>
          <ScrollProgress />
          <Header locale={locale} nav={dict.nav} projects={dict.projects.items} social={dict.social} />
          <main id="main">{children}</main>
          <Footer locale={locale} dict={dict} />
        </ClientEffects>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
