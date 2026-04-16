import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Question } from "@/data/questions";

export interface ErrorNotebookEntry {
  id: string;
  user_id: string;
  question_id: string;
  section_id: string;
  theme: string | null;
  status: "a_reviser" | "en_cours" | "maitrise";
  student_answer: string | null;
  session_id: string | null;
  question: Question | null;
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

export function useErrorNotebook(userId: string | undefined) {
  return useQuery({
    queryKey: ["error-notebook", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("error_notebook")
        .select("*, questions(*)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(row => ({
        id: row.id,
        user_id: row.user_id,
        question_id: row.question_id,
        section_id: row.section_id,
        theme: row.theme,
        status: row.status as ErrorNotebookEntry["status"],
        student_answer: row.student_answer,
        session_id: row.session_id,
        question: row.questions ? mapQuestion(row.questions as Record<string, unknown>) : null,
      })) as ErrorNotebookEntry[];
    },
  });
}

export function useAddToErrorNotebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      questionId,
      sectionId,
      theme,
      studentAnswer,
      sessionId,
    }: {
      userId: string;
      questionId: string;
      sectionId: string;
      theme?: string;
      studentAnswer?: string;
      sessionId?: string;
    }) => {
      const { error } = await supabase.from("error_notebook").upsert(
        {
          user_id: userId,
          question_id: questionId,
          section_id: sectionId,
          theme: theme ?? null,
          status: "a_reviser",
          student_answer: studentAnswer ?? null,
          session_id: sessionId ?? null,
        },
        { onConflict: "user_id,question_id" }
      );
      if (error) throw error;
    },
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["error-notebook", userId] });
    },
  });
}

export function useUpdateErrorStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      userId,
    }: {
      id: string;
      status: ErrorNotebookEntry["status"];
      userId: string;
    }) => {
      const { error } = await supabase
        .from("error_notebook")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["error-notebook", userId] });
    },
  });
}
