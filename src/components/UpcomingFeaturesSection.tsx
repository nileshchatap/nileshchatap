import { motion } from "framer-motion";
import { Bot, BookOpen, Globe, Rocket, Sparkles, Wrench } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "An intelligent chatbot powered by machine learning to assist visitors and answer questions in real-time.",
    status: "In Development",
  },
  {
    icon: BookOpen,
    title: "Coding Tutorials",
    description: "Step-by-step tutorials on Python, ML, Data Science, and web development — built from real-world experience.",
    status: "Coming Soon",
  },
  {
    icon: Globe,
    title: "New Web Tools",
    description: "Handy online tools for data conversion, visualization, and productivity — free and open-source.",
    status: "Planned",
  },
  {
    icon: Wrench,
    title: "ML Model Playground",
    description: "Interactive playground to test and explore machine learning models directly in the browser.",
    status: "Planned",
  },
];

const statusColors: Record<string, string> = {
  "In Development": "bg-accent/20 text-accent border-accent/30",
  "Coming Soon": "bg-primary/20 text-primary border-primary/30",
  "Planned": "bg-hero-muted/20 text-hero-muted border-hero-muted/30",
};

const UpcomingFeaturesSection = () => {
  return (
    <section id="upcoming" className="py-20 hero-gradient relative overflow-hidden border-t border-b border-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="h-7 w-7 text-primary" />
            <h2
              className="text-3xl md:text-4xl font-bold text-hero-foreground"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Upcoming Features
            </h2>
          </div>
          <p className="text-hero-muted max-w-xl mx-auto">
            Exciting things I'm building next — stay tuned!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.06] hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, type: "spring", stiffness: 100 }}
              >
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 w-fit mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3
                  className="text-lg font-semibold text-hero-foreground mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-hero-muted text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusColors[feature.status] || ""}`}
                >
                  {feature.status}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingFeaturesSection;
