import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal, SectionHeader } from "./ui";
import { Cloud, CompassRose, Contours, Parallax, Pine } from "./decor";

gsap.registerPlugin(ScrollTrigger);

/* Tiny waypoint sketches drawn beside each stop */
const waypoints = {
  bot: (
    <g stroke="var(--ink-soft)" strokeWidth="1.3" fill="none">
      <rect x="8" y="10" width="16" height="13" rx="3" />
      <rect x="11" y="3" width="10" height="6" rx="2.5" />
      <circle cx="14" cy="6" r=".9" fill="var(--forest)" stroke="none" />
      <circle cx="18" cy="6" r=".9" fill="var(--forest)" stroke="none" />
      <path d="M12 15h2M18 15h2M13 19h6" strokeLinecap="round" />
    </g>
  ),
  tower: (
    <g stroke="var(--ink-soft)" strokeWidth="1.3" fill="none">
      <path d="M13 24 L16 5 L19 24M14 18h4M14.5 12h3" />
      <path d="M11 8a7 7 0 0 1 10 0" strokeLinecap="round" stroke="var(--gold)" />
    </g>
  ),
  factory: (
    <g stroke="var(--ink-soft)" strokeWidth="1.3" fill="none">
      <path d="M6 23v-8l6 4v-4l6 4v-4l6 4v4z" strokeLinejoin="round" />
      <rect x="8" y="6" width="3" height="9" />
      <path d="M9.5 5c2-2 4-3 7-3" stroke="var(--mist)" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  ),
};

const stops = [
  {
    company: "EOX Vantage",
    dates: "2021",
    role: "Automation Engineer",
    summary: "5+ RPA bots automating ERP and SCM workflows.",
    waypoint: waypoints.bot,
  },
  {
    company: "Ericsson",
    dates: "2021 – 2024",
    role: "Associate → Solution Integrator",
    summary: "Telecom-scale integration testing and a 1.5-year AWS migration.",
    waypoint: waypoints.tower,
  },
  {
    company: "Cal-Comp Electronics",
    dates: "2024 – Present",
    role: "Software Validation Engineer",
    summary: "Owning the validation gate for a global manufacturing product line.",
    waypoint: waypoints.factory,
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !pathRef.current || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pathRef.current,
        { clipPath: "inset(0px 0px 100% 0px)" },
        {
          clipPath: "inset(0px 0px 0% 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 0.6,
          },
        }
      );
    });
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      aria-label="Career timeline"
      className="relative overflow-hidden bg-paper"
    >
      <Parallax speed={0.16} className="absolute right-[8%] top-20 hidden h-24 w-24 md:block">
        <CompassRose className="relative h-full w-full" />
      </Parallax>
      <Cloud className="cloud absolute left-[6%] top-12 w-32 opacity-60 blur-[1px]" />
      <Cloud className="cloud absolute right-[18%] top-32 hidden w-24 opacity-40 blur-[2px] md:block [animation-delay:-30s]" />
      <Parallax speed={0.3} className="absolute -left-32 bottom-10">
        <Contours className="relative h-[26rem] w-[26rem] opacity-45" />
      </Parallax>
      <Pine className="sway absolute bottom-8 right-[12%] hidden h-24 w-14 opacity-50 lg:block" shade="var(--green)" />
      <Pine className="sway absolute bottom-4 right-[8%] hidden h-32 w-20 opacity-70 lg:block [animation-delay:-2s]" />

      <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeader eyebrow="The Trail Map" title="The Road So Far" align="center" />

        <div className="relative mt-14">
          {/* Hand-drawn dotted trail, revealed on scroll */}
          <div
            ref={pathRef}
            aria-hidden="true"
            className="absolute bottom-4 left-5 top-2 sm:left-1/2 sm:-translate-x-1/2"
            style={reduced ? undefined : { clipPath: "inset(0px 0px 100% 0px)" }}
          >
            <svg
              width="24"
              height="100%"
              preserveAspectRatio="none"
              viewBox="0 0 24 600"
              className="h-full"
            >
              <path
                d="M12 0 C 20 80, 4 140, 12 220 C 20 300, 4 360, 12 440 C 18 520, 8 560, 12 600"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="0.5 9"
              />
            </svg>
          </div>

          <ol className="space-y-14">
            {stops.map((stop, i) => (
              <li key={stop.company}>
                <Reveal delay={0.05 * i}>
                  <div
                    className={`relative flex items-start gap-6 pl-14 sm:w-1/2 sm:pl-0 ${
                      i % 2 === 0
                        ? "sm:mr-auto sm:flex-row-reverse sm:pr-12 sm:text-right"
                        : "sm:ml-auto sm:pl-12"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-[0.85rem] top-1.5 h-3 w-3 rounded-full border-2 border-gold bg-paper shadow-[0_0_0_4px_rgba(201,164,92,0.15)] sm:left-auto ${
                        i % 2 === 0 ? "sm:-right-[6.5px]" : "sm:-left-[6.5px]"
                      }`}
                    />
                    <div>
                      <svg
                        viewBox="0 0 32 28"
                        aria-hidden="true"
                        className={`mb-2 h-7 w-8 opacity-80 ${i % 2 === 0 ? "sm:ml-auto" : ""}`}
                      >
                        {stop.waypoint}
                      </svg>
                      <h3 className="font-display text-2xl font-semibold tracking-wide">
                        {stop.company}
                      </h3>
                      <p className="mt-1 font-mono text-[0.66rem] tracking-[0.18em] text-ink-soft">
                        {stop.role} · {stop.dates}
                      </p>
                      <p className="mt-2 text-[0.85rem] leading-6 text-ink-soft">
                        {stop.summary}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
