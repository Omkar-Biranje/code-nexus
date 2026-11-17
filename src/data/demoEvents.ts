export type Hackathon = {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  summary: string;
  mode: string;
  location: string;
  country?: string | null;
  city?: string | null;
  level: string;
  skills: string[];
  registrationDeadline: string | null;
  submissionDeadline: string | null;
  eventStart: string | null;
  eventEnd: string | null;
  timezone: string | null;
  teamSize: string | null;
  prize: string | null;
  entryFee?: string | null;
  eligibility?: string | null;
  sourcePlatforms?: string | null;
  lastCheckedAt?: string | null;
  sourceUrl: string | null;
  officialUrl: string | null;
  verificationStatus: string;
  sourceNames?: string;
  sourceCount?: number;
  sourceConflicts?: string;
  attribution?: string;
  isDemo?: boolean;
};

export const demoEvents: Hackathon[] = [
  {
    id: "demo-01",
    slug: "build-for-good-demo",
    title: "Build for Good — Demo Challenge",
    organizer: "Illustrative organizer",
    summary: "A sample event record showing how CODE NEXUS presents a clear brief, eligibility context and important dates.",
    mode: "Online",
    location: "Remote",
    level: "Beginner friendly",
    skills: ["Web development", "UI/UX", "Problem solving"],
    registrationDeadline: "2026-12-08T23:59:00",
    submissionDeadline: "2026-12-14T23:59:00",
    eventStart: "2026-12-10T09:00:00",
    eventEnd: "2026-12-14T23:59:00",
    timezone: "Asia/Kolkata",
    teamSize: "2–4",
    prize: "Not specified",
    sourceUrl: null,
    officialUrl: null,
    verificationStatus: "Illustrative demo",
    isDemo: true,
  },
  {
    id: "demo-02",
    slug: "open-source-weekend-demo",
    title: "Open Source Weekend — Demo Sprint",
    organizer: "Illustrative organizer",
    summary: "A sample community sprint for builders who want to collaborate on practical open-source ideas.",
    mode: "Hybrid",
    location: "Location not specified",
    level: "Intermediate",
    skills: ["JavaScript", "Git", "Open source"],
    registrationDeadline: "2026-12-18T18:00:00",
    submissionDeadline: "2026-12-22T18:00:00",
    eventStart: "2026-12-20T09:00:00",
    eventEnd: "2026-12-22T18:00:00",
    timezone: "UTC",
    teamSize: "2–5",
    prize: "Not specified",
    sourceUrl: null,
    officialUrl: null,
    verificationStatus: "Illustrative demo",
    isDemo: true,
  },
  {
    id: "demo-03",
    slug: "future-interfaces-demo",
    title: "Future Interfaces — Demo Jam",
    organizer: "Illustrative organizer",
    summary: "A sample design-and-build challenge focused on accessible, thoughtful digital experiences.",
    mode: "In person",
    location: "City not specified",
    level: "All levels",
    skills: ["Product design", "Accessibility", "Frontend"],
    registrationDeadline: "2027-01-05T23:59:00",
    submissionDeadline: "2027-01-12T23:59:00",
    eventStart: "2027-01-09T09:00:00",
    eventEnd: "2027-01-12T17:00:00",
    timezone: null,
    teamSize: "1–4",
    prize: "Not specified",
    sourceUrl: null,
    officialUrl: null,
    verificationStatus: "Illustrative demo",
    isDemo: true,
  },
  {
    id: "demo-04",
    slug: "climate-action-lab-demo",
    title: "Climate Action Lab — Demo Hack",
    organizer: "Illustrative organizer",
    summary: "A sample sustainability-themed challenge with space for research, prototypes and data storytelling.",
    mode: "Online",
    location: "Remote",
    level: "All levels",
    skills: ["Data", "AI/ML", "Sustainability"],
    registrationDeadline: null,
    submissionDeadline: "2027-01-20T23:59:00",
    eventStart: "2027-01-17T09:00:00",
    eventEnd: "2027-01-20T23:59:00",
    timezone: "Europe/London",
    teamSize: "Not specified",
    prize: "Not specified",
    sourceUrl: null,
    officialUrl: null,
    verificationStatus: "Illustrative demo",
    isDemo: true,
  },
];