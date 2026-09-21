export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  /** e.g. "May 2026" */
  start: string;
  /** e.g. "Aug 2026" or "Present" */
  end: string;
  /** 2 to 3 short points. */
  bullets: string[];
  link?: string;
};

/** PLACEHOLDER DATA. Replace with real roles. */
export const experience: Experience[] = [
  {
    id: "placeholder-1",
    role: "Placeholder Role",
    company: "Placeholder Company",
    location: "Placeholder City",
    start: "Jan 2026",
    end: "Present",
    bullets: [
      "Placeholder bullet describing the work.",
      "Placeholder bullet describing the impact.",
    ],
  },
  {
    id: "placeholder-2",
    role: "Placeholder Role",
    company: "Placeholder Company",
    location: "Placeholder City",
    start: "May 2025",
    end: "Aug 2025",
    bullets: [
      "Placeholder bullet describing the work.",
      "Placeholder bullet describing the impact.",
    ],
  },
];
