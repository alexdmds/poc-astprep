import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Flashcard } from "@/data/flashcards";

interface FlashcardFilters {
  sectionId?: string;
  theme?: string;
}

function mapFlashcard(row: {
  id: string;
  section_id: string;
  theme: string;
  front: string;
  back: string;
}): Flashcard {
  return {
    id: row.id,
    sectionId: row.section_id,
    theme: row.theme,
    front: row.front,
    back: row.back,
  };
}

export function useFlashcardTemplates(filters?: FlashcardFilters) {
  return useQuery({
    queryKey: ["flashcard-templates", filters],
    queryFn: async () => {
      let query = supabase.from("flashcard_templates").select("*");
      if (filters?.sectionId) query = query.eq("section_id", filters.sectionId);
      if (filters?.theme) query = query.eq("theme", filters.theme);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(mapFlashcard);
    },
  });
}

export interface FlashcardProgress {
  flashcard_id: string;
  status: "new" | "learning" | "mastered";
  ease_factor: number;
  review_count: number;
  next_review: string | null;
}

export function useFlashcardProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["flashcard-progress", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_flashcard_progress")
        .select("flashcard_id, status, ease_factor, review_count, next_review")
        .eq("user_id", userId!);
      if (error) throw error;
      const map: Record<string, FlashcardProgress> = {};
      for (const row of data ?? []) {
        map[row.flashcard_id] = row as FlashcardProgress;
      }
      return map;
    },
  });
}

type Rating = "incorrect" | "correct" | "easy";

function nextReviewDays(rating: Rating): number {
  if (rating === "incorrect") return 1;
  if (rating === "correct") return 7;
  return 14;
}

function nextStatus(rating: Rating, current?: FlashcardProgress): FlashcardProgress["status"] {
  if (rating === "incorrect") return "learning";
  if (rating === "easy") return "mastered";
  const count = (current?.review_count ?? 0) + 1;
  return count >= 3 ? "mastered" : "learning";
}

export function useSaveFlashcardRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      flashcardId,
      rating,
      current,
    }: {
      userId: string;
      flashcardId: string;
      rating: Rating;
      current?: FlashcardProgress;
    }) => {
      const days = nextReviewDays(rating);
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + days);
      const status = nextStatus(rating, current);
      const reviewCount = (current?.review_count ?? 0) + 1;

      const { error } = await supabase.from("user_flashcard_progress").upsert(
        {
          user_id: userId,
          flashcard_id: flashcardId,
          status,
          ease_factor: current?.ease_factor ?? 2.5,
          review_count: reviewCount,
          next_review: nextReview.toISOString(),
        },
        { onConflict: "user_id,flashcard_id" }
      );
      if (error) throw error;
    },
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["flashcard-progress", userId] });
    },
  });
}
