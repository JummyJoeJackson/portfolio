"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlaneLanding, PlaneTakeoff } from "lucide-react";
import { useCallback, useRef, type MouseEvent as ReactMouseEvent } from "react";

import type { Flight } from "@/components/PlaneFlight";
import { cn } from "@/lib/utils";

export type PlaneDirection = "arrivals" | "departures";

const routes = {
  arrivals: {
    href: "/experience",
    icon: PlaneLanding,
    label: "Arrivals",
    sub: "(Experience)",
    section: "Experience",
    // Touching down: forward and toward the ground.
    nudge: "motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:translate-y-0.5",
    align: "items-end text-right",
  },
  departures: {
    href: "/projects",
    icon: PlaneTakeoff,
    label: "Departures",
    sub: "(Projects)",
    section: "Projects",
    // Climbing out: forward and up.
    nudge: "motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5",
    align: "items-start text-left",
  },
} as const;

export function NavPlane({
  direction,
  departing,
  locked,
  onDepart,
  className,
}: {
  direction: PlaneDirection;
  /** This plane is the one currently in the air. */
  departing?: boolean;
  /** Some plane is in the air, so further clicks are ignored. */
  locked?: boolean;
  onDepart?: (direction: PlaneDirection, href: string, flight: Flight) => void;
  className?: string;
}) {
  const route = routes[direction];
  const Icon = route.icon;
  const router = useRouter();
  const iconRef = useRef<SVGSVGElement>(null);

  /*
    Link prefetches on its own in production, but navigation here happens
    programmatically once the animation finishes, so the route is warmed on
    intent as well: on hover and focus, and again on the click itself.
  */
  const prefetch = useCallback(() => {
    router.prefetch(route.href);
  }, [router, route.href]);

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      /*
        Cmd, Ctrl, Shift and Alt clicks, and anything that is not the primary
        button, are left alone so the browser opens a new tab or window from
        the real href. Middle clicks arrive as auxclick and never reach here.
      */
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      if (locked) return; // an animation is already playing

      prefetch();

      const rect = iconRef.current?.getBoundingClientRect();
      if (!rect) {
        router.push(route.href);
        return;
      }

      onDepart?.(direction, route.href, {
        direction,
        left: rect.left,
        top: rect.top,
        size: rect.width,
      });
    },
    [direction, locked, onDepart, prefetch, route.href, router],
  );

  return (
    <Link
      href={route.href}
      aria-label={`${route.label}: ${route.section}`}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      onClick={handleClick}
      className={cn(
        "group inline-flex flex-col gap-0.5 rounded-sm",
        route.align,
        className,
      )}
    >
      <span className="board-sign flex items-center gap-2 text-sm font-medium group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 md:text-base">
        <Icon
          ref={iconRef}
          aria-hidden
          // Handed over to the flight overlay the moment it launches, so the
          // plane is never drawn twice.
          style={departing ? { opacity: 0 } : undefined}
          className={cn(
            "size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-200 md:size-[1.125rem]",
            route.nudge,
          )}
        />
        {route.label}
      </span>
      <span className="text-xs text-muted-foreground md:text-sm">
        {route.sub}
      </span>
    </Link>
  );
}
