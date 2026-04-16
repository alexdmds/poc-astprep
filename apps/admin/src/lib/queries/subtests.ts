import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type SubtestInsert = Database["public"]["Tables"]["subtests"]["Insert"];

export function useSubtests(sectionId?: string) {
  return useQuery({
    queryKey: ["subtests", sectionId],
    queryFn: async () => {
      let query = supabase
        .from("subtests")
        .select("*, sections(id, label)")
        .order("sort_order");
      if (sectionId) query = query.eq("section_id", sectionId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useSubtest(id: string) {
  return useQuery({
    queryKey: ["subtests", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subtests")
        .select("*, subtest_questions(question_id, sort_order), sections(id, label)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertSubtest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subtest: SubtestInsert) => {
      const { data, error } = await supabase.from("subtests").upsert(subtest).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtests"] });
    },
  });
}

export function useDeleteSubtest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subtests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtests"] });
    },
  });
}

export function useSaveSubtestQuestions(subtestId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      questions: { question_id: string; sort_order: number }[],
    ) => {
      const { error: deleteError } = await supabase
        .from("subtest_questions")
        .delete()
        .eq("subtest_id", subtestId);
      if (deleteError) throw deleteError;

      if (questions.length > 0) {
        const rows = questions.map((q) => ({
          subtest_id: subtestId,
          question_id: q.question_id,
          sort_order: q.sort_order,
        }));
        const { error: insertError } = await supabase
          .from("subtest_questions")
          .insert(rows);
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtests", subtestId] });
    },
  });
}
