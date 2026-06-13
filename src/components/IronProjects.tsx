import type { ReactNode } from "react";
import { Impact, Pills, Reveal, SectionHeader } from "./ui";
import { CloudBank, Contours, Stamp, Tape, WaveDivider } from "./decor";
import GlassTilt from "./GlassTilt";

/* Icon-led story row, shared visual language with the chapter cards */
function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper-warm text-forest" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </span>
      <p className="text-[0.82rem] leading-[1.65] text-ink-soft">
        <span className="mr-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-forest">
          {label}
        </span>
        {children}
      </p>
    </div>
  );
}

/* Big proof metric chip */
function Proof({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-gold/40 bg-gold/[0.07] px-3 py-2.5 text-center">
      <span className="font-display text-xl font-semibold text-gold">{value}</span>
      <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-ink-soft">{label}</span>
    </div>
  );
}

/* CI pipeline strip — commit → scheduled runs → tests → live dashboard */
function CiStrip() {
  const steps = [
    { label: "push / 6AM·6PM", d: "M8 3v10M4 9l4 4 4-4M3 17h10" },
    { label: "GitHub Actions", d: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM8 5v3l2 2" },
    { label: "18 xUnit tests", d: "M3 8l3 3 7-7" },
    { label: "live dashboard", d: "M2 13h12M4 11V7M8 11V4M12 11V6" },
  ];
  return (
    <div aria-hidden="true" className="flex items-center justify-between gap-1 rounded-lg border border-line bg-paper px-3 py-2.5">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-1.5">
          <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 16 16" className="h-4 w-4 text-forest" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d={s.d} />
            </svg>
            <span className="whitespace-nowrap font-mono text-[0.5rem] tracking-wide text-ink-soft">
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <svg viewBox="0 0 16 8" className="h-2 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M1 4h11M9 1l3 3-3 3" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/* Old Nokia keypad sketch — T9 nostalgia */
function KeypadSketch() {
  const keys = ["1", "2 abc", "3 def", "4 ghi", "5 jkl", "6 mno", "7 pqrs", "8 tuv", "9 wxyz"];
  return (
    <div aria-hidden="true" className="rounded-lg border border-line bg-paper p-3">
      <div className="mx-auto mb-2 w-fit rounded border border-line bg-mist/60 px-3 py-1 font-mono text-[0.6rem] tracking-[0.2em] text-ink">
        4433555 555666# → HELLO
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {keys.map((k) => {
          const [num, letters] = k.split(" ");
          return (
            <div key={k} className="flex flex-col items-center rounded-md border border-line bg-card py-1">
              <span className="font-display text-sm font-semibold leading-none">{num}</span>
              {letters && (
                <span className="font-mono text-[0.5rem] uppercase tracking-widest text-ink-soft">
                  {letters}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const linkBtn =
  "rounded-full bg-forest px-4 py-1.5 font-mono text-[0.66rem] tracking-wider text-paper transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_14px_rgba(61,107,79,0.35)] dark:text-ink";
const linkBtnOutline =
  "rounded-full border border-forest/50 px-4 py-1.5 font-mono text-[0.66rem] tracking-wider text-forest transition-colors duration-300 hover:bg-forest/10";

export default function IronProjects() {
  return (
    <section
      id="projects"
      aria-label="Projects built for Iron Software"
      className="relative overflow-hidden bg-paper-warm"
    >
      <WaveDivider fill="var(--paper)" />
      <WaveDivider fill="var(--paper)" flip />
      <CloudBank className="top-10 opacity-60" />
      <Contours className="-right-28 -top-20 h-[26rem] w-[26rem] opacity-50" />
      {/* Gold wax-seal medallion */}
      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="pointer-events-none absolute left-[6%] top-16 hidden h-24 w-24 -rotate-12 lg:block"
      >
        <circle cx="60" cy="60" r="50" fill="var(--gold)" opacity=".18" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="var(--gold)" strokeWidth="1.6" opacity=".6" />
        <circle cx="60" cy="60" r="36" fill="none" stroke="var(--gold)" strokeWidth=".8" strokeDasharray="3 4" opacity=".6" />
        <path d="M74 38c-16 0-28 6-31.5 21-.9 4.5.8 8.5 2.4 10.2 2.3-7 8.4-16 19-22-7.4 6.7-13.4 15-15.8 22.8C63 69 74 57 74 38z" fill="var(--gold)" opacity=".75" />
        <text x="60" y="104" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="2" fill="var(--gold)" opacity=".8">EST. 2026</text>
      </svg>

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeader
          eyebrow="Built for Iron Software · 2026"
          title="Going Beyond the Brief"
          intro="Before my interview I built two public projects to get hands-on with Iron Software's products and demonstrate my approach to quality engineering."
          align="center"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* ---- Exhibit A — IronPDF QA Test Suite ---- */}
          <Reveal>
            <GlassTilt baseRotate={-0.5} className="h-full">
            <article
              className="relative flex h-full flex-col gap-4 rounded-2xl border border-gold/40 bg-card p-6 shadow-[0_2px_12px_rgba(201,164,92,0.08)] transition-shadow duration-300 hover:shadow-[0_14px_34px_rgba(201,164,92,0.2)] sm:p-7"
            >
              <Tape className="-top-3 left-10" rotate={-4} />
              <span aria-hidden="true" className="hand absolute -top-1 right-6 text-xl text-gold">
                exhibit A
              </span>
              <h3 className="font-display text-2xl font-semibold tracking-wide">
                IronPDF QA Test Suite
              </h3>
              <CiStrip />
              <div className="space-y-2.5">
                <Row label="What" icon={<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />}>
                  A real QA suite against Iron Software's own IronPDF library — 18 xUnit tests
                  across 5 categories: generation, text, security, performance, edge cases.
                </Row>
                <Row label="How" icon={<g><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></g>}>
                  GitHub Actions runs it unattended at 6 AM and 6 PM Bangkok time, every day.
                </Row>
                <Row label="Proof" icon={<path d="M4 13h4l2 5 4-12 2 7h4" />}>
                  A live GitHub Pages dashboard shows real container specs, run history and a
                  manual trigger panel — quality you can watch happening.
                </Row>
              </div>
              <div className="flex gap-3" aria-label="IronPDF QA metrics">
                <Proof value="18/18" label="tests passing" />
                <Proof value="2× daily" label="automated runs" />
                <Proof value="5" label="test categories" />
              </div>
              <Pills items={["C#", ".NET 8", "xUnit", "GitHub Actions", "IronPDF"]} />
              <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-line pt-4">
                <a href="https://cybersage05.github.io/IronPdfQA" target="_blank" rel="noreferrer" className={linkBtn}>
                  Live Dashboard ↗
                </a>
                <a href="https://github.com/cybersage05/IronPdfQA" target="_blank" rel="noreferrer" className={linkBtnOutline}>
                  GitHub ↗
                </a>
              </div>
              <Stamp text="Live · CI/CD" color="var(--terracotta)" className="right-5 top-12 hidden sm:inline-block" />
            </article>
            </GlassTilt>
          </Reveal>

          {/* ---- Exhibit B — OldPhonePad Simulator ---- */}
          <Reveal delay={0.08}>
            <GlassTilt baseRotate={0.5} className="h-full">
            <article
              className="relative flex h-full flex-col gap-4 rounded-2xl border border-gold/40 bg-card p-6 shadow-[0_2px_12px_rgba(201,164,92,0.08)] transition-shadow duration-300 hover:shadow-[0_14px_34px_rgba(201,164,92,0.2)] sm:p-7"
            >
              <Tape className="-top-3 right-10" rotate={5} />
              <span aria-hidden="true" className="hand absolute -top-1 right-6 text-xl text-gold">
                exhibit B
              </span>
              <h3 className="font-display text-2xl font-semibold tracking-wide">
                OldPhonePad Simulator
              </h3>
              <KeypadSketch />
              <div className="space-y-2.5">
                <Row label="What" icon={<g><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M10 18h4" /></g>}>
                  Iron Software's coding challenge: decode multi-press Nokia keypad input
                  back into text.
                </Row>
                <Row label="How" icon={<path d="M14.5 6.5a4.5 4.5 0 0 0-6 6L4 17l3 3 4.5-4.5a4.5 4.5 0 0 0 6-6L14 13l-3-3z" />}>
                  Clean C# with Dictionary lookup, a Flush function and modulo wrapping —
                  built test-first, packaged on NuGet.
                </Row>
              </div>
              <div className="flex gap-3" aria-label="OldPhonePad metrics">
                <Proof value="8/8" label="tests passing" />
                <Proof value="22ms" label="execution" />
                <Proof value="NuGet" label="packaged" />
              </div>
              <Pills items={["C#", ".NET 8", "xUnit", "NuGet"]} />
              <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-line pt-4">
                <a href="https://github.com/cybersage05/OldPhonePad" target="_blank" rel="noreferrer" className={linkBtn}>
                  GitHub ↗
                </a>
              </div>
            </article>
            </GlassTilt>
          </Reveal>
        </div>

        <Reveal className="mt-8 text-center">
          <Impact>Both projects public, documented and reviewable — built the way I test: evidence first.</Impact>
        </Reveal>
      </div>
    </section>
  );
}
