-- ============================================================
-- ASTPrep Database Schema
-- ============================================================

-- ========================
-- CONTENT TABLES (admin-seeded, read-only for students)
-- ========================

CREATE TABLE products (
  id text PRIMARY KEY,
  name text NOT NULL,
  accent_color text NOT NULL DEFAULT 'primary'
);

CREATE TABLE sections (
  id text PRIMARY KEY,
  product_id text NOT NULL REFERENCES products(id),
  label text NOT NULL,
  short_label text NOT NULL,
  icon_name text NOT NULL,
  color text NOT NULL,
  hsl text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id text NOT NULL REFERENCES sections(id),
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE chapters (
  id text PRIMARY KEY,
  section_id text NOT NULL REFERENCES sections(id),
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE lessons (
  id text PRIMARY KEY,
  chapter_id text NOT NULL REFERENCES chapters(id),
  title text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 0,
  professor text,
  type text NOT NULL DEFAULT 'video' CHECK (type IN ('video', 'exercise')),
  video_url text,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE questions (
  id text PRIMARY KEY,
  section_id text NOT NULL REFERENCES sections(id),
  theme text NOT NULL,
  number integer,
  text text NOT NULL,
  choices jsonb NOT NULL DEFAULT '[]',
  correct_answer text NOT NULL,
  explanation text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'Moyen',
  product_id text NOT NULL REFERENCES products(id) DEFAULT 'tage_mage',
  toeic_part integer,
  micro_competence text,
  audio_url text,
  linked_lesson_id text REFERENCES lessons(id)
);

CREATE TABLE subtests (
  id text PRIMARY KEY,
  section_id text NOT NULL REFERENCES sections(id),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'generaliste' CHECK (type IN ('generaliste', 'thematique')),
  question_count integer NOT NULL DEFAULT 15,
  duration_minutes integer NOT NULL DEFAULT 20,
  avg_score numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE subtest_questions (
  subtest_id text NOT NULL REFERENCES subtests(id) ON DELETE CASCADE,
  question_id text NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (subtest_id, question_id)
);

CREATE TABLE mock_tests (
  id text PRIMARY KEY,
  product_id text NOT NULL REFERENCES products(id) DEFAULT 'tage_mage',
  title text NOT NULL,
  difficulty text CHECK (difficulty IN ('Facile', 'Moyen', 'Difficile')),
  is_monthly boolean NOT NULL DEFAULT false,
  month_label text,
  avg_score numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE flashcard_templates (
  id text PRIMARY KEY,
  section_id text NOT NULL REFERENCES sections(id),
  theme text NOT NULL,
  front text NOT NULL,
  back text NOT NULL
);

CREATE TABLE fiches (
  id text PRIMARY KEY,
  section_id text NOT NULL REFERENCES sections(id),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  pdf_url text
);

CREATE TABLE live_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  professor text,
  section_id text REFERENCES sections(id),
  scheduled_at timestamptz NOT NULL,
  join_url text,
  replay_url text,
  is_live boolean NOT NULL DEFAULT false
);

-- ========================
-- USER TABLES
-- ========================

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  school text,
  exam_date date,
  target_score integer,
  hours_per_week integer,
  subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'month', 'quarter', 'year')),
  subscription_status text DEFAULT 'trialing' CHECK (subscription_status IN ('active', 'trialing', 'canceled')),
  onboarding_complete boolean NOT NULL DEFAULT false,
  bienvenue_complete boolean NOT NULL DEFAULT false,
  toeic_onboarding_complete boolean NOT NULL DEFAULT false,
  toeic_bienvenue_complete boolean NOT NULL DEFAULT false,
  current_product text NOT NULL DEFAULT 'tage_mage',
  theme text NOT NULL DEFAULT 'light',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('subtest', 'mock_test', 'training', 'error_notebook')),
  product_id text NOT NULL REFERENCES products(id) DEFAULT 'tage_mage',
  subtest_id text REFERENCES subtests(id),
  mock_test_id text REFERENCES mock_tests(id),
  section_id text REFERENCES sections(id),
  score numeric,
  max_score numeric,
  correct_count integer NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 0,
  duration_seconds integer,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);

CREATE TABLE quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id text NOT NULL REFERENCES questions(id),
  user_answer text,
  is_correct boolean NOT NULL DEFAULT false,
  is_flagged boolean NOT NULL DEFAULT false,
  error_category text CHECK (error_category IN ('notion_incomprise', 'piege', 'temps', 'inattention', 'devine')),
  time_spent_seconds integer
);

CREATE TABLE error_notebook (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id text NOT NULL REFERENCES questions(id),
  session_id uuid REFERENCES quiz_sessions(id),
  section_id text NOT NULL REFERENCES sections(id),
  theme text NOT NULL,
  student_answer text,
  status text NOT NULL DEFAULT 'a_reviser' CHECK (status IN ('a_reviser', 'en_cours', 'maitrise')),
  next_review_at timestamptz NOT NULL DEFAULT now(),
  review_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_flashcard_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  flashcard_id text NOT NULL REFERENCES flashcard_templates(id),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'mastered')),
  next_review_at timestamptz NOT NULL DEFAULT now(),
  ease_factor numeric NOT NULL DEFAULT 2.5,
  review_count integer NOT NULL DEFAULT 0,
  UNIQUE (user_id, flashcard_id)
);

CREATE TABLE user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id text NOT NULL REFERENCES lessons(id),
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  UNIQUE (user_id, lesson_id)
);

CREATE TABLE personal_bests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  score numeric NOT NULL,
  achieved_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, category)
);

CREATE TABLE streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_activity_date date,
  UNIQUE (user_id)
);

CREATE TABLE daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  challenges jsonb NOT NULL DEFAULT '[]',
  completed jsonb NOT NULL DEFAULT '[]',
  points_earned integer NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

CREATE TABLE leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  period_type text NOT NULL CHECK (period_type IN ('monthly', 'quarterly')),
  period_key text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  challenges_completed integer NOT NULL DEFAULT 0,
  UNIQUE (user_id, period_type, period_key)
);

CREATE TABLE mental_calc_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  operation text NOT NULL,
  difficulty text NOT NULL,
  duration_seconds integer NOT NULL,
  score integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE alphabetical_reading_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  letter_count integer NOT NULL,
  duration_seconds integer NOT NULL,
  score integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('live', 'score', 'reminder', 'streak', 'info')),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  minutes_studied integer NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

CREATE TABLE parcours_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  activities jsonb NOT NULL DEFAULT '[]',
  UNIQUE (user_id, date)
);

-- ========================
-- INDEXES
-- ========================

CREATE INDEX idx_questions_section ON questions(section_id);
CREATE INDEX idx_questions_product ON questions(product_id);
CREATE INDEX idx_questions_theme ON questions(theme);
CREATE INDEX idx_quiz_sessions_user ON quiz_sessions(user_id);
CREATE INDEX idx_quiz_sessions_type ON quiz_sessions(type);
CREATE INDEX idx_quiz_answers_session ON quiz_answers(session_id);
CREATE INDEX idx_error_notebook_user ON error_notebook(user_id);
CREATE INDEX idx_error_notebook_review ON error_notebook(user_id, next_review_at);
CREATE INDEX idx_activity_log_user_date ON activity_log(user_id, date);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_leaderboard_period ON leaderboard_entries(period_type, period_key);

-- ========================
-- ROW LEVEL SECURITY
-- ========================

-- Content tables: public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sections" ON sections FOR SELECT USING (true);

ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read themes" ON themes FOR SELECT USING (true);

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read chapters" ON chapters FOR SELECT USING (true);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lessons" ON lessons FOR SELECT USING (true);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (true);

ALTER TABLE subtests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read subtests" ON subtests FOR SELECT USING (true);

ALTER TABLE subtest_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read subtest_questions" ON subtest_questions FOR SELECT USING (true);

ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read mock_tests" ON mock_tests FOR SELECT USING (true);

ALTER TABLE flashcard_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read flashcard_templates" ON flashcard_templates FOR SELECT USING (true);

ALTER TABLE fiches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read fiches" ON fiches FOR SELECT USING (true);

ALTER TABLE live_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read live_courses" ON live_courses FOR SELECT USING (true);

-- User tables: CRUD own data only
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own quiz_sessions" ON quiz_sessions FOR ALL USING (auth.uid() = user_id);

ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own quiz_answers" ON quiz_answers
  FOR ALL USING (EXISTS (SELECT 1 FROM quiz_sessions WHERE quiz_sessions.id = quiz_answers.session_id AND quiz_sessions.user_id = auth.uid()));

ALTER TABLE error_notebook ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own error_notebook" ON error_notebook FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_flashcard_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own flashcard_progress" ON user_flashcard_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own lesson_progress" ON user_lesson_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE personal_bests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own personal_bests" ON personal_bests FOR ALL USING (auth.uid() = user_id);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own streaks" ON streaks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own daily_challenges" ON daily_challenges FOR ALL USING (auth.uid() = user_id);

ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read all leaderboard" ON leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "Users insert own leaderboard" ON leaderboard_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own leaderboard" ON leaderboard_entries FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE mental_calc_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own mental_calc_scores" ON mental_calc_scores FOR ALL USING (auth.uid() = user_id);

ALTER TABLE alphabetical_reading_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own reading_scores" ON alphabetical_reading_scores FOR ALL USING (auth.uid() = user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own activity_log" ON activity_log FOR ALL USING (auth.uid() = user_id);

ALTER TABLE parcours_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own parcours_plans" ON parcours_plans FOR ALL USING (auth.uid() = user_id);

-- ========================
-- TRIGGER: auto-create profile on signup
-- ========================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================
-- TRIGGER: update updated_at on profiles
-- ========================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
