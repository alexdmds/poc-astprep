import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Question } from "@/data/questions";

interface QuestionFilters {
  sectionId?: string;
  theme?: string;
  difficulty?: string;
  limit?: number;
}

function mapQuestion(row: Record<string, unknown>): Question {
  return {
    id: row.id as string,
    number: (row.number as number) ?? 0,
    text: row.text as string,
    choices: row.choices as { label: string; text: string }[],
    correctAnswer: row.correct_answer as string,
    explanation: (row.explanation as string) ?? "",
    theme: (row.theme as string) ?? "",
    section: row.section_id as string,
    difficulty: (row.difficulty as Question["difficulty"]) ?? "Moyen",
  };
}

export function useQuestions(filters?: QuestionFilters) {
  return useQuery({
    queryKey: ["questions", filters],
    queryFn: async () => {
      let query = supabase.from("questions").select("*");
      if (filters?.sectionId) query = query.eq("section_id", filters.sectionId);
      if (filters?.theme) query = query.eq("theme", filters.theme);
      if (filters?.difficulty) query = query.eq("difficulty", filters.difficulty);
      if (filters?.limit) query = query.limit(filters.limit);
      const { data, error } = await query.order("number", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []).map(mapQuestion);
    },
  });
}

export function useSubtestQuestions(subtestId: string) {
  return useQuery({
    queryKey: ["subtest-questions", subtestId],
    enabled: !!subtestId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subtest_questions")
        .select("sort_order, questions(*)")
        .eq("subtest_id", subtestId)
        .order("sort_order");
      if (error) throw error;
      return (data ?? [])
        .map(row => row.questions as Record<string, unknown>)
        .filter(Boolean)
        .map(mapQuestion);
    },
  });
}
