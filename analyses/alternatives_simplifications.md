# Alternatives & simplifications — Challenger la roadmap

> Pour chaque choix technique de la roadmap Symfony, on évalue si une alternative plus simple existe
> dans le contexte React/Supabase, et ce qu'on gagne ou perd.

---

## 1. Vidéo — Mux vs alternatives

### Ce que Mux apporte
- Transcoding automatique (multi-qualité, HLS)
- Signed playback tokens (protection anti-piratage)
- Upload direct depuis le navigateur (pas de stockage intermédiaire)
- Analytics vidéo (temps de visionnage, taux completion)
- Webhook `asset.ready`

### Coût
Mux est payant à l'usage (~0,015$/min stockée + ~0,005$/min visionnée). Pour 100 leçons de 15 min = 1 500 min stockées ≈ 22,5$/mois + visionnage.

### Alternatives challengées

| Alternative | Avantages | Inconvénients | Verdict |
|---|---|---|---|
| **YouTube non listé** | Gratuit, transcoding auto, player natif | Pas de contrôle d'accès (URL partageable), pub possible, pas d'analytics custom | ❌ Inacceptable si contenu payant |
| **Vimeo Pro** (~20$/mois) | Contrôle domaine (whitelist), pas de pub, player propre | Pas de signed tokens stricts, upload moins flexible, API moins puissante | ⚠️ Acceptable si budget serré |
| **Cloudflare Stream** (~5$/1000 min) | Très bon rapport qualité/prix, signed URLs natives, upload direct, webhooks | Moins mature que Mux pour analytics | ✅ Alternative sérieuse à Mux |
| **Bunny.net Stream** (~10$/mois flat) | Très bon marché, CDN mondial, signed URLs | API moins documentée, moins d'intégrations | ✅ Si budget prioritaire |

**Recommandation** : Cloudflare Stream ou Bunny.net sont des alternatives légitimes à Mux pour réduire les coûts et la complexité, tout en gardant les signed URLs. L'API est similaire. La migration ultérieure vers Mux est possible.

**Concernant le backend pour les signed tokens** : avec n'importe lequel de ces services, une Edge Function Supabase suffit. Le flow :
1. Front appelle `/functions/v1/video-token?videoId=xxx`
2. Edge Function signe le token avec la clé secrète
3. Renvoie le token au front
4. Front l'injecte dans le player

---

## 2. Stripe — gestion native vs logique custom

### Ce que la roadmap implémente en custom
- Entité `Subscription` + états (active, paused, expired, canceled)
- Entité `SubscriptionHistory`
- Anti-chevauchement
- Upgrade/downgrade avec prorata

### Alternative : laisser Stripe gérer au maximum

Stripe a nativement :
- **Customer Portal** : l'utilisateur gère lui-même son abo (upgrade, downgrade, annulation, pause) depuis une page Stripe hébergée. Zéro dev côté toi.
- **Stripe Billing** : gère les états d'abonnement, les renouvellements, les échecs de paiement, les relances automatiques.
- **Stripe Coupons/Promotion Codes** : les codes promo sont gérables directement dans Stripe sans entité custom.

**Ce qui reste à faire dans tous les cas** :
- Webhook `customer.subscription.updated` / `deleted` → mettre à jour un flag `is_subscriber` en DB
- Checkout Session depuis une Edge Function

**Ce qu'on peut supprimer** :
- Entité `PromoCode` custom → utiliser les coupons Stripe directement
- Logique upgrade/downgrade → Customer Portal Stripe
- Anti-chevauchement → configurable dans les settings Stripe (1 abo actif par produit)
- Entité `SubscriptionHistory` → Stripe garde l'historique, interrogeable via API

**Verdict** : on peut réduire l'effort Stripe de 🔴 à 🟡 en déléguant au Customer Portal et aux coupons Stripe natifs. La contrepartie : moins de contrôle sur l'UX (page Stripe = branding Stripe).

---

## 3. Anti multi-connexions — vraiment nécessaire ?

### Le besoin
Empêcher le partage de compte entre plusieurs personnes.

### La complexité
Implémenter un système de session token unique avec Supabase Auth nécessite :
- Une table `active_sessions` avec un token UUID par user
- Un middleware (ou vérification dans chaque Edge Function) comparant le token en DB avec celui du user
- Une logique d'invalidation à chaque nouveau login
- La gestion des cas edge (expiration, refresh token, multi-devices légitimes)

### Alternatives

| Approche | Complexité | Efficacité |
|---|---|---|
| **Session token unique custom** (roadmap) | 🔴 Élevée | Forte mais contournable (copie de cookie) |
| **Limite devices via Supabase Auth JWT claims** | 🟡 Moyenne | Partielle — claim stocké dans le token, vérifié à chaque request |
| **Ne pas l'implémenter v1** | 🟢 Nulle | Zéro — mais le risque de partage est faible au lancement |
| **Rate limiting par IP + device fingerprint** | 🟡 Moyenne | Raisonnable, difficile à contourner en pratique |

**Recommandation** : **ne pas implémenter en V1**. Le partage de compte est un problème qui se manifeste à l'échelle (plusieurs milliers d'users). À ce stade, le coût de l'implémentation est disproportionné par rapport au risque réel. À ajouter en V2 si le problème se constate.

---

## 4. Emails transactionnels — Brevo vs alternatives

### Ce que Brevo apporte
- Templates HTML visuels avec variables dynamiques
- Tracking ouvertures/clics
- Séquences automatiques (rappels J+3, J+7)
- Gestion listes/segmentation

### Alternatives

| Alternative | Avantages | Inconvénients |
|---|---|---|
| **Resend** (~0$/mois jusqu'à 3 000 emails) | API TypeScript native, très simple, intégration React Email | Pas de séquences automatiques |
| **Supabase + Resend** | Edge Functions déclenchées sur événements DB (triggers) | Séquences = crons manuels |
| **Brevo (roadmap)** | Séquences, templates, segmentation | API moins moderne, setup plus lourd |
| **Postmark** | Excellent deliverability, API simple | Payant dès le départ |

**Recommandation** : **Resend** pour les emails transactionnels simples (bienvenue, confirmation, reset). Brevo uniquement si les séquences marketing automatiques (rappels inactivité, relances) sont prioritaires en V1 — ce qui peut attendre.

---

## 5. Crons — pg_cron vs Edge Functions schedulées

### Deux options dans l'écosystème Supabase

**pg_cron** (extension PostgreSQL disponible sur Supabase) :
- Cron directement dans la DB, exécute du SQL
- Parfait pour : recalcul moyennes, mise à jour classements, nettoyage sessions expirées
- Limité : pas d'appels HTTP externes (pas d'Attio, pas de Discord)

**Supabase Edge Functions avec schedule** :
- Supporte les appels HTTP externes
- TypeScript/Deno
- Nécessite un plan Supabase Pro pour le scheduling natif (sinon = service externe type cron-job.org)

**Recommandation** :
- Moyennes ASTPrep, classements → **pg_cron** (tout en SQL, simple)
- Sync Attio, events Discord → **Edge Function** appelée par un cron externe (cron-job.org gratuit) ou Supabase Pro

---

## 6. Attio (CRM) — vraiment nécessaire en V1 ?

Attio est un outil de suivi commercial/CRM pour avoir une vue sur les users et leurs abonnements. Alternatives :

| Approche | Effort | Valeur V1 |
|---|---|---|
| **Attio sync (roadmap)** | 🟡 Moyenne | Utile pour le suivi commercial |
| **Dashboard admin Supabase existant** | 🟢 Déjà là | Suffisant pour les premiers 500 users |
| **Export CSV manuel depuis admin** | 🟢 Faible | Suffisant phase early |

**Recommandation** : **reporter à V2**. Tant que la base d'utilisateurs est < 500-1 000, le dashboard admin + export CSV couvre le besoin. L'intégration Attio est un confort, pas une nécessité.

---

## 7. Moteur parcours adaptatif — simplifier l'algorithme V1

### Ce que la roadmap veut
15 profils × tranches de 25 pts, répartition items pondérés, régénération dynamique.

### Simplification possible
En V1, le parcours peut être semi-statique :
- Grégoire définit les 15 profils à la main dans l'admin (poids par item déjà prévu dans le CRUD)
- Le moteur = une lookup table (score visé → profil) + calcul heures selon date examen
- La "génération dynamique" = simplement afficher le profil correspondant, ordonné par poids

Cela ramène la complexité de 🔴 à 🟡 pour la V1, avec la possibilité d'affiner l'algo en V2 avec les données réelles d'usage.

---

## 8. Parrainage — simplifier le reward

### Ce que la roadmap veut
Reward 10€ via Stripe Customer Balance + promo code -15% auto-attribué au filleul.

### Complexité réelle
Stripe Customer Balance nécessite une logique de crédit appliqué au prochain paiement. Le code promo auto = créer un coupon Stripe via API à la validation du filleul.

### Simplification possible
- **V1** : reward = code promo manuel envoyé par email (Brevo/Resend). Zéro Stripe Customer Balance.
- **V2** : automatiser avec Customer Balance.

Ça ramène le parrainage de 🔴 à 🟡.

---

## Résumé des recommandations

| Choix roadmap | Recommandation | Gain |
|---|---|---|
| Mux pour les vidéos | Cloudflare Stream ou Bunny.net en V1 | Coût réduit, même technicité |
| Stripe tout custom | Déléguer au Customer Portal + coupons natifs | Effort -50% |
| Anti multi-connexions | Reporter à V2 | Évite une complexité disproportionnée |
| Brevo dès V1 | Resend pour transactionnel, Brevo si séquences marketing V1 | Setup plus rapide |
| Attio sync | Reporter à V2 | Inutile < 1 000 users |
| Moteur parcours full-algo | Lookup table statique + heures calculées | Réduit 🔴 à 🟡 |
| Parrainage reward Stripe | Code promo email manuel en V1 | Réduit 🔴 à 🟡 |
| pg_cron vs Edge Function | pg_cron pour calculs DB, Edge Function pour HTTP externe | Architecture propre |
