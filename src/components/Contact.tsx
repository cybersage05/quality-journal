import { Reveal } from "./ui";
import { Birds, Cloud, CompassRose, Contours, Parallax, Pine, SectionStage } from "./decor";

const items = [
  { icon: "✉", label: "reevan5dsouza@gmail.com", href: "mailto:reevan5dsouza@gmail.com" },
  { icon: "☎", label: "+66 065 053 0098", href: "tel:+660650530098" },
  { icon: "⌥", label: "github.com/cybersage05", href: "https://github.com/cybersage05" },
  {
    icon: "◈",
    label: "Live QA Dashboard → cybersage05.github.io/IronPdfQA",
    href: "https://cybersage05.github.io/IronPdfQA",
  },
];

/** Watercolor hills return softly at the last page. */
function FooterHills() {
  return (
    <svg
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      className="block h-40 w-full sm:h-52"
      aria-hidden="true"
    >
      <path
        d="M0 130 C 200 80, 380 150, 600 110 C 820 70, 1040 140, 1440 95 L1440 220 L0 220 Z"
        fill="var(--mist)"
      />
      <path
        d="M0 165 C 260 120, 480 185, 760 150 C 1040 115, 1240 180, 1440 145 L1440 220 L0 220 Z"
        fill="var(--green-light)"
        opacity="0.8"
      />
      <path
        d="M0 200 C 320 160, 620 215, 940 185 C 1200 162, 1340 205, 1440 190 L1440 220 L0 220 Z"
        fill="var(--green)"
        opacity="0.85"
      />
      {/* tiny estate house on the far hill */}
      <g transform="translate(1130 118)" opacity="0.75">
        <rect x="0" y="6" width="14" height="10" fill="var(--forest)" />
        <path d="M-2 7 L7 -1 L16 7 Z" fill="var(--terracotta)" />
        <rect x="9" y="10" width="3" height="6" fill="var(--gold)" />
      </g>
    </svg>
  );
}

export default function Contact() {
  return (
    <section id="contact" aria-label="Contact" className="relative overflow-hidden bg-paper">
      <Parallax speed={0.26} className="absolute -left-28 top-10">
        <Contours className="relative h-[26rem] w-[26rem] opacity-45" />
      </Parallax>
      <Parallax speed={0.16} className="absolute right-[7%] top-24 hidden h-20 w-20 md:block">
        <CompassRose className="!relative h-full w-full" />
      </Parallax>
      <Cloud className="cloud absolute left-[12%] top-10 w-36 opacity-60 blur-[1px]" />
      <Cloud className="cloud absolute right-[22%] top-20 hidden w-28 opacity-45 blur-[2px] md:block [animation-delay:-40s]" />

      <SectionStage className="relative mx-auto max-w-4xl px-5 pt-20 text-center sm:px-8 sm:pt-24">
        <Reveal>
          <p className="eyebrow">The Last Page</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-wide sm:text-5xl">
            Let's Build Quality Together.
          </h2>
          <p className="mt-4 text-[0.88rem] leading-7 text-ink-soft">
            Open to QA and Test Engineering roles across Thailand and Southeast Asia.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <ul className="mx-auto mt-12 flex max-w-md flex-col gap-3 text-left">
            {items.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center gap-4 rounded-xl border border-line bg-card px-5 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[0_6px_18px_rgba(46,58,48,0.08)]"
                >
                  <span aria-hidden="true" className="font-mono text-gold">
                    {item.icon}
                  </span>
                  <span className="font-mono text-[0.74rem] tracking-wide text-ink-soft">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-16 font-display text-2xl font-semibold italic text-gold">
            "Building quality into every release."
          </p>
        </Reveal>
      </SectionStage>

      <div className="relative mt-16">
        {/* Dusk life over the last hills — fireflies, birds, pines */}
        <Birds className="float-bob left-[16%] -top-10 h-10 w-28 opacity-70" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-16 h-24">
          {[
            { l: "22%", t: "30%", d: "0s" },
            { l: "38%", t: "62%", d: "1.1s" },
            { l: "55%", t: "24%", d: "0.4s" },
            { l: "68%", t: "55%", d: "1.8s" },
            { l: "82%", t: "38%", d: "0.8s" },
          ].map((f) => (
            <span
              key={f.l}
              className="deco-blink absolute h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]"
              style={{ left: f.l, top: f.t, animationDelay: f.d }}
            />
          ))}
        </div>
        <Pine className="sway absolute -top-12 left-[6%] z-10 hidden h-20 w-12 opacity-80 sm:block" />
        <Pine className="sway absolute -top-20 left-[10%] z-10 hidden h-28 w-16 sm:block [animation-delay:-2.5s]" />
        <FooterHills />
        <footer className="bg-forest pb-6 pt-1 text-center dark:bg-[#1f3528]">
          <p className="font-mono text-[0.64rem] tracking-[0.18em] text-paper/90 dark:text-ink/80">
            Reevan D'Souza · Software QA &amp; Test Engineer · Phetchaburi, Thailand
          </p>
        </footer>
      </div>
    </section>
  );
}
