export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          date: string
          id: string
          minutes_studied: number
          user_id: string
        }
        Insert: {
          date?: string
          id?: string
          minutes_studied?: number
          user_id: string
        }
        Update: {
          date?: string
          id?: string
          minutes_studied?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alphabetical_reading_scores: {
        Row: {
          created_at: string
          duration_seconds: number
          id: string
          letter_count: number
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds: number
          id?: string
          letter_count: number
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          id?: string
          letter_count?: number
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alphabetical_reading_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          id: string
          section_id: string
          sort_order: number
          title: string
        }
        Insert: {
          id: string
          section_id: string
          sort_order?: number
          title: string
        }
        Update: {
          id?: string
          section_id?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          challenges: Json
          completed: Json
          date: string
          id: string
          points_earned: number
          user_id: string
        }
        Insert: {
          challenges?: Json
          completed?: Json
          date?: string
          id?: string
          points_earned?: number
          user_id: string
        }
        Update: {
          challenges?: Json
          completed?: Json
          date?: string
          id?: string
          points_earned?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      error_notebook: {
        Row: {
          created_at: string
          id: string
          next_review_at: string
          question_id: string
          review_count: number
          section_id: string
          session_id: string | null
          status: string
          student_answer: string | null
          theme: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          next_review_at?: string
          question_id: string
          review_count?: number
          section_id: string
          session_id?: string | null
          status?: string
          student_answer?: string | null
          theme: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          next_review_at?: string
          question_id?: string
          review_count?: number
          section_id?: string
          session_id?: string | null
          status?: string
          student_answer?: string | null
          theme?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "error_notebook_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "error_notebook_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "error_notebook_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "error_notebook_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fiches: {
        Row: {
          description: string
          id: string
          pdf_url: string | null
          section_id: string
          title: string
        }
        Insert: {
          description?: string
          id: string
          pdf_url?: string | null
          section_id: string
          title: string
        }
        Update: {
          description?: string
          id?: string
          pdf_url?: string | null
          section_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiches_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_templates: {
        Row: {
          back: string
          front: string
          id: string
          section_id: string
          theme: string
        }
        Insert: {
          back: string
          front: string
          id: string
          section_id: string
          theme: string
        }
        Update: {
          back?: string
          front?: string
          id?: string
          section_id?: string
          theme?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_templates_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          challenges_completed: number
          id: string
          period_key: string
          period_type: string
          points: number
          user_id: string
        }
        Insert: {
          challenges_completed?: number
          id?: string
          period_key: string
          period_type: string
          points?: number
          user_id: string
        }
        Update: {
          challenges_completed?: number
          id?: string
          period_key?: string
          period_type?: string
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          chapter_id: string
          duration_minutes: number
          id: string
          professor: string | null
          sort_order: number
          title: string
          type: string
          video_url: string | null
        }
        Insert: {
          chapter_id: string
          duration_minutes?: number
          id: string
          professor?: string | null
          sort_order?: number
          title: string
          type?: string
          video_url?: string | null
        }
        Update: {
          chapter_id?: string
          duration_minutes?: number
          id?: string
          professor?: string | null
          sort_order?: number
          title?: string
          type?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      live_courses: {
        Row: {
          id: string
          is_live: boolean
          join_url: string | null
          professor: string | null
          replay_url: string | null
          scheduled_at: string
          section_id: string | null
          title: string
        }
        Insert: {
          id?: string
          is_live?: boolean
          join_url?: string | null
          professor?: string | null
          replay_url?: string | null
          scheduled_at: string
          section_id?: string | null
          title: string
        }
        Update: {
          id?: string
          is_live?: boolean
          join_url?: string | null
          professor?: string | null
          replay_url?: string | null
          scheduled_at?: string
          section_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_courses_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      mental_calc_scores: {
        Row: {
          created_at: string
          difficulty: string
          duration_seconds: number
          id: string
          operation: string
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          difficulty: string
          duration_seconds: number
          id?: string
          operation: string
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          difficulty?: string
          duration_seconds?: number
          id?: string
          operation?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mental_calc_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_tests: {
        Row: {
          avg_score: number
          difficulty: string | null
          id: string
          is_monthly: boolean
          month_label: string | null
          product_id: string
          sort_order: number
          title: string
        }
        Insert: {
          avg_score?: number
          difficulty?: string | null
          id: string
          is_monthly?: boolean
          month_label?: string | null
          product_id?: string
          sort_order?: number
          title: string
        }
        Update: {
          avg_score?: number
          difficulty?: string | null
          id?: string
          is_monthly?: boolean
          month_label?: string | null
          product_id?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_tests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          description: string
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parcours_plans: {
        Row: {
          activities: Json
          date: string
          id: string
          user_id: string
        }
        Insert: {
          activities?: Json
          date: string
          id?: string
          user_id: string
        }
        Update: {
          activities?: Json
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parcours_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_bests: {
        Row: {
          achieved_at: string
          category: string
          id: string
          score: number
          user_id: string
        }
        Insert: {
          achieved_at?: string
          category: string
          id?: string
          score: number
          user_id: string
        }
        Update: {
          achieved_at?: string
          category?: string
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_bests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          accent_color: string
          id: string
          name: string
        }
        Insert: {
          accent_color?: string
          id: string
          name: string
        }
        Update: {
          accent_color?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bienvenue_complete: boolean
          created_at: string
          current_product: string
          email: string | null
          exam_date: string | null
          full_name: string | null
          hours_per_week: number | null
          id: string
          onboarding_complete: boolean
          school: string | null
          subscription_plan: string | null
          subscription_status: string | null
          target_score: number | null
          theme: string
          toeic_bienvenue_complete: boolean
          toeic_onboarding_complete: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bienvenue_complete?: boolean
          created_at?: string
          current_product?: string
          email?: string | null
          exam_date?: string | null
          full_name?: string | null
          hours_per_week?: number | null
          id: string
          onboarding_complete?: boolean
          school?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          target_score?: number | null
          theme?: string
          toeic_bienvenue_complete?: boolean
          toeic_onboarding_complete?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bienvenue_complete?: boolean
          created_at?: string
          current_product?: string
          email?: string | null
          exam_date?: string | null
          full_name?: string | null
          hours_per_week?: number | null
          id?: string
          onboarding_complete?: boolean
          school?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          target_score?: number | null
          theme?: string
          toeic_bienvenue_complete?: boolean
          toeic_onboarding_complete?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          audio_url: string | null
          choices: Json
          correct_answer: string
          difficulty: string
          explanation: string
          id: string
          linked_lesson_id: string | null
          micro_competence: string | null
          number: number | null
          product_id: string
          section_id: string
          text: string
          theme: string
          toeic_part: number | null
        }
        Insert: {
          audio_url?: string | null
          choices?: Json
          correct_answer: string
          difficulty?: string
          explanation?: string
          id: string
          linked_lesson_id?: string | null
          micro_competence?: string | null
          number?: number | null
          product_id?: string
          section_id: string
          text: string
          theme: string
          toeic_part?: number | null
        }
        Update: {
          audio_url?: string | null
          choices?: Json
          correct_answer?: string
          difficulty?: string
          explanation?: string
          id?: string
          linked_lesson_id?: string | null
          micro_competence?: string | null
          number?: number | null
          product_id?: string
          section_id?: string
          text?: string
          theme?: string
          toeic_part?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_linked_lesson_id_fkey"
            columns: ["linked_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_answers: {
        Row: {
          error_category: string | null
          id: string
          is_correct: boolean
          is_flagged: boolean
          question_id: string
          session_id: string
          time_spent_seconds: number | null
          user_answer: string | null
        }
        Insert: {
          error_category?: string | null
          id?: string
          is_correct?: boolean
          is_flagged?: boolean
          question_id: string
          session_id: string
          time_spent_seconds?: number | null
          user_answer?: string | null
        }
        Update: {
          error_category?: string | null
          id?: string
          is_correct?: boolean
          is_flagged?: boolean
          question_id?: string
          session_id?: string
          time_spent_seconds?: number | null
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          correct_count: number
          duration_seconds: number | null
          finished_at: string | null
          id: string
          max_score: number | null
          mock_test_id: string | null
          product_id: string
          score: number | null
          section_id: string | null
          started_at: string
          subtest_id: string | null
          total_count: number
          type: string
          user_id: string
        }
        Insert: {
          correct_count?: number
          duration_seconds?: number | null
          finished_at?: string | null
          id?: string
          max_score?: number | null
          mock_test_id?: string | null
          product_id?: string
          score?: number | null
          section_id?: string | null
          started_at?: string
          subtest_id?: string | null
          total_count?: number
          type: string
          user_id: string
        }
        Update: {
          correct_count?: number
          duration_seconds?: number | null
          finished_at?: string | null
          id?: string
          max_score?: number | null
          mock_test_id?: string | null
          product_id?: string
          score?: number | null
          section_id?: string | null
          started_at?: string
          subtest_id?: string | null
          total_count?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_subtest_id_fkey"
            columns: ["subtest_id"]
            isOneToOne: false
            referencedRelation: "subtests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          color: string
          hsl: string
          icon_name: string
          id: string
          label: string
          product_id: string
          short_label: string
          sort_order: number
        }
        Insert: {
          color: string
          hsl: string
          icon_name: string
          id: string
          label: string
          product_id: string
          short_label: string
          sort_order?: number
        }
        Update: {
          color?: string
          hsl?: string
          icon_name?: string
          id?: string
          label?: string
          product_id?: string
          short_label?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "sections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          current_streak: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          user_id: string
        }
        Insert: {
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          user_id: string
        }
        Update: {
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subtest_questions: {
        Row: {
          question_id: string
          sort_order: number
          subtest_id: string
        }
        Insert: {
          question_id: string
          sort_order?: number
          subtest_id: string
        }
        Update: {
          question_id?: string
          sort_order?: number
          subtest_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtest_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subtest_questions_subtest_id_fkey"
            columns: ["subtest_id"]
            isOneToOne: false
            referencedRelation: "subtests"
            referencedColumns: ["id"]
          },
        ]
      }
      subtests: {
        Row: {
          avg_score: number
          duration_minutes: number
          id: string
          question_count: number
          section_id: string
          sort_order: number
          title: string
          type: string
        }
        Insert: {
          avg_score?: number
          duration_minutes?: number
          id: string
          question_count?: number
          section_id: string
          sort_order?: number
          title: string
          type?: string
        }
        Update: {
          avg_score?: number
          duration_minutes?: number
          id?: string
          question_count?: number
          section_id?: string
          sort_order?: number
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtests_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          id: string
          name: string
          section_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          section_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          section_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "themes_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_flashcard_progress: {
        Row: {
          ease_factor: number
          flashcard_id: string
          id: string
          next_review_at: string
          review_count: number
          status: string
          user_id: string
        }
        Insert: {
          ease_factor?: number
          flashcard_id: string
          id?: string
          next_review_at?: string
          review_count?: number
          status?: string
          user_id: string
        }
        Update: {
          ease_factor?: number
          flashcard_id?: string
          id?: string
          next_review_at?: string
          review_count?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_flashcard_progress_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcard_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_flashcard_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
