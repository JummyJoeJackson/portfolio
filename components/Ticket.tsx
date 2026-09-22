import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/*
  Boarding pass chrome shared by both subpages.

  The notches are drawn as background filled circles with their own arc, half
  clipped away by the card. They need that arc: --card and --background differ
  by about a percent of lightness, so an unoutlined punch is invisible. Since
  overflow clips to the padding box the card outline stays unbroken behind
  them, which reads as a scalloped notch rather than a torn edge, and is the
  closest a bordered card gets without hand drawing the silhouette.

  No shadow, since section 8 reserves the one soft shadow on the site for the
  place card.
*/

/*
  Minimum size for a ticket, so one is the same object on Arrivals and
  Departures even though an experience carries bullets and a project does not.

  It sits on the ticket rather than on the deck because a min-height on the
  deck only guarantees the deck area, not the card inside it. Two values
  because the stub sits beside the body at md and below it under that, which
  makes a narrow ticket a good deal taller.

  Measured against the tallest placeholder entry, roughly 202px at desktop and
  306px at mobile. Raise these if a real entry outgrows them: that deck grows
  past the floor and the two pages stop matching.
*/
const MIN_TICKET_HEIGHT = "min-h-[20rem] md:min-h-[15rem]";

/**
 * Stable pseudo-random seed from an entry id, so SSR and the client agree.
 *
 * FNV-1a with a murmur3 finalizer. The finalizer is the point: ids usually
 * differ by one character, and a plain rolling hash would turn that into
 * flight numbers that count up, which gives the game away.
 */
function seedFrom(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 2246822507);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 3266489909);
  return (hash ^= hash >>> 16) >>> 0;
}

/** Decorative flight number, derived from the id so it never changes. */
function flightCode(id: string): string {
  return `DG ${(seedFrom(id) % 900) + 100}`;
}

function barcodeBars(id: string, count: number): number[] {
  let state = seedFrom(id) || 1;
  const bars: number[] = [];
  for (let i = 0; i < count; i += 1) {
    state = (state * 1103515245 + 12345) >>> 0;
    bars.push(((state >>> 16) % 3) + 1);
  }
  return bars;
}

function Barcode({ id, className }: { id: string; className?: string }) {
  return (
    <span className={cn("flex items-stretch gap-px", className)}>
      {barcodeBars(id, 24).map((width, index) => (
        <span
          key={index}
          style={{ width: `${width}px` }}
          className="bg-foreground/75"
        />
      ))}
    </span>
  );
}

/** A labelled value, the micro caps label being the strongest ticket cue. */
export function TicketField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="board-label">
        {label}
      </p>
      <div className="mt-0.5 text-sm">{children}</div>
    </div>
  );
}

export function Ticket({
  id,
  children,
  className,
}: {
  /** Entry id, used for the decorative code and barcode. */
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-lg border border-border bg-card md:flex-row",
        MIN_TICKET_HEIGHT,
        className,
      )}
    >
      {/*
        Centred rather than top aligned, because the deck stretches every card
        to a shared height and the contents would otherwise sit against the
        top edge of a half empty ticket.
      */}
      <div className="flex min-w-0 flex-1 flex-col justify-center p-4 md:p-5">
        {children}
      </div>

      {/*
        The stub. Everything in it is decorative and fabricated, so it is
        hidden from assistive technology rather than read out as if it meant
        something.
      */}
      <div
        aria-hidden
        className="relative flex shrink-0 items-center justify-between gap-3 border-t border-dashed border-border px-4 py-3 md:w-28 md:flex-col md:items-start md:justify-center md:border-l md:border-t-0 md:px-4 md:py-5"
      >
        {/*
          Notches, centred on the seam where it meets the card edge, with the
          outer half clipped by the card. The first sits at the same corner of
          the stub in both directions; the second moves from the far end of a
          horizontal seam to the far end of a vertical one.
        */}
        <span className="absolute -left-2 -top-2 size-4 rounded-full border border-border bg-background" />
        <span className="absolute -right-2 -top-2 size-4 rounded-full border border-border bg-background md:bottom-[-0.5rem] md:left-[-0.5rem] md:right-auto md:top-auto" />

        <div>
          <p className="board-label">
            Flight
          </p>
          <p className="mt-0.5 text-sm tabular-nums tracking-wider">
            {flightCode(id)}
          </p>
        </div>

        <Barcode id={id} className="h-6 md:mt-3 md:h-8 md:w-full" />
      </div>
    </div>
  );
}
