import type { Metadata } from "next";
import { Plane, PlaneLanding } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { Ticket, TicketField } from "@/components/Ticket";
import { TicketDeck } from "@/components/TicketDeck";
import { experience } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
};

export default function ExperiencePage() {
  return (
    <PageShell title="Arrivals" subtitle="(Experience)" icon={PlaneLanding}>
      {/*
        One boarding pass per role, dealt as a deck per section 7.3. Every
        field comes from data/experience.ts;
        the date range doubles as the route, which is the one mapping that fits
        rather than being forced, since a job really is a trip between two
        dates. All tickets share a width and a field row, so the values still
        line up down the page.
      */}
      <TicketDeck label="Experience tickets">
        {experience.map((entry) => (
          <Ticket key={entry.id} id={entry.id}>
              <h2 className="text-sm font-medium">
                {entry.link ? (
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm hover:underline hover:decoration-1 hover:underline-offset-4"
                  >
                    {entry.company}
                  </a>
                ) : (
                  entry.company
                )}
              </h2>
              <p className="text-sm text-muted-foreground">{entry.role}</p>

              <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
                <div className="flex items-end gap-3">
                  <TicketField label="From">
                    <span className="tabular-nums">{entry.start}</span>
                  </TicketField>
                  <Plane
                    aria-hidden
                    className="mb-1 size-3.5 shrink-0 text-muted-foreground"
                  />
                  <TicketField label="To">
                    <span className="tabular-nums">{entry.end}</span>
                  </TicketField>
                </div>

                <TicketField label="Location">{entry.location}</TicketField>
              </div>

              <ul className="mt-4 space-y-1.5">
                {entry.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative pl-4 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:text-muted-foreground before:content-['·']"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
          </Ticket>
        ))}
      </TicketDeck>
    </PageShell>
  );
}
