import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type LessonInsert = Database["public"]["Tables"]["lessons"]["Insert"];

interface LessonFilters {
  sectionId?: string;
  chapterId?: string;
  type?: string;
}

export function useLessons(filters?: LessonFilters) {
  return useQuery({
    queryKey: ["lessons", filters],
    queryFn: async () => {
      let query = supabase
        .from("lessons")
        .select("*, chapters(id, title, section_id, sections(id, label))")
        .order("sort_order");
      if (filters?.chapterId) query = query.eq("chapter_id", filters.chapterId);
      if (filters?.sectionId)
        query = query.eq("chapters.section_id", filters.sectionId);
      if (filters?.type) query = query.eq("type", filters.type);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ["lessons", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*, chapters(id, title, section_id, sections(id, label))")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lesson: LessonInsert) => {
      const { data, error } = await supabase.from("lessons").upsert(lesson).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}
