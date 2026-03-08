import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers" as any)
      .insert([{ email: trimmed }] as any);
    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already subscribed!", description: "This email is already on our list." });
      } else {
        toast({ title: "Error", description: "Failed to subscribe. Please try again.", variant: "destructive" });
      }
    } else {
      toast({ title: "Subscribed!", description: "You'll receive our latest updates." });
      setEmail("");
    }
  };

  return (
    <section className="py-16 hero-gradient relative overflow-hidden">
      <div className="absolute top-5 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-md mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-hero-foreground mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Newsletter
          </h2>
          <p className="text-hero-muted mb-6">
            Subscribe to our newsletter for latest updates.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl bg-white text-foreground placeholder:text-muted-foreground border-none h-12 text-base px-5"
            />
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl h-12 text-base font-bold bg-transparent hover:bg-white/10 text-hero-foreground border-none shadow-none"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
