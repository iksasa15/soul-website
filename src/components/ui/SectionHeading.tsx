import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { nb } from "@/lib/nobreak";

type Props = {
  kicker: string;
  title: string;
  highlight?: string;
  intro?: string;
  align?: "start" | "center";
  className?: string;
  id?: string;
};

export function SectionHeading({ kicker, title, highlight, intro, align = "start", className, id }: Props) {
  const center = align === "center";
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      <Reveal>
        <p className={cn("flex items-center gap-3 text-sm font-semibold text-accent", center && "justify-center")}>
          <span className="h-px w-8 bg-gradient-to-l from-sky to-transparent rtl:bg-gradient-to-r" aria-hidden />
          {kicker}
          {center && <span className="h-px w-8 bg-gradient-to-r from-sky to-transparent rtl:bg-gradient-to-l" aria-hidden />}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 id={id} className="mt-4 text-3xl leading-[1.25] font-semibold sm:text-4xl lg:text-[2.75rem]">
          {nb(title)} {highlight && <span className="text-gradient">{nb(highlight)}</span>}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.12}>
          <p className="mt-5 text-base text-muted sm:text-lg">{nb(intro)}</p>
        </Reveal>
      )}
    </div>
  );
}
