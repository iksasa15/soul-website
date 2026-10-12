import { SOCIAL_LINKS } from "@/data/projects";
import { cn } from "@/lib/cn";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M5 3.6a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6ZM3.1 9.4H7V21H3.1V9.4Zm6.3 0h3.7V11h.05c.52-.98 1.79-2 3.68-2 3.94 0 4.67 2.5 4.67 5.8V21h-3.9v-5.5c0-1.3-.02-3-1.86-3-1.86 0-2.14 1.42-2.14 2.9V21H9.4V9.4Z" />
    </svg>
  );
}

type Labels = { instagram: string; linkedin: string };

/** SOUL's Instagram and LinkedIn accounts. `variant="buttons"` shows labels, `"icons"` shows round icon buttons. */
export function SocialLinks({ labels, variant = "icons", className }: { labels: Labels; variant?: "icons" | "buttons"; className?: string }) {
  const items = [
    { href: SOCIAL_LINKS.instagram, label: labels.instagram, Icon: InstagramIcon },
    { href: SOCIAL_LINKS.linkedin, label: labels.linkedin, Icon: LinkedinIcon },
  ];
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map(({ href, label, Icon }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-line text-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-sky/60 hover:text-accent",
              variant === "icons" ? "size-10 justify-center" : "h-10 px-4 text-sm font-semibold",
            )}
          >
            <Icon className="size-[18px]" />
            {variant === "buttons" && <span>{label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
