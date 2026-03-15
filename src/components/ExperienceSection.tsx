import { Briefcase, MapPin, Calendar, Award, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useExperiences } from "@/hooks/useSiteContent";
import { useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  show: { opacity: 1, x: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

const ExperienceSection = () => {
  const { data: experiences = [] } = useExperiences();
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  return (
    <section id="experience" className="py-24 hero-gradient relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl floating" />
      <div className="absolute bottom-10 right-20 w-60 h-60 bg-accent/8 rounded-full blur-3xl floating" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="flex items-center gap-3 mb-12"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <motion.div
            className="p-2.5 rounded-xl bg-primary/20"
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <Briefcase className="h-6 w-6 text-primary" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Experience</h2>
        </motion.div>

        <motion.div
          className="grid gap-6 max-w-3xl"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {experiences.map((exp) => (
            <motion.div key={exp.id} variants={item}>
              <Card className="card-hover group border-none shadow-md overflow-hidden glass-dark bg-transparent">
                <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-hero-foreground group-hover:text-primary transition-colors">{exp.company}</h3>
                  <p className="text-hero-accent font-semibold mt-1">{exp.role}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-hero-muted">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {exp.period}</span>
                    {exp.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {exp.location}</span>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
