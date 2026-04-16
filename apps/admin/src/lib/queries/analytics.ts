import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [usersRes, questionsRes, lessonsRes, sessionsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("questions").select("id", { count: "exact", head: true }),
        supabase.from("lessons").select("id", { count: "exact", head: true }),
        supabase.from("quiz_sessions").select("id", { count: "exact", head: true }),
      ]);
      return {
        totalUsers: usersRes.count ?? 0,
        totalQuestions: questionsRes.count ?? 0,
        totalLessons: lessonsRes.count ?? 0,
        totalSessions: sessionsRes.count ?? 0,
      };
    },
  });
}

export function useRecentSessions(limit = 10) {
  return useQuery({
    queryKey: ["recent-sessions", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*, profiles(full_name)")
        .order("started_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
  });
}

export function useSignupTrend() {
  return useQuery({
    queryKey: ["signup-trend"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at");
      if (error) throw error;

      const grouped: Record<string, number> = {};
      for (const row of data ?? []) {
        const day = row.created_at.slice(0, 10);
        grouped[day] = (grouped[day] ?? 0) + 1;
      }
      return Object.entries(grouped).map(([date, count]) => ({ date, count }));
    },
  });
}

export function useSessionTrend() {
  return useQuery({
    queryKey: ["session-trend"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("started_at")
        .gte("started_at", thirtyDaysAgo.toISOString())
        .order("started_at");
      if (error) throw error;

      const grouped: Record<string, number> = {};
      for (const row of data ?? []) {
        const day = row.started_at.slice(0, 10);
        grouped[day] = (grouped[day] ?? 0) + 1;
      }
      return Object.entries(grouped).map(([date, count]) => ({ date, count }));
    },
  });
}
