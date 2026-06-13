import { useState } from "react";
import Loader from "./components/Loader";
import CursorGlow from "./components/CursorGlow";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ChapterOne from "./components/ChapterOne";
import ChapterTwo from "./components/ChapterTwo";
import ChapterThree from "./components/ChapterThree";
import STLCDiagram from "./components/STLCDiagram";
import IronProjects from "./components/IronProjects";
import Timeline from "./components/Timeline";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import { useTheme } from "./hooks/useTheme";
import { PointerProvider } from "./hooks/usePointer";
import { JournalRail } from "./components/decor";

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [started, setStarted] = useState(false);

  return (
    <PointerProvider>
      <div className="grain">
        <Loader onDone={() => setStarted(true)} />
        <CursorGlow />
        <Nav theme={theme} onToggleTheme={toggleTheme} />
        <JournalRail />
        <main>
          <Hero theme={theme} started={started} />
          <ChapterOne />
          <ChapterTwo />
          <STLCDiagram />
          <ChapterThree />
          <IronProjects />
          <Timeline />
          <Skills />
          <Contact />
        </main>
      </div>
    </PointerProvider>
  );
}
