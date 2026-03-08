import { GraduationCap, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEducation } from "@/hooks/useSiteContent";

const EducationSection = () => {
  const { data: education = [] } = useEducation();

  return (
    <section id="education" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(250 30% 10%) 0%, hsl(250 35% 14%) 50%, hsl(280 30% 12%) 100%)" }}>
      <div className="absolute top-0 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-primary/8 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div className="flex items-center gap-3 mb-12" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="p-2.5 rounded-xl bg-accent/20">
            <GraduationCap className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Education</h2>
        </motion.div>

        <div className="grid gap-6 max-w-3xl">
          {education.map((edu, i) => (
            <motion.div key={edu.id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Card className="card-hover group border-none shadow-md relative overflow-hidden glass-dark">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-primary" />
                <CardContent className="p-6 pl-8">
                  <h3 className="text-lg font-bold text-hero-foreground group-hover:text-accent transition-colors">{edu.institution}</h3>
                  <p className="text-hero-accent font-semibold mt-1">{edu.degree}</p>
                  <p className="flex items-center gap-1.5 text-sm text-hero-muted mt-2">
                    <Calendar className="h-3.5 w-3.5" /> {edu.period}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
