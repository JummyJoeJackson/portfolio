import Link from "next/link";
import { PlaneLanding, PlaneTakeoff } from "lucide-react";

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
  className,
}: {
  direction: PlaneDirection;
  className?: string;
}) {
  const route = routes[direction];
  const Icon = route.icon;

  return (
    <Link
      href={route.href}
      aria-label={`${route.label}: ${route.section}`}
      className={cn(
        "group inline-flex flex-col gap-0.5 rounded-sm",
        route.align,
        className,
      )}
    >
      <span className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 md:text-base">
        <Icon
          aria-hidden
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
