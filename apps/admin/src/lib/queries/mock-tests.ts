import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type MockTestInsert = Database["public"]["Tables"]["mock_tests"]["Insert"];

export function useMockTests(productId?: string) {
  return useQuery({
    queryKey: ["mock-tests", productId],
    queryFn: async () => {
      let query = supabase
        .from("mock_tests")
        .select("*, products(id, name)")
        .order("sort_order");
      if (productId) query = query.eq("product_id", productId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useMockTest(id: string) {
  return useQuery({
    queryKey: ["mock-tests", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mock_tests")
        .select("*, products(id, name)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertMockTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mockTest: MockTestInsert) => {
      const { data, error } = await supabase.from("mock_tests").upsert(mockTest).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock-tests"] });
    },
  });
}

export function useDeleteMockTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("mock_tests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock-tests"] });
    },
  });
}
