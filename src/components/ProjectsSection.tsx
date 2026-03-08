import { FolderOpen, ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useSiteContent";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 14 } },
};

const ProjectsSection = () => {
  const { data: projects = [] } = useProjects();

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(250 30% 10%) 0%, hsl(250 35% 14%) 50%, hsl(280 30% 12%) 100%)" }}>
      <div className="absolute top-10 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl floating" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-accent/8 rounded-full blur-3xl floating" style={{ animationDelay: "2s" }} />

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
            <FolderOpen className="h-6 w-6 text-primary" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Projects
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 max-w-5xl"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {projects.map((project) => {
            const bullets = Array.isArray(project.bullets) ? project.bullets as string[] : [];
            const url = (project as any).project_url;
            return (
              <motion.div key={project.id} variants={item} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="group border-none shadow-md overflow-hidden h-full flex flex-col glass-dark transition-shadow hover:shadow-2xl hover:shadow-primary/20">
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
                        <Button asChild size="sm" className="gap-2 bg-primary/20 text-hero-accent border border-primary/30 hover:bg-primary/40 transition-all rounded-xl hover:scale-105">
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
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
