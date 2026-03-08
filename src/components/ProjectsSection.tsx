import { FolderOpen, ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useSiteContent";

const ProjectsSection = () => {
  const { data: projects = [] } = useProjects();

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(250 30% 10%) 0%, hsl(250 35% 14%) 50%, hsl(280 30% 12%) 100%)" }}>
      <div className="absolute top-10 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-accent/8 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="flex items-center gap-3 mb-12"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="p-2.5 rounded-xl bg-primary/20">
            <FolderOpen className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Projects
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
          {projects.map((project, i) => {
            const bullets = Array.isArray(project.bullets) ? project.bullets as string[] : [];
            const url = (project as any).project_url;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="card-hover group border-none shadow-md overflow-hidden h-full flex flex-col glass-dark">
                  <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                  <CardContent className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-hero-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="mt-2 text-sm text-hero-muted">{project.description}</p>
                    )}
                    {bullets.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {bullets.map((bullet, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-hero-muted">
                            <ChevronRight className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {url && (
                      <div className="mt-auto pt-4">
                        <Button asChild size="sm" className="gap-2 bg-primary/20 text-hero-accent border border-primary/30 hover:bg-primary/40 transition-all rounded-xl">
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" /> View Project
                          </a>
                        </Button>
                      </div>
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
