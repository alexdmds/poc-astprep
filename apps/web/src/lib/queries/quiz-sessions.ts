import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface QuizSessionInput {
  userId: string;
  type: "subtest" | "mock_test" | "training" | "error_notebook";
  sectionId?: string;
  subtestId?: string;
  mockTestId?: string;
  score: number;
  correctCount: number;
  totalCount: number;
  maxScore?: number;
  durationSeconds?: number;
  startedAt: string;
}

export interface QuizAnswerInput {
  sessionId: string;
  questionId: string;
  userAnswer: string | null;
  isCorrect: boolean;
  isFlagged?: boolean;
  timeSpentSeconds?: number;
}

export function useSaveQuizSession() {
  return useMutation({
    mutationFn: async (input: QuizSessionInput) => {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .insert({
          user_id: input.userId,
          type: input.type,
          section_id: input.sectionId ?? null,
          subtest_id: input.subtestId ?? null,
          mock_test_id: input.mockTestId ?? null,
          score: input.score,
          correct_count: input.correctCount,
          total_count: input.totalCount,
          max_score: input.maxScore ?? null,
          duration_seconds: input.durationSeconds ?? null,
          started_at: input.startedAt,
          finished_at: new Date().toISOString(),
          product_id: "tage_mage",
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
  });
}

export function useSaveQuizAnswers() {
  return useMutation({
    mutationFn: async (answers: QuizAnswerInput[]) => {
      if (answers.length === 0) return;
      const { error } = await supabase.from("quiz_answers").insert(
        answers.map(a => ({
          session_id: a.sessionId,
          question_id: a.questionId,
          user_answer: a.userAnswer,
          is_correct: a.isCorrect,
          is_flagged: a.isFlagged ?? false,
          time_spent_seconds: a.timeSpentSeconds ?? null,
        }))
      );
      if (error) throw error;
    },
  });
}
