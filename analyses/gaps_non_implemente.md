# Gaps roadmap V3 — Ce qui n'est pas encore implémenté

> Basé sur la roadmap `20260421_ASTPrep_V3_Roadmap.xlsx` et l'état du POC React/Supabase.
> Complexité : 🟢 Faible (< 0,5j) · 🟡 Moyenne (0,5–1,5j) · 🔴 Élevée (> 1,5j)

---

## LOT 0 — Fondations

### Infrastructure

| Item | État | Complexité | Notes |
|---|---|---|---|
| Setup CI/CD (GitHub Actions ou GitLab Runner) | ❌ | 🟡 | Équivalent à GitLab Runner. Build Vite + deploy Vercel/Supabase. |
| Monitoring Sentry | ❌ | 🟢 | `@sentry/react` + DSN, 2h max. |
| Docker / environnement de déploiement défini | ❌ | 🟡 | La roadmap cible Docker Swarm + Scaleway. Avec Supabase hébergé + Vercel c'est beaucoup plus simple — mais à décider. |

### Auth

| Item | État | Complexité | Notes |
|---|---|---|---|
| Remember me 1 an | ⚠️ Partiel | 🟢 | Supabase gère les sessions, le TTL est configurable dans les settings Supabase. |
| Session token unique (anti multi-connexions) | ❌ | 🔴 | Voir fichier `alternatives_simplifications.md`. Pas natif Supabase. |
| Vérification email obligatoire avant accès | ⚠️ | 🟢 | Activable dans Supabase Auth settings, à vérifier si c'est en place. |

### Abonnements & Stripe

| Item | État | Complexité | Notes |
|---|---|---|---|
| Entités Subscription + SubscriptionHistory | ❌ | 🟡 | 2 nouvelles tables Supabase + migration. |
| Entité PromoCode (CRUD admin) | ❌ | 🟡 | Table + page admin. Stripe gère aussi les coupons nativement. |
| Checkout Stripe (3 plans) | ❌ | 🟡 | Edge Function qui crée une Stripe Checkout Session. |
| Webhooks Stripe (payment_succeeded, subscription.deleted) | ❌ | 🔴 | Edge Function exposée en HTTP, gestion idempotence, mise à jour DB. |
| Anti-chevauchement d'abonnements | ❌ | 🟡 | Vérification avant création checkout — logique SQL ou trigger PG. |
| Upgrade / downgrade / pause (prorata Stripe) | ❌ | 🔴 | Logique complexe : prorata Stripe + historique + états cohérents. |
| Portail Stripe (gestion facturation self-service) | ❌ | 🟢 | Un seul appel API Stripe → URL portail. 1h. |

### Vidéo (Mux)

| Item | État | Complexité | Notes |
|---|---|---|---|
| Upload vidéo direct depuis admin (Mux Direct Upload) | ❌ | 🟡 | Edge Function génère une upload URL Mux signée → l'admin upload directement. |
| Signed playback tokens | ❌ | 🟡 | Edge Function qui signe le token à la demande. |
| Webhook Mux `asset.ready` | ❌ | 🟡 | Edge Function HTTP → met à jour `mux_playback_id` en DB quand la vidéo est prête. |

### Admin — fonctionnalités manquantes

| Item | État | Complexité | Notes |
|---|---|---|---|
| CKEditor (contenu riche cours) | ❌ | 🟢 | Intégrer `@ckeditor/ckeditor5-react`. Les leçons ont actuellement un champ texte simple. |
| Drag & drop reorder (chapitres, exercices, questions) | ❌ | 🟡 | `@dnd-kit/core` ou `react-beautiful-dnd` + update position en DB. |
| Reset password user par admin | ❌ | 🟢 | Appel `supabase.auth.admin.generateLink()` + envoi email. |
| Export CSV utilisateurs/connexions | ❌ | 🟢 | Query Supabase → génération CSV côté client. 2-3h. |
| Alertes admin (multi-connexions, discount > 80) | ❌ | 🟡 | Badges/notifications dans l'admin. Dépend de l'implémentation des sessions. |

### Contenu & Schema — nouvelles entités

| Item | État | Complexité | Notes |
|---|---|---|---|
| Entité Micro-compétence (liée aux leçons) | ❌ | 🟡 | Nouvelle table + relation `lessons` + CRUD admin. |
| Entité Drill (5 questions par leçon) | ❌ | 🟡 | Table + CRUD admin + UI player post-vidéo. |
| Test de positionnement (12-15 Q, scoring par domaine) | ❌ | 🟡 | Config admin + flow UI post-paiement. Scoring = calcul client simple. |
| CRUD Parcours → Parts → Items pondérés (15 profils) | ⚠️ Partiel | 🔴 | `parcours_plans` existe mais sans la hiérarchie complète ni les poids horaires. |

---

## LOT 1 — Monétisation & Entrée

| Item | État | Complexité | Notes |
|---|---|---|---|
| Onboarding pré-paiement (4 étapes avec barre progression) | ⚠️ Partiel | 🟡 | L'onboarding existe pour TAGE-MAGE mais sans le tunnel pré-paiement + paywall en fin. |
| Page pricing (3 plans affichés) | ❌ | 🟢 | UI statique + boutons → checkout Edge Function. |
| Freemium avec cadenas visuels | ❌ | 🟡 | Flag `is_free` sur leçons/exercices en DB + composant cadenas conditionnel. |
| Dashboard minimal placeholder (avant Lot 3) | ⚠️ Partiel | 🟢 | Dashboard existe — à simplifier/adapter pour l'état sans parcours. |
| Parrainage (code unique, reward 10€, promo -15%) | ❌ | 🔴 | Table parrainage + Edge Function reward Stripe Customer Balance + code promo auto. |
| Écoles partenaires (matching domaine email, crédit Stripe) | ❌ | 🟡 | Table `partner_schools` (domaine email → crédit) + appel à la vérification email. |
| Emails transactionnels Brevo | ❌ | 🟡 | Edge Function appelée sur événements (paiement, inscription, rappel) → API Brevo. |
| Sync Attio (users + abonnements) | ❌ | 🟢 | Cron/Edge Function schedulée → API Attio. Faible priorité métier. |
| Témoignages en rotation sur la page pricing | ❌ | 🟢 | Composant UI pur, données statiques ou table admin. |

---

## LOT 2 — Cœur d'apprentissage + TageMage

### Quiz & Exercices

| Item | État | Complexité | Notes |
|---|---|---|---|
| QuizInterface complète (save localStorage, auto-submit, tracking temps >1s) | ⚠️ Partiel | 🟡 | La mécanique de base existe. Manque : save localStorage robuste (fermeture/réouverture), auto-submit à 0:00, tracking temps par question >1s. |
| Drill post-vidéo (5 Q, CTA fin de vidéo, modale) | ❌ | 🟡 | Dépend de l'entité Drill (Lot 0). UI : modale ou section dédiée après le player. |
| Mini-fenêtre debrief post-exo (3 notions faibles, feedback adaptatif) | ❌ | 🟡 | Calcul côté client des thèmes les plus ratés. 4 cas de feedback. |
| CorrectionView complète (vidéo Mux à la demande, catégorisation erreur, bloc "Pour progresser") | ⚠️ Partiel | 🟡 | Correction partielle. Manque : player Mux à la demande + catégorisation erreur enregistrée + liens cours. |
| Générateur d'entraînement (chips, résumé dynamique, pré-remplissage URL) | ⚠️ Partiel | 🟡 | Existe partiellement. Manque : comptage dynamique questions disponibles, pré-remplissage URL depuis correction/stats. |
| Carnet d'erreurs V2 (layout 2 colonnes, générateur spécifique, pie chart, J+1/J+7) | ⚠️ Partiel | 🟡 | Base solide. Manque : générateur dédié depuis le carnet, pie chart par catégorie, infos répétition espacée J+1/J+7. |
| Catalogue sous-tests (score/60 coloré, moyenne ASTPrep par card) | ⚠️ Partiel | 🟡 | Cards existent. Manque : couleur sur le score, moyenne ASTPrep (dépend du cron). |
| Cron calcul moyennes ASTPrep (filtre score > 8/60, 1er passage uniquement) | ❌ | 🟡 | Supabase Edge Function schedulée ou pg_cron. Stockage dans une table `subtest_averages`. |

### TageMage blanc

| Item | État | Complexité | Notes |
|---|---|---|---|
| Orchestration 6 steps (Exam + ExamAnswers, timestamps, enregistrement live, scoring /600) | ⚠️ Partiel | 🔴 | Mock tests existent mais pas l'orchestration multi-steps avec enregistrement live step-by-step et scoring pondéré /600. |
| Page résultats TageMage (percentile, courbe en cloche, détail sous-tests, partage Discord) | ⚠️ Partiel | 🟡 | Page résultats basique existe. Manque : percentile, courbe en cloche, partage Discord. |

### Bibliothèque cours

| Item | État | Complexité | Notes |
|---|---|---|---|
| Page leçon complète (player Mux large, 4 onglets : Transcript/Notes/Drill/Ask an Expert) | ⚠️ Partiel | 🟡 | Player vidéo basique. Manque : player Mux (vs URL générique), onglets Notes éditables, Drill, Ask an Expert, like/dislike. |
| Trait animé au scroll dans le catalogue | ❌ | 🟢 | CSS/Framer Motion. Cosmétique. |

---

## LOT 3 — Intelligence & Progression

| Item | État | Complexité | Notes |
|---|---|---|---|
| Moteur de calcul du parcours (algo 15 profils × tranches 25 pts, répartition items pondérés) | ❌ | 🔴 | L'algorithme lui-même est le cœur. Inputs : score visé + date + heures dispo → plan hebdomadaire. |
| Interface parcours (toggle Liste/Calendrier, modale Personnaliser, barre progression globale) | ⚠️ Partiel | 🟡 | Parcours affiché basiquement. Manque : vue calendrier, personnalisation temps réel, barre progression. |
| Statistiques V2 (filtre 7j/30j/90j, 7 PB avec badge "Nouveau", barres % par thème, heatmap) | ⚠️ Partiel | 🟡 | Stats basiques existent. Manque : filtre temporel, badge PB récent, tri par thème, heatmap Strava-style. |
| Dashboard bento complet (remplace placeholder, graphiques, popup défi) | ⚠️ Partiel | 🟡 | Dashboard existe en version bento. Manque : courbe TM blancs, score estimé + FAQ, intégration popup défi (Lot 5). |

---

## LOT 4 — Outils & Communauté

| Item | État | Complexité | Notes |
|---|---|---|---|
| Sync events Discord (cron → API Discord pour cours live planifiés) | ❌ | 🟡 | Edge Function schedulée → API Discord Bot. Nécessite un bot Discord avec permissions. |
| Classement défis (podium 3, top 20, onglets mensuel/trimestriel, cron) | ⚠️ Partiel | 🟡 | Leaderboard existe. Manque : podium visuel, filtre mensuel/trimestriel, cron de mise à jour. |

> Flashcards, Calcul mental, Lecture alphabétique, Fiches PDF sont déjà implémentés.

---

## LOT 5 — Gamification & Finition

| Item | État | Complexité | Notes |
|---|---|---|---|
| Animations gamification (confettis PB 2s, compteur 1,5s, pop-ups contextuels ~20) | ⚠️ Partiel | 🟡 | Mécaniques en place. Manque : animations visuelles, ~20 micro pop-ups contextuels (1er exo terminé, streak 7j, etc.). |
| Popup défi du jour 1x/jour (localStorage) | ❌ | 🟢 | Logique localStorage + composant modal. Trivial. |
| Paramètres user (toggles notifications, tiers temps, facturation → portail Stripe) | ⚠️ Partiel | 🟡 | Page paramètres partielle. Manque : toggle tiers temps, redirect portail Stripe. |
| Dark mode toggle dans paramètres | ⚠️ Partiel | 🟢 | next-themes en place, à exposer dans les paramètres user. |

---

## LOT 6 — Migration & Go-Live

| Item | État | Complexité | Notes |
|---|---|---|---|
| Étude de migration (audit schéma V1 vs V3, dry run 100 users) | ❌ | 🟡 | Travail d'analyse. Livrable = note de décision. |
| Scripts de migration des données (users, scores, erreurs, abos) | ❌ | 🔴 | Dépend du schéma V1. Scripts SQL/TypeScript one-shot. Risque élevé si données corrompues. |
| Recette finale (E2E, 0 anomalie critique) | ❌ | 🟡 | Tests manuels ou Playwright E2E. |

---

## Récapitulatif par complexité

### 🔴 Élevée — items à planifier en priorité

- Webhooks Stripe (idempotence, gestion états)
- Upgrade/downgrade/pause avec prorata Stripe
- Anti multi-connexions (si vraiment requis)
- Orchestration TageMage 6 steps avec enregistrement live
- Moteur de calcul parcours adaptatif (algo 15 profils)
- Parrainage (reward Stripe Customer Balance)
- Scripts de migration données V1 → V3
- Structure Parcours → Parts → Items pondérés

### 🟡 Moyenne — à budgéter normalement

- Entités Subscription / PromoCode / Micro-compétences / Drill
- Checkout Stripe + webhooks simples
- Signed tokens Mux + upload direct + webhook asset.ready
- QuizInterface robuste (localStorage save, auto-submit)
- Orchestration TageMage (version allégée)
- CorrectionView complète
- Moteur parcours (interface)
- Emails Brevo (Edge Functions)
- Classement défis complet
- Carnet d'erreurs V2
- Stats V2

### 🟢 Faible — à faire mais sans risque

- Sentry
- Remember me (config Supabase)
- CKEditor
- Export CSV
- Reset password user par admin
- Portail Stripe (1 appel API)
- Page pricing (UI statique)
- Freemium cadenas (flag DB + composant)
- Popup défi du jour
- Dark mode dans paramètres
- Trait animé catalogue
- Témoignages rotation
- Attio sync
