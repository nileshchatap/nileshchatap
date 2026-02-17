import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-foreground">
          Nilesh <span className="text-gradient">Chatap</span>
        </Link>
        <div className="flex flex-wrap items-center gap-3 md:gap-5">
          <a href="#experience" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Experience</a>
          <a href="#education" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Education</a>
          <a href="#skills" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Skills</a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          <a href="https://github.com/NileshChatap2625-Star" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
          <Link to="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
