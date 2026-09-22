import { links, site } from "@/data/site";
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

/*
  Math webring. The ring identifies a member by the fragment, so it is built
  from site.url rather than hardcoded, and the host is used bare to match the
  shape of the placeholder the ring hands out. If the ring turns out to want
  the protocol too, drop the replace.
*/
const webringHost = site.url.replace(/^https?:\/\//, "");
const webring = {
  prev: `https://math-webring.vercel.app/#${webringHost}?nav=prev`,
  ring: `https://math-webring.vercel.app/#${webringHost}`,
  next: `https://math-webring.vercel.app/#${webringHost}?nav=next`,
};

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

      {/*
        The arrows carry an aria-label and the glyph itself is hidden, so a
        screen reader says where the link goes rather than reading out an
        arrow. Each one gets a 24px box so it is not a one character tap
        target. The badge link takes its name from the image alt.
      */}
      <div className="mt-3 flex items-center justify-center gap-2 text-muted-foreground">
        <a
          href={webring.prev}
          aria-label="Previous site in the math webring"
          className="inline-flex size-6 items-center justify-center rounded-sm text-xs transition-colors hover:text-foreground"
        >
          <span aria-hidden>&larr;</span>
        </a>

        <a
          href={webring.ring}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-sm"
        >
          {/*
            A plain img, not next/image: this is a third party SVG, and Next
            does not optimise SVGs anyway, so routing it through the image
            pipeline would only mean declaring a remote host for no gain.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://math-webring.vercel.app/math-webring-pink.svg"
            alt="Math Webring"
            width={24}
            height={24}
            className="h-6 w-auto"
          />
        </a>

        <a
          href={webring.next}
          aria-label="Next site in the math webring"
          className="inline-flex size-6 items-center justify-center rounded-sm text-xs transition-colors hover:text-foreground"
        >
          <span aria-hidden>&rarr;</span>
        </a>
      </div>
    </footer>
  );
}
