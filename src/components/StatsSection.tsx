import { motion } from "framer-motion";
import { Award, Users, FolderKanban, Code, BarChart3, Briefcase, GraduationCap, Star, Eye } from "lucide-react";
import { useStats, useVisitorCount } from "@/hooks/useSiteContent";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ComponentType<any>> = {
  Award, Users, FolderKanban, Code, BarChart3, Briefcase, GraduationCap, Star, Eye,
};

const StatsSection = () => {
  const { data: stats } = useStats();
  const { data: visitorCount } = useVisitorCount();

  // Track visitor on mount - only once per unique visitor (localStorage persists across sessions)
  useEffect(() => {
    const trackVisit = async () => {
      let visitorId = localStorage.getItem("portfolio_visitor_id");
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem("portfolio_visitor_id", visitorId);
        
        // Get real visitor info
        const userAgent = navigator.userAgent;
        const screenSize = `${screen.width}x${screen.height}`;
        const language = navigator.language;
        const platform = navigator.platform || "Unknown";

        await (supabase as any).from("site_visitors").insert({
          visitor_id: visitorId,
          page: window.location.pathname,
          user_agent: userAgent,
          screen_size: screenSize,
          language: language,
          platform: platform,
        });
      }
    };
    trackVisit();
  }, []);

  if (!stats || stats.length === 0) return null;

  // Add visitor count as an extra stat
  const allStats = [
    ...stats,
    {
      id: "visitors",
      icon: "Eye",
      value: `${visitorCount ?? 0}+`,
      label: "Visitors",
      sort_order: 999,
    },
  ];

  return (
    <section className="py-16 hero-gradient relative overflow-hidden border-t border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {allStats.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Award;
            return (
              <motion.div
                key={stat.id}
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5, type: "spring", stiffness: 100 }}
              >
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Icon className="h-7 w-7 text-primary" />
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
