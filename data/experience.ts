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
    start: "Jan 2027",
    end: "Apr 2027",
    bullets: [
      "Real-world impact @ Canada's 3rd largest bank",
      "Developed ML solutions that improved operational efficiency and customer outcomes",
    ],
  },
  {
    id: "sun-strategy-group",
    role: "Consultant & Lead Developer",
    company: "Sun Strategy Group",
    location: "Toronto (YYZ)",
    start: "May 2026",
    end: "Present",
    bullets: [
      "Tech lead @ student-run firm advising SMBs across the GTA",
      "Directed a team of 3 across 6 unique clients",
      "Advised clients on pricing and brand strategy",
    ],
  },
  {
    id: "code-it-hacks",
    role: "Lead Instructor",
    company: "Code-It Hacks",
    location: "Toronto (YYZ)",
    start: "May 2026",
    end: "Sep 2026",
    bullets: [
      "Taught Python and ML to 100+ students in an intensive summer program backed by Google and Microsoft.",
      "Led 200+ hours of instruction and mentorship, helping students build AI/ML projects",
    ],
  },
];
