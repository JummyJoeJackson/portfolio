export type Project = {
  id: string;
  title: string;
  /** One line. */
  summary: string;
  /** Tech stack. */
  tags: string[];
  /**
   * When the project ran, shown as the FROM and TO of the ticket's route, the
   * same way a role's dates are on Arrivals. Optional, and the route only
   * appears when both ends are set. Leave them off for something ongoing with
   * no meaningful start.
   */
  start?: string;
  end?: string;
  /**
   * Where the project came from, for the LOCATION field. A course, a
   * hackathon, a team, or "Personal" all read fine here.
   */
  location?: string;
  github?: string;
  demo?: string;
  image?: string;
};

/** PLACEHOLDER DATA. Replace with real projects. */
export const projects: Project[] = [
  {
    id: "placeholder-1",
    title: "Placeholder Project",
    summary: "One line placeholder summary of what this project does.",
    tags: ["TypeScript", "Next.js"],
    start: "Jan 2025",
    end: "Mar 2025",
    location: "Placeholder Location",
  },
  {
    id: "placeholder-2",
    title: "Placeholder Project",
    summary: "One line placeholder summary of what this project does.",
    tags: ["Python", "pandas"],
    start: "Sep 2024",
    end: "Dec 2024",
    location: "Placeholder Location",
  },
  {
    id: "placeholder-3",
    title: "Placeholder Project",
    summary: "One line placeholder summary of what this project does.",
    tags: ["R", "Shiny"],
    start: "May 2024",
    end: "Jun 2024",
    location: "Placeholder Location",
  },
];
