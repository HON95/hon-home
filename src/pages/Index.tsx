import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RandomFactsSection from "@/components/RandomFactsSection";
import TechSection from "@/components/TechSection";
import GameSection from "@/components/GameSection";
import TerminalSection from "@/components/TerminalSection";
import SoulsQuizSection from "@/components/SoulsQuizSection";
import FooterSection from "@/components/FooterSection";
import AiBanner from "@/components/AiBanner";
import RetroMusicPlayer from "@/components/RetroMusicPlayer";
import FishEasterEgg from "@/components/FishEasterEgg";
import DarkSoulsEasterEgg from "@/components/DarkSoulsEasterEgg";

const Index = () => {
  return (
    <main className="bg-background text-foreground">
      <AiBanner />
      <div className="pt-10">
        <HeroSection />
      </div>
      <AboutSection />
      <RandomFactsSection />
      <TechSection />
      <GameSection />
      <SoulsQuizSection />
      <TerminalSection />
      <FooterSection />
      <RetroMusicPlayer />
      <FishEasterEgg />
      <DarkSoulsEasterEgg />
    </main>
  );
};

export default Index;
