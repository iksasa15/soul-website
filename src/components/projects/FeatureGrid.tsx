import type { LucideIcon } from "lucide-react";
import { Hexagon } from "@/components/ui/Hexagon";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export function FeatureGrid({
  kicker,
  title,
  items,
  icons,
  className,
}: {
  kicker: string;
  title: string;
  items: { title: string; text: string }[];
  icons: LucideIcon[];
  className?: string;
}) {
  const compact = items.every((i) => !i.text);
  return (
    <section className={cn("relative py-20 sm:py-28", className)}>
      <div className="container-x">
        <SectionHeading kicker={kicker} title={title} align="center" />
        <Stagger
          className={cn(
            "mt-12 grid gap-4",
            compact ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7" : "sm:grid-cols-2 lg:grid-cols-3",
          )}
          stagger={0.06}
        >
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={item.title} className="h-full">
                <article
                  className={cn(
                    "spotlight glass h-full rounded-3xl transition-transform duration-500 hover:-translate-y-1",
                    compact ? "flex flex-col items-center gap-4 p-5 text-center" : "p-7",
                  )}
                >
                  <Hexagon size={compact ? "md" : "lg"}>
                    <Icon />
                  </Hexagon>
                  <h3 className={cn("font-semibold", compact ? "text-sm leading-snug" : "mt-5 text-lg")}>{item.title}</h3>
                  {item.text && <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>}
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
