# ASTPrep V3 — Roadmap & choix techniques

> Document destiné au client · Version du 22 avril 2026

---

## Nos choix techniques en un coup d'œil

Avant de détailler la roadmap, voici les grandes orientations que nous proposons. Elles visent toutes le même objectif : **livrer vite, sans réinventer la roue**.

### Ce qu'on délègue aux plateformes spécialisées

| Domaine | Outil retenu | Pourquoi |
|---|---|---|
| **Vidéo** | **Mux** | Standard du marché, signed URLs, upload direct, analytics — on ne se pose pas la question |
| **Paiement** | **Stripe natif** | On délègue ~90% du travail à Stripe (voir ci-dessous) |
| **Emails transactionnels** | **Resend** | API moderne, simple, gratuit jusqu'à 3 000 emails/mois |
| **Tâches planifiées (crons)** | **Supabase Pro** | Natif à notre infrastructure, zéro service supplémentaire |

### Pourquoi Stripe natif change tout

Plutôt que de coder une logique de facturation complexe, on s'appuie sur les outils Stripe existants :

- **Stripe Checkout** — page de paiement hébergée par Stripe, zéro interface à développer
- **Stripe Customer Portal** — page autonome où l'utilisateur gère seul son abonnement : changement de formule, annulation, mise à jour de carte bancaire, téléchargement des factures PDF
- **Stripe Billing** — renouvellements automatiques, relances intelligentes en cas d'échec de paiement
- **Stripe Tax** (optionnel) — calcul automatique de la TVA selon le pays de l'utilisateur, indispensable pour un SaaS européen
- **Coupons & codes promo Stripe** — créés directement dans le tableau de bord Stripe, sans développement spécifique

Cela réduit de moitié l'effort sur la partie monétisation.

---

## Indicateurs de difficulté

| Indicateur | Effort estimé |
|---|---|
| 🟢 Simple | < 0,5 jour |
| 🟡 Standard | 0,5 à 1,5 jour |
| 🔴 Complexe | > 1,5 jour |

---

## Phase 0 — Fondations

*Socle technique invisible mais indispensable avant toute mise en production.*

### Infrastructure & qualité

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Pipeline CI/CD (déploiement automatique à chaque mise à jour) | 🟡 Standard | Build + déploiement automatisé sur Vercel + Supabase |
| Monitoring des erreurs (Sentry) | 🟢 Simple | Détection et alertes en temps réel en cas de bug |

### Authentification

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| "Se souvenir de moi" — session 1 an | 🟢 Simple | Configuration Supabase |
| Vérification email obligatoire avant accès | 🟢 Simple | Activation dans les paramètres Supabase |

### Vidéo (Mux)

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Upload vidéo depuis l'interface admin | 🟡 Standard | L'admin charge la vidéo, Mux la traite automatiquement |
| Protection des vidéos (tokens sécurisés) | 🟡 Standard | Empêche l'accès aux vidéos sans être connecté et abonné |
| Confirmation automatique de disponibilité vidéo | 🟡 Standard | Le système est notifié dès qu'une vidéo est prête à la lecture |

### Interface admin — améliorations

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Éditeur de texte riche pour les cours (CKEditor) | 🟢 Simple | Formatage, titres, listes, gras, italique dans les leçons |
| Réorganisation par glisser-déposer (chapitres, questions) | 🟡 Standard | Réordonner les éléments en faisant glisser |
| Réinitialisation du mot de passe d'un utilisateur par l'admin | 🟢 Simple | Envoi d'un lien de reset depuis l'interface admin |
| Export CSV des utilisateurs et connexions | 🟢 Simple | Téléchargement d'un fichier tableur depuis l'admin |

---

## Phase 1 — Monétisation & Entrée

*Le tunnel d'acquisition : de la découverte à l'abonnement payant.*

### Paiement (Stripe natif)

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Page tarification (3 formules) | 🟢 Simple | Interface statique + boutons vers le checkout Stripe |
| Paiement initial via Stripe Checkout | 🟡 Standard | Page hébergée Stripe, aucune interface de paiement à développer |
| Renouvellements & relances automatiques (Stripe Billing) | 🟡 Standard | Stripe gère les échecs de paiement, les retries et les emails de relance |
| Portail de gestion autonome (Stripe Customer Portal) | 🟢 Simple | L'utilisateur gère lui-même son abonnement — 1 appel API suffit |
| Synchronisation des statuts d'abonnement en base | 🟡 Standard | Mise à jour automatique lors des événements Stripe (paiement, annulation…) |
| Freemium — accès limité avec cadenas visuels | 🟡 Standard | Contenu verrouillé pour les non-abonnés, avec indication visuelle claire |
| Codes promotionnels | 🟢 Simple | Gérés nativement dans le tableau de bord Stripe |

### Acquisition & conversion

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Tunnel d'onboarding pré-paiement (4 étapes) | 🟡 Standard | Parcours guidé avant la page de paiement |
| Témoignages en rotation sur la page tarification | 🟢 Simple | Composant visuel, données statiques ou configurables |

### Parrainage

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Système de parrainage complet | 🟡 Standard | Code unique par utilisateur, suivi des filleuls, récompense automatique via Stripe (crédit sur le prochain paiement), réduction filleul via coupon Stripe |

### Écoles partenaires

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Accès privilégié par domaine email d'école | 🟡 Standard | Reconnaissance automatique des emails école → crédit ou accès gratuit |

### Emails transactionnels (Resend)

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Email de bienvenue à l'inscription | 🟢 Simple | |
| Email de confirmation de paiement | 🟢 Simple | |
| Email de reset de mot de passe | 🟢 Simple | |
| Email de notification de parrainage | 🟢 Simple | |

---

## Phase 2 — Cœur d'apprentissage

*Les fonctionnalités centrales que l'utilisateur utilise chaque jour.*

### Quiz & exercices

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Interface quiz robuste (sauvegarde automatique, soumission à 0:00, suivi du temps) | 🟡 Standard | Reprise possible si fermeture accidentelle, minuteur automatique |
| Micro-compétences liées aux leçons | 🟡 Standard | Nouvelles entités à créer : micro-compétences attachées à chaque leçon |
| Drills post-vidéo (5 questions, modale de fin de vidéo) | 🟡 Standard | Exercice court déclenché à la fin de chaque vidéo |
| Test de positionnement (12-15 questions, scoring par domaine) | 🟡 Standard | Évaluation initiale après l'inscription pour orienter le parcours |
| Correction complète avec vidéo explicative à la demande | 🟡 Standard | Player Mux intégré dans la correction, catégorisation des erreurs |
| Mini-bilan post-exercice (3 notions faibles, feedback adaptatif) | 🟡 Standard | Résumé personnalisé après chaque exercice |
| Générateur d'entraînement (comptage dynamique, pré-remplissage) | 🟡 Standard | Création de sessions personnalisées depuis les stats ou la correction |
| Carnet d'erreurs V2 (2 colonnes, graphique, répétition espacée J+1/J+7) | 🟡 Standard | Refonte avec plus d'informations et d'outils |
| Catalogue des sous-tests (score coloré, moyenne ASTPrep) | 🟡 Standard | Indicateur de performance collectif par sous-test |
| Calcul automatique des moyennes ASTPrep (tâche planifiée) | 🟡 Standard | Calcul nocturne des scores de référence sur l'ensemble des utilisateurs |

### TageMage blanc

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Examen blanc complet (6 étapes, enregistrement en temps réel, score /600) | 🔴 Complexe | Orchestration multi-étapes avec sauvegarde progressive et scoring pondéré |
| Page de résultats (percentile, courbe de distribution, partage Discord) | 🟡 Standard | Positionnement par rapport à la communauté ASTPrep |

### Bibliothèque de cours

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Page leçon complète (player Mux, onglets Transcript/Notes/Drill/Ask an Expert) | 🟡 Standard | Expérience de cours complète avec notes personnelles éditables |
| Animation au scroll dans le catalogue | 🟢 Simple | Cosmétique — trait animé sur défilement |

---

## Phase 3 — Intelligence & Progression

*Le moteur qui personnalise l'expérience.*

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Moteur de parcours adaptatif (15 profils, répartition pondérée) | 🟡 Standard | **Simplifié en V1** : les 15 profils sont définis manuellement dans l'admin, le moteur = table de correspondance (score visé → profil) + calcul d'heures selon la date d'examen. L'algo peut s'affiner en V2 avec les données réelles |
| Interface parcours (vue liste / vue calendrier, personnalisation) | 🟡 Standard | Toggle entre les deux vues, barre de progression globale |
| Statistiques V2 (filtres 7j/30j/90j, records personnels, répartition par thème, heatmap) | 🟡 Standard | Vue enrichie des performances sur le temps |
| Dashboard complet (graphiques, score estimé, pop-up défi) | 🟡 Standard | Tableau de bord principal avec toutes les métriques clés |

---

## Phase 4 — Outils & Communauté

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Synchronisation des cours live sur Discord | 🟡 Standard | Les cours planifiés apparaissent automatiquement comme événements Discord |
| Classement des défis complet (podium, top 20, filtres mensuel/trimestriel) | 🟡 Standard | Refonte du leaderboard avec plus de niveaux et de périodes |

> *Flashcards, Calcul mental, Lecture alphabétique et Fiches PDF sont déjà implémentés.*

---

## Phase 5 — Gamification & Finition

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Animations de gamification (confettis, compteurs animés, ~20 micro pop-ups contextuels) | 🟡 Standard | Célébration des premières victoires, streaks, records |
| Pop-up "Défi du jour" (1 fois par jour) | 🟢 Simple | |
| Paramètres utilisateur complets (notifications, tiers-temps, lien portail Stripe) | 🟡 Standard | |
| Dark mode dans les paramètres | 🟢 Simple | |

---

## Phase 6 — Migration & Go-Live

| Fonctionnalité | Difficulté | Note |
|---|---|---|
| Étude de migration (audit du schéma V1 vs V3, test à blanc sur 100 utilisateurs) | 🟡 Standard | Analyse et décision documentée avant toute migration |
| Scripts de migration des données (utilisateurs, scores, erreurs, abonnements) | 🔴 Complexe | Scripts one-shot, risque élevé si données corrompues en V1 — à traiter avec soin |
| Recette finale (validation end-to-end, zéro anomalie critique) | 🟡 Standard | Phase de tests avant ouverture |

---

## Ce que nous excluons de la V1

Ces fonctionnalités ont été évaluées et **délibérément reportées en V2** (ou supprimées). Le gain de temps est significatif et le risque métier est faible au lancement.

| Fonctionnalité | Décision | Justification |
|---|---|---|
| **Anti multi-connexions** | ⏳ V2 | Complexité disproportionnée pour le risque réel. Le partage de compte ne devient un problème qu'à grande échelle. Réimplémentable en V2 si nécessaire. |
| **CRM Attio (synchronisation contacts)** | ⏳ V2 (voire jamais) | L'interface admin + export CSV couvre le besoin pour les 500 à 1 000 premiers utilisateurs. Aucune valeur immédiate. |
| **Email marketing & séquences automatiques** | ⏳ V2 | Les relances d'inactivité, séquences onboarding automatisées et emails de réengagement sont reportés. En V1, on couvre uniquement les emails transactionnels essentiels (bienvenue, paiement, reset). |
| **Algorithme de parcours full-dynamique** | ⏳ V2 | En V1, le moteur s'appuie sur 15 profils définis manuellement. L'algo dynamique complet sera affiné en V2 grâce aux données réelles d'utilisation. |

---

## Récapitulatif des items complexes (🔴)

Ces deux points concentrent le plus de risque et méritent une attention particulière lors du planning :

1. **Examen blanc TageMage** — orchestration multi-étapes avec enregistrement en temps réel
2. **Scripts de migration V1 → V3** — dépend de l'état des données existantes, risque de données corrompues

*Tous les autres items complexes de la roadmap initiale ont été simplifiés grâce aux choix techniques ci-dessus.*

---

*Document produit à partir de l'analyse technique du POC React/Supabase et de la roadmap V3.*
