import { links } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Footer links. Deliberately unadorned: same background as the page, no
 * border, no divider, no color band, not sticky. Just centered text.
 *
 * Text only rather than icon plus label, because lucide v1 removed its brand
 * icons, so LinkedIn and GitHub have no mark to pair with.
 */
const footerLinks = [
  { label: "LinkedIn", href: links.linkedin, newTab: true },
  { label: "GitHub", href: links.github, newTab: true },
  { label: "Email", href: `mailto:${links.email}`, newTab: false },
  { label: "Resume", href: links.resume, newTab: true },
] as const;

export function SocialLinks({ className }: { className?: string }) {
  return (
    <footer className={cn("text-center", className)}>
      <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground md:text-sm">
        {footerLinks.map((link, index) => (
          <li key={link.label} className="flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden className="select-none opacity-60">
                ·
              </span>
            ) : null}
            <a
              href={link.href}
              {...(link.newTab
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="rounded-sm transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
