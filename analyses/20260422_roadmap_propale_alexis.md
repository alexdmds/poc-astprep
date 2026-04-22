# ASTPrep V3 — Roadmap & choix techniques

> Document destiné au client · Version du 22 avril 2026

---

## Ce que nos choix techniques permettent d'éviter

La roadmap initiale était pensée autour d'un backend Symfony sur serveur dédié. En passant sur une stack React + Supabase et en s'appuyant sur des services "sur étagère", on évite une quantité de travail significative — du code qui n'a aucune valeur pédagogique pour les utilisateurs mais qui prend du temps et introduit des risques.

| Ce que Symfony aurait exigé | Ce qu'on fait à la place | Temps économisé |
|---|---|---|
| Backend applicatif complet (serveur, Docker, déploiement Scaleway) | Vercel + Supabase hébergé — zéro infra à gérer | Plusieurs jours |
| Interface de paiement, upgrade/downgrade, annulation, gestion CB | **Stripe Customer Portal** (page hébergée Stripe clé en main) | 3–4 jours |
| Logique de renouvellement, retry en cas d'échec, emails de relance | **Stripe Billing** (natif Stripe) | 2–3 jours |
| Entité PromoCode custom avec CRUD admin | **Coupons Stripe** (gérés dans le dashboard Stripe) | 1 jour |
| Logique anti-chevauchement d'abonnements | Configuration native Stripe (1 abo actif par produit) | 0,5 jour |
| Service de crons externe | **pg_cron Supabase Pro** (crons directement en base de données) | 1 jour |
| Anti multi-connexions (middleware interceptant chaque requête) | **Reporté V2** — risque inexistant au lancement | 2–3 jours |
| Intégration CRM Attio | **Reporté V2** — export Supabase Studio suffit pour < 1 000 users | 1–2 jours |

**Total estimé économisé : 10 à 15 jours de développement**, réaffectables directement sur les fonctionnalités métier.

---

## Comment lire la roadmap

La roadmap est organisée en **jalons techniques** plutôt qu'en liste de features isolées. Chaque jalon correspond à un bloc cohérent qui peut être livré, testé et validé indépendamment. Les jalons sont séquentiels : chacun débloque le suivant.

Chaque item précise où se situe l'effort réel :

| Indicateur | Signification |
|---|---|
| 🔧 **Technique** | Intégration d'un service ou d'une API — la logique métier est simple ou connue |
| 📋 **Métier** | L'effort principal est de définition fonctionnelle : règles, cas limites, contenu. La technique suit une fois la logique arrêtée. |
| ⚖️ **Les deux** | Effort équilibré |

| Indicateur | Effort estimé |
|---|---|
| 🟢 Simple | < 0,5 jour |
| 🟡 Standard | 0,5 à 1,5 jour |
| 🔴 Conséquent | > 1,5 jour |

---

## Jalon 0 — Socle technique

*Prérequis à tout le reste. Rien d'autre ne peut démarrer sans ce jalon.*

| Fonctionnalité | Effort | Nature | Note |
|---|---|---|---|
| Pipeline CI/CD (déploiement automatique) | 🟡 Standard | 🔧 Technique | Build + deploy automatisé à chaque push |
| Monitoring des erreurs (Sentry) | 🟢 Simple | 🔧 Technique | Branchement rapide, alertes en temps réel |
| Vérification email obligatoire + session longue durée | 🟢 Simple | 🔧 Technique | Deux paramètres de configuration Supabase Auth |
| Upload vidéo depuis l'admin (Mux Direct Upload) | 🟡 Standard | 🔧 Technique | L'admin charge la vidéo, Mux encode automatiquement |
| Protection des vidéos (signed tokens Mux) | 🟡 Standard | 🔧 Technique | Une fonction serverless signe le token à la demande — accès impossible sans abonnement |
| Notification de disponibilité vidéo (webhook Mux asset.ready) | 🟡 Standard | 🔧 Technique | La base de données est mise à jour dès qu'une vidéo est prête |

---

## Jalon 1 — Monétisation

*Le moteur de revenus. Entièrement délégué à Stripe — notre travail se limite au branchement.*

| Fonctionnalité | Effort | Nature | Note |
|---|---|---|---|
| Page tarification (3 formules) | 🟢 Simple | 📋 Métier | Interface statique — l'effort est de définir et rédiger les offres |
| Paiement initial — Stripe Checkout | 🟡 Standard | 🔧 Technique | Page de paiement hébergée Stripe, zéro formulaire CB à développer |
| Synchronisation des statuts d'abonnement | 🟡 Standard | 🔧 Technique | Webhooks Stripe → mise à jour de la base de données |
| Portail client — Stripe Customer Portal | 🟢 Simple | 🔧 Technique | 1 appel API → l'utilisateur gère seul son abonnement (upgrade, annulation, CB, factures) |
| Emails transactionnels essentiels (Resend) | 🟢 Simple | ⚖️ Les deux | Bienvenue, confirmation paiement, reset mot de passe — branchement rapide, effort principal = rédaction des templates |

---

## Jalon 2 — Expérience d'apprentissage

*Le cœur du produit que l'utilisateur utilise chaque jour. La base de code couvre déjà l'essentiel — l'effort est principalement de définition métier.*

| Fonctionnalité | Effort | Nature | Note |
|---|---|---|---|
| Interface quiz robuste (sauvegarde auto, soumission à 0:00, suivi du temps) | 🟡 Standard | 📋 Métier | Mécanique de base existante. Définir : que se passe-t-il si l'utilisateur ferme l'onglet ? comment gère-t-on les questions non répondues à 0:00 ? |
| Micro-compétences liées aux leçons | 🟡 Standard | 📋 Métier | Structure technique simple. L'effort : définir le référentiel de micro-compétences et leur association aux leçons |
| Drills post-vidéo (5 questions, modale fin de vidéo) | 🟡 Standard | 📋 Métier | Techniquement simple. Nécessite de définir les 5 questions associées à chaque leçon |
| Correction complète (player Mux à la demande, catégorisation des erreurs) | 🟡 Standard | 📋 Métier | Branchement Mux simple. Définir la catégorisation des erreurs et les "blocs de progression" associés |
| Mini-bilan post-exercice (3 notions faibles, feedback adaptatif) | 🟡 Standard | 📋 Métier | Définir les 4 cas de feedback et leur formulation |
| Carnet d'erreurs V2 (2 colonnes, graphique, répétition espacée J+1/J+7) | 🟡 Standard | ⚖️ Les deux | Base solide existante. Enrichissement visuel + logique de répétition espacée à préciser |
| Générateur d'entraînement (comptage dynamique, pré-remplissage) | 🟡 Standard | 📋 Métier | Définir les critères de filtrage et l'expérience souhaitée |
| Page leçon complète (player Mux, onglets Transcript / Notes / Drill / Ask an Expert) | 🟡 Standard | 📋 Métier | Player = branchement simple. Définir le fonctionnement de chaque onglet (notes partagées ou privées ? "Ask an Expert" = formulaire ou lien Discord ?) |
| Catalogue sous-tests + cron moyennes ASTPrep | 🟡 Standard | 🔧 Technique | Cron Supabase Pro, calcul filtre score > 8/60, premier passage uniquement |

---

## Jalon 3 — TageMage blanc

*Fonctionnalité flagship. Traitée en jalon séparé car c'est le seul item où la complexité vient de l'orchestration elle-même.*

| Fonctionnalité | Effort | Nature | Note |
|---|---|---|---|
| Examen blanc complet (6 étapes, enregistrement en temps réel, score /600) | 🔴 Conséquent | 📋 Métier | **Le défi est principalement de cadrage** : définir l'enchaînement exact des 6 sous-tests, la formule de scoring pondéré /600, les comportements edge (coupure réseau, retour arrière, onglet fermé). La technique suit directement. |
| Page de résultats (percentile, courbe de distribution, partage Discord) | 🟡 Standard | 📋 Métier | Définir la formule du percentile et les tranches d'affichage. La courbe est un composant graphique standard. |

---

## Jalon 4 — Intelligence & Parcours

*La couche de personnalisation. L'enjeu est entièrement métier : les décisions prises ici conditionnent la valeur différenciante du produit.*

| Fonctionnalité | Effort | Nature | Note |
|---|---|---|---|
| Test de positionnement (12-15 questions, scoring par domaine) | 🟡 Standard | 📋 Métier | Définir la sélection des questions, la grille de scoring, et ce que le résultat déclenche dans le parcours |
| Moteur de parcours (15 profils, répartition pondérée) | 🟡 Standard | 📋 Métier | **Simplifié V1** : les 15 profils sont saisis manuellement dans l'admin par Grégoire. Le moteur = table de correspondance score visé → profil + calcul d'heures selon la date d'examen. **L'effort principal est de définir les 15 profils** — pas de coder un algorithme. |
| Interface parcours (vue liste / vue calendrier, barre de progression) | 🟡 Standard | ⚖️ Les deux | |
| Statistiques V2 (filtres 7j/30j/90j, records personnels, répartition thèmes, heatmap) | 🟡 Standard | 📋 Métier | Base technique existante. Définir les indicateurs à afficher et leur calcul. |
| Dashboard complet (graphiques, score estimé, pop-up défi) | 🟡 Standard | 📋 Métier | Définir le calcul du score estimé et la composition des blocs |

---

## Jalon 5 — Finition & Go-Live

*Polish, migration et ouverture. Techniquement léger dans l'ensemble — ce sont des jours d'itération, pas de conception.*

| Fonctionnalité | Effort | Nature | Note |
|---|---|---|---|
| Animations gamification (confettis, compteurs, ~20 micro pop-ups contextuels) | 🟡 Standard | 📋 Métier | L'animation est triviale. L'effort : **définir les ~20 déclencheurs** (1er exercice terminé, streak 7j, nouveau record…) et leur formulation |
| Pop-up "Défi du jour" | 🟢 Simple | 🔧 Technique | |
| Dark mode dans les paramètres | 🟢 Simple | 🔧 Technique | Infrastructure déjà en place |
| Paramètres utilisateur (notifications, tiers-temps, lien portail Stripe) | 🟡 Standard | 📋 Métier | Définir les options à exposer |
| Éditeur de texte riche admin (CKEditor) | 🟢 Simple | 🔧 Technique | |
| Étude de migration (audit schéma V1 vs V3, dry run 100 utilisateurs) | 🟡 Standard | ⚖️ Les deux | À lancer tôt — ne pas attendre le Jalon 5 pour commencer l'audit |
| Scripts de migration des données (utilisateurs, scores, erreurs, abonnements) | 🔴 Conséquent | 🔧 Technique | Le risque dépend de l'état des données V1. Scripts one-shot à traiter avec soin. |
| Recette finale (validation end-to-end, zéro anomalie critique) | 🟡 Standard | ⚖️ Les deux | |

---

## V2 — Post go-live

Ces fonctionnalités ont été **délibérément sorties de la V1** : elles ne sont pas nécessaires pour ouvrir, et les inclure compliquerait le scope sans apporter de valeur immédiate aux premiers utilisateurs.

Elles forment une V2 cohérente, livrable rapidement après le go-live car la base technique sera déjà en place.

| Fonctionnalité | Justification du report |
|---|---|
| **Parrainage** | Feature de croissance, pas de rétention. Pertinent une fois les premiers utilisateurs satisfaits — pas avant l'ouverture. |
| **Écoles partenaires** | Idem — acquisition, pas nécessaire au go-live. |
| **Freemium + cadenas visuels** | Uniquement pertinent si un tier gratuit est prévu. Si le lancement est 100% payant, c'est une décision future. |
| **Drag & drop reorder admin** | L'admin fonctionne sans — les positions se gèrent manuellement en attendant. |
| **Export CSV utilisateurs** | Le dashboard Supabase Studio couvre le besoin pour les premières semaines. |
| **Témoignages en rotation** | Marketing — à alimenter avec de vrais retours post-lancement. |
| **Sync cours live Discord** | Communauté — valeur réelle seulement quand la base d'utilisateurs est active. |
| **Classement défis complet** | La base existe, le podium et les filtres mensuel/trimestriel peuvent attendre. |
| **Anti multi-connexions** | Problème d'échelle — inexistant au lancement. |
| **CRM Attio** | Inutile avant 1 000 utilisateurs. |
| **Email marketing & séquences automatiques** | V1 couvre les emails transactionnels essentiels. Les séquences de réengagement viennent après. |
| **Algorithme parcours full-dynamique** | V1 = 15 profils manuels. L'algo s'affinera avec les données réelles. |

---

## Synthèse : où se situe vraiment l'effort

La majorité des items des Jalons 2, 3 et 4 **ne sont pas des défis techniques** — ils nécessitent des décisions de votre côté avant qu'on puisse coder quoi que ce soit :

- Comment scorer exactement un TageMage ?
- Quels sont les 15 profils de parcours et leurs poids ?
- Quels sont les 20 déclencheurs de gamification et leur formulation ?
- Comment catégoriser les erreurs dans la correction ?

Ces points ne se débloquent pas en codant plus vite. **Plus ils sont arrêtés en amont de chaque jalon, plus le jalon avance vite.**

Les seuls vrais défis techniques restants sont les **scripts de migration V1 → V3** (dépend de l'état des données existantes) et le **branchement Stripe** (standard mais demande du soin sur la gestion des états).

---

*Document produit à partir de l'analyse technique du POC React/Supabase et de la roadmap V3.*
