export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  link?: string;
};

export const experience: Experience[] = [
  {
    id: "scotiabank",
    role: "Data Science Intern",
    company: "Scotiabank",
    location: "Toronto (YYZ)",
    start: "Jan. 2027",
    end: "Apr. 2027",
    bullets: [
      "Incoming Winter 2027",
    ],
    link: "scotiabank.com",
  },
  {
    id: "sun-strategy-group",
    role: "Tech Lead & Consultant",
    company: "Sun Strategy Group",
    location: "Toronto (YYZ)",
    start: "May 2026",
    end: "Present",
    bullets: [
      "Directed a team of 3 across 6 client projects for small and medium-sized businesses (SMBs) across Ontario",
      "Led recommendation calls with tech clients and designed custom websites",
    ],
    link: "sunstrategygroup.ca",
  },
  {
    id: "code-it-hacks",
    role: "Lead Instructor",
    company: "Code-It Hacks",
    location: "Toronto (YYZ)",
    start: "May 2026",
    end: "Sept. 2026",
    bullets: [
      "Taught Python and ML to 100+ students in an intensive summer program",
      "Translated advanced technical concepts into age-appropriate, hands-on lessons and gave students exposure to industry tools",
    ],
    link: "codeithackskids.com",
  },
];
