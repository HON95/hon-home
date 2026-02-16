import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import TechSection from "@/components/TechSection";
import TerminalSection from "@/components/TerminalSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <main className="bg-background text-foreground">
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <ProjectsSection />
      <TechSection />
      <TerminalSection />
      <FooterSection />
    </main>
  );
};

export default Index;
