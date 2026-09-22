"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import type { Place } from "@/data/places";
import { cn } from "@/lib/utils";

export type PlaceCardProps = {
  place: Place;
  onClose: () => void;
  className?: string;
};

/**
 * A floating card sitting low over the globe on md and up, and a bottom sheet
 * below md. One element either way, switched with CSS, so there is no
 * breakpoint to read in JavaScript and nothing to get wrong during hydration.
 *
 * Anchoring to the marker would be redundant here: opening a card rotates that
 * place to the centre of the globe, so a fixed position within the globe is
 * the same place the anchor would land, and it cannot be clipped on a short
 * viewport. Section 5.4 allows exactly this.
 */
export function PlaceCard({ place, onClose, className }: PlaceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const headingId = `place-card-${place.id}`;

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

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-labelledby={headingId}
      tabIndex={-1}
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 rounded-t-xl border-t border-border bg-card p-4 text-card-foreground shadow-sm outline-none",
        "place-card-enter",
        "md:absolute md:inset-x-auto md:bottom-9 md:left-1/2 md:w-[min(18rem,92%)] md:-translate-x-1/2 md:rounded-xl md:border",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
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
            sizes="(max-width: 768px) 100vw, 18rem"
            className="object-cover"
          />
        </div>
      ) : null}

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {place.note}
      </p>
    </div>
  );
}
