export type Project = {
  id: string;
  title: string;
  /** One line. */
  summary: string;
  /** Tech stack. */
  tags: string[];
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
  },
  {
    id: "placeholder-2",
    title: "Placeholder Project",
    summary: "One line placeholder summary of what this project does.",
    tags: ["Python", "pandas"],
  },
  {
    id: "placeholder-3",
    title: "Placeholder Project",
    summary: "One line placeholder summary of what this project does.",
    tags: ["R", "Shiny"],
  },
];
