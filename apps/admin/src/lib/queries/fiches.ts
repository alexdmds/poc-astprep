import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type FicheInsert = Database["public"]["Tables"]["fiches"]["Insert"];

export function useFiches(sectionId?: string) {
  return useQuery({
    queryKey: ["fiches", sectionId],
    queryFn: async () => {
      let query = supabase
        .from("fiches")
        .select("*, sections(label)")
        .order("title");
      if (sectionId) query = query.eq("section_id", sectionId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useFiche(id: string) {
  return useQuery({
    queryKey: ["fiches", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fiches")
        .select("*, sections(label)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertFiche() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fiche: FicheInsert) => {
      const { data, error } = await supabase.from("fiches").upsert(fiche).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiches"] });
    },
  });
}

export function useDeleteFiche() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fiches").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiches"] });
    },
  });
}
