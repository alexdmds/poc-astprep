import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface LessonRow {
  id: string;
  title: string;
  type: string;
  duration_minutes: number;
  professor: string | null;
  video_url: string | null;
  sort_order: number;
  chapter_id: string;
}

export interface ChapterRow {
  id: string;
  title: string;
  sort_order: number;
  section_id: string;
  lessons: LessonRow[];
}

export function useChaptersWithLessons(sectionId: string) {
  return useQuery({
    queryKey: ["chapters-lessons", sectionId],
    enabled: !!sectionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*, lessons(*)")
        .eq("section_id", sectionId)
        .order("sort_order")
        .order("sort_order", { referencedTable: "lessons" });
      if (error) throw error;
      return (data ?? []) as ChapterRow[];
    },
  });
}

export function useLessonProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["lesson-progress", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", userId!);
      if (error) throw error;
      const map: Record<string, boolean> = {};
      for (const row of data ?? []) map[row.lesson_id] = row.completed;
      return map;
    },
  });
}

export function useMarkLessonComplete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, lessonId }: { userId: string; lessonId: string }) => {
      const { error } = await supabase.from("user_lesson_progress").upsert(
        { user_id: userId, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() },
        { onConflict: "user_id,lesson_id" }
      );
      if (error) throw error;
    },
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress", userId] });
    },
  });
}
