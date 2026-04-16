import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 20;

export function useUsers(
  filters?: { search?: string; plan?: string; status?: string },
  page = 0,
) {
  return useQuery({
    queryKey: ["users", filters, page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });
      if (filters?.search)
        query = query.or(
          `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`,
        );
      if (filters?.plan)
        query = query.eq("subscription_plan", filters.plan);
      if (filters?.status)
        query = query.eq("subscription_status", filters.status);
      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      return { data: data ?? [], count: count ?? 0 };
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUserStats(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["users", id, "stats"],
    enabled: !!id,
    queryFn: async () => {
      const [sessionsRes, streakRes] = await Promise.all([
        supabase
          .from("quiz_sessions")
          .select("id, score", { count: "exact" })
          .eq("user_id", id),
        supabase
          .from("streaks")
          .select("current_streak")
          .eq("user_id", id)
          .maybeSingle(),
      ]);
      if (sessionsRes.error) throw sessionsRes.error;
      if (streakRes.error) throw streakRes.error;

      const sessions = sessionsRes.data ?? [];
      const totalSessions = sessionsRes.count ?? 0;
      const scores = sessions
        .map((s) => s.score)
        .filter((s): s is number => s !== null);
      const avgScore =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0;
      const streak = streakRes.data?.current_streak ?? 0;

      return { totalSessions, avgScore, streak };
    },
  });
}

export function useUserQuizSessions(userId: string, page = 0) {
  return useQuery({
    queryKey: ["users", userId, "sessions", page],
    enabled: !!userId,
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await supabase
        .from("quiz_sessions")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("started_at", { ascending: false })
        .range(from, to);
      if (error) throw error;
      return { data: data ?? [], count: count ?? 0 };
    },
  });
}
