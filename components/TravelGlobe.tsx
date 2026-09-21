"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { PlaceCard } from "@/components/PlaceCard";
import { PlacesList } from "@/components/PlacesList";
import {
  CobeGlobe,
  type CobeGlobeHandle,
  type GlobeArc,
  type GlobeMarker,
} from "@/components/ui/cobe-globe";
import { places } from "@/data/places";
import { features, globeTheme, site } from "@/data/site";
import { cn } from "@/lib/utils";

/*
  Derived once at module level. places is already a stable module level array,
  so the markers keep a stable identity too and nothing downstream sees a new
  array on re-render.
*/
const markers: GlobeMarker[] = places.map((place) => ({
  id: place.id,
  label: place.label,
  location: place.location,
}));

const NO_ARCS: GlobeArc[] = [];

export function TravelGlobe({ className }: { className?: string }) {
  const globeRef = useRef<CobeGlobeHandle>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /*
    The element that opened the card, so focus can go back where it came from
    on close. It may be a marker button or a row of the places list, and after
    a pointer click the browser has already focused it for us.
  */
  const triggerRef = useRef<HTMLElement | null>(null);

  const selected = selectedId
    ? (places.find((place) => place.id === selectedId) ?? null)
    : null;

  /*
    Flight paths, both behind flags in data/site.ts and off by default.
    homeArc draws a single arc from home to the open place; placeToPlaceArcs
    additionally links it to every other place, so opening either end of a pair
    shows the route between them.
  */
  const arcs = useMemo<GlobeArc[]>(() => {
    if (!selected) return NO_ARCS;

    const result: GlobeArc[] = [];
    if (features.homeArc) {
      result.push({
        id: `home-${selected.id}`,
        from: site.home.location,
        to: selected.location,
      });
    }
    if (features.placeToPlaceArcs) {
      for (const place of places) {
        if (place.id === selected.id) continue;
        result.push({
          id: `${selected.id}-${place.id}`,
          from: place.location,
          to: selected.location,
        });
      }
    }
    return result;
  }, [selected]);

  const select = useCallback((id: string) => {
    const place = places.find((entry) => entry.id === id);
    if (!place) return;

    const active = document.activeElement;
    triggerRef.current = active instanceof HTMLElement ? active : null;

    setSelectedId(id);
    globeRef.current?.focusOn(place.location);
  }, []);

  const close = useCallback(() => {
    setSelectedId(null);

    const trigger = triggerRef.current;
    triggerRef.current = null;
    // Only worth restoring if it is still in the document and still focusable;
    // a marker can rotate out of view while the card is open.
    if (trigger?.isConnected) trigger.focus();
  }, []);

  return (
    <div className={cn("relative", className)}>
      <CobeGlobe
        ref={globeRef}
        className="size-full"
        markers={markers}
        arcs={arcs}
        theme={globeTheme}
        paused={selected !== null}
        onMarkerSelect={select}
      />

      <PlacesList onSelect={select} selectedId={selectedId} />

      {selected ? <PlaceCard place={selected} onClose={close} /> : null}
    </div>
  );
}
