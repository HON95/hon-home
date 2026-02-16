import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import TechSection from "@/components/TechSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <main className="bg-background text-foreground">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <TechSection />
      <FooterSection />
    </main>
  );
};

export default Index;
