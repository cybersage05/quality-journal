import type { ReactNode } from "react";
import { Pills, Reveal, SectionHeader } from "./ui";
import { Contours, Sprig, WaveDivider } from "./decor";

/* Hand-drawn toolshed icons, one per group */
const icons: Record<string, ReactNode> = {
  magnifier: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L24 24" strokeLinecap="round" />
      <path d="M8 10c.5-2 2-3.5 4-4" strokeLinecap="round" opacity=".6" />
    </g>
  ),
  brackets: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4L4 13l5 9M19 4l5 9-5 9" />
      <path d="M15.5 5l-4 18" opacity=".6" />
    </g>
  ),
  gear: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      <circle cx="14" cy="14" r="5" />
      <path d="M14 3v4M14 21v4M3 14h4M21 14h4M6.2 6.2l2.8 2.8M19 19l2.8 2.8M21.8 6.2L19 9M9 19l-2.8 2.8" strokeLinecap="round" />
    </g>
  ),
  cloud: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round">
      <path d="M8 20a5 5 0 0 1 1-9.9A6.5 6.5 0 0 1 21.5 12 4.5 4.5 0 0 1 21 20z" />
      <path d="M11 16c1.5-1.5 4.5-1.5 6 0" strokeLinecap="round" opacity=".6" />
    </g>
  ),
  server: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      <rect x="4" y="5" width="20" height="7" rx="2" />
      <rect x="4" y="16" width="20" height="7" rx="2" />
      <circle cx="9" cy="8.5" r="1" fill="var(--gold)" stroke="none" />
      <circle cx="9" cy="19.5" r="1" fill="var(--gold)" stroke="none" />
      <path d="M14 8.5h6M14 19.5h6" strokeLinecap="round" opacity=".6" />
    </g>
  ),
  sparkles: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
      <path d="M23 18l.8 2.2L26 21l-2.2.8L23 24l-.8-2.2L20 21l2.2-.8z" opacity=".7" />
    </g>
  ),
};

const groups: { name: string; icon: ReactNode; accent: string; note?: string; items: string[] }[] = [
  {
    name: "Testing",
    icon: icons.magnifier,
    accent: "var(--forest)",
    note: "the craft itself",
    items: ["STLC", "SDLC", "SIT", "UAT", "Regression", "Integration", "Performance", "Load", "Root Cause Analysis"],
  },
  {
    name: "Programming",
    icon: icons.brackets,
    accent: "var(--sky-deep)",
    items: ["Python", "PowerShell", "Bash", "SQL", "C#"],
  },
  {
    name: "Automation",
    icon: icons.gear,
    accent: "var(--gold)",
    note: "let the machines repeat",
    items: ["Selenium", "Robot Framework", "JMeter", "UiPath", "Playwright"],
  },
  {
    name: "Cloud & DevOps",
    icon: icons.cloud,
    accent: "var(--sky-deep)",
    items: ["AWS", "Docker", "Kubernetes", "OCP", "GitHub Actions", "CI/CD"],
  },
  {
    name: "Platforms",
    icon: icons.server,
    accent: "var(--green)",
    items: ["Red Hat Linux", "Windows", "MapR", "Greenplum"],
  },
  {
    name: "AI & Emerging",
    icon: icons.sparkles,
    accent: "var(--terracotta)",
    note: "sharpening daily",
    items: ["Claude", "ChatGPT", "GitHub Copilot", "Cursor", "LangChain", "RAG"],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      aria-label="Skills"
      className="relative overflow-hidden bg-paper-warm"
    >
      <WaveDivider fill="var(--paper)" />
      <WaveDivider fill="var(--paper)" flip />
      <Contours className="-right-32 top-[18%] h-[30rem] w-[30rem] opacity-45" />
      <Sprig className="absolute left-4 top-24 hidden h-24 w-14 rotate-6 xl:block" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeader eyebrow="The Toolshed" title="Skills & Instruments" />
        <p aria-hidden="true" className="hand mt-4 text-xl text-ink-soft opacity-80">
          every tool earned its place on this wall
        </p>
        <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <Reveal key={g.name} delay={0.06 * i}>
              <div className="relative">
                {g.note && (
                  <span
                    aria-hidden="true"
                    className="hand absolute -top-6 right-0 rotate-2 text-base text-ink-soft opacity-70"
                  >
                    {g.note}
                  </span>
                )}
                <div
                  className="mb-4 flex items-center gap-3 border-b-2 pb-2"
                  style={{ borderColor: `color-mix(in srgb, ${g.accent} 45%, transparent)` }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ color: g.accent, backgroundColor: `color-mix(in srgb, ${g.accent} 12%, transparent)` }}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 28 28" className="h-5 w-5">
                      {g.icon}
                    </svg>
                  </span>
                  <h3 className="font-display text-xl font-semibold tracking-wide">{g.name}</h3>
                </div>
                <Pills items={g.items} label={`${g.name} skills`} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
