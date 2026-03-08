import { motion } from "framer-motion";
import { Github, GitFork, Star, Code2, Users, BookOpen } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useHero } from "@/hooks/useSiteContent";
import { Skeleton } from "@/components/ui/skeleton";

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
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

const CountUp = ({ end, loading }: { end: number; loading: boolean }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || hasAnimated.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, loading]);

  if (loading) return <Skeleton className="h-10 w-14 mx-auto mb-1 bg-white/5" />;
  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-hero-foreground">
      {count}
    </div>
  );
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
    { icon: BookOpen, label: "Repositories", value: user?.public_repos ?? 0, color: "text-blue-400", border: "border-blue-500/20", glow: "shadow-blue-500/10" },
    { icon: Star, label: "Total Stars", value: totalStars, color: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
    { icon: GitFork, label: "Total Forks", value: totalForks, color: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
    { icon: Users, label: "Followers", value: user?.followers ?? 0, color: "text-purple-400", border: "border-purple-500/20", glow: "shadow-purple-500/10" },
  ];

  return (
    <section id="github" className="py-20 hero-gradient relative overflow-hidden border-t border-b border-white/5" style={{ minHeight: '400px' }}>
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
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
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
              className={`relative group rounded-2xl border ${stat.border} bg-white/[0.03] backdrop-blur-md p-6 text-center overflow-hidden hover:bg-white/[0.06] transition-all duration-300 shadow-lg ${stat.glow}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4 }}
            >
              <stat.icon className={`h-7 w-7 ${stat.color} mx-auto mb-3 drop-shadow-lg`} />
              <CountUp end={stat.value} loading={loading} />
              <p className="text-xs text-hero-muted mt-1.5 font-medium tracking-wide uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Top Languages */}
        <motion.div
          className="max-w-2xl mx-auto mb-12 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8"
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
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all text-sm font-medium"
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
