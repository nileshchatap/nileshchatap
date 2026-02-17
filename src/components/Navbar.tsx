import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async (email: string | undefined) => {
      if (!email) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.rpc("is_admin", { _email: email });
      setIsAdmin(!!data);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdmin(session?.user?.email);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAdmin(session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-foreground">
          Nilesh <span className="text-gradient">Chatap</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
          <a href="https://github.com/NileshChatap2625-Star" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </a>
          {isAdmin && (
            <Link to="/admin/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden glass border-t px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
          <a href="https://github.com/NileshChatap2625-Star" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </a>
          {isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="sm" className="gap-2 w-full">
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
