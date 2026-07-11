import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("submissions").insert([form]);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    } else {
      // Fire-and-forget admin notification email.
      supabase.functions.invoke("notify-contact", { body: form }).catch(() => {});
      toast({ title: "Success!", description: "Your message has been submitted." });
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <section id="contact" className="py-24 hero-gradient relative overflow-hidden">
      <div className="absolute top-10 right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent/8 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12" />

        <div className="max-w-xl mx-auto">
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
