import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type ChapterInsert = Database["public"]["Tables"]["chapters"]["Insert"];

export function useChapters(sectionId?: string) {
  return useQuery({
    queryKey: ["chapters", sectionId],
    queryFn: async () => {
      let query = supabase
        .from("chapters")
        .select("*, sections(id, label)")
        .order("sort_order");
      if (sectionId) query = query.eq("section_id", sectionId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chapter: ChapterInsert) => {
      const { data, error } = await supabase.from("chapters").upsert(chapter).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}

export function useDeleteChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chapters").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });
}
