import { motion } from "framer-motion";
import { Github, GitFork, Star, Code2, Users, BookOpen, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useHero } from "@/hooks/useSiteContent";
import { Skeleton } from "@/components/ui/skeleton";

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
  avatar_url: string;
  bio: string | null;
  name: string | null;
  login: string;
  html_url: string;
}

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
}

function extractUsername(url?: string | null): string {
  if (!url) return "NileshChatap2625-Star";
  const match = url.replace(/\/+$/, "").match(/github\.com\/([^/]+)/);
  return match?.[1] ?? "NileshChatap2625-Star";
}

const GitHubStatsSection = () => {
  const { data: hero } = useHero();
  const username = extractUsername(hero?.github_url);

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStars, setTotalStars] = useState(0);
  const [totalForks, setTotalForks] = useState(0);
  const [topLangs, setTopLangs] = useState<{ name: string; count: number }[]>([]);

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
          setRepos(repoData);
          const stars = repoData.reduce((s: number, r: GitHubRepo) => s + r.stargazers_count, 0);
          const forks = repoData.reduce((s: number, r: GitHubRepo) => s + r.forks_count, 0);
          setTotalStars(stars);
          setTotalForks(forks);

          const langMap: Record<string, number> = {};
          repoData.forEach((r: GitHubRepo) => {
            if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
          });
          const sorted = Object.entries(langMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
          setTopLangs(sorted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username]);

  const statCards = [
    { icon: BookOpen, label: "Repositories", value: user?.public_repos ?? 0 },
    { icon: Star, label: "Total Stars", value: totalStars },
    { icon: GitFork, label: "Total Forks", value: totalForks },
    { icon: Users, label: "Followers", value: user?.followers ?? 0 },
  ];

  const langColors: Record<string, string> = {
    Python: "bg-[#3572A5]",
    JavaScript: "bg-[#f1e05a]",
    TypeScript: "bg-[#3178c6]",
    HTML: "bg-[#e34c26]",
    CSS: "bg-[#563d7c]",
    "Jupyter Notebook": "bg-[#DA5B0B]",
    Java: "bg-[#b07219]",
    "C++": "bg-[#f34b7d]",
    C: "bg-[#555555]",
    R: "bg-[#198CE7]",
    Shell: "bg-[#89e051]",
  };

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
            Live open-source contributions and coding activity.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm p-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              {loading ? (
                <Skeleton className="h-8 w-16 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-hero-foreground">{stat.value}</p>
              )}
              <p className="text-xs text-hero-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Top Languages */}
        <motion.div
          className="max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-hero-foreground mb-4 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" /> Top Languages
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {topLangs.map((lang) => {
                const totalRepos = repos.filter((r) => r.language).length;
                const pct = totalRepos > 0 ? Math.round((lang.count / totalRepos) * 100) : 0;
                return (
                  <div key={lang.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-hero-foreground font-medium">{lang.name}</span>
                      <span className="text-hero-muted">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${langColors[lang.name] || "bg-primary"}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Repos */}
        <motion.div
          className="max-w-4xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-hero-foreground mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Recent Repositories
          </h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.slice(0, 6).map((repo) => (
                <a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm p-4 hover:border-primary/40 transition-colors group"
                >
                  <p className="font-semibold text-hero-foreground group-hover:text-primary transition-colors text-sm mb-1">
                    {repo.name}
                  </p>
                  {repo.description && (
                    <p className="text-xs text-hero-muted line-clamp-2 mb-2">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-hero-muted">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className={`h-2.5 w-2.5 rounded-full ${langColors[repo.language] || "bg-primary"}`} />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" /> {repo.forks_count}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Profile Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href={`https://github.com/${username}`}
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
