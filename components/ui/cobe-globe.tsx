"use client";

import createGlobe, { type Arc, type Marker } from "cobe";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

export type GlobeMarker = {
  /** Unique, and a valid CSS identifier fragment: it becomes --cobe-<id>. */
  id: string;
  label: string;
  location: [number, number];
  size?: number;
};

export type GlobeArc = {
  id: string;
  from: [number, number];
  to: [number, number];
};

/** Colors and lighting, supplied from one config so the palette lives in one place. */
export type GlobeTheme = {
  dark: number;
  diffuse: number;
  mapBrightness: number;
  baseColor: [number, number, number];
  markerColor: [number, number, number];
  glowColor: [number, number, number];
  arcColor: [number, number, number];
};

export type CobeGlobeHandle = {
  /** Ease the globe until location sits at the centre. Jumps under reduced motion. */
  focusOn: (location: [number, number], options?: { immediate?: boolean }) => void;
};

export type CobeGlobeProps = {
  markers: GlobeMarker[];
  arcs?: GlobeArc[];
  theme: GlobeTheme;
  /** Stops auto-rotation. Dragging still works. */
  paused?: boolean;
  /** Fired for a real click on a marker, never for the click that ends a drag. */
  onMarkerSelect?: (id: string) => void;
  className?: string;
  ref?: Ref<CobeGlobeHandle>;
};

const MAX_THETA = 0.7; // radians, keeps the poles from swinging into view
const AUTO_ROTATE = 0.14; // radians per second
const DRAG_SENSITIVITY = 0.005; // radians per pixel
const MOMENTUM_REMAINING_PER_SECOND = 0.08;
const DRAG_THRESHOLD = 5; // px of travel before a pointer gesture counts as a drag
const FOCUS_DURATION = 700; // ms
const DEFAULT_MARKER_SIZE = 0.055;
const MAP_SAMPLES = 16000;

let webglProbe: boolean | null = null;

function supportsWebGL(): boolean {
  if (webglProbe !== null) return webglProbe;
  try {
    // A throwaway canvas, so we never hand cobe a context that was created
    // with different attributes than the ones it asks for.
    const probe = document.createElement("canvas");
    webglProbe = Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  } catch {
    webglProbe = false;
  }
  return webglProbe;
}

let reducedMotionQuery: MediaQueryList | null = null;

function prefersReducedMotion(): boolean {
  reducedMotionQuery ??= window.matchMedia("(prefers-reduced-motion: reduce)");
  return reducedMotionQuery.matches;
}

/*
  These two capabilities differ between the server and the browser, and reading
  them through useSyncExternalStore gives the client value without a hydration
  mismatch and without a setState inside an effect. Neither can change for the
  lifetime of the page, so the subscription is a no-op.
*/
const subscribeNever = () => () => {};

function useAnchorPositioning(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => CSS.supports("position-anchor: --a"),
    () => false,
  );
}

function useWebGL(): boolean {
  return useSyncExternalStore(subscribeNever, supportsWebGL, () => true);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/** Shortest signed angular distance from one angle to another. */
function shortestAngle(from: number, to: number): number {
  const twoPi = Math.PI * 2;
  return ((((to - from + Math.PI) % twoPi) + twoPi) % twoPi) - Math.PI;
}

/**
 * Rotation that puts a location at the centre of the visible face.
 *
 * cobe maps a marker onto the unit sphere as
 *   latRad = lat * PI / 180, lambda = lng * PI / 180 - PI
 *   v = [-cos(latRad)cos(lambda), sin(latRad), cos(latRad)sin(lambda)]
 * and its horizontal screen term is cos(phi) * v.x + sin(phi) * v.z. Solving
 * that for zero gives phi = PI/2 - lambda, and the vertical term is zeroed by
 * tilting theta to the latitude.
 */
function rotationFor([lat, lng]: [number, number]): { phi: number; theta: number } {
  const lambda = (lng * Math.PI) / 180 - Math.PI;
  return {
    phi: Math.PI / 2 - lambda,
    theta: Math.max(-MAX_THETA, Math.min(MAX_THETA, (lat * Math.PI) / 180)),
  };
}

function toCobeMarkers(markers: GlobeMarker[]): Marker[] {
  return markers.map((marker) => ({
    id: marker.id,
    location: marker.location,
    size: marker.size ?? DEFAULT_MARKER_SIZE,
  }));
}

function toCobeArcs(arcs: GlobeArc[]): Arc[] {
  return arcs.map((arc) => ({ id: arc.id, from: arc.from, to: arc.to }));
}

export function CobeGlobe({
  markers,
  arcs,
  theme,
  paused = false,
  onMarkerSelect,
  className,
  ref,
}: CobeGlobeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [painted, setPainted] = useState(false);

  const anchorsSupported = useAnchorPositioning();
  const webglSupported = useWebGL();
  const status = !webglSupported ? "unsupported" : painted ? "ready" : "pending";

  /*
    Everything the render loop reads lives in a ref. Props arrive as fresh
    array and tuple identities on every parent render, and if the init effect
    depended on them the globe would be torn down and rebuilt whenever a card
    opened, losing its rotation and flickering. The loop reads current values
    instead, so the globe is constructed exactly once.

    The refs are filled from effects rather than during render, because writing
    a ref while rendering is not safe under the React Compiler.
  */
  const themeRef = useRef(theme);
  const pausedRef = useRef(paused);
  const onMarkerSelectRef = useRef(onMarkerSelect);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    onMarkerSelectRef.current = onMarkerSelect;
  }, [onMarkerSelect]);

  const markersRef = useRef(markers);
  const arcsRef = useRef(arcs ?? []);
  // Set when marker or arc geometry genuinely changed and the GPU buffers need
  // rebuilding, so we are not re-uploading them on every frame.
  const geometryDirtyRef = useRef(true);

  const markersKey = markers
    .map((m) => `${m.id}:${m.location[0]},${m.location[1]}:${m.size ?? DEFAULT_MARKER_SIZE}`)
    .join("|");
  const arcsKey = (arcs ?? [])
    .map((a) => `${a.id}:${a.from[0]},${a.from[1]}>${a.to[0]},${a.to[1]}`)
    .join("|");

  useEffect(() => {
    markersRef.current = markers;
    arcsRef.current = arcs ?? [];
    geometryDirtyRef.current = true;
    // Tracked through the serialised keys rather than the array identities.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markersKey, arcsKey]);

  const motion = useRef({
    phi: 0,
    theta: 0.25,
    velocity: 0,
    dragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    travel: 0,
    /** True once a gesture has travelled far enough to take pointer capture. */
    captured: false,
    /** Set while a marker has pointer or keyboard focus. */
    interactionPaused: false,
    focus: null as null | {
      fromPhi: number;
      toPhi: number;
      fromTheta: number;
      toTheta: number;
      start: number;
    },
  });

  useImperativeHandle(
    ref,
    (): CobeGlobeHandle => ({
      focusOn: (location, options) => {
        const target = rotationFor(location);
        const state = motion.current;
        state.velocity = 0;

        if (options?.immediate || prefersReducedMotion()) {
          state.focus = null;
          state.phi = target.phi;
          state.theta = target.theta;
          return;
        }

        state.focus = {
          fromPhi: state.phi,
          toPhi: state.phi + shortestAngle(state.phi, target.phi),
          fromTheta: state.theta,
          toTheta: target.theta,
          start: performance.now(),
        };
      },
    }),
    [],
  );

  useEffect(() => {
    const root = rootRef.current;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!root || !host || !canvas) return;

    if (!webglSupported) return;

    const devicePixelRatio = window.devicePixelRatio || 1;
    let width = Math.max(1, root.clientWidth);
    let height = Math.max(1, root.clientHeight);

    const initial = themeRef.current;
    const globe = createGlobe(canvas, {
      devicePixelRatio,
      width,
      height,
      phi: motion.current.phi,
      theta: motion.current.theta,
      mapSamples: MAP_SAMPLES,
      mapBrightness: initial.mapBrightness,
      baseColor: initial.baseColor,
      markerColor: initial.markerColor,
      glowColor: initial.glowColor,
      arcColor: initial.arcColor,
      diffuse: initial.diffuse,
      dark: initial.dark,
      markers: toCobeMarkers(markersRef.current),
      arcs: toCobeArcs(arcsRef.current),
    });
    geometryDirtyRef.current = false;

    /*
      cobe fixes the devicePixelRatio at construction and sizes the backing
      store as (width we pass) * that ratio, so feeding it the live CSS size
      keeps the globe crisp across window resizes, device rotation and the md
      breakpoint.

      A DPR change, from the window moving to a differently scaled display, is
      compensated arithmetically below rather than by rebuilding. Rebuilding
      here was a bug: the observer fires on observe(), so any DPR disagreement
      tore the globe down and recreated it in a loop, cancelling each scheduled
      frame before it ran. Scaling the width instead means the globe really is
      constructed exactly once.
    */
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const next = entry.contentRect;
      if (next.width < 1 || next.height < 1) return;
      width = next.width;
      height = next.height;
    });
    observer.observe(root);

    let frame = 0;
    let last = performance.now();
    let hasPainted = false;
    let wasPaused = pausedRef.current;

    const render = (now: number) => {
      const state = motion.current;
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;

      /*
        Closing a card has to resume rotation, and closing it with Escape hands
        focus back to the marker that opened it, which would otherwise re-arm
        the focus pause and leave the globe frozen for good.
      */
      if (wasPaused && !pausedRef.current) state.interactionPaused = false;
      wasPaused = pausedRef.current;

      if (state.focus) {
        const progress = Math.min(1, (now - state.focus.start) / FOCUS_DURATION);
        const eased = easeInOutCubic(progress);
        state.phi = state.focus.fromPhi + (state.focus.toPhi - state.focus.fromPhi) * eased;
        state.theta =
          state.focus.fromTheta + (state.focus.toTheta - state.focus.fromTheta) * eased;
        if (progress >= 1) state.focus = null;
      } else if (!state.dragging) {
        if (Math.abs(state.velocity) > 0.0005) {
          state.phi += state.velocity * delta;
          state.velocity *= MOMENTUM_REMAINING_PER_SECOND ** delta;
        } else {
          state.velocity = 0;
          const idle =
            !pausedRef.current && !state.interactionPaused && !prefersReducedMotion();
          if (idle) state.phi += AUTO_ROTATE * delta;
        }
      }

      state.theta = Math.max(-MAX_THETA, Math.min(MAX_THETA, state.theta));

      const current = themeRef.current;
      // Undo cobe's fixed ratio and reapply the live one, so the backing store
      // stays at CSS size times the real DPR.
      const dprScale = (window.devicePixelRatio || 1) / devicePixelRatio;
      globe.update({
        phi: state.phi,
        theta: state.theta,
        width: width * dprScale,
        height: height * dprScale,
        mapBrightness: current.mapBrightness,
        baseColor: current.baseColor,
        markerColor: current.markerColor,
        glowColor: current.glowColor,
        arcColor: current.arcColor,
        diffuse: current.diffuse,
        dark: current.dark,
        ...(geometryDirtyRef.current
          ? {
              markers: toCobeMarkers(markersRef.current),
              arcs: toCobeArcs(arcsRef.current),
            }
          : {}),
      });
      geometryDirtyRef.current = false;

      if (!hasPainted) {
        hasPainted = true;
        setPainted(true);
      }
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      globe.destroy();
      /*
        cobe inserts its own position:relative wrapper around the canvas and
        never undoes it, so without this a rebuild would nest a fresh wrapper
        inside the previous one every time.
      */
      const wrapper = canvas.parentElement;
      if (wrapper && wrapper !== host && wrapper.parentElement === host) {
        host.insertBefore(canvas, wrapper);
        wrapper.remove();
      }
    };
    // Only a DPR change rebuilds. Everything else is read from refs inside the
    // loop, which is what keeps the globe from restarting on prop changes.
  }, [webglSupported]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const state = motion.current;
    state.dragging = true;
    state.travel = 0;
    state.velocity = 0;
    state.focus = null;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    /*
      Capture is taken lazily, once the gesture is actually a drag. Capturing
      on pointerdown would retarget the pointerup, and with it the synthesised
      click, onto this element, so a marker button would never see the click
      that selects it.
    */
  }, []);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const state = motion.current;
    if (!state.dragging) return;
    const dx = event.clientX - state.lastPointerX;
    const dy = event.clientY - state.lastPointerY;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    state.travel += Math.hypot(dx, dy);

    if (!state.captured && state.travel > DRAG_THRESHOLD) {
      event.currentTarget.setPointerCapture(event.pointerId);
      state.captured = true;
    }

    state.phi += dx * DRAG_SENSITIVITY;
    state.theta = Math.max(
      -MAX_THETA,
      Math.min(MAX_THETA, state.theta + dy * DRAG_SENSITIVITY),
    );
    // Carry the last movement forward as a spin, in radians per second.
    state.velocity = dx * DRAG_SENSITIVITY * 60;
  }, []);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const state = motion.current;
    if (!state.dragging) return;
    state.dragging = false;
    if (state.travel <= DRAG_THRESHOLD) state.velocity = 0;
    if (state.captured) {
      state.captured = false;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
  }, []);

  const handleMarkerActivate = useCallback(
    (id: string, event: ReactMouseEvent<HTMLButtonElement>) => {
      /*
        detail is 0 when the click came from the keyboard, where there is no
        gesture to disambiguate. A pointer click only counts if it barely
        moved, so the click that ends a drag never opens a card.
      */
      if (event.detail > 0 && motion.current.travel > DRAG_THRESHOLD) return;
      onMarkerSelectRef.current?.(id);
    },
    [],
  );

  const setInteractionPaused = useCallback((value: boolean) => {
    motion.current.interactionPaused = value;
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn("relative touch-none select-none", className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={hostRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          className={cn(
            "h-full w-full cursor-grab transition-opacity duration-700 active:cursor-grabbing",
            status === "ready" ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {status === "unsupported" ? (
        <div
          aria-hidden
          className="absolute inset-0 rounded-full border border-border bg-muted/40"
        />
      ) : null}

      {anchorsSupported && status === "ready"
        ? markers.map((marker) => {
            const anchorStyle = {
              "--cobe-anchor": `--cobe-${marker.id}`,
              "--cobe-vis": `var(--cobe-visible-${marker.id}, hidden)`,
            } as CSSProperties;

            return (
              <div key={marker.id} className="contents">
                <button
                  type="button"
                  data-globe-marker={marker.id}
                  style={anchorStyle}
                  onClick={(event) => handleMarkerActivate(marker.id, event)}
                  onFocus={(event) => {
                    // Only keyboard focus holds the globe still. A mouse click
                    // also focuses the button, and pausing for that would stop
                    // the globe every time someone dismissed a card.
                    setInteractionPaused(event.currentTarget.matches(":focus-visible"));
                  }}
                  onBlur={() => setInteractionPaused(false)}
                  onPointerEnter={() => setInteractionPaused(true)}
                  onPointerLeave={() => setInteractionPaused(false)}
                  className="cobe-anchored cobe-marker-hit peer size-9 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span className="sr-only">{marker.label}</span>
                </button>
                <span
                  aria-hidden
                  style={anchorStyle}
                  className="cobe-anchored cobe-marker-label pointer-events-none whitespace-nowrap rounded-md bg-card px-2 py-1 text-xs text-card-foreground opacity-0 shadow-sm transition-opacity duration-150 peer-hover:opacity-100 peer-focus-visible:opacity-100"
                >
                  {marker.label}
                </span>
              </div>
            );
          })
        : null}
    </div>
  );
}
