import { motion } from "framer-motion";
import { Github, GitFork, Star, Code2 } from "lucide-react";

const GITHUB_USERNAME = "NileshChatap2625-Star";

const GitHubStatsSection = () => {
  return (
    <section id="github" className="py-20 hero-gradient relative overflow-hidden border-t border-b border-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="h-7 w-7 text-primary" />
            <h2
              className="text-3xl md:text-4xl font-bold text-hero-foreground"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              GitHub Stats
            </h2>
          </div>
          <p className="text-hero-muted max-w-xl mx-auto">
            My open-source contributions and coding activity on GitHub.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* GitHub Stats Card */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0d1117&title_color=7c6aef&icon_color=7c6aef&text_color=a0a0b8&ring_color=7c6aef`}
              alt="GitHub Stats"
              className="w-full max-w-md rounded-2xl border border-white/10 shadow-lg"
              loading="lazy"
            />
          </motion.div>

          {/* Top Languages Card */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=tokyonight&hide_border=true&bg_color=0d1117&title_color=7c6aef&text_color=a0a0b8`}
              alt="Top Languages"
              className="w-full max-w-md rounded-2xl border border-white/10 shadow-lg"
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* GitHub Streak */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src={`https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&theme=tokyonight&hide_border=true&background=0d1117&ring=7c6aef&fire=7c6aef&currStreakLabel=a0a0b8&sideLabels=a0a0b8&dates=a0a0b8&currStreakNum=7c6aef&sideNums=7c6aef`}
            alt="GitHub Streak"
            className="w-full max-w-2xl rounded-2xl border border-white/10 shadow-lg"
            loading="lazy"
          />
        </motion.div>

        {/* Profile Link */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            <Github className="h-4 w-4" />
            View Full Profile
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubStatsSection;
