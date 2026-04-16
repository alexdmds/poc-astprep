import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface SubtestRow {
  id: string;
  section_id: string;
  title: string;
  type: string;
  question_count: number;
  duration_minutes: number;
  avg_score: number;
  sort_order: number;
}

export function useSubtests(sectionId?: string) {
  return useQuery({
    queryKey: ["subtests", sectionId],
    queryFn: async () => {
      let query = supabase.from("subtests").select("*");
      if (sectionId) query = query.eq("section_id", sectionId);
      const { data, error } = await query.order("sort_order");
      if (error) throw error;
      return (data ?? []) as SubtestRow[];
    },
  });
}

export function useSubtest(subtestId: string) {
  return useQuery({
    queryKey: ["subtest", subtestId],
    enabled: !!subtestId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subtests")
        .select("*")
        .eq("id", subtestId)
        .single();
      if (error) throw error;
      return data as SubtestRow;
    },
  });
}
