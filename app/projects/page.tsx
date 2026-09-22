import type { Metadata } from "next";
import Image from "next/image";
import { Plane, PlaneTakeoff } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { Ticket, TicketField } from "@/components/Ticket";
import { TicketDeck } from "@/components/TicketDeck";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <PageShell title="Departures" subtitle="(Projects)" icon={PlaneTakeoff}>
      {/*
        Same boarding pass as Arrivals, down to the route and location, so a
        ticket reads identically whichever page it is on. The route is the span
        the project ran; both are optional in the data, so a project without
        dates simply drops that row.
      */}
      <TicketDeck label="Project tickets">
        {projects.map((project) => (
          <Ticket key={project.id} id={project.id}>
              {project.image ? (
                <div className="relative mb-4 aspect-[3/2] w-full overflow-hidden rounded-md bg-muted">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 34rem"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <h2 className="text-sm font-medium">{project.title}</h2>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                {project.summary}
              </p>

              {project.start && project.end ? (
                <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
                  <div className="flex items-end gap-3">
                    <TicketField label="From">
                      <span className="tabular-nums">{project.start}</span>
                    </TicketField>
                    <Plane
                      aria-hidden
                      className="mb-1 size-3.5 shrink-0 text-muted-foreground"
                    />
                    <TicketField label="To">
                      <span className="tabular-nums">{project.end}</span>
                    </TicketField>
                  </div>

                  {project.location ? (
                    <TicketField label="Location">{project.location}</TicketField>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
                {project.tags.length > 0 ? (
                  <TicketField label="Stack">
                    <span className="text-muted-foreground">
                      {project.tags.join(" · ")}
                    </span>
                  </TicketField>
                ) : null}

                {project.github || project.demo ? (
                  <TicketField label="Links">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-sm transition-colors hover:text-foreground"
                        >
                          GitHub
                        </a>
                      ) : null}
                      {project.github && project.demo ? (
                        <span aria-hidden className="select-none opacity-60">
                          ·
                        </span>
                      ) : null}
                      {project.demo ? (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-sm transition-colors hover:text-foreground"
                        >
                          Demo
                        </a>
                      ) : null}
                    </span>
                  </TicketField>
                ) : null}
              </div>
          </Ticket>
        ))}
      </TicketDeck>
    </PageShell>
  );
}
