import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type FlashcardInsert = Database["public"]["Tables"]["flashcard_templates"]["Insert"];

export function useFlashcards(filters?: { sectionId?: string; theme?: string }) {
  return useQuery({
    queryKey: ["flashcards", filters],
    queryFn: async () => {
      let query = supabase
        .from("flashcard_templates")
        .select("*, sections(label)")
        .order("theme");
      if (filters?.sectionId) query = query.eq("section_id", filters.sectionId);
      if (filters?.theme) query = query.eq("theme", filters.theme);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useFlashcard(id: string) {
  return useQuery({
    queryKey: ["flashcards", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flashcard_templates")
        .select("*, sections(label)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertFlashcard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (flashcard: FlashcardInsert) => {
      const { data, error } = await supabase
        .from("flashcard_templates")
        .upsert(flashcard)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
}

export function useDeleteFlashcard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("flashcard_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
}
