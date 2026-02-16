import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import TechSection from "@/components/TechSection";
import GameSection from "@/components/GameSection";
import TerminalSection from "@/components/TerminalSection";
import FooterSection from "@/components/FooterSection";
import AiBanner from "@/components/AiBanner";
import RetroMusicPlayer from "@/components/RetroMusicPlayer";

const Index = () => {
  return (
    <main className="bg-background text-foreground">
      <AiBanner />
      <div className="pt-10">
        <HeroSection />
      </div>
      <AboutSection />
      <StatsSection />
      <ProjectsSection />
      <TechSection />
      <GameSection />
      <TerminalSection />
      <FooterSection />
      <RetroMusicPlayer />
    </main>
  );
};

export default Index;
