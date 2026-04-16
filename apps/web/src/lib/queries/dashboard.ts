import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useStreak(userId: string | undefined) {
  return useQuery({
    queryKey: ["streak", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streaks")
        .select("current_streak, longest_streak, last_activity_date")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useErrorCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["error-count", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("error_notebook")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .in("status", ["a_reviser", "en_cours"]);
      if (error) throw error;
      return count ?? 0;
    },
  });
}

export function useTmScores(userId: string | undefined) {
  return useQuery({
    queryKey: ["tm-scores", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("score, started_at")
        .eq("user_id", userId!)
        .eq("type", "mock_test")
        .not("score", "is", null)
        .order("started_at", { ascending: true })
        .limit(10);
      if (error) throw error;
      return (data ?? []).map(row => ({
        date: new Date(row.started_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
        score: row.score as number,
      }));
    },
  });
}

export function useWeeklyMinutes(userId: string | undefined) {
  return useQuery({
    queryKey: ["weekly-minutes", userId],
    enabled: !!userId,
    queryFn: async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data, error } = await supabase
        .from("activity_log")
        .select("minutes_studied")
        .eq("user_id", userId!)
        .gte("date", weekAgo.toISOString().split("T")[0]);
      if (error) throw error;
      return (data ?? []).reduce((sum, row) => sum + row.minutes_studied, 0);
    },
  });
}

export function useNextLiveCourse() {
  return useQuery({
    queryKey: ["next-live-course"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("live_courses")
        .select("*")
        .gte("scheduled_at", now)
        .order("scheduled_at")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useEstimatedScore(userId: string | undefined) {
  return useQuery({
    queryKey: ["estimated-score", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("score, started_at")
        .eq("user_id", userId!)
        .eq("type", "mock_test")
        .not("score", "is", null)
        .order("started_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      if (!data?.length) return null;
      const avg = Math.round(data.reduce((s, r) => s + (r.score ?? 0), 0) / data.length);
      return avg;
    },
  });
}
