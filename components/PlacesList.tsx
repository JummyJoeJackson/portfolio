"use client";

import { useEffect, useId, useRef, useState } from "react";

import { places } from "@/data/places";
import { cn } from "@/lib/utils";

export type PlacesListProps = {
  onSelect: (id: string) => void;
  selectedId: string | null;
  className?: string;
};

/**
 * Small text control that opens a plain list of every place.
 *
 * This is the route that keeps all places reachable when the anchored marker
 * buttons are not: browsers without CSS anchor positioning, screen readers,
 * and anyone who would rather not chase a moving dot.
 *
 * A disclosure rather than a modal, since it is a short list and trapping
 * focus for it would be heavier than the interaction deserves.
 */
export function PlacesList({ onSelect, selectedId, className }: PlacesListProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target && containerRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      data-places-control
      className={cn("absolute bottom-1 left-1/2 z-30 -translate-x-1/2", className)}
    >
      {open ? (
        <ul
          id={panelId}
          className="absolute bottom-full left-1/2 mb-2 max-h-48 w-44 -translate-x-1/2 overflow-y-auto rounded-lg border border-border bg-card p-1 text-left shadow-sm"
        >
          {places.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  /*
                    Move focus to the trigger before selecting. The owner
                    remembers whatever is focused when the card opens so it can
                    restore it on close, and this row is about to unmount with
                    the list, which would leave it with a detached element and
                    focus stranded on the body.
                  */
                  triggerRef.current?.focus();
                  onSelect(place.id);
                }}
                aria-current={place.id === selectedId ? "true" : undefined}
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted",
                  place.id === selectedId
                    ? "text-card-foreground"
                    : "text-muted-foreground",
                )}
              >
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="rounded-sm px-2 py-1 text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Places
      </button>
    </div>
  );
}
