  Analyse : Roadmap Symfony V3 vs Codebase React/Supabase actuelle
                                                                                                                        
  Ce qui est déjà bien couvert
                                                                                                                        
  La codebase couvre une grande partie des fonctionnalités des Lots 2, 3, 4 et 5 :                                      
  
  ┌────────────────────────────────────────────────────────────────────────────────┬────────────────────────┐           
  │                                Feature Roadmap                                 │    État dans le POC    │
  ├────────────────────────────────────────────────────────────────────────────────┼────────────────────────┤
  │ Schema BDD ~30 tables                                                          │ ✅ ~25 tables en place │
  ├────────────────────────────────────────────────────────────────────────────────┼────────────────────────┤
  │ Auth (inscription, login, reset)                                               │ ✅ Supabase Auth       │           
  ├────────────────────────────────────────────────────────────────────────────────┼────────────────────────┤           
  │ Admin CRUD (sections, leçons, questions, mock tests, flashcards, fiches, live) │ ✅ Implémenté          │           
  ├────────────────────────────────────────────────────────────────────────────────┼────────────────────────┤           
  │ QuizInterface (chrono, pastilles, navigation)                                  │ ⚠️  Partiellement       │
  ├────────────────────────────────────────────────────────────────────────────────┼────────────────────────┤           
  │ Carnet d'erreurs                                                               │ ✅ Table + UI          │
  ├────────────────────────────────────────────────────────────────────────────────┼────────────────────────┤           
  │ Flashcards Anki (3 boutons, spaced repetition)                                 │ ✅                     │
  ├────────────────────────────────────────────────────────────────────────────────┼────────────────────────┤           
  │ Calcul mental, Lecture alphabétique                                            │ ✅                     │
  ├────────────────────────────────────────────────────────────────────────────────┼────────────────────────┤           
  │ Gamification (streak, PB, leaderboard, défis)                                  │ ✅                     │
  ├────────────────────────────────────────────────────────────────────────────────┼────────────────────────┤           
  │ Notifications                                                                  │ ✅                     │
  ├────────────────────────────────────────────────────────────────────────────────┼────────────────────────┤           
  │ Cours live                                                                     │ ✅                     │
  └────────────────────────────────────────────────────────────────────────────────┴────────────────────────┘

  ---
  Difficultés majeures
                                                                                                                        
  1. Absence totale de backend — problème architectural fondamental
                                                                                                                        
  La roadmap Symfony suppose un serveur capable de gérer :
  - Webhooks Stripe (invoice.payment_succeeded, etc.)                                                                   
  - Webhooks Mux (asset.ready)                                                                                          
  - Crons (app:compute:subtest-averages, app:attio:sync)
  - Sessions anti multi-connexions                                                                                      
                                  
  Le POC actuel n'a pas de backend : tout passe directement par Supabase. Il faudra soit des Supabase Edge Functions    
  pour chaque webhook/cron, soit ajouter un petit backend (Hono/Express serverless).                                    
   
  ---                                                                                                                   
  2. Stripe — complètement absent (Lot 1, critique)
                                                                                                                        
  Rien n'est implémenté : pas de checkout, pas de webhooks, pas de PromoCode, pas de SubscriptionHistory, pas
  d'upgrade/downgrade/pause/prorata. La table profiles a un subscription_plan mais c'est juste un champ texte sans      
  logique de paiement derrière. C'est le plus gros chantier manquant.
                                                                                                                        
  ---             
  3. Mux — intégration superficielle
                                                                                                                        
  Le POC stocke juste des URLs vidéo en string. La roadmap exige :
  - Upload direct depuis l'admin                                                                                        
  - Signed playback tokens (sécurité)
  - Webhook asset.ready pour confirmer la disponibilité                                                                 
                                                                                                                        
  Sans backend, les signed tokens exposent la clé API côté client. Nécessite impérativement une Edge Function ou un
  backend.                                                                                                              
                  
  ---                                                                                                                   
  4. Micro-compétences + Drills — tables manquantes
                                                                                                                        
  La roadmap prévoit 3 entités liées (micro-compétences, drills, test de positionnement) avec ~500 questions de drill
  (100 leçons × 5). Ces tables n'existent pas dans le schéma actuel. C'est un ajout de schéma + admin CRUD + UI.        
                  
  ---                                                                                                                   
  5. Moteur parcours adaptatif — algorithme absent
                                                                                                                        
  La table parcours_plans existe mais le moteur de calcul (15 profils × tranches de 25 pts, répartition items pondérés)
  n'est pas implémenté. C'est listé comme l'item le plus complexe du Lot 3.                                             
                  
  ---                                                                                                                   
  6. Parrainage + Écoles partenaires — non implémentés
                                                                                                                        
  Code unique par user, reward Stripe, matching auto par domaine email → rien dans le POC actuel.
                                                                                                                        
  ---             
  7. Anti multi-connexions — non supporté nativement par Supabase Auth                                                  
                                                                      
  Supabase Auth permet plusieurs sessions simultanées. L'implémenter nécessite une table de session tokens custom +
  middleware ou Edge Function interceptant chaque requête.                                                              
   
  ---                                                                                                                   
  8. Brevo (emails transactionnels) + Attio (CRM sync)
                                                                                                                        
  Actuellement, seuls les emails Supabase Auth (basiques) sont envoyés. Les templates Brevo (bienvenue, confirmation
  paiement, rappel) et la sync Attio sont absents.                                                                      
                  
  ---                                                                                                                   
  9. Fonctionnalités admin manquantes

  ┌─────────────────────────────────────────────────┬───────────┐
  │                     Feature                     │   État    │
  ├─────────────────────────────────────────────────┼───────────┤
  │ CKEditor pour contenu cours                     │ ❌ Absent │
  ├─────────────────────────────────────────────────┼───────────┤
  │ Upload vidéo Mux direct depuis admin            │ ❌ Absent │                                                       
  ├─────────────────────────────────────────────────┼───────────┤                                                       
  │ Drag & drop reorder (exercices, chapitres)      │ ❌ Absent │                                                       
  ├─────────────────────────────────────────────────┼───────────┤                                                       
  │ Codes promo CRUD                                │ ❌ Absent │
  ├─────────────────────────────────────────────────┼───────────┤                                                       
  │ Reset password user par admin                   │ ❌ Absent │
  ├─────────────────────────────────────────────────┼───────────┤                                                       
  │ Export CSV connexions                           │ ❌ Absent │
  ├─────────────────────────────────────────────────┼───────────┤                                                       
  │ Alertes admin (multi-connexions, discount > 80) │ ❌ Absent │
  └─────────────────────────────────────────────────┴───────────┘                                                       
                  
  ---                                                                                                                   
  Résumé par lot  

  ┌─────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
  │         Lot         │                         Effort restant si on garde React/Supabase                         │
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
  │ Lot 0 — Fondations  │ ⚠️  Moyen — Schema quasi-complet, mais Mux, anti-multi-sessions, et CI/CD à construire     │
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
  │ Lot 1 —             │ 🔴 Élevé — Stripe 0%, parrainage 0%, écoles 0%, Brevo 0%                                  │   
  │ Monétisation        │                                                                                           │   
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Lot 2 — Cœur        │ ⚠️  Moyen — Quiz/correction partiels, drills/micro-compétences absents, Mux correction     │   
  │                     │ vidéo absent                                                                              │
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Lot 3 —             │ ⚠️  Moyen — Moteur parcours à coder, stats V2 à enrichir                                   │
  │ Intelligence        │                                                                                           │   
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
  │ Lot 4 — Outils      │ ✅ Faible — Presque tout déjà là                                                          │   
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Lot 5 —             │ ✅ Faible — Base solide, à enrichir en animations                                         │
  │ Gamification        │                                                                                           │   
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
  │ Lot 6 — Migration   │ ⚠️  Variable — Dépend du volume de données prod existantes                                 │   
  └─────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘  