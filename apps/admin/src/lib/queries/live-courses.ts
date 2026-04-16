import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type LiveCourseInsert = Database["public"]["Tables"]["live_courses"]["Insert"];

export function useLiveCourses() {
  return useQuery({
    queryKey: ["live-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_courses")
        .select("*, sections(label)")
        .order("scheduled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useLiveCourse(id: string) {
  return useQuery({
    queryKey: ["live-courses", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_courses")
        .select("*, sections(label)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertLiveCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (course: LiveCourseInsert) => {
      const { data, error } = await supabase
        .from("live_courses")
        .upsert(course)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["live-courses"] });
    },
  });
}

export function useDeleteLiveCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("live_courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["live-courses"] });
    },
  });
}

export function useToggleLive(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isLive: boolean) => {
      const { error } = await supabase
        .from("live_courses")
        .update({ is_live: isLive })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["live-courses"] });
    },
  });
}
