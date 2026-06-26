import { motion } from "framer-motion";
import { Award, Users, FolderKanban, Code, BarChart3, Briefcase, GraduationCap, Star, Eye } from "lucide-react";
import { useStats } from "@/hooks/useSiteContent";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ComponentType<any>> = {
  Award, Users, FolderKanban, Code, BarChart3, Briefcase, GraduationCap, Star, Eye,
};

const StatsSection = () => {
  const { data: stats } = useStats();

  // Track every visit - same visitor_id for returning visitors
  useEffect(() => {
    const trackVisit = async () => {
      // Bot detection - skip tracking for bots/crawlers
      const ua = navigator.userAgent;
      const botPatterns = [
        /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
        /headless/i, /phantom/i, /selenium/i, /puppeteer/i,
        /lighthouse/i, /pagespeed/i, /gtmetrix/i, /pingdom/i,
        /wget/i, /curl/i, /python/i, /java\//i, /go-http/i,
        /scrapy/i, /nutch/i, /archive/i, /facebookexternalhit/i,
        /twitterbot/i, /linkedinbot/i, /whatsapp/i, /telegrambot/i,
        /discordbot/i, /bingpreview/i, /yandex/i, /baidu/i,
      ];
      if (botPatterns.some(p => p.test(ua))) return;

      // Check for headless browser signals
      if (navigator.webdriver) return;

      // Suspicious screen size check (800x600 is common for bots)
      if (screen.width <= 800 && screen.height <= 600) return;

      let visitorId = localStorage.getItem("portfolio_visitor_id");
      const isNewVisitor = !visitorId;
      if (!visitorId) {
        visitorId = crypto.randomUUID();
      }

      // Get real visitor info
      const screenSize = `${screen.width}x${screen.height}`;
      const language = navigator.language;
      const platform = navigator.platform || "Unknown";

      // Get real location from IP using free API
      let city = "Unknown";
      let country = "Unknown";
      let ipAddress = "";
      try {
        const geoRes = await fetch("https://ipapi.co/json/");
        if (geoRes.ok) {
          const geo = await geoRes.json();
          city = geo.city || "Unknown";
          country = geo.country_name || "Unknown";
          ipAddress = geo.ip || "";
        }
      } catch {
        // Geolocation fetch failed, continue with defaults
      }

      const { error } = await (supabase as any).from("site_visitors").insert({
        visitor_id: visitorId,
        page: window.location.pathname,
        user_agent: ua,
        screen_size: screenSize,
        language: language,
        platform: platform,
        city: city,
        country: country,
        ip_address: ipAddress,
      });

      if (!error && isNewVisitor) {
        localStorage.setItem("portfolio_visitor_id", visitorId);
      }
    };
    trackVisit();
  }, []);

  if (!stats || stats.length === 0) return null;

  const allStats = stats;


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
