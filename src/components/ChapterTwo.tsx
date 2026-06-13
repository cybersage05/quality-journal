import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ArchDiagram from "./ArchDiagram";
import ReleaseCycle from "./ReleaseCycle";
import AgileWorkflow from "./AgileWorkflow";
import { MetaChips, Pills, Reveal, SectionHeader } from "./ui";
import {
  Birds,
  CloudBank,
  Contours,
  Fig,
  GhostNumeral,
  Parallax,
  SectionStage,
  Sprig,
  TowerScene,
  WaveDivider,
} from "./decor";

/* ---------- Reporting architecture pipeline with flowing particles ---------- */

const pipeline = [
  { name: "Subscriber Transaction", note: "Where everything begins — a recharge, top-up or plan change", flow: "charging events generated" },
  { name: "Charging System", note: "Rates and charges every subscriber event in real time", flow: "usage data processed" },
  { name: "Mediation System", note: "Normalizes raw usage records for downstream systems", flow: "records written" },
  { name: "Operational Database", note: "Stores subscriber usage and account history at 10M+ record scale", flow: "APIs serve data" },
  { name: "API Layer", note: "Serves usage and history data to every customer-facing app", flow: "apps consume APIs" },
  { name: "Web Applications", note: "Self Care · Kic Care · Reseller Care — used by millions of AT&T prepaid subscribers", flow: "analytics pipeline" },
  { name: "Data Warehouse", note: "Aggregates platform data for analytics", flow: "reports generated" },
  { name: "Reporting Platform", note: "My primary domain — every report validated end to end", flow: "" },
];

function Pipeline() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <div
      role="group"
      aria-label="Reporting architecture data pipeline"
      className="mx-auto flex max-w-md flex-col items-center"
    >
      <p className="sr-only">
        Data flows from subscriber transactions through the charging system, mediation
        system, operational database and API layer into the web applications, then through
        the data warehouse to the reporting platform.
      </p>
      {pipeline.map((stage, i) => {
        const open = openIdx === i;
        return (
          <div key={stage.name} className="flex w-full flex-col items-center">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIdx(open ? null : i)}
              onMouseEnter={() => setOpenIdx(i)}
              onMouseLeave={() => setOpenIdx(null)}
              className={`w-full rounded-xl border bg-card px-4 py-2.5 text-left transition-all duration-300 ${
                open
                  ? "border-green shadow-[0_4px_16px_rgba(94,146,114,0.18)]"
                  : "border-line shadow-[0_1px_3px_rgba(46,58,48,0.06)]"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
                    open ? "bg-gold" : "bg-green"
                  }`}
                  aria-hidden="true"
                />
                <span className="font-display text-base font-semibold tracking-wide">
                  {stage.name}
                </span>
              </span>
              <motion.span
                initial={false}
                animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
                className="block overflow-hidden"
              >
                <span className="block pt-2 text-[0.8rem] leading-6 text-ink-soft">
                  {stage.note}
                </span>
              </motion.span>
            </button>
            {i < pipeline.length - 1 && (
              <div className="relative flex h-9 flex-col items-center" aria-hidden="true">
                <div className="h-full w-px bg-line" />
                {!reduced && (
                  <span
                    className="flow-dot absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold"
                    style={{ animationDelay: `${i * 0.45}s` }}
                  />
                )}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[0.6rem] italic text-ink-soft/70">
                  {stage.flow}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const testingTypes = ["Smoke", "Sanity", "System", "Integration", "SIT", "Regression", "Performance", "Load", "UAT"];

const regressionCycle = [
  "06:00 AM",
  "~600 Test Scenarios Executed",
  "Failure Monitoring & Triage",
  "Root Cause Analysis",
  "Coordinate Fix with Development / Infrastructure / Business teams",
  "Fix Validation",
  "Production Readiness Sign-off",
  "06:00 PM (repeat)",
];

/* ---------- AWS migration split diagram ---------- */

function Migration() {
  const reduced = useReducedMotion();
  const scope = ["Charging Systems", "Mediation Systems", "Databases", "APIs", "Reporting", "Customer Portals"];
  const validation = [
    "Functional", "System", "Integration", "Regression", "Performance",
    "Load", "Data Integrity", "API Validation", "Cross-environment", "Post-migration verification",
  ];
  return (
    <div className="relative rounded-2xl border border-line bg-card p-6 sm:p-8">
      <Birds className="right-8 top-6 hidden h-10 w-28 sm:block" />
      <span
        aria-hidden="true"
        className="hand absolute right-10 top-14 hidden -rotate-3 text-lg text-ink-soft opacity-80 md:block"
      >
        the long crossing — 18 months
      </span>
      <p className="eyebrow">AWS Migration · 1.5 Years</p>
      <h3 className="mt-2 font-display text-2xl font-semibold tracking-wide">
        From a Texas Data Center to the Cloud
      </h3>

      <div className="mt-8 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl border border-line bg-paper p-6 text-center">
          <p className="font-display text-xl font-semibold">On-Premise</p>
          <p className="mt-1 font-mono text-[0.66rem] tracking-wider text-ink-soft">
            Plano, Texas
          </p>
          <svg viewBox="0 0 48 32" className="mx-auto mt-4 h-10 w-14 text-ink-soft" aria-hidden="true">
            <rect x="8" y="6" width="32" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <line x1="8" y1="13" x2="40" y2="13" stroke="currentColor" strokeWidth="1" />
            <line x1="8" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1" />
            <circle cx="13" cy="9.5" r="1" fill="currentColor" />
            <circle cx="13" cy="16.5" r="1" fill="currentColor" />
            <circle cx="13" cy="23.5" r="1" fill="currentColor" />
          </svg>
        </div>

        <div className="relative mx-auto h-8 w-full max-w-[10rem] md:h-px md:w-32" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-full w-px bg-line md:left-0 md:top-1/2 md:h-px md:w-full" />
          {!reduced &&
            [0, 1, 2].map((i) => (
              <span
                key={i}
                className="migrate-dot absolute top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold md:block"
                style={{ animationDelay: `${i * 1.05}s` }}
              />
            ))}
          <svg viewBox="0 0 10 10" className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-90 md:-right-1 md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:rotate-0" >
            <path d="M1 1l7 4-7 4" fill="none" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>

        <div className="rounded-xl border border-gold/50 bg-paper p-6 text-center shadow-[0_0_0_3px_rgba(201,164,92,0.08)]">
          <p className="font-display text-xl font-semibold">AWS Cloud</p>
          <p className="mt-1 font-mono text-[0.66rem] tracking-wider text-ink-soft">
            EC2 · S3 · IAM · CloudWatch
          </p>
          <svg viewBox="0 0 48 32" className="mx-auto mt-4 h-10 w-14 text-gold" aria-hidden="true">
            <path
              d="M14 24a7 7 0 0 1 1.3-13.9A9 9 0 0 1 32.6 12 6.5 6.5 0 0 1 34 24z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft">
            Migration scope
          </p>
          <Pills items={scope} label="Migration scope" />
        </div>
        <div>
          <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft">
            My validation scope — reporting domain
          </p>
          <Pills items={validation} label="Validation scope" />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gold/40 bg-gold/[0.07] px-5 py-3 text-center">
        <p className="font-display text-lg font-semibold italic text-gold">
          "Validated migration with zero functional impact."
        </p>
      </div>
    </div>
  );
}

/* ---------- Chapter ---------- */

export default function ChapterTwo() {
  return (
    <section
      id="architecture"
      aria-label="Chapter two — Ericsson"
      className="relative overflow-hidden bg-[color-mix(in_srgb,var(--sky)_38%,var(--paper-warm))]"
    >
      <WaveDivider fill="var(--paper)" />
      <WaveDivider fill="var(--paper)" flip />
      <CloudBank className="top-8" />
      <GhostNumeral n="02" className="left-2 top-4 sm:left-10" />
      <Parallax speed={0.3} className="absolute -right-36 top-[12%]">
        <Contours className="relative h-[36rem] w-[36rem] opacity-50" />
      </Parallax>
      <Parallax speed={-0.22} className="absolute -left-28 bottom-[6%]">
        <Contours className="relative h-[30rem] w-[30rem] rotate-90 opacity-40" />
      </Parallax>
      <Birds className="float-bob right-[10%] top-24 hidden h-12 w-32 md:block" />

      <SectionStage className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_14rem]">
          <SectionHeader
            eyebrow="Chapter Two · Solution Integrator · Bangalore"
            title="System Integration & Verification for Telecom at Scale"
            intro="Three years on Agile Systems and Verification teams supporting large-scale BSS/OSS platforms serving millions of AT&T prepaid subscribers — from daily regression cycles and integration testing to a 1.5-year AWS cloud migration."
          >
            <MetaChips
              items={[
                { icon: "building", text: "Ericsson · BSS/OSS" },
                { icon: "pin", text: "Bangalore, India" },
                { icon: "calendar", text: "2021 – 2024" },
                { icon: "people", text: "AT&T prepaid · 10M+ subscribers" },
              ]}
            />
          </SectionHeader>
          <Reveal delay={0.15} className="hidden lg:block">
            <Parallax speed={0.18}>
              <TowerScene rotate={-2.5} className="mt-4" />
            </Parallax>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <div className="rounded-2xl border border-line bg-card p-6 sm:p-7">
            <p className="eyebrow mb-4">AT&amp;T Prepaid Platform · What Was Being Tested</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {["Self Care", "Kic Care", "Reseller Care"].map((app) => (
                <div key={app} className="rounded-xl border border-line bg-paper px-4 py-3 text-center">
                  <p className="font-display text-lg font-semibold">{app}</p>
                  <p className="mt-0.5 font-mono text-[0.58rem] tracking-wider text-ink-soft">
                    customer-facing application
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.84rem] leading-[1.7] text-ink-soft">
              Subscribers used them for recharge, top-up, plan changes, usage history and
              account history. Primary domain:{" "}
              <span className="font-medium text-ink">Reporting &amp; Usage History</span>.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <h3 className="eyebrow mb-6 text-center">
            Reporting Architecture — click any component to inspect it
          </h3>
          <div className="mx-auto hidden max-w-3xl md:block">
            <ArchDiagram />
          </div>
          <div className="md:hidden">
            <Pipeline />
          </div>
          <Fig n="04" label="system architecture · the data river, source to report" />
          <p className="mx-auto mt-6 max-w-2xl text-center text-[0.84rem] italic leading-7 text-ink-soft">
            "When changes occurred in any layer — charging, mediation, APIs, databases,
            reporting or customer portals — I performed end-to-end validation across the
            full stack."
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
          <Reveal>
            <h3 className="eyebrow mb-6 text-center">The Release Cycle — select any stage</h3>
            <ReleaseCycle />
            <Fig n="05" label="nine stages, every release, three years" />
          </Reveal>

          <div className="flex flex-col gap-6">
          <Reveal delay={0.1}>
            <article className="dotgrid relative h-full rounded-2xl border border-line bg-card p-6 sm:p-7">
              <svg
                viewBox="0 0 40 40"
                aria-hidden="true"
                className="absolute right-7 top-7 h-9 w-9 text-ink-soft opacity-70"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="20" cy="20" r="16" strokeWidth="1.4" />
                <path d="M20 10v10l7 5" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M20 2v3M20 35v3M2 20h3M35 20h3" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <p className="eyebrow mb-6">Daily Regression Cycle</p>
              <ol className="relative ml-3 space-y-5 border-l border-dashed border-line pl-6">
                {regressionCycle.map((step, i) => (
                  <li key={step} className="relative">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full border ${
                        i === 0 || i === regressionCycle.length - 1
                          ? "border-gold bg-gold"
                          : "border-green bg-card"
                      }`}
                    />
                    <span
                      className={`text-[0.85rem] leading-6 ${
                        i === 0 || i === regressionCycle.length - 1
                          ? "font-mono text-[0.75rem] tracking-wider text-gold"
                          : "text-ink-soft"
                      }`}
                    >
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>

          <Reveal delay={0.15}>
            <article className="flex h-full flex-col gap-5 rounded-2xl border border-line bg-card p-6 sm:p-7">
              <p className="eyebrow">Platform Reliability</p>
              <Pills
                items={["MapR", "Greenplum", "Red Hat Linux", "OCP", "Kubernetes", "CI/CD"]}
                label="Platform technologies"
              />
              <dl className="mt-2 space-y-4">
                {[
                  ["Platform", "99%+ uptime · MapR · Greenplum · OCP"],
                  ["CI/CD", "Deployment frequency improved across releases"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-4 border-b border-line pb-3">
                    <dt className="w-16 shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft">
                      {k}
                    </dt>
                    <dd className="text-[0.88rem] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>
          </div>
        </div>

        <Reveal className="mt-12 text-center">
          <h3 className="eyebrow mb-7">Testing Types</h3>
          <ul aria-label="Testing types" className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2.5">
            {testingTypes.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i, duration: 0.35, ease: "easeOut" }}
                className="rounded-full border border-green/40 bg-card px-4 py-1.5 font-mono text-[0.7rem] tracking-wide text-ink-soft transition-colors duration-300 hover:bg-green-light/40 hover:text-ink"
              >
                {t}
              </motion.li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12">
          <Migration />
        </Reveal>

        <Reveal className="mt-12">
          <AgileWorkflow />
        </Reveal>

        <Sprig
          className="sway absolute bottom-10 right-4 hidden h-24 w-14 -rotate-6 lg:block"
          flip
        />
      </SectionStage>
    </section>
  );
}
