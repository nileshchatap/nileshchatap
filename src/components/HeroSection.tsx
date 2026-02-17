import { Mail, Phone, Linkedin, MapPin, Github } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="hero-gradient pt-28 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
