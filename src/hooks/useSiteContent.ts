import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHero = () =>
  useQuery({
    queryKey: ["site_hero"],
    queryFn: async () => {
      const { data } = await supabase.from("site_hero").select("*").limit(1).single();
      return data;
    },
  });

export const useExperiences = () =>
  useQuery({
    queryKey: ["site_experiences"],
    queryFn: async () => {
      const { data } = await supabase.from("site_experiences").select("*").order("sort_order");
      return data ?? [];
    },
  });

export const useEducation = () =>
  useQuery({
    queryKey: ["site_education"],
    queryFn: async () => {
      const { data } = await supabase.from("site_education").select("*").order("sort_order");
      return data ?? [];
    },
  });

export const useSkills = () =>
  useQuery({
    queryKey: ["site_skills"],
    queryFn: async () => {
      const { data } = await supabase.from("site_skills").select("*").order("sort_order");
      return data ?? [];
    },
  });

export const useCertifications = () =>
  useQuery({
    queryKey: ["site_certifications"],
    queryFn: async () => {
      const { data } = await supabase.from("site_certifications").select("*").order("sort_order");
      return data ?? [];
    },
  });

export const useProjects = () =>
  useQuery({
    queryKey: ["site_projects"],
    queryFn: async () => {
      const { data } = await supabase.from("site_projects").select("*").order("sort_order");
      return data ?? [];
    },
  });

export const useStats = () =>
  useQuery({
    queryKey: ["site_stats"],
    queryFn: async () => {
      const { data } = await supabase.from("site_stats").select("*").order("sort_order");
      return data ?? [];
    },
  });

export const useVisitorCount = () =>
  useQuery({
    queryKey: ["site_visitors_count"],
    queryFn: async () => {
      const { count } = await (supabase as any)
        .from("site_visitors")
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    },
    refetchInterval: 30000, // refresh every 30s
  });

export const useAbout = () =>
  useQuery({
    queryKey: ["site_about"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("site_about").select("*").limit(1).single();
      return data;
    },
  });
      return data;
    },
  });
