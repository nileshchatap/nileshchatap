import { motion } from "framer-motion";
import { Github, GitFork, Star, Code2, Users, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useHero } from "@/hooks/useSiteContent";
import { Skeleton } from "@/components/ui/skeleton";

interface GitHubUser {
  public_repos: number;
  followers: number;
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
          setTotalStars(repoData.reduce((s: number, r: GitHubRepo) => s + r.stargazers_count, 0));
          setTotalForks(repoData.reduce((s: number, r: GitHubRepo) => s + r.forks_count, 0));

          const langMap: Record<string, number> = {};
          repoData.forEach((r: GitHubRepo) => {
            if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
          });
          const totalWithLang = repoData.filter((r: GitHubRepo) => r.language).length;
          setTopLangs(
            Object.entries(langMap)
              .map(([name, count]) => ({
                name,
                count,
                pct: totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 0,
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 6)
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username]);

  const statCards = [
    { icon: BookOpen, label: "Repositories", value: user?.public_repos ?? 0, color: "text-blue-400", border: "border-blue-500/20" },
    { icon: Star, label: "Total Stars", value: totalStars, color: "text-amber-400", border: "border-amber-500/20" },
    { icon: GitFork, label: "Total Forks", value: totalForks, color: "text-emerald-400", border: "border-emerald-500/20" },
    { icon: Users, label: "Followers", value: user?.followers ?? 0, color: "text-purple-400", border: "border-purple-500/20" },
  ];

  return (
    <section id="github" className="py-20 hero-gradient relative z-10 border-t border-b border-white/5">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Github className="h-6 w-6 text-primary" />
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(220 15% 95%)" }}
            >
              GitHub <span className="text-gradient-purple">Stats</span>
            </h2>
          </div>
          <p style={{ color: "hsl(250 15% 65%)" }} className="max-w-xl mx-auto">
            Live open-source contributions and coding activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto mb-14">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`rounded-2xl border ${stat.border} p-6 text-center backdrop-blur-md`}
              style={{ background: "rgba(255,255,255,0.03)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <stat.icon className={`h-7 w-7 ${stat.color} mx-auto mb-3`} />
              {loading ? (
                <Skeleton className="h-10 w-14 mx-auto mb-1" style={{ background: "rgba(255,255,255,0.05)" }} />
              ) : (
                <p className="text-3xl md:text-4xl font-bold" style={{ color: "hsl(220 15% 95%)" }}>
                  {stat.value}
                </p>
              )}
              <p className="text-xs mt-1.5 font-medium tracking-wide uppercase" style={{ color: "hsl(250 15% 65%)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Top Languages */}
        <div
          className="max-w-2xl mx-auto mb-12 rounded-2xl border border-white/10 backdrop-blur-sm p-6 md:p-8"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(220 15% 95%)" }}>
            <Code2 className="h-5 w-5 text-primary" /> Top Languages
          </h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-full" style={{ background: "rgba(255,255,255,0.05)" }} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topLangs.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium flex items-center gap-2" style={{ color: "hsl(220 15% 95%)" }}>
                      <span
                        className="h-3 w-3 rounded-full inline-block"
                        style={{ backgroundColor: langColors[lang.name] || "hsl(var(--primary))" }}
                      />
                      {lang.name}
                    </span>
                    <span className="font-mono text-xs" style={{ color: "hsl(250 15% 65%)" }}>{lang.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: langColors[lang.name] || "hsl(var(--primary))" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Link */}
        <div className="text-center">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all text-sm font-medium"
          >
            <Github className="h-4 w-4" />
            View Full Profile
          </a>
        </div>
      </div>
    </section>
  );
};

export default GitHubStatsSection;
