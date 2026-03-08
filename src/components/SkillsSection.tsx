import { Zap, Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useSkills, useCertifications } from "@/hooks/useSiteContent";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const SkillsSection = () => {
  const { data: skills = [] } = useSkills();
  const { data: certifications = [] } = useCertifications();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="skills" className="py-24 hero-gradient relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-primary/20"><Zap className="h-6 w-6 text-primary" /></div>
              <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Top Skills</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.3 }}>
                  <Badge className="px-4 py-2.5 text-sm font-medium cursor-default bg-primary/15 text-hero-accent border border-primary/30 hover:bg-primary/30 transition-all hover:scale-110 hover:shadow-lg">
                    {skill.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-accent/20"><Award className="h-6 w-6 text-accent" /></div>
              <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Certifications</h2>
            </div>
            <div className="space-y-3">
              {certifications.map((cert, i) => {
                const imageUrl = (cert as any).image_url;
                return (
                  <motion.div key={cert.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                    <Card
                      className={`border-none shadow-sm hover:shadow-md transition-all hover:translate-x-1 glass-dark ${imageUrl ? "cursor-pointer" : ""}`}
                      onClick={() => imageUrl && setSelectedImage(imageUrl)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-accent to-primary shrink-0" />
                        <span className="text-sm text-hero-muted flex-1">{cert.name}</span>
                        {imageUrl && <ExternalLink className="h-4 w-4 text-hero-accent shrink-0" />}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-2">
          {selectedImage && (
            <img src={selectedImage} alt="Certificate" className="w-full h-auto rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SkillsSection;
