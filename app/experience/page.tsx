import type { Metadata } from "next";

import { experience } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
};

// Phase 1 placeholder. The real Arrivals page is built in Phase 5.
export default function ExperiencePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-xl font-medium tracking-tight">Arrivals</h1>
      <p className="mt-1 text-sm text-muted-foreground">(Experience)</p>
      <ul className="mt-8 space-y-4 text-sm">
        {experience.map((entry) => (
          <li key={entry.id}>
            {entry.role}, {entry.company}
          </li>
        ))}
      </ul>
    </main>
  );
}
