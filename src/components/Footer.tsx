import * as React from "react";
import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { useHero } from "@/hooks/useSiteContent";

const Footer = React.forwardRef<HTMLElement>((_, ref) => {
  const { data: hero } = useHero();
  const fullName = hero?.full_name ?? "Nilesh Chatap";
  const email = hero?.email ?? "";
  const githubUrl = hero?.github_url ?? "";
  const linkedinUrl = hero?.linkedin_url ?? "";

  return (
    <footer ref={ref} className="py-10" style={{ background: "linear-gradient(180deg, hsl(280 30% 12%) 0%, hsl(250 30% 6%) 100%)" }}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-hero-muted text-sm">
            © {new Date().getFullYear()} {fullName}. Built with <Heart className="h-3.5 w-3.5 inline text-destructive fill-destructive" />
          </p>
          <div className="flex items-center gap-4">
            {email && (
              <a href={`mailto:${email}`} aria-label="Email" className="text-hero-muted hover:text-hero-accent transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-hero-muted hover:text-hero-accent transition-colors">
                <Github className="h-5 w-5" />
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-hero-muted hover:text-hero-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = "Footer";

export default Footer;
