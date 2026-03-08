import { motion } from "framer-motion";
import { Award, Users, FolderKanban, Code } from "lucide-react";

const stats = [
  { icon: Award, value: "3+", label: "Years Experience" },
  { icon: Users, value: "100+", label: "Students Trained" },
  { icon: FolderKanban, value: "15+", label: "Projects Completed" },
  { icon: Code, value: "10+", label: "Tools Mastered" },
];

const StatsSection = () => {
  return (
    <section className="py-16 hero-gradient relative overflow-hidden border-t border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5, type: "spring", stiffness: 100 }}
            >
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <motion.span
                className="text-3xl md:text-4xl font-bold text-primary"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 150 }}
              >
                {stat.value}
              </motion.span>
              <span className="text-sm text-hero-muted text-center">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
