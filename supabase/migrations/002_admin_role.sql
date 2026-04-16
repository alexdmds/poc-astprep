-- ============================================================
-- Admin Role & Policies
-- ============================================================

-- 1. Add admin flag to profiles
ALTER TABLE profiles ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

-- 2. Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- 3. Admin WRITE policies for content tables
-- ============================================================

-- products
CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (public.is_admin());

-- sections
CREATE POLICY "Admin insert sections" ON sections FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update sections" ON sections FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete sections" ON sections FOR DELETE USING (public.is_admin());

-- themes
CREATE POLICY "Admin insert themes" ON themes FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update themes" ON themes FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete themes" ON themes FOR DELETE USING (public.is_admin());

-- chapters
CREATE POLICY "Admin insert chapters" ON chapters FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update chapters" ON chapters FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete chapters" ON chapters FOR DELETE USING (public.is_admin());

-- lessons
CREATE POLICY "Admin insert lessons" ON lessons FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update lessons" ON lessons FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete lessons" ON lessons FOR DELETE USING (public.is_admin());

-- questions
CREATE POLICY "Admin insert questions" ON questions FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update questions" ON questions FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete questions" ON questions FOR DELETE USING (public.is_admin());

-- subtests
CREATE POLICY "Admin insert subtests" ON subtests FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update subtests" ON subtests FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete subtests" ON subtests FOR DELETE USING (public.is_admin());

-- subtest_questions
CREATE POLICY "Admin insert subtest_questions" ON subtest_questions FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update subtest_questions" ON subtest_questions FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete subtest_questions" ON subtest_questions FOR DELETE USING (public.is_admin());

-- mock_tests
CREATE POLICY "Admin insert mock_tests" ON mock_tests FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update mock_tests" ON mock_tests FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete mock_tests" ON mock_tests FOR DELETE USING (public.is_admin());

-- flashcard_templates
CREATE POLICY "Admin insert flashcard_templates" ON flashcard_templates FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update flashcard_templates" ON flashcard_templates FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete flashcard_templates" ON flashcard_templates FOR DELETE USING (public.is_admin());

-- fiches
CREATE POLICY "Admin insert fiches" ON fiches FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update fiches" ON fiches FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete fiches" ON fiches FOR DELETE USING (public.is_admin());

-- live_courses
CREATE POLICY "Admin insert live_courses" ON live_courses FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update live_courses" ON live_courses FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete live_courses" ON live_courses FOR DELETE USING (public.is_admin());

-- ============================================================
-- 4. Admin READ policies for user data tables
-- ============================================================

CREATE POLICY "Admin read all profiles" ON profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all quiz_sessions" ON quiz_sessions FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all quiz_answers" ON quiz_answers FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all error_notebook" ON error_notebook FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all activity_log" ON activity_log FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all streaks" ON streaks FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all daily_challenges" ON daily_challenges FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all leaderboard_entries" ON leaderboard_entries FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all notifications" ON notifications FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all user_lesson_progress" ON user_lesson_progress FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all user_flashcard_progress" ON user_flashcard_progress FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all mental_calc_scores" ON mental_calc_scores FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all alphabetical_reading_scores" ON alphabetical_reading_scores FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all parcours_plans" ON parcours_plans FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read all personal_bests" ON personal_bests FOR SELECT USING (public.is_admin());

-- 5. Admin can send notifications to any user
CREATE POLICY "Admin insert notifications" ON notifications FOR INSERT WITH CHECK (public.is_admin());
