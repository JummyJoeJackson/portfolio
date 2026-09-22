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
/** Offset and shrink applied per card of depth, which is what gives the pile depth. */
const DEPTH_Y = 10;
const DEPTH_SCALE = 0.04;
/** Travel before a gesture counts as a drag rather than a click, as on the globe. */
const DRAG_SLOP = 5;
/** Travel, or flick speed, needed to actually send a card away. */
const ADVANCE_PX = 90;
const ADVANCE_VELOCITY = 500;

/*
  The shuffle runs in two halves. First the front card lifts clear of the pile
  and tilts, still on top of everything. Then the order changes underneath it
  and it settles back down into the last slot, straightening as it goes.

  It has to be two halves because the card has to be above the pile while it
  rises and below it while it drops, and z-index cannot be animated through.
  Swapping it at the turn is invisible, since the card is clear of the others
  at that moment.
*/
const LIFT_MS = 190;
const TUCK_MS = 280;
const LIFT_Y = 72;
const LIFT_TILT = 7; // degrees

type Shuffle = { position: number; dir: -1 | 1; phase: "lift" | "tuck" };

/*
  inert and pointer-events must not reach the server HTML: without JavaScript
  every card is on show, and shipping those would leave all but the first one
  unreadable and unfocusable, which is the opposite of the fallback. They are
  applied only once the client has taken over. Read through
  useSyncExternalStore rather than a setState in an effect, which the React
  Compiler rejects.
*/
const subscribeNever = () => () => {};

/*
  Without JavaScript the deck cannot deal cards, so it un-stacks itself back
  into the plain list the page would otherwise have rendered. Doing it from a
  noscript stylesheet rather than from React means the server can ship the
  stacked markup directly and there is no flash of a list collapsing into a
  deck on hydration.
*/
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
  const [shuffle, setShuffle] = useState<Shuffle | null>(null);
  const reduced = useReducedMotion();
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);
  const dragged = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const statusId = useId();

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const id of pending) clearTimeout(id);
    };
  }, []);

  const go = useCallback(
    (delta: 1 | -1, dir: -1 | 1) => {
      if (shuffle !== null || total < 2) return; // mid shuffle
      const advance = () => setIndex((value) => (value + delta + total) % total);

      // Reduced motion cuts straight to the next card, no lift and no tilt.
      if (reduced) {
        advance();
        return;
      }

      const position = index;
      setShuffle({ position, dir, phase: "lift" });
      timers.current.push(
        setTimeout(() => {
          // Reorder underneath the raised card, then let it drop into the back.
          advance();
          setShuffle({ position, dir, phase: "tuck" });
          timers.current.push(setTimeout(() => setShuffle(null), TUCK_MS));
        }, LIFT_MS),
      );
    },
    [index, reduced, shuffle, total],
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
          jump as shorter cards come forward.

          items-center matters: grid items stretch by default, which pulled
          every card out to the tallest card's height and left its contents
          sitting against the top edge. Centred, each card keeps its own height
          and sits in the middle of the pile.

          The padding leaves room for the offset of the cards behind, which
          transforms do not reserve.
        */}
        <div
          data-deck
          tabIndex={mounted ? 0 : undefined}
          onKeyDown={onKeyDown}
          aria-describedby={statusId}
          className="grid items-center rounded-lg pb-6 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 [&>*]:col-start-1 [&>*]:row-start-1"
        >
          {cards.map((card, position) => {
            const depth = (position - index + total) % total;
            const isActive = depth === 0;
            const hidden = depth > VISIBLE_BEHIND;
            const lifting =
              shuffle?.position === position && shuffle.phase === "lift";

            return (
              <motion.div
                key={position}
                // Only the front card takes focus or the pointer. The rest are
                // inert, which drops them from the tab order and the
                // accessibility tree in one attribute.
                {...(mounted && !isActive ? { inert: true } : {})}
                // Above the whole pile while it rises, back in the normal
                // order once it starts dropping behind.
                style={{ zIndex: lifting ? total + 10 : total - depth }}
                // Render straight at these values, so the server ships the
                // deck already stacked instead of a list that snaps together
                // on hydration.
                initial={false}
                animate={
                  lifting
                    ? {
                        x: 0,
                        y: -LIFT_Y,
                        rotate: (shuffle?.dir ?? -1) * LIFT_TILT,
                        scale: 1.03,
                        opacity: 1,
                      }
                    : {
                        x: 0,
                        y: depth * DEPTH_Y,
                        rotate: 0,
                        scale: 1 - depth * DEPTH_SCALE,
                        opacity: hidden ? 0 : 1,
                      }
                }
                transition={
                  lifting
                    ? { duration: LIFT_MS / 1000, ease: "easeOut" }
                    : { type: "spring", stiffness: 340, damping: 32 }
                }
                drag={
                  isActive && shuffle === null && total > 1 ? "x" : false
                }
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
