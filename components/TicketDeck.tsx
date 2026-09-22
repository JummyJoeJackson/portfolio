"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import {
  Children,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

/** Cards drawn behind the active one. Deeper ones stay mounted but invisible. */
const VISIBLE_BEHIND = 2;
/** Travel before a gesture counts as a drag rather than a click, as on the globe. */
const DRAG_SLOP = 5;
/** Travel, or flick speed, needed to actually send a card away. */
const ADVANCE_PX = 90;
const ADVANCE_VELOCITY = 500;
/** How long the discarded card takes to clear the frame. */
const EXIT_MS = 280;

/*
  Without JavaScript the deck cannot deal cards, so it un-stacks itself back
  into the plain list the page would otherwise have rendered. Doing it from a
  noscript stylesheet rather than from React means the server can ship the
  stacked markup directly and there is no flash of a list collapsing into a
  deck on hydration.
*/
/*
  inert and pointer-events must not reach the server HTML: without JavaScript
  every card is on show, and shipping those would leave all but the first one
  unreadable and unfocusable, which is the opposite of the fallback. They are
  applied only once the client has taken over. Read through
  useSyncExternalStore rather than a setState in an effect, which the React
  Compiler rejects.
*/
const subscribeNever = () => () => {};

const NO_JS_FALLBACK = `<style>
[data-deck]{display:block!important;padding-bottom:0!important}
[data-deck]>*{transform:none!important;opacity:1!important;z-index:auto!important;margin-bottom:1.5rem}
[data-deck-controls]{display:none!important}
</style>`;

export function TicketDeck({
  label,
  children,
  className,
}: {
  /** Names the deck for screen readers, e.g. "Experience tickets". */
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const cards = Children.toArray(children);
  const total = cards.length;

  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState<-1 | 1 | null>(null);
  const reduced = useReducedMotion();
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const dragged = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusId = useId();

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const go = useCallback(
    (delta: 1 | -1, direction: -1 | 1) => {
      if (exit !== null || total < 2) return; // already dealing
      const commit = () => {
        setIndex((value) => (value + delta + total) % total);
        setExit(null);
      };

      // Reduced motion cuts straight to the next card, no fly off.
      if (reduced) {
        commit();
        return;
      }
      setExit(direction);
      timer.current = setTimeout(commit, EXIT_MS);
    },
    [exit, reduced, total],
  );

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1, -1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1, 1);
      }
    },
    [go],
  );

  /** A drag that ends over a link must not also follow it. */
  const swallowDragClick = useCallback((event: ReactMouseEvent) => {
    if (!dragged.current) return;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  if (total === 0) return null;

  return (
    <MotionConfig reducedMotion="user">
      <noscript dangerouslySetInnerHTML={{ __html: NO_JS_FALLBACK }} />

      <section
        aria-roledescription="carousel"
        aria-label={label}
        className={cn("relative", className)}
      >
        {/*
          Every card occupies the same grid cell, so they stack and the deck
          takes the height of the tallest one on its own. No measuring, and no
          jump as shorter cards come forward. The padding leaves room for the
          offset of the cards behind, which transforms do not reserve.
        */}
        <div
          data-deck
          tabIndex={mounted ? 0 : undefined}
          onKeyDown={onKeyDown}
          aria-describedby={statusId}
          className="grid rounded-lg pb-6 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 [&>*]:col-start-1 [&>*]:row-start-1"
        >
          {cards.map((card, position) => {
            const depth = (position - index + total) % total;
            const isActive = depth === 0;
            const hidden = depth > VISIBLE_BEHIND;
            const leaving = isActive && exit !== null;

            return (
              <motion.div
                key={position}
                // Only the front card takes focus or the pointer. The rest are
                // inert, which drops them from the tab order and the
                // accessibility tree in one attribute.
                {...(mounted && !isActive ? { inert: true } : {})}
                style={{ zIndex: total - depth }}
                // Render straight at these values, so the server ships the
                // deck already stacked instead of a list that snaps together
                // on hydration.
                initial={false}
                animate={{
                  x: leaving ? exit * 520 : 0,
                  y: depth * 10,
                  scale: 1 - depth * 0.04,
                  opacity: hidden ? 0 : leaving ? 0 : 1,
                }}
                transition={
                  leaving
                    ? { duration: EXIT_MS / 1000, ease: "easeIn" }
                    : { type: "spring", stiffness: 420, damping: 38 }
                }
                drag={isActive && !leaving && total > 1 ? "x" : false}
                dragSnapToOrigin
                dragElastic={0.18}
                dragMomentum={false}
                onDragStart={() => {
                  dragged.current = false;
                }}
                onDrag={(_, info) => {
                  if (Math.abs(info.offset.x) > DRAG_SLOP) dragged.current = true;
                }}
                onDragEnd={(_, info) => {
                  const far = Math.abs(info.offset.x) > ADVANCE_PX;
                  const fast = Math.abs(info.velocity.x) > ADVANCE_VELOCITY;
                  if (!far && !fast) return; // springs back on its own
                  // Left sends you forward, the way a discarded card reads.
                  if (info.offset.x < 0) go(1, -1);
                  else go(-1, 1);
                }}
                onClickCapture={swallowDragClick}
                className={cn(
                  isActive && total > 1 && "cursor-grab active:cursor-grabbing",
                  mounted && !isActive && "pointer-events-none",
                )}
              >
                {card}
              </motion.div>
            );
          })}
        </div>

        {total > 1 ? (
          <div
            data-deck-controls
            className="mt-4 flex items-center justify-between"
          >
            <button
              type="button"
              onClick={() => go(-1, 1)}
              className="board-label rounded-sm px-2 py-1 transition-colors hover:text-foreground"
            >
              Prev
            </button>

            <p aria-hidden className="board-label tabular-nums">
              {index + 1} / {total}
            </p>
            {/*
              Spoken position. Separate from the visible counter so the reading
              is a sentence rather than two numbers and a slash.
            */}
            <p id={statusId} aria-live="polite" className="sr-only">
              {`Ticket ${index + 1} of ${total}`}
            </p>

            <button
              type="button"
              onClick={() => go(1, -1)}
              className="board-label rounded-sm px-2 py-1 transition-colors hover:text-foreground"
            >
              Next
            </button>
          </div>
        ) : null}
      </section>
    </MotionConfig>
  );
}
