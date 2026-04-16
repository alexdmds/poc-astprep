import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type ThemeInsert = Database["public"]["Tables"]["themes"]["Insert"];

export function useThemes(sectionId?: string) {
  return useQuery({
    queryKey: ["themes", sectionId],
    queryFn: async () => {
      let query = supabase.from("themes").select("*").order("sort_order");
      if (sectionId) query = query.eq("section_id", sectionId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (theme: ThemeInsert) => {
      const { data, error } = await supabase.from("themes").upsert(theme).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
    },
  });
}

export function useDeleteTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("themes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
    },
  });
}
