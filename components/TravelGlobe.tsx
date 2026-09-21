"use client";

import { useMemo, useRef, useState } from "react";

import {
  CobeGlobe,
  type CobeGlobeHandle,
  type GlobeArc,
  type GlobeMarker,
} from "@/components/ui/cobe-globe";
import { places } from "@/data/places";
import { features, globeTheme, site } from "@/data/site";

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
    Flight paths, both behind flags in data/site.ts and off by default.
    homeArc draws a single arc from home to the open place; placeToPlaceArcs
    additionally links it to every other place, so opening either end of a pair
    shows the route between them.
  */
  const arcs = useMemo<GlobeArc[]>(() => {
    if (!selectedId) return NO_ARCS;
    const selected = places.find((place) => place.id === selectedId);
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
  }, [selectedId]);

  const select = (id: string) => {
    const place = places.find((entry) => entry.id === id);
    if (!place) return;
    setSelectedId(id);
    globeRef.current?.focusOn(place.location);
  };

  return (
    <CobeGlobe
      ref={globeRef}
      className={className}
      markers={markers}
      arcs={arcs}
      theme={globeTheme}
      paused={selectedId !== null}
      onMarkerSelect={select}
    />
  );
}
