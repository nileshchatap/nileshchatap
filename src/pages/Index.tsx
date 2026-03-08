import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactForm from "@/components/ContactForm";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";

const Index = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;
      e.preventDefault();
      const id = anchor.getAttribute("href")?.slice(1);
      if (id) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleField />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactForm />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
