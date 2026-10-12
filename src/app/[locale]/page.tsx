import { notFound } from "next/navigation";
import { About } from "@/components/home/About";
import { Achievements } from "@/components/home/Achievements";
import { Contact } from "@/components/home/Contact";
import { Fields } from "@/components/home/Fields";
import { Hero } from "@/components/home/Hero";
import { Initiatives } from "@/components/home/Initiatives";
import { Partnerships } from "@/components/home/Partnerships";
import { Projects } from "@/components/home/Projects";
import { Snapshot } from "@/components/home/Snapshot";
import { Story } from "@/components/home/Story";
import { Team } from "@/components/home/Team";
import { WhySoul } from "@/components/home/WhySoul";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Hero hero={dict.hero} />
      <Snapshot snapshot={dict.snapshot} />
      <About about={dict.about} />
      <Story story={dict.story} />
      <WhySoul why={dict.why} />
      <Fields fields={dict.fields} />
      <Projects locale={locale} dict={dict} />
      <Initiatives locale={locale} initiatives={dict.initiatives} />
      <Achievements locale={locale} achievements={dict.achievements} />
      <Team team={dict.team} />
      <Partnerships locale={locale} partnerships={dict.partnerships} />
      <Contact contact={dict.contact} />
    </>
  );
}
