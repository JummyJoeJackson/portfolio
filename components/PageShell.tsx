import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type PageShellProps = {
  /** Board style title, e.g. "Arrivals". */
  title: string;
  /** Quieter second line, e.g. "(Experience)". */
  subtitle: string;
  icon: LucideIcon;
  children: ReactNode;
};

/**
 * Shared wrapper for the two subpages.
 *
 * No header: the back link and the title are plain text in the content
 * column, with no bar, border or background band. Unlike the home page these
 * are allowed to scroll.
 *
 * The entrance lives here so both subpages inherit it from one place.
 */
export function PageShell({ title, subtitle, icon: Icon, children }: PageShellProps) {
  return (
    /*
      The back link and the title stay at the top, per section 7, and the
      content centres in whatever height is left. The second track is 1fr,
      whose minimum is auto, so once the content is taller than the leftover
      space the track grows with it and the page simply scrolls. Centring
      never clips the top the way a fixed height flex centre would.
    */
    /*
      Full width clipper. A dragged ticket is moved with a transform, which
      does not affect layout but does extend the scrollable area, so without
      this the page grows sideways while you drag. It has to be out here
      rather than on main, which is only as wide as the text column and would
      cut the card off well inside the screen.

      clip rather than hidden, so it pairs with a visible vertical axis and
      creates no scroll container. Scoped to the subpages rather than the root
      layout, so it can never clip the home page's fixed plane overlay.
    */
    <div className="overflow-x-clip">
      <main className="page-enter mx-auto grid min-h-dvh w-full max-w-2xl grid-rows-[auto_1fr] px-6 py-12 md:py-16">
        <div>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              aria-hidden
              className="size-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-x-0.5"
            />
            Back
          </Link>

          <div className="mt-10">
            <h1 className="board-sign flex items-center gap-2 text-lg font-medium md:text-xl">
              <Icon aria-hidden className="size-5 shrink-0" />
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center py-10">
          <div className="w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
