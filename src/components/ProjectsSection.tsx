import { FolderOpen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useSiteContent";

const colors = [
  "from-primary to-accent",
  "from-accent to-primary",
  "from-primary to-primary/60",
];

const ProjectsSection = () => {
  const { data: projects = [] } = useProjects();

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 bg-muted/40">
      <div className="container mx-auto px-6">
        <motion.div
          className="flex items-center gap-3 mb-12"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="p-2.5 rounded-xl bg-primary/10">
            <FolderOpen className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Projects
          </h2>
        </motion.div>

        <div className="grid gap-6 max-w-3xl">
          {projects.map((project, i) => {
            const bullets = Array.isArray(project.bullets) ? project.bullets as string[] : [];
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="card-hover group border-none shadow-md overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${colors[i % colors.length]}`} />
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {bullets.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {bullets.map((bullet, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
