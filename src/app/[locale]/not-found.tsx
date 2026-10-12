import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import ar from "@/i18n/dictionaries/ar";
import en from "@/i18n/dictionaries/en";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[80svh] place-items-center pt-28 text-center">
      <div>
        <Logo variant="mark" className="mx-auto size-24 animate-float" />
        <p className="mt-6 font-display text-7xl font-semibold text-gradient" dir="ltr">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold">{ar.notFound.title}</h1>
        <p className="mt-1 text-muted" lang="en" dir="ltr">
          {en.notFound.title}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/ar" className="rounded-full bg-sky px-5 py-2.5 text-sm font-semibold text-white">
            {ar.notFound.home}
          </Link>
          <Link href="/en" lang="en" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold">
            {en.notFound.home}
          </Link>
        </div>
      </div>
    </section>
  );
}
