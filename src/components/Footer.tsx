import * as React from "react";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = React.forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="py-10" style={{ background: "linear-gradient(180deg, hsl(280 30% 12%) 0%, hsl(250 30% 6%) 100%)" }}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-hero-muted text-sm">
            © {new Date().getFullYear()} Nilesh Chatap. Built with <Heart className="h-3.5 w-3.5 inline text-destructive fill-destructive" /> 
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:nileshchatap25@gmail.com" className="text-hero-muted hover:text-hero-accent transition-colors">
              <Mail className="h-5 w-5" />
            </a>
            <a href="https://github.com/NileshChatap2625-Star" target="_blank" rel="noopener noreferrer" className="text-hero-muted hover:text-hero-accent transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/in/nilesh-chatap-967101348" target="_blank" rel="noopener noreferrer" className="text-hero-muted hover:text-hero-accent transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = "Footer";

export default Footer;
