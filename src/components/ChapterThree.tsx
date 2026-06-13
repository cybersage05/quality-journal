import { FlowDiagram, type FlowNode } from "./FlowDiagram";
import { Impact, MetaChips, Pills, Reveal, SectionHeader } from "./ui";
import {
  Contours,
  Fig,
  GhostNumeral,
  MarginNote,
  MeadowEdge,
  Parallax,
  RobotScene,
} from "./decor";

const rpaFlow: FlowNode[] = [
  { title: "Business Process", icon: "clipboard" },
  { title: "UiPath Bot", icon: "bot" },
  { title: "ERP / SCM System", icon: "db" },
  {
    title: "Validation Layer",
    tone: "green",
    icon: "shield",
    details: [
      "Full test cases and edge-case validation scripts for every module",
      "Deployment documentation shipped alongside each bot",
    ],
  },
  { title: "Automated Execution", icon: "play" },
  { title: "✓ Business Outcome", tone: "gold", icon: "seal" },
];

export default function ChapterThree() {
  return (
    <section
      aria-label="Chapter three — EOX Vantage"
      className="relative overflow-hidden bg-paper pb-16"
    >
      <GhostNumeral n="03" className="-top-4 right-2 sm:right-10" />
      <Contours className="-left-24 top-[20%] h-[28rem] w-[28rem] opacity-45" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_14rem]">
          <SectionHeader
            eyebrow="Chapter Three · Automation Engineer · Remote"
            title="Robotic Process Automation"
            intro="Designed and deployed 5+ RPA bots using UiPath integrated with ERP and SCM workflows — with full test cases, edge-case validation scripts and deployment documentation for every module."
          >
            <MetaChips
              items={[
                { icon: "building", text: "EOX Vantage" },
                { icon: "pin", text: "Remote" },
                { icon: "calendar", text: "2021" },
                { icon: "people", text: "5+ bots in production" },
              ]}
            />
          </SectionHeader>
          <Reveal delay={0.15} className="hidden lg:block">
            <Parallax speed={0.18}>
              <RobotScene rotate={2} className="mt-4" />
            </Parallax>
          </Reveal>
        </div>

        <Reveal className="relative mt-12">
          <FlowDiagram
            nodes={rpaFlow}
            ariaLabel="RPA automation flow"
            description="A business process is automated by a UiPath bot integrated with ERP and SCM systems, verified by a validation layer, then executed automatically to deliver the business outcome."
          />
          <MarginNote className="right-[8%] top-[42%] hidden xl:flex" arrow="left">
            tested like everything else
          </MarginNote>
          <Fig n="06" label="five bots, zero unattended surprises" />
        </Reveal>

        <Reveal className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 text-center">
          <Pills items={["UiPath", "Selenium", "Python", "ERP/SCM Integration"]} />
          <Impact>75% manual processing load eliminated</Impact>
        </Reveal>
      </div>

      <MeadowEdge />
    </section>
  );
}
