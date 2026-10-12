import { Ambulance, HeartPulse, Nfc } from "lucide-react";
import type { ProjectSlug } from "@/data/projects";
import { cn } from "@/lib/cn";

const ICONS = { "cardio-k": HeartPulse, neomove: Ambulance, omnisense: Nfc } as const;

export function ProjectGlyph({ slug, className }: { slug: ProjectSlug; className?: string }) {
  const Icon = ICONS[slug];
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky/20 to-[#3b8cff]/10 text-accent ring-1 ring-sky/25",
        className,
      )}
    >
      <Icon className="size-5" aria-hidden />
    </span>
  );
}
