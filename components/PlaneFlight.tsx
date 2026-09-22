"use client";

import { PlaneLanding, PlaneTakeoff } from "lucide-react";
import { motion } from "motion/react";

import type { PlaneDirection } from "@/components/NavPlane";

export type Flight = {
  direction: PlaneDirection;
  /** Viewport coordinates of the icon this flight takes over from. */
  left: number;
  top: number;
  size: number;
};

/*
  The plane flies as a fixed overlay rather than inside its button, because
  section 6.1 fades out "the rest of the hero" while the plane is still in the
  air. Opacity multiplies down the tree, so an icon inside the fading hero
  would fade with it. Out here it is unaffected.

  Each axis gets its own easing, which is what bends the path: moving the two
  axes at different rates traces a curve rather than a straight diagonal.
*/
const flights = {
  arrivals: {
    Icon: PlaneLanding,
    to: { x: 260, y: 190 },
    rotate: 10,
    // Runs out horizontally while still dropping, so it settles like a
    // touchdown instead of sliding away in a straight line.
    easeX: [0.16, 0.73, 0.35, 1],
    easeY: [0.5, 0.05, 0.75, 0.3],
    trailAngle: 36,
  },
  departures: {
    Icon: PlaneTakeoff,
    to: { x: 300, y: -460 },
    rotate: -12,
    // Slow off the mark then accelerating away, and far enough to leave the
    // top of the screen.
    easeX: [0.5, 0.05, 0.75, 0.3],
    easeY: [0.5, 0.05, 0.75, 0.3],
    trailAngle: -57,
  },
} as const;

export const WHOOSH_MS = 550;

export function PlaneFlight({ flight }: { flight: Flight }) {
  const { Icon, to, rotate, easeX, easeY, trailAngle } = flights[flight.direction];
  const duration = WHOOSH_MS / 1000;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-50"
      style={{ left: flight.left, top: flight.top }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
      animate={{ x: to.x, y: to.y, rotate, opacity: [1, 1, 0] }}
      transition={{
        x: { duration, ease: easeX },
        y: { duration, ease: easeY },
        rotate: { duration, ease: "easeOut" },
        opacity: { duration, times: [0, 0.65, 1], ease: "linear" },
      }}
    >
      {/*
        Trail. The wrapper carries the static rotation so the line lies along
        the flight path, and the inner element scales out from the plane, which
        keeps the whole thing on transform and opacity as section 6.5 requires.
      */}
      <div
        className="absolute right-1/2 top-1/2 h-px w-32 origin-right"
        style={{ transform: `rotate(${trailAngle}deg)` }}
      >
        <motion.div
          className="h-full w-full origin-right bg-gradient-to-l from-muted-foreground/45 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={{ duration, times: [0, 0.45, 1], ease: "easeOut" }}
        />
      </div>

      <Icon style={{ width: flight.size, height: flight.size }} />
    </motion.div>
  );
}
