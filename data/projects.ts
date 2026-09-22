export type Project = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  start?: string;
  end?: string;
  location?: string;
  github?: string;
  demo?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    id: "midas",
    title: "Midas",
    summary: "AR Tech Repair Assistant.",
    tags: ["Python", "Javascript", "React", "FastAPI", "YOLOv11", "OpenCV"], 
    start: "Feb 2026",
    end: "Mar 2026",
    location: "QHacks 2026",
    github:"https://github.com/JummyJoeJackson/Midas",
  },
  {
    id: "signcli",
    title: "SignCLI",
    summary: "Duolingo for ASL.",
    tags: ["Python", "PyTorch", "scikit-learn", "OpenCV", "MediaPipe"],
    start: "Jan 2026",
    end: "Feb 2026",
    location: "UOttaHacks 2026",
    github:"https://github.com/JummyJoeJackson/sign-cli",
  },
  {
    id: "chess-engine",
    title: "AI Chess Engine",
    summary: "Neural Network-based chess engine.",
    tags: ["Python", "PyTorch", "Modal", "Weights & Biases", "Next.js"],
    start: "Nov 2025",
    end: "Dec 2025",
    location: "ChessHacks 2025",
    github:"https://github.com/JummyJoeJackson/AI-Chess-Bot",
  },
];
