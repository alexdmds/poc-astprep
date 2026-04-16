-- ============================================================
-- ASTPrep — Nettoyage des données fake de production
-- ============================================================
-- À exécuter dans le SQL Editor du dashboard Supabase.
-- ATTENTION : supprime TOUT le contenu (questions, cours, flashcards…)
-- Les données utilisateurs (profiles, quiz_sessions…) ne sont PAS touchées.
-- L'admin peut recréer le contenu depuis l'interface d'administration.
-- ============================================================

-- Supprimer dans l'ordre (FK constraints)
TRUNCATE TABLE subtest_questions CASCADE;
TRUNCATE TABLE subtests CASCADE;
TRUNCATE TABLE mock_tests CASCADE;
TRUNCATE TABLE flashcard_templates CASCADE;
TRUNCATE TABLE fiches CASCADE;
TRUNCATE TABLE live_courses CASCADE;
TRUNCATE TABLE questions CASCADE;
TRUNCATE TABLE lessons CASCADE;
TRUNCATE TABLE chapters CASCADE;
TRUNCATE TABLE themes CASCADE;
TRUNCATE TABLE sections CASCADE;
TRUNCATE TABLE products CASCADE;
