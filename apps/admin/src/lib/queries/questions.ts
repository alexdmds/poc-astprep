import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type QuestionInsert = Database["public"]["Tables"]["questions"]["Insert"];

const PAGE_SIZE = 20;

interface QuestionFilters {
  productId?: string;
  sectionId?: string;
  theme?: string;
  difficulty?: string;
  search?: string;
}

export function useQuestions(filters?: QuestionFilters, page = 0) {
  return useQuery({
    queryKey: ["questions", filters, page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query = supabase
        .from("questions")
        .select("*, sections(id, label)", { count: "exact" });
      if (filters?.productId) query = query.eq("product_id", filters.productId);
      if (filters?.sectionId) query = query.eq("section_id", filters.sectionId);
      if (filters?.theme) query = query.eq("theme", filters.theme);
      if (filters?.difficulty) query = query.eq("difficulty", filters.difficulty);
      if (filters?.search) query = query.ilike("text", `%${filters.search}%`);
      const { data, error, count } = await query.range(from, to).order("id");
      if (error) throw error;
      return { data: data ?? [], count: count ?? 0 };
    },
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ["questions", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*, sections(id, label)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (question: QuestionInsert) => {
      const { data, error } = await supabase.from("questions").upsert(question).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useDeleteQuestions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("questions").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}
