import { Code, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const skills = ["pandas", "Artificial Intelligence", "Machine Learning", "C", "Python", "Data Analyst", "Data Structure"];

const certifications = [
  "Google Student Ambassador Certified (6 Month)",
  "Generative AI: Prompt Engineering Basics",
  "Microsoft Azure SQL",
  "GenAI in Data Analytics",
  "Tata - GenAI Powered Data Analytics Job Simulation",
  "Conditional Formatting, Tables and Charts in Microsoft Excel",
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Code className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Top Skills</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Award className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Certifications</h2>
            </div>
            <ul className="space-y-3">
              {certifications.map((cert) => (
                <li key={cert} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0" />
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
