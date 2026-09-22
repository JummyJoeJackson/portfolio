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
    id: "sun-strategy-group",
    role: "Consultant & Lead Developer",
    company: "Sun Strategy Group",
    location: "Toronto, ON",
    start: "May 2026",
    end: "Present",
    bullets: [
      "Tech lead @ student-run firm advising SMBs across the GTA; directed a team of 3 across 6 unique clients.",
      "Advised clients on pricing and brand strategy.",
    ],
  },
  {
    id: "code-it-hacks",
    role: "Lead Instructor",
    company: "Code-It Hacks",
    location: "Toronto, ON",
    start: "May 2026",
    end: "Aug 2026",
    bullets: [
      "Taught Python and ML to 100+ students in an intensive summer program.",
      "Guided students through hands-on lessons and industry relevant projects.",
    ],
  },
];
