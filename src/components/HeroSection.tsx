import { Mail, Phone, Linkedin, MapPin, Github, Download, Eye } from "lucide-react";
import adminPhoto from "@/assets/admin-photo.jpg";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="hero-gradient pt-28 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <img
            src={adminPhoto}
            alt="Nilesh Chatap"
            className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-primary/20 shadow-lg"
          />
          <h1 className="text-5xl md:text-6xl font-extrabold text-hero-foreground mb-4">
            Nilesh Chatap
          </h1>
          <p className="text-lg md:text-xl text-hero-muted mb-6 leading-relaxed">
            Intern Infosys Springboard | Edunet Foundation | Elevate Lab |
            Google Student Ambassador | C | Python | Data Analyst | Data Structure | AI
          </p>
          <div className="flex items-center justify-center gap-2 text-hero-muted mb-8">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Beed, Maharashtra, India</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:nileshchatap25@gmail.com"
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm text-hero-accent hover:bg-primary/20 transition-colors"
            >
              <Mail className="h-4 w-4" /> nileshchatap25@gmail.com
            </a>
            <a
              href="tel:9021412625"
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm text-hero-accent hover:bg-primary/20 transition-colors"
            >
              <Phone className="h-4 w-4" /> 9021412625
            </a>
            <a
              href="https://www.linkedin.com/in/nilesh-chatap-967101348"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm text-hero-accent hover:bg-primary/20 transition-colors"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href="https://github.com/NileshChatap2625-Star"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm text-hero-accent hover:bg-primary/20 transition-colors"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Button size="lg" className="gap-2 text-base px-8 py-6 rounded-xl shadow-lg hover:scale-105 transition-transform" asChild>
              <a href="#skills"><Eye className="h-5 w-5" /> View My Skills</a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6 rounded-xl shadow-lg hover:scale-105 transition-transform border-primary/40" asChild>
              <a href="#contact"><Mail className="h-5 w-5" /> Get In Touch</a>
            </Button>
            <Button size="lg" variant="secondary" className="gap-2 text-base px-8 py-6 rounded-xl shadow-lg hover:scale-105 transition-transform" asChild>
              <a href="#experience"><Download className="h-5 w-5" /> View Experience</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
