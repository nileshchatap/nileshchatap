import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageCircle, Phone, Mail, Linkedin, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useHero } from "@/hooks/useSiteContent";

const contactCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, type: "spring" as const, stiffness: 100 },
  }),
};

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const { data: hero } = useHero();

  const email = hero?.email ?? "";
  const phone = hero?.phone ?? "";
  const linkedinUrl = hero?.linkedin_url ?? "";
  const githubUrl = hero?.github_url ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("submissions").insert([form]);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Your message has been submitted." });
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  };

  const infoCards = [
    ...(phone ? [{ icon: Phone, label: "Phone", value: phone, href: `tel:${phone}` }] : []),
    ...(email ? [{ icon: Mail, label: "Email", value: email, href: `mailto:${email}` }] : []),
    ...(linkedinUrl ? [{ icon: Linkedin, label: "LinkedIn", value: "Connect on LinkedIn", href: linkedinUrl, external: true }] : []),
    ...(githubUrl ? [{ icon: Github, label: "GitHub", value: githubUrl.replace("https://github.com/", ""), href: githubUrl, external: true }] : []),
  ];

  return (
    <section id="contact" className="py-24 hero-gradient relative overflow-hidden">
      <div className="absolute top-10 right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent/8 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-hero-foreground mb-12"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get in Touch
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Info Cards */}
          <div className="space-y-4">
            {infoCards.map((card, i) => (
              <motion.a
                key={card.label}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                custom={i}
                variants={contactCardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-4 p-5 rounded-2xl glass-dark border border-white/10 hover:border-primary/40 transition-all hover:scale-[1.02] group cursor-pointer block"
              >
                <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-hero-muted uppercase tracking-wider">{card.label}</p>
                  <p className="text-base font-semibold text-hero-foreground">{card.value}</p>
                </div>
              </motion.a>
            ))}

            {/* Action Buttons */}
            <motion.div
              className="flex gap-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {phone && (
                <Button size="lg" className="flex-1 gap-2 rounded-2xl py-6 bg-gradient-to-r from-primary to-accent glow-primary hover:scale-105 transition-transform" asChild>
                  <a href={`tel:${phone}`}><Phone className="h-5 w-5" /> Call Now</a>
                </Button>
              )}
              {linkedinUrl && (
                <Button size="lg" variant="outline" className="flex-1 gap-2 rounded-2xl py-6 border-white/20 bg-white/5 text-hero-foreground hover:bg-white/10 hover:scale-105 transition-transform" asChild>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5" /> LinkedIn</a>
                </Button>
              )}
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-none shadow-xl overflow-hidden glass-dark bg-transparent">
              <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl text-center text-hero-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input placeholder="Your Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl bg-white/5 border-white/10 text-hero-foreground placeholder:text-hero-muted/50 focus:border-primary" />
                  <Input type="email" placeholder="Your Email *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl bg-white/5 border-white/10 text-hero-foreground placeholder:text-hero-muted/50 focus:border-primary" />
                  <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl bg-white/5 border-white/10 text-hero-foreground placeholder:text-hero-muted/50 focus:border-primary" />
                  <Textarea placeholder="Your Message *" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-xl bg-white/5 border-white/10 text-hero-foreground placeholder:text-hero-muted/50 focus:border-primary" />
                  <Button type="submit" className="w-full gap-2 rounded-xl py-6 text-base glow-primary bg-gradient-to-r from-primary to-primary/80" disabled={loading}>
                    <Send className="h-4 w-4" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
