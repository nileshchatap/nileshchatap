import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";
import { useAbout } from "@/hooks/useSiteContent";

const AboutSection = () => {
  const { data: about } = useAbout();

  if (!about?.content) return null;

  return (
    <section id="about" className="py-20 relative" style={{ background: "linear-gradient(180deg, hsl(250 30% 8%) 0%, hsl(250 35% 12%) 50%, hsl(250 30% 10%) 100%)" }}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-accent tracking-wider uppercase">About Me</span>
            <Sparkles className="h-5 w-5 text-accent" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Who I <span className="text-gradient-purple">Am</span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-dark rounded-2xl p-8 md:p-10"
          >
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-7 w-7 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              {about.content}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
