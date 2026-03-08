import { Mail, Phone, Linkedin, MapPin, Github, Eye, Sparkles, ArrowDown, Download } from "lucide-react";
import defaultPhoto from "@/assets/admin-photo.jpg";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useHero } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const { data: hero } = useHero();

  const fullName = hero?.full_name ?? "Nilesh Chatap";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ");
  const photoUrl = (hero as any)?.photo_url || "";
  const resumeUrl = (hero as any)?.resume_url || "";
  const tagline = hero?.tagline ?? "";
  const location = hero?.location ?? "";
  const email = hero?.email ?? "";
  const phone = hero?.phone ?? "";
  const linkedinUrl = hero?.linkedin_url ?? "";
  const githubUrl = hero?.github_url ?? "";

  const contactLinks = [
    ...(email ? [{ href: `mailto:${email}`, icon: Mail, label: email }] : []),
    ...(phone ? [{ href: `tel:${phone}`, icon: Phone, label: phone }] : []),
    ...(linkedinUrl ? [{ href: linkedinUrl, icon: Linkedin, label: "LinkedIn", external: true }] : []),
    ...(githubUrl ? [{ href: githubUrl, icon: Github, label: "GitHub", external: true }] : []),
  ];

  return (
    <section className="hero-gradient pt-28 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl floating" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl floating" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pulse-glow" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
            <img src={photoUrl || defaultPhoto} alt={fullName} className="w-36 h-36 rounded-full object-cover mx-auto mb-6 border-4 border-primary/30 shadow-2xl glow-primary" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-accent tracking-wider uppercase">Portfolio</span>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <span className="text-hero-foreground">{firstName} </span>
              <span className="text-gradient-purple">{lastName}</span>
            </h1>
          </motion.div>

          <motion.p className="text-base md:text-lg text-hero-muted mb-6 leading-relaxed max-w-2xl mx-auto italic" style={{ fontFamily: "'Playfair Display', serif" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.3 }}>
            {tagline}
          </motion.p>

          {location && (
            <motion.div className="flex items-center justify-center gap-2 text-hero-muted mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <MapPin className="h-4 w-4 text-accent" />
              <span className="text-sm">{location}</span>
            </motion.div>
          )}

          <motion.div className="flex flex-wrap items-center justify-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
            {contactLinks.map((link) => (
              <a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className="flex items-center gap-2 rounded-xl glass-dark px-4 py-2.5 text-sm text-hero-accent hover:bg-primary/20 transition-all hover:scale-105">
                <link.icon className="h-4 w-4" /> {link.label}
              </a>
            ))}
          </motion.div>

          <motion.div className="flex flex-wrap items-center justify-center gap-4 mt-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.5 }}>
            <Button size="lg" className="gap-2 text-base px-8 py-6 rounded-2xl shadow-xl glow-primary hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/80" asChild>
              <a href="#skills"><Eye className="h-5 w-5" /> View My Skills</a>
            </Button>
            {resumeUrl && (
              <Button size="lg" className="gap-2 text-base px-8 py-6 rounded-2xl shadow-xl hover:scale-105 transition-transform bg-gradient-to-r from-accent to-accent/80" onClick={async () => {
                try {
                  const response = await fetch(resumeUrl);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "resume.pdf";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                } catch {
                  window.open(resumeUrl, "_blank");
                }
              }}>
                <Download className="h-5 w-5" /> Download Resume
              </Button>
            )}
            <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6 rounded-2xl shadow-xl hover:scale-105 transition-transform border-white/40 bg-white/10 text-white hover:bg-white/20" asChild>
              <a href="#contact"><Mail className="h-5 w-5" /> Get In Touch</a>
            </Button>
          </motion.div>

          <motion.div className="mt-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
            <a href="#experience" className="inline-flex flex-col items-center gap-1 text-hero-muted hover:text-hero-accent transition-colors">
              <span className="text-xs uppercase tracking-widest">Scroll Down</span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
