import { Briefcase, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useExperiences } from "@/hooks/useSiteContent";

const ExperienceSection = () => {
  const { data: experiences = [] } = useExperiences();

  return (
    <section id="experience" className="py-24 hero-gradient relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-20 w-60 h-60 bg-accent/8 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div className="flex items-center gap-3 mb-12" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="p-2.5 rounded-xl bg-primary/20">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Experience</h2>
        </motion.div>

        <div className="grid gap-6 max-w-3xl">
          {experiences.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Card className="card-hover group border-none shadow-md overflow-hidden glass-dark">
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
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
