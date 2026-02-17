import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const education = [
  {
    institution: "Savitribai Phule Pune University",
    degree: "Bachelor of Engineering - BE, Artificial Intelligence",
    period: "September 2024 - July 2028",
  },
  {
    institution: "ADSULS Technical Campus Faculty of MBA, Ahmednagar",
    degree: "Bachelor of Engineering - BE, Artificial Intelligence",
    period: "September 2024 - June 2028",
  },
  {
    institution: "Dnyaneshwar Mauli Maydhmic & Uchh-Maydhmic Vidhyalaya, Pimpari",
    degree: "Science",
    period: "June 2023 - March 2024",
  },
  {
    institution: "Vasant Vidhyalaya, Kaij",
    degree: "Primary School, Science",
    period: "June 2021 - June 2022",
  },
];

const EducationSection = () => {
  return (
    <section id="education" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Education</h2>
        </div>
        <div className="grid gap-6 max-w-3xl">
          {education.map((edu, i) => (
            <Card key={i} className="card-hover">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground">{edu.institution}</h3>
                <p className="text-primary font-medium">{edu.degree}</p>
                <p className="text-sm text-muted-foreground mt-1">{edu.period}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
