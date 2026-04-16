import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type SectionInsert = Database["public"]["Tables"]["sections"]["Insert"];

export function useSections(productId?: string) {
  return useQuery({
    queryKey: ["sections", productId],
    queryFn: async () => {
      let query = supabase.from("sections").select("*").order("sort_order");
      if (productId) query = query.eq("product_id", productId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (section: SectionInsert) => {
      const { data, error } = await supabase.from("sections").upsert(section).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
}
