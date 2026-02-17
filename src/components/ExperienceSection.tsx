import { Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const experiences = [
  {
    company: "Infosys Springboard",
    role: "Artificial Intelligence",
    period: "January 2026 - Present (2 months)",
    location: "Pune, Maharashtra, India",
  },
  {
    company: "Edunet Foundation",
    role: "Artificial Intelligence and Machine Learning",
    period: "December 2025 - February 2026 (3 months)",
    location: "Bengaluru, Karnataka, India",
  },
  {
    company: "Google Student Ambassador Program X MCE",
    role: "Google Student Ambassador",
    period: "September 2025 - February 2026 (6 months)",
    location: "Maharashtra, India",
  },
  {
    company: "Elevate Labs",
    role: "Data Analyst Intern",
    period: "September 2025 - November 2025 (3 months)",
    location: "Bengaluru, Karnataka, India",
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <Briefcase className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Experience</h2>
        </div>
        <div className="grid gap-6 max-w-3xl">
          {experiences.map((exp, i) => (
            <Card key={i} className="card-hover border-l-4 border-l-primary" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground">{exp.company}</h3>
                <p className="text-primary font-medium">{exp.role}</p>
                <p className="text-sm text-muted-foreground mt-1">{exp.period}</p>
                <p className="text-sm text-muted-foreground">{exp.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
