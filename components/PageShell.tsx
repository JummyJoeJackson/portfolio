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
    <main className="page-enter mx-auto w-full max-w-2xl px-6 py-12 md:py-16">
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

      <div className="mt-10">{children}</div>
    </main>
  );
}
