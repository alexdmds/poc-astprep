-- ============================================================
-- ASTPrep Seed Data
-- ============================================================

-- Products
INSERT INTO products (id, name, accent_color) VALUES
  ('tage_mage', 'TAGE MAGE', 'primary'),
  ('toeic', 'TOEIC', 'sky-500');

-- Sections TAGE MAGE
INSERT INTO sections (id, product_id, label, short_label, icon_name, color, hsl, sort_order) VALUES
  ('strategie', 'tage_mage', 'Stratégie', 'Stratégie', 'Target', 'strategie', '262 83% 58%', 1),
  ('comprehension', 'tage_mage', 'Compréhension', 'Compréhension', 'BookOpen', 'comprehension', '221 83% 53%', 2),
  ('calcul', 'tage_mage', 'Calcul', 'Calcul', 'Calculator', 'calcul', '142 76% 36%', 3),
  ('ra', 'tage_mage', 'Raisonnement & Argumentation', 'R&A', 'Scale', 'ra', '24 95% 53%', 4),
  ('conditions', 'tage_mage', 'Conditions minimales', 'Conditions', 'GitBranch', 'conditions', '346 77% 50%', 5),
  ('expression', 'tage_mage', 'Expression', 'Expression', 'PenTool', 'expression', '199 89% 48%', 6),
  ('logique', 'tage_mage', 'Logique', 'Logique', 'Brain', 'logique', '43 96% 56%', 7);

-- Sections TOEIC
INSERT INTO sections (id, product_id, label, short_label, icon_name, color, hsl, sort_order) VALUES
  ('listening', 'toeic', 'Listening', 'Listening', 'Headphones', 'comprehension', '221 83% 53%', 1),
  ('reading', 'toeic', 'Reading', 'Reading', 'BookOpen', 'calcul', '142 76% 36%', 2);

-- Chapters TAGE MAGE
INSERT INTO chapters (id, section_id, title, sort_order) VALUES
  ('strat-ch1', 'strategie', 'Introduction au TAGE MAGE', 1),
  ('strat-ch2', 'strategie', 'Ordre de passage optimal', 2),
  ('calc-ch1', 'calcul', 'Arithmétique', 1),
  ('calc-ch2', 'calcul', 'Algèbre', 2),
  ('calc-ch3', 'calcul', 'Géométrie', 3),
  ('calc-ch4', 'calcul', 'Probabilités & Dénombrement', 4),
  ('log-ch1', 'logique', 'Séries logiques', 1),
  ('log-ch2', 'logique', 'Logique spatiale', 2),
  ('comp-ch1', 'comprehension', 'Méthode de lecture rapide', 1),
  ('comp-ch2', 'comprehension', 'Types de questions', 2),
  ('ra-ch1', 'ra', 'Raisonnement', 1),
  ('ra-ch2', 'ra', 'Argumentation', 2),
  ('cond-ch1', 'conditions', 'Méthode CM', 1),
  ('expr-ch1', 'expression', 'Vocabulaire', 1),
  ('expr-ch2', 'expression', 'Grammaire', 2);

-- Lessons
INSERT INTO lessons (id, chapter_id, title, duration_minutes, professor, type, sort_order) VALUES
  ('strat-1', 'strat-ch1', 'Présentation de l''épreuve', 12, 'M. Dupont', 'video', 1),
  ('strat-2', 'strat-ch1', 'Structure et scoring', 15, 'M. Dupont', 'video', 2),
  ('strat-3', 'strat-ch2', 'Gérer son temps', 10, 'M. Dupont', 'video', 1),
  ('strat-4', 'strat-ch2', 'Stratégie de passage', 8, 'M. Dupont', 'video', 2),
  ('calc-1', 'calc-ch1', 'Fractions et puissances', 20, 'Mme Martin', 'video', 1),
  ('calc-2', 'calc-ch1', 'Pourcentages et proportions', 18, 'Mme Martin', 'video', 2),
  ('calc-3', 'calc-ch2', 'Équations du 1er et 2nd degré', 22, 'Mme Martin', 'video', 1),
  ('calc-4', 'calc-ch2', 'Systèmes d''équations', 15, 'Mme Martin', 'video', 2),
  ('calc-5', 'calc-ch3', 'Géométrie plane', 18, 'Mme Martin', 'video', 1),
  ('calc-6', 'calc-ch3', 'Volumes et aires', 16, 'Mme Martin', 'video', 2),
  ('calc-7', 'calc-ch4', 'Probabilités', 20, 'Mme Martin', 'video', 1),
  ('calc-8', 'calc-ch4', 'Dénombrement', 15, 'Mme Martin', 'video', 2),
  ('log-1', 'log-ch1', 'Suites numériques', 15, 'M. Bernard', 'video', 1),
  ('log-2', 'log-ch1', 'Suites de lettres', 12, 'M. Bernard', 'video', 2),
  ('log-3', 'log-ch2', 'Rotations et symétries', 18, 'M. Bernard', 'video', 1),
  ('comp-1', 'comp-ch1', 'Lecture rapide : méthode', 14, 'Mme Leroy', 'video', 1),
  ('comp-2', 'comp-ch2', 'Questions de compréhension', 16, 'Mme Leroy', 'video', 1),
  ('ra-1', 'ra-ch1', 'Failles de raisonnement', 18, 'M. Petit', 'video', 1),
  ('ra-2', 'ra-ch2', 'Connecteurs logiques', 14, 'M. Petit', 'video', 1),
  ('cond-1', 'cond-ch1', 'Méthode complète CM', 20, 'Mme Roux', 'video', 1),
  ('cond-2', 'cond-ch1', 'Pièges fréquents', 15, 'Mme Roux', 'video', 2),
  ('expr-1', 'expr-ch1', 'Locutions latines', 12, 'M. Moreau', 'video', 1),
  ('expr-2', 'expr-ch1', 'Proverbes et expressions', 10, 'M. Moreau', 'video', 2),
  ('expr-3', 'expr-ch2', 'Conjugaisons pièges', 14, 'M. Moreau', 'video', 1);

-- Sample questions TAGE MAGE (Calcul)
INSERT INTO questions (id, section_id, theme, number, text, choices, correct_answer, explanation, difficulty, product_id) VALUES
  ('q1', 'calcul', 'Probabilités', 1,
   'Un sac contient 3 boules rouges, 4 boules bleues et 5 boules vertes. On tire une boule au hasard. Quelle est la probabilité de tirer une boule rouge ?',
   '[{"label":"A","text":"1/4"},{"label":"B","text":"1/3"},{"label":"C","text":"3/12"},{"label":"D","text":"1/2"},{"label":"E","text":"5/12"}]',
   'A', 'P(rouge) = 3/(3+4+5) = 3/12 = 1/4. Les réponses A et C sont équivalentes, mais A est la forme simplifiée.', 'Moyen', 'tage_mage'),
  ('q2', 'calcul', 'Pourcentages', 2,
   'Un article coûte 80€. Après une réduction de 25%, quel est le nouveau prix ?',
   '[{"label":"A","text":"55€"},{"label":"B","text":"60€"},{"label":"C","text":"65€"},{"label":"D","text":"70€"},{"label":"E","text":"75€"}]',
   'B', '80 × (1 - 0.25) = 80 × 0.75 = 60€.', 'Facile', 'tage_mage'),
  ('q3', 'calcul', 'Équations', 3,
   'Résoudre : 2x² - 8 = 0',
   '[{"label":"A","text":"x = 2"},{"label":"B","text":"x = -2"},{"label":"C","text":"x = 2 ou x = -2"},{"label":"D","text":"x = 4"},{"label":"E","text":"Pas de solution"}]',
   'C', '2x² = 8, x² = 4, x = ±2.', 'Facile', 'tage_mage'),
  ('q4', 'calcul', 'Géométrie', 4,
   'Un cercle a un rayon de 5 cm. Quelle est son aire ?',
   '[{"label":"A","text":"25π cm²"},{"label":"B","text":"10π cm²"},{"label":"C","text":"50π cm²"},{"label":"D","text":"15π cm²"},{"label":"E","text":"20π cm²"}]',
   'A', 'Aire = πr² = π × 5² = 25π cm².', 'Facile', 'tage_mage'),
  ('q5', 'calcul', 'Dénombrement', 5,
   'De combien de façons peut-on choisir 3 personnes parmi 7 ?',
   '[{"label":"A","text":"21"},{"label":"B","text":"35"},{"label":"C","text":"42"},{"label":"D","text":"210"},{"label":"E","text":"120"}]',
   'B', 'C(7,3) = 7!/(3!×4!) = 35.', 'Moyen', 'tage_mage'),
  ('q6', 'calcul', 'Probabilités', 6,
   'On lance deux dés. Quelle est la probabilité d''obtenir une somme de 7 ?',
   '[{"label":"A","text":"1/6"},{"label":"B","text":"1/12"},{"label":"C","text":"5/36"},{"label":"D","text":"1/9"},{"label":"E","text":"7/36"}]',
   'A', 'Combinaisons donnant 7 : (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 cas sur 36 = 1/6.', 'Moyen', 'tage_mage'),
  ('q7', 'calcul', 'Pourcentages', 7,
   'Un placement rapporte 5% par an. Après 2 ans, un capital de 1000€ vaut :',
   '[{"label":"A","text":"1100€"},{"label":"B","text":"1102,50€"},{"label":"C","text":"1105€"},{"label":"D","text":"1050€"},{"label":"E","text":"1110,25€"}]',
   'B', '1000 × 1.05² = 1000 × 1.1025 = 1102.50€.', 'Moyen', 'tage_mage'),
  ('q8', 'calcul', 'VTT', 8,
   'Un train parcourt 240 km en 3h. Quelle est sa vitesse moyenne ?',
   '[{"label":"A","text":"60 km/h"},{"label":"B","text":"70 km/h"},{"label":"C","text":"80 km/h"},{"label":"D","text":"90 km/h"},{"label":"E","text":"100 km/h"}]',
   'C', 'V = D/T = 240/3 = 80 km/h.', 'Facile', 'tage_mage'),
  ('q9', 'logique', 'Suites numériques', 1,
   'Quelle est la suite logique : 2, 6, 18, 54, ... ?',
   '[{"label":"A","text":"108"},{"label":"B","text":"162"},{"label":"C","text":"126"},{"label":"D","text":"148"},{"label":"E","text":"180"}]',
   'B', 'Suite géométrique de raison 3 : 54 × 3 = 162.', 'Facile', 'tage_mage'),
  ('q10', 'logique', 'Suites numériques', 2,
   'Quelle est la suite logique : 1, 1, 2, 3, 5, 8, ... ?',
   '[{"label":"A","text":"11"},{"label":"B","text":"12"},{"label":"C","text":"13"},{"label":"D","text":"15"},{"label":"E","text":"10"}]',
   'C', 'Suite de Fibonacci : chaque terme est la somme des deux précédents. 5 + 8 = 13.', 'Moyen', 'tage_mage');

-- Sample TOEIC questions
INSERT INTO questions (id, section_id, theme, number, text, choices, correct_answer, explanation, difficulty, product_id, toeic_part, micro_competence) VALUES
  ('tq1', 'listening', 'Office', 1,
   'The meeting has been _____ to next Monday.',
   '[{"label":"A","text":"postponed"},{"label":"B","text":"delayed"},{"label":"C","text":"cancelled"},{"label":"D","text":"advanced"}]',
   'A', 'Postponed means rescheduled to a later date.', 'Easy', 'toeic', 5, 'Vocabulary'),
  ('tq2', 'reading', 'Business', 2,
   'The company _____ its quarterly results last Friday.',
   '[{"label":"A","text":"announces"},{"label":"B","text":"announced"},{"label":"C","text":"has announced"},{"label":"D","text":"announcing"}]',
   'B', 'Past simple because of "last Friday" (specific past time).', 'Easy', 'toeic', 5, 'Past Simple'),
  ('tq3', 'listening', 'Transportation', 3,
   'Passengers are advised to arrive at the airport _____ two hours before departure.',
   '[{"label":"A","text":"at least"},{"label":"B","text":"at most"},{"label":"C","text":"at once"},{"label":"D","text":"at all"}]',
   'A', '"At least" means a minimum of.', 'Easy', 'toeic', 6, 'Expressions');

-- Subtests (sample)
INSERT INTO subtests (id, section_id, title, type, question_count, duration_minutes, avg_score, sort_order) VALUES
  ('calc-g1', 'calcul', 'Sous-test Calcul #1', 'generaliste', 15, 20, 36, 1),
  ('calc-g2', 'calcul', 'Sous-test Calcul #2', 'generaliste', 15, 20, 36, 2),
  ('calc-g3', 'calcul', 'Sous-test Calcul #3', 'generaliste', 15, 20, 36, 3),
  ('calc-t1', 'calcul', 'Probabilités', 'thematique', 15, 20, 38, 1),
  ('calc-t2', 'calcul', 'Géométrie', 'thematique', 15, 20, 35, 2),
  ('log-g1', 'logique', 'Sous-test Logique #1', 'generaliste', 15, 20, 37, 1),
  ('log-g2', 'logique', 'Sous-test Logique #2', 'generaliste', 15, 20, 37, 2),
  ('comp-g1', 'comprehension', 'Sous-test Compréhension #1', 'generaliste', 15, 20, 38, 1),
  ('ra-g1', 'ra', 'Sous-test R&A #1', 'generaliste', 15, 20, 35, 1),
  ('cond-g1', 'conditions', 'Sous-test Conditions #1', 'generaliste', 15, 20, 34, 1),
  ('expr-g1', 'expression', 'Sous-test Expression #1', 'generaliste', 15, 20, 38, 1);

-- Mock tests
INSERT INTO mock_tests (id, product_id, title, difficulty, avg_score, sort_order) VALUES
  ('tm1', 'tage_mage', 'TM n°1', 'Facile', 340, 1),
  ('tm2', 'tage_mage', 'TM n°2', 'Facile', 342, 2),
  ('tm3', 'tage_mage', 'TM n°3', 'Moyen', 345, 3),
  ('tm4', 'tage_mage', 'TM n°4', 'Moyen', 350, 4),
  ('tm5', 'tage_mage', 'TM n°5', 'Moyen', 355, 5),
  ('tm6', 'tage_mage', 'TM n°6', 'Difficile', 362, 6);

INSERT INTO mock_tests (id, product_id, title, is_monthly, month_label, avg_score, sort_order) VALUES
  ('tm-sept', 'tage_mage', 'TM Mensuel Septembre', true, 'Sept.', 340, 100),
  ('tm-oct', 'tage_mage', 'TM Mensuel Octobre', true, 'Oct.', 345, 101),
  ('tm-nov', 'tage_mage', 'TM Mensuel Novembre', true, 'Nov.', 350, 102);

-- Flashcards
INSERT INTO flashcard_templates (id, section_id, theme, front, back) VALUES
  ('fc1', 'calcul', 'Probabilités', 'Formule P(A|B) ?', 'P(A|B) = P(A ∩ B) / P(B). C''est la probabilité conditionnelle de A sachant B.'),
  ('fc2', 'calcul', 'Géométrie', 'Aire d''un triangle ?', 'A = (base × hauteur) / 2'),
  ('fc3', 'calcul', 'Pourcentages', 'Augmentation successive de a% puis b% ?', 'Coefficient multiplicateur = (1 + a/100) × (1 + b/100)'),
  ('fc4', 'expression', 'Locutions latines', 'Que signifie "a fortiori" ?', 'À plus forte raison. S''utilise pour renforcer un argument.'),
  ('fc5', 'expression', 'Conjugaison', 'Participe passé de "résoudre" ?', 'Résolu (et non "résous").'),
  ('fc6', 'logique', 'Suites', 'Comment reconnaître une suite géométrique ?', 'Le rapport entre deux termes consécutifs est constant : u(n+1)/u(n) = q (raison).'),
  ('fc7', 'ra', 'Argumentation', 'Qu''est-ce qu''un sophisme ?', 'Un raisonnement qui semble logique mais qui est en réalité fallacieux.'),
  ('fc8', 'conditions', 'Méthode', 'Quand une condition est-elle suffisante ?', 'Quand elle permet à elle seule de répondre à la question posée.');

-- Fiches
INSERT INTO fiches (id, section_id, title, description) VALUES
  ('fiche-calc-1', 'calcul', 'Formules essentielles', 'Toutes les formules de calcul à connaître pour le TAGE MAGE'),
  ('fiche-calc-2', 'calcul', 'Tables de multiplication', 'Tables de 1 à 15 avec astuces de mémorisation'),
  ('fiche-calc-3', 'calcul', 'Astuces de calcul mental', 'Techniques rapides pour les opérations courantes'),
  ('fiche-calc-4', 'calcul', 'Conversions', 'Unités de mesure et conversions fréquentes'),
  ('fiche-calc-5', 'calcul', 'Puissances de 2 à 10', 'Les puissances à connaître par cœur'),
  ('fiche-log-1', 'logique', 'Ordre de résolution', 'Méthodologie pour les séries logiques'),
  ('fiche-log-2', 'logique', 'Alphabet et rangs', 'Position des lettres dans l''alphabet'),
  ('fiche-log-3', 'logique', 'Formes géométriques', 'Patterns visuels fréquents en logique'),
  ('fiche-log-4', 'logique', 'Suites classiques', 'Fibonacci, puissances, nombres premiers...'),
  ('fiche-expr-1', 'expression', 'Locutions latines', 'Les 50 locutions latines les plus fréquentes'),
  ('fiche-expr-2', 'expression', 'Proverbes', 'Proverbes et expressions idiomatiques'),
  ('fiche-expr-3', 'expression', 'Conjugaisons pièges', 'Les verbes et temps qui posent problème'),
  ('fiche-expr-4', 'expression', 'Homophones', 'Homophones grammaticaux et lexicaux'),
  ('fiche-ra-1', 'ra', 'Failles logiques', 'Les principales failles de raisonnement'),
  ('fiche-ra-2', 'ra', 'Connecteurs argumentatifs', 'Cause, conséquence, concession, opposition...'),
  ('fiche-ra-3', 'ra', 'Méthode R&A', 'Approche structurée pour les questions R&A'),
  ('fiche-cond-1', 'conditions', 'Méthode complète CM', 'La méthode pas à pas pour les conditions minimales'),
  ('fiche-cond-2', 'conditions', 'Pièges fréquents', 'Les erreurs classiques à éviter en CM'),
  ('fiche-comp-1', 'comprehension', 'Thèmes récurrents', 'Les grands thèmes des textes de compréhension'),
  ('fiche-comp-2', 'comprehension', 'Lecture rapide', 'Techniques pour lire plus vite et mieux comprendre'),
  ('fiche-comp-3', 'comprehension', 'Types de questions', 'Classification et méthode par type de question');

-- ============================================================
-- Admin user (admin@astprep.fr / admin123456)
-- ============================================================
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, reauthentication_token,
  email_change, email_change_token_new, email_change_token_current,
  phone, phone_change, phone_change_token,
  email_change_confirm_status
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'admin@astprep.fr',
  crypt('admin123456', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin ASTPrep"}',
  '', '', '',
  '', '', '',
  '', '', '',
  0
);

INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'admin@astprep.fr',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@astprep.fr"}',
  'email',
  now(), now(), now()
);

UPDATE profiles SET full_name = 'Admin ASTPrep', email = 'admin@astprep.fr', is_admin = true
  WHERE id = '00000000-0000-0000-0000-000000000001';
