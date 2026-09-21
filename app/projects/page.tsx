import type { Metadata } from "next";

import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
};

// Phase 1 placeholder. The real Departures page is built in Phase 5.
export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-xl font-medium tracking-tight">Departures</h1>
      <p className="mt-1 text-sm text-muted-foreground">(Projects)</p>
      <ul className="mt-8 space-y-4 text-sm">
        {projects.map((project) => (
          <li key={project.id}>{project.title}</li>
        ))}
      </ul>
    </main>
  );
}
