import { Code, Award, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const skills = ["pandas", "Artificial Intelligence", "Machine Learning", "C", "Python", "Data Analyst", "Data Structure", "Scikit-learn", "NumPy", "Linear Regression", "Git", "Data Science", "SQL", "DBMS", "Prompt Engineering", "Deep Learning", "LLM"];

const certifications = [
  "Google Student Ambassador Certified (6 Month)",
  "Generative AI: Prompt Engineering Basics",
  "Microsoft Azure SQL",
  "GenAI in Data Analytics",
  "Tata - GenAI Powered Data Analytics Job Simulation",
  "Conditional Formatting, Tables and Charts in Microsoft Excel",
  "5-Day AI Agents Intensive Course with Google",
  "Getting Started with Generative AI - Certified in IBM",
  "Introduction to Gen AI - Certified in Google Cloud",
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 section-gradient relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Top Skills
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Badge
                    variant="secondary"
                    className="px-4 py-2.5 text-sm font-medium cursor-default hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110 hover:shadow-lg"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-accent/10">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Certifications
              </h2>
            </div>
            <div className="space-y-3">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Card className="border-none shadow-sm hover:shadow-md transition-all hover:translate-x-1">
                    <CardContent className="p-4 flex items-start gap-3">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-accent to-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">{cert}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;