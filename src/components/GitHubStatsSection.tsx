import { motion, animate } from "framer-motion";
import { Github, GitFork, Star, Code2, Users, BookOpen } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useHero } from "@/hooks/useSiteContent";
import { Skeleton } from "@/components/ui/skeleton";

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
  login: string;
}

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

function extractUsername(url?: string | null): string {
  if (!url) return "NileshChatap2625-Star";
  const match = url.replace(/\/+$/, "").match(/github\.com\/([^/]+)/);
  return match?.[1] ?? "NileshChatap2625-Star";
}

const AnimatedNumber = ({ value, loading }: { value: number; loading: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (loading || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [value, loading]);

  if (loading) return <Skeleton className="h-10 w-14 mx-auto mb-1 bg-white/5" />;
  return <span ref={ref} className="text-3xl md:text-4xl font-bold text-hero-foreground">0</span>;
};

const langColors: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "Jupyter Notebook": "#DA5B0B",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  R: "#198CE7",
  Shell: "#89e051",
};

const GitHubStatsSection = () => {
  const { data: hero } = useHero();
  const username = extractUsername(hero?.github_url);

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalStars, setTotalStars] = useState(0);
  const [totalForks, setTotalForks] = useState(0);
  const [topLangs, setTopLangs] = useState<{ name: string; count: number; pct: number }[]>([]);

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then((r) => r.json()),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`).then((r) => r.json()),
    ])
      .then(([userData, repoData]) => {
        if (userData?.login) setUser(userData);
        if (Array.isArray(repoData)) {
          const stars = repoData.reduce((s: number, r: GitHubRepo) => s + r.stargazers_count, 0);
          const forks = repoData.reduce((s: number, r: GitHubRepo) => s + r.forks_count, 0);
          setTotalStars(stars);
          setTotalForks(forks);

          const langMap: Record<string, number> = {};
          repoData.forEach((r: GitHubRepo) => {
            if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
          });
          const totalWithLang = repoData.filter((r: GitHubRepo) => r.language).length;
          const sorted = Object.entries(langMap)
            .map(([name, count]) => ({
              name,
              count,
              pct: totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 0,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
          setTopLangs(sorted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username]);

  const statCards = [
    { icon: BookOpen, label: "Repositories", value: user?.public_repos ?? 0, gradient: "from-blue-500/20 to-indigo-500/20" },
    { icon: Star, label: "Total Stars", value: totalStars, gradient: "from-amber-500/20 to-yellow-500/20" },
    { icon: GitFork, label: "Total Forks", value: totalForks, gradient: "from-emerald-500/20 to-teal-500/20" },
    { icon: Users, label: "Followers", value: user?.followers ?? 0, gradient: "from-purple-500/20 to-pink-500/20" },
  ];

  const iconColors = [
    "text-blue-400",
    "text-amber-400",
    "text-emerald-400",
    "text-purple-400",
  ];

  return (
    <section id="github" className="py-20 hero-gradient relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Github className="h-6 w-6 text-primary" />
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-hero-foreground"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              GitHub <span className="text-gradient-purple">Stats</span>
            </h2>
          </div>
          <p className="text-hero-muted max-w-xl mx-auto">
            Live open-source contributions and coding activity
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto mb-14">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`relative group rounded-2xl border border-white/10 bg-gradient-to-br ${stat.gradient} backdrop-blur-md p-6 text-center overflow-hidden hover:border-white/20 transition-all duration-300`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent" />
              
              <stat.icon className={`h-7 w-7 ${iconColors[i]} mx-auto mb-3 drop-shadow-lg`} />
              <AnimatedNumber value={stat.value} loading={loading} />
              <p className="text-xs text-hero-muted mt-1 font-medium tracking-wide uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Top Languages */}
        <motion.div
          className="max-w-2xl mx-auto mb-12 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-hero-foreground mb-6 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" /> Top Languages
          </h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-full bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topLangs.map((lang, i) => (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                >
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-hero-foreground font-medium flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full inline-block shadow-lg"
                        style={{ backgroundColor: langColors[lang.name] || "hsl(var(--primary))" }}
                      />
                      {lang.name}
                    </span>
                    <span className="text-hero-muted font-mono text-xs">{lang.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: langColors[lang.name] || "hsl(var(--primary))" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.4 + i * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Profile Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all text-sm font-medium shadow-lg shadow-primary/5"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(124, 106, 239, 0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="h-4 w-4" />
            View Full Profile
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubStatsSection;
