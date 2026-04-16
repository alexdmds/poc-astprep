export interface Fiche {
  id: string;
  sectionId: string;
  title: string;
  description: string;
}

export const fichesData: Fiche[] = [
  // Calcul
  { id: "f-calc-1", sectionId: "calcul", title: "Formules essentielles à connaître par cœur", description: "Toutes les formules de probabilités, géométrie, dénombrement, suites" },
  { id: "f-calc-2", sectionId: "calcul", title: "Formules géométriques — Aide-mémoire visuel", description: "Aires, volumes, périmètres avec schémas" },
  { id: "f-calc-3", sectionId: "calcul", title: "Tables de multiplication 11-20", description: "Les tables étendues à connaître" },
  { id: "f-calc-4", sectionId: "calcul", title: "Astuces de calcul mental", description: "Techniques pour gagner du temps" },
  { id: "f-calc-5", sectionId: "calcul", title: "Conversions et unités", description: "Les conversions fréquentes au TAGE MAGE" },
  // Logique
  { id: "f-log-1", sectionId: "logique", title: "Ordre de résolution par type de question", description: "Méthode pour chaque type (damiers, séries, figures)" },
  { id: "f-log-2", sectionId: "logique", title: "Alphabet et rangs des lettres", description: "Tableau A=1 à Z=26 + moyens mnémotechniques" },
  { id: "f-log-3", sectionId: "logique", title: "Méthodes pour les damiers", description: "Rotations, symétries, transformations" },
  { id: "f-log-4", sectionId: "logique", title: "Séries numériques — Patterns fréquents", description: "Les suites classiques à reconnaître" },
  // Expression
  { id: "f-exp-1", sectionId: "expression", title: "Locutions latines à connaître par cœur", description: "Liste complète avec définitions et exemples" },
  { id: "f-exp-2", sectionId: "expression", title: "Proverbes et expressions françaises", description: "Les plus fréquents au TAGE MAGE" },
  { id: "f-exp-3", sectionId: "expression", title: "Conjugaisons pièges", description: "Les verbes irréguliers et temps difficiles" },
  { id: "f-exp-4", sectionId: "expression", title: "Règles d'accord essentielles", description: "Participes passés, accords complexes" },
  // R&A
  { id: "f-ra-1", sectionId: "ra", title: "Les failles logiques à repérer", description: "Liste des sophismes et paralogismes" },
  { id: "f-ra-2", sectionId: "ra", title: "Connecteurs argumentatifs", description: "Tableau des connecteurs et leurs fonctions" },
  { id: "f-ra-3", sectionId: "ra", title: "Méthode de résolution R&A", description: "Approche systématique question par question" },
  // Conditions Minimales
  { id: "f-cm-1", sectionId: "conditions", title: "Méthode complète CM", description: "Les 5 réponses possibles + arbre de décision" },
  { id: "f-cm-2", sectionId: "conditions", title: "Pièges fréquents en CM", description: "Les erreurs classiques et comment les éviter" },
  // Compréhension
  { id: "f-comp-1", sectionId: "comprehension", title: "Liste des thèmes qui peuvent tomber", description: "Les grands thèmes récurrents au TAGE MAGE" },
  { id: "f-comp-2", sectionId: "comprehension", title: "Méthode de lecture rapide", description: "Techniques pour lire et comprendre en 20 minutes" },
  { id: "f-comp-3", sectionId: "comprehension", title: "Types de questions et pièges", description: "Les formulations à connaître" },
];
