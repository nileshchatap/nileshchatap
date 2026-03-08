import { Menu, X, Shield, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkAdmin = async (email?: string) => {
      if (!email) { setIsAdmin(false); return; }
      const { data } = await supabase.rpc("is_admin", { _email: email });
      setIsAdmin(!!data);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAdmin(session?.user?.email ?? undefined);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdmin(session?.user?.email ?? undefined);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#github", label: "GitHub" },
    { href: "#contact", label: "Contact" },
  ];

  const textColor = scrolled ? "text-foreground" : "text-white";
  const linkColor = scrolled ? "text-muted-foreground hover:text-primary" : "text-white/70 hover:text-white";
  const mobileToggleColor = scrolled ? "text-foreground" : "text-white";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-lg border-b border-border/30" : "bg-transparent border-b border-white/10"}`}>
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className={`text-xl font-bold ${textColor} flex items-center gap-1.5 transition-colors`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <Sparkles className="h-5 w-5 text-primary" />
          Nilesh <span className="text-gradient-purple">Chatap</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={`text-sm font-medium ${linkColor} transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full`}>
              {link.label}
            </a>
          ))}
          {isAdmin && (
            <Link to="/admin/dashboard" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
        </div>

        <button className={`md:hidden ${mobileToggleColor}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-border/30 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
          {isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;