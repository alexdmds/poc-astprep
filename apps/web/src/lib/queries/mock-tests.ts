import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface MockTestRow {
  id: string;
  product_id: string;
  title: string;
  difficulty: string | null;
  is_monthly: boolean;
  month_label: string | null;
  avg_score: number;
  sort_order: number;
}

export function useMockTests(productId = "tage_mage") {
  return useQuery({
    queryKey: ["mock-tests", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mock_tests")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as MockTestRow[];
    },
  });
}
