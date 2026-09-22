import type { Metadata } from "next";
import Image from "next/image";
import { PlaneTakeoff } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { Ticket, TicketField } from "@/components/Ticket";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <PageShell title="Departures" subtitle="(Projects)" icon={PlaneTakeoff}>
      {/*
        Same boarding pass as Arrivals, with the fields a project actually has.
        No route line here: a project has no date range to fly between, and
        inventing one would be the gimmick the brief warns against.
      */}
      <ul className="space-y-6">
        {projects.map((project) => (
          <li key={project.id}>
            <Ticket id={project.id}>
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
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
