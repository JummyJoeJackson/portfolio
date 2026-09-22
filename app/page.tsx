"use client";

import { useRouter } from "next/navigation";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { NavPlane, type PlaneDirection } from "@/components/NavPlane";
import { PlaneFlight, WHOOSH_MS, type Flight } from "@/components/PlaneFlight";
import { SocialLinks } from "@/components/SocialLinks";
import { TravelGlobe } from "@/components/TravelGlobe";
import { site } from "@/data/site";

/** Hero fade out overlaps the tail of the whoosh, per section 6.4. */
const HERO_FADE_MS = 200;
/** Reduced motion gets a quick fade and nothing else. */
const REDUCED_FADE_MS = 150;

/*
  Entrance order from section 6.3: name and hook, then globe, then buttons,
  then footer. The delays drive the .hero-enter animation in globals.css. The
  last one ends at 290 + 350, which lands the whole entrance near the 600ms
  section 6.4 asks for, and the globe's own canvas fade is tuned to 400ms so it
  does not trail noticeably behind.
*/
const ENTER = {
  text: "[animation-delay:50ms]",
  globe: "[animation-delay:130ms]",
  buttons: "[animation-delay:210ms]",
  footer: "[animation-delay:290ms]",
};

export default function Home() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [departing, setDeparting] = useState<PlaneDirection | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const depart = useCallback(
    (direction: PlaneDirection, href: string, next: Flight) => {
      setDeparting(direction);
      // Section 6.5: skip the plane and the trail under reduced motion and let
      // the quick fade carry the whole transition.
      if (!reduced) setFlight(next);

      timer.current = setTimeout(
        () => router.push(href),
        reduced ? REDUCED_FADE_MS : WHOOSH_MS,
      );
    },
    [reduced, router],
  );

  return (
    <MotionConfig reducedMotion="user">
      {/*
        Only the fade out is animated from JS, because it has to be timed
        against the navigation. It sits on main rather than an inner wrapper:
        the obvious wrapper would need display:contents to keep the grid
        children direct, and an element with no box cannot be faded. Fading
        main works because the departing plane flies as a fixed overlay
        outside it.
      */}
      <motion.main
        animate={{ opacity: departing ? 0 : 1 }}
        transition={
          reduced
            ? { duration: REDUCED_FADE_MS / 1000 }
            : {
                duration: HERO_FADE_MS / 1000,
                delay: (WHOOSH_MS - HERO_FADE_MS) / 1000,
              }
        }
        className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] gap-y-[clamp(0.5rem,2dvh,1.5rem)] overflow-hidden px-6 py-[clamp(0.75rem,3dvh,2rem)]"
      >
        {/*
          Hero text. Not a header: no bar, no border, no background band, it is
          plain centered text that belongs to the hero.
        */}
        <div className={`hero-enter text-center ${ENTER.text}`}>
          <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
            {site.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {site.hook}
          </p>
        </div>

        {/*
          Middle row. On md and up the globe sits in a centre track flanked by
          the two plane buttons; below md the globe takes a full width row with
          the buttons side by side underneath it.

          The side tracks are symmetric (1fr / 2fr / 1fr) so the globe is
          exactly centred and the gap to each button is equal no matter how
          wide the two labels are. That also keeps the centre cell a definite
          size, which lets the globe size itself off the cell with container
          query units instead of overflowing the row.
        */}
        <div className="grid min-h-0 grid-cols-2 grid-rows-[minmax(0,1fr)_auto] gap-x-[clamp(1rem,6vw,2rem)] gap-y-[clamp(0.5rem,2dvh,1.5rem)] md:grid-cols-[1fr_2fr_1fr] md:grid-rows-1 md:gap-x-[clamp(1rem,4vw,3rem)]">
          <div
            className={`hero-enter col-span-2 col-start-1 row-start-1 grid min-h-0 min-w-0 place-items-center [container-type:size] md:col-span-1 md:col-start-2 ${ENTER.globe}`}
          >
            <TravelGlobe className="aspect-square w-[min(100cqw,100cqh,30rem)]" />
          </div>

          <div
            className={`hero-enter col-start-1 row-start-2 justify-self-end md:col-start-1 md:row-start-1 md:self-center ${ENTER.buttons}`}
          >
            <NavPlane
              direction="arrivals"
              departing={departing === "arrivals"}
              locked={departing !== null}
              onDepart={depart}
            />
          </div>

          <div
            className={`hero-enter col-start-2 row-start-2 justify-self-start md:col-start-3 md:row-start-1 md:self-center ${ENTER.buttons}`}
          >
            <NavPlane
              direction="departures"
              departing={departing === "departures"}
              locked={departing !== null}
              onDepart={depart}
            />
          </div>
        </div>

        <div className={`hero-enter ${ENTER.footer}`}>
          <SocialLinks />
        </div>
      </motion.main>

      {flight ? <PlaneFlight flight={flight} /> : null}
    </MotionConfig>
  );
}
