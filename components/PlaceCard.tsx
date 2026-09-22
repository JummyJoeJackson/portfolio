"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { motion, useDragControls, useMotionValue } from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import type { Place } from "@/data/places";
import { cn } from "@/lib/utils";

export type Point = { x: number; y: number };

export type PlaceCardProps = {
  place: Place;
  onClose: () => void;
  /** Where the card was left last time, so it stays put between places. */
  offset: Point;
  onOffsetChange: (offset: Point) => void;
  className?: string;
};

/** Under this the card is a bottom sheet instead of a floating panel. */
const FLOATING_UP = "(min-width: 1024px)";

let floatingQuery: MediaQueryList | null = null;
const getFloatingQuery = () => (floatingQuery ??= window.matchMedia(FLOATING_UP));

const subscribeToFloating = (onChange: () => void) => {
  const query = getFloatingQuery();
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const neverChanges = () => () => {};

/**
 * Place detail. A bottom sheet on narrow screens, and on wide ones a panel
 * parked in the top right corner that the reader can drag anywhere.
 *
 * It used to sit over the globe, because it rendered inside the globe's own
 * box and there is no position in that box that is not on top of the globe.
 * With arcs on it was covering the very arc it describes. So it portals to
 * the body and positions against the viewport instead.
 *
 * The portal is not incidental. position:fixed resolves against the nearest
 * ancestor carrying a transform, and the hero is a motion element that also
 * clips its overflow, so left where it was the card would be positioned
 * against the hero and clipped by it. Leaving the tree is what makes fixed
 * mean fixed.
 */
export function PlaceCard({
  place,
  onClose,
  offset,
  onOffsetChange,
  className,
}: PlaceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const headingId = `place-card-${place.id}`;
  const dragControls = useDragControls();

  const mounted = useSyncExternalStore(neverChanges, () => true, () => false);
  const floating = useSyncExternalStore(
    subscribeToFloating,
    () => getFloatingQuery().matches,
    () => false,
  );

  /*
    motion owns the position while dragging, so it lives in motion values
    rather than React state, which would re-render on every pointer move. The
    parent is told only when a drag ends, and that is what carries the
    position from one place to the next.
  */
  const x = useMotionValue(offset.x);
  const y = useMotionValue(offset.y);

  useEffect(() => {
    // The sheet is placed by CSS, so a carried offset has to be dropped or it
    // would shift the sheet off the bottom of the screen.
    if (!floating) {
      x.set(0);
      y.set(0);
    }
  }, [floating, x, y]);

  useEffect(() => {
    /*
      Focus moves into the card on open. The element that opened it is
      remembered and refocused by the owner on close, so this only has to take
      focus, not give it back.
    */
    cardRef.current?.focus();
  }, [place.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (cardRef.current?.contains(target)) return;
      // Clicking a different marker or list entry switches places rather than
      // just dismissing, so those are not treated as an outside click.
      if (target.closest("[data-globe-marker], [data-places-control]")) return;
      onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose]);

  if (!mounted) return null;

  const overlay = (
    /*
      A viewport sized frame. It exists so motion has an element to measure
      the drag bounds from, which keeps the card on screen without any
      measuring, resize listening or clamping here. It takes no pointer events
      of its own, so clicking past the card still reaches the page and still
      closes it.
    */
    <div
      ref={frameRef}
      aria-hidden={false}
      className="pointer-events-none fixed inset-0 z-50"
    >
      <motion.div
        ref={cardRef}
        role="dialog"
        aria-labelledby={headingId}
        tabIndex={-1}
        style={{ x, y }}
        /*
          dragListener false hands the gesture to the header alone, so body
          text stays selectable and a press on the close button is never taken
          for a grab.
        */
        drag={floating}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={frameRef}
        dragMomentum={false}
        dragElastic={0}
        onDragEnd={() => onOffsetChange({ x: x.get(), y: y.get() })}
        /*
          The entrance is opacity only when floating, because the CSS keyframe
          animates transform and motion is already using transform for the
          drag position. Under lg nothing is dragged, so the CSS rise is free
          to run.
        */
        initial={floating ? { opacity: 0 } : false}
        animate={floating ? { opacity: 1 } : undefined}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "pointer-events-auto absolute border-border bg-card text-card-foreground shadow-sm outline-none",
          !floating && "place-card-enter",
          // Bottom sheet under lg. A floating panel on a phone is worse than
          // a sheet, and it would fight the page for the drag gesture.
          "inset-x-0 bottom-0 rounded-t-xl border-t p-4",
          // Floating panel at lg and up, parked top right. lg rather than md
          // because at 768 a 288px panel in the corner still clips the globe,
          // which is the thing being fixed.
          "lg:inset-x-auto lg:bottom-auto lg:right-4 lg:top-4 lg:w-72 lg:rounded-xl lg:border",
          className,
        )}
      >
        <div
          onPointerDown={(event) => {
            if (!floating) return;
            if ((event.target as Element).closest("button")) return;
            dragControls.start(event);
          }}
          className={cn(
            "flex items-start justify-between gap-3",
            floating && "cursor-grab active:cursor-grabbing",
          )}
        >
          <div className="min-w-0">
            <h2 id={headingId} className="truncate text-sm font-medium">
              {place.name}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{place.date}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${place.name}`}
            className="-m-2 shrink-0 rounded-sm p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>

        {place.image ? (
          <div className="relative mt-3 aspect-[3/2] w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={place.image}
              alt={place.imageAlt ?? ""}
              fill
              sizes="(max-width: 1024px) 100vw, 18rem"
              className="object-cover"
            />
          </div>
        ) : null}

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {place.note}
        </p>
      </motion.div>
    </div>
  );

  return createPortal(overlay, document.body);
}
