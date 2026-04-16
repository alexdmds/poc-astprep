import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface FicheRow {
  id: string;
  section_id: string;
  title: string;
  description: string;
  pdf_url: string | null;
}

export function useFiches(sectionId?: string) {
  return useQuery({
    queryKey: ["fiches", sectionId],
    queryFn: async () => {
      let query = supabase.from("fiches").select("*");
      if (sectionId) query = query.eq("section_id", sectionId);
      const { data, error } = await query.order("title");
      if (error) throw error;
      return (data ?? []) as FicheRow[];
    },
  });
}
