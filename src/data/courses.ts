export interface Lesson {
  id: string;
  title: string;
  duration: number; // minutes
  completed: boolean;
  professor?: string;
  type?: "video" | "exercise"; // default "video"
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface SectionCourses {
  sectionId: string;
  chapters: Chapter[];
}

const mkLesson = (id: string, title: string, dur: number, done: boolean): Lesson => ({
  id, title, duration: dur, completed: done, professor: "M. Dupont", type: "video"
});

const mkExercise = (id: string, title: string, dur: number, done: boolean): Lesson => ({
  id, title, duration: dur, completed: done, type: "exercise"
});

export const courseData: SectionCourses[] = [
  {
    sectionId: "strategie",
    chapters: [
      { id: "s1", title: "Introduction au TAGE MAGE", lessons: [
        mkLesson("s1l1", "Présentation de l'épreuve", 8, true),
        mkLesson("s1l2", "Structure et notation", 12, true),
        mkLesson("s1l3", "Stratégie globale", 15, true),
        mkLesson("s1l4", "Gestion du temps", 10, true),
      ]},
      { id: "s2", title: "Ordre de passage optimal", lessons: [
        mkLesson("s2l1", "Analyser ses forces", 10, true),
        mkLesson("s2l2", "Choisir son ordre", 12, true),
        mkLesson("s2l3", "Adapter en condition réelle", 8, true),
        mkLesson("s2l4", "Cas pratiques", 15, false),
      ]},
      { id: "s3", title: "Gestion du stress", lessons: [
        mkLesson("s3l1", "Techniques de respiration", 6, false),
        mkLesson("s3l2", "Visualisation positive", 8, false),
        mkLesson("s3l3", "Routine le jour J", 10, false),
        mkLesson("s3l4", "Gérer l'imprévu", 7, false),
      ]},
      { id: "s4", title: "Optimisation du score", lessons: [
        mkLesson("s4l1", "Quand deviner", 10, false),
        mkLesson("s4l2", "Élimination stratégique", 12, false),
        mkLesson("s4l3", "Pièges classiques", 14, false),
        mkLesson("s4l4", "Simulation complète", 20, false),
      ]},
    ],
  },
  {
    sectionId: "comprehension",
    chapters: [
      { id: "c1", title: "Méthode de lecture rapide", lessons: [
        mkLesson("c1l1", "Lecture en diagonale", 10, true),
        mkLesson("c1l2", "Repérage des mots-clés", 12, true),
        mkLesson("c1l3", "Synthèse rapide", 15, true),
        mkLesson("c1l4", "Exercices chronométrés", 8, false),
      ]},
      { id: "c2", title: "Types de questions", lessons: [
        mkLesson("c2l1", "Questions de compréhension", 10, false),
        mkLesson("c2l2", "Questions d'inférence", 12, false),
        mkLesson("c2l3", "Questions de vocabulaire", 8, false),
        mkLesson("c2l4", "Questions pièges", 14, false),
      ]},
      { id: "c3", title: "Entraînement intensif", lessons: [
        mkLesson("c3l1", "Texte argumentatif", 15, false),
        mkLesson("c3l2", "Texte narratif", 12, false),
        mkLesson("c3l3", "Texte scientifique", 14, false),
        mkLesson("c3l4", "Correction détaillée", 10, false),
      ]},
    ],
  },
  {
    sectionId: "calcul",
    chapters: [
      { id: "ca1", title: "Arithmétique de base", lessons: [
        mkLesson("ca1l1", "Fractions et PGCD", 12, true),
        mkLesson("ca1l2", "Puissances et racines", 10, true),
        mkLesson("ca1l3", "Divisibilité", 8, true),
        mkLesson("ca1l4", "Proportionnalité", 10, true),
        mkLesson("ca1l5", "Calcul mental avancé", 15, true),
        mkExercise("ca1ex", "Exercice — Arithmétique de base", 10, true),
      ]},
      { id: "ca2", title: "Pourcentages et variations", lessons: [
        mkLesson("ca2l1", "Pourcentages simples", 10, true),
        mkLesson("ca2l2", "Variations successives", 12, true),
        mkLesson("ca2l3", "Coefficient multiplicateur", 8, false),
        mkLesson("ca2l4", "VTT et indices", 14, false),
        mkLesson("ca2l5", "Pièges classiques", 10, false),
        mkExercise("ca2ex", "Exercice — Pourcentages et variations", 10, false),
      ]},
      { id: "ca3", title: "Équations et inéquations", lessons: [
        mkLesson("ca3l1", "Équations du 1er degré", 10, true),
        mkLesson("ca3l2", "Équations du 2nd degré", 12, false),
        mkLesson("ca3l3", "Systèmes d'équations", 14, false),
        mkLesson("ca3l4", "Inéquations", 10, false),
        mkLesson("ca3l5", "Mise en équation", 12, false),
        mkExercise("ca3ex", "Exercice — Équations et inéquations", 10, false),
      ]},
      { id: "ca4", title: "Géométrie", lessons: [
        mkLesson("ca4l1", "Périmètres et aires", 10, false),
        mkLesson("ca4l2", "Volumes", 12, false),
        mkLesson("ca4l3", "Théorème de Pythagore", 8, false),
        mkLesson("ca4l4", "Trigonométrie de base", 14, false),
        mkLesson("ca4l5", "Géométrie dans l'espace", 12, false),
        mkExercise("ca4ex", "Exercice — Géométrie", 10, false),
      ]},
      { id: "ca5", title: "Probabilités", lessons: [
        mkLesson("ca5l1", "Dénombrement", 12, false),
        mkLesson("ca5l2", "Arrangements et combinaisons", 14, false),
        mkLesson("ca5l3", "Probabilités simples", 10, false),
        mkLesson("ca5l4", "Probabilités conditionnelles", 12, false),
        mkLesson("ca5l5", "Arbres de probabilité", 10, false),
        mkExercise("ca5ex", "Exercice — Probabilités", 10, false),
      ]},
      { id: "ca6", title: "Suites et fonctions", lessons: [
        mkLesson("ca6l1", "Suites arithmétiques", 10, false),
        mkLesson("ca6l2", "Suites géométriques", 10, false),
        mkLesson("ca6l3", "Fonctions de base", 12, false),
        mkLesson("ca6l4", "Applications concrètes", 10, false),
        mkExercise("ca6ex", "Exercice — Suites et fonctions", 10, false),
      ]},
      { id: "ca7", title: "Entraînement final Calcul", lessons: [
        mkLesson("ca7l1", "Mini-test chronométré 1", 15, false),
        mkLesson("ca7l2", "Mini-test chronométré 2", 15, false),
        mkLesson("ca7l3", "Analyse d'erreurs", 12, false),
        mkLesson("ca7l4", "Stratégie Calcul", 10, false),
        mkLesson("ca7l5", "Dernières astuces", 8, false),
        mkExercise("ca7ex", "Exercice — Entraînement final", 15, false),
      ]},
    ],
  },
  {
    sectionId: "ra",
    chapters: [
      { id: "r1", title: "Logique argumentative", lessons: [
        mkLesson("r1l1", "Structure d'un argument", 12, true),
        mkLesson("r1l2", "Identifier la conclusion", 10, true),
        mkLesson("r1l3", "Prémisses et hypothèses", 14, true),
        mkLesson("r1l4", "Sophismes courants", 12, false),
        mkLesson("r1l5", "Exercices guidés", 10, false),
      ]},
      { id: "r2", title: "Renforcer / Affaiblir", lessons: [
        mkLesson("r2l1", "Renforcer un argument", 10, false),
        mkLesson("r2l2", "Affaiblir un argument", 10, false),
        mkLesson("r2l3", "Hypothèse nécessaire", 12, false),
        mkLesson("r2l4", "Exercices pratiques", 14, false),
        mkLesson("r2l5", "Correction détaillée", 10, false),
      ]},
      { id: "r3", title: "Parallélisme de raisonnement", lessons: [
        mkLesson("r3l1", "Identifier la structure", 12, false),
        mkLesson("r3l2", "Analogies logiques", 10, false),
        mkLesson("r3l3", "Méthode systématique", 14, false),
        mkLesson("r3l4", "Exercices avancés", 12, false),
        mkLesson("r3l5", "Pièges à éviter", 8, false),
      ]},
      { id: "r4", title: "Entraînement R&A", lessons: [
        mkLesson("r4l1", "Mini-test 1", 15, false),
        mkLesson("r4l2", "Mini-test 2", 15, false),
        mkLesson("r4l3", "Analyse d'erreurs", 12, false),
        mkLesson("r4l4", "Stratégie R&A", 10, false),
        mkLesson("r4l5", "Bilan", 8, false),
      ]},
    ],
  },
  {
    sectionId: "conditions",
    chapters: [
      { id: "cm1", title: "Méthode des conditions", lessons: [
        mkLesson("cm1l1", "Comprendre le format", 10, true),
        mkLesson("cm1l2", "Suffisance d'une condition", 12, true),
        mkLesson("cm1l3", "Combinaison de conditions", 14, false),
        mkLesson("cm1l4", "Arbres de décision", 10, false),
        mkExercise("cm1ex", "Exercice — Méthode des conditions", 10, false),
      ]},
      { id: "cm2", title: "Conditions numériques", lessons: [
        mkLesson("cm2l1", "Équations à résoudre", 12, false),
        mkLesson("cm2l2", "Inégalités", 10, false),
        mkLesson("cm2l3", "Cas indéterminés", 14, false),
        mkLesson("cm2l4", "Exercices types", 12, false),
        mkExercise("cm2ex", "Exercice — Conditions numériques", 10, false),
      ]},
      { id: "cm3", title: "Entraînement CM", lessons: [
        mkLesson("cm3l1", "Mini-test chronométré", 15, false),
        mkLesson("cm3l2", "Analyse d'erreurs", 12, false),
        mkLesson("cm3l3", "Stratégie CM", 10, false),
        mkLesson("cm3l4", "Derniers conseils", 8, false),
        mkExercise("cm3ex", "Exercice — Entraînement CM", 10, false),
      ]},
    ],
  },
  {
    sectionId: "expression",
    chapters: [
      { id: "e1", title: "Grammaire et conjugaison", lessons: [
        mkLesson("e1l1", "Accord du participe passé", 10, true),
        mkLesson("e1l2", "Concordance des temps", 12, true),
        mkLesson("e1l3", "Homophones grammaticaux", 8, true),
        mkLesson("e1l4", "Subjonctif vs indicatif", 10, true),
        mkLesson("e1l5", "Exercices rapides", 6, true),
      ]},
      { id: "e2", title: "Vocabulaire et registres", lessons: [
        mkLesson("e2l1", "Enrichir son vocabulaire", 12, true),
        mkLesson("e2l2", "Niveaux de langue", 8, false),
        mkLesson("e2l3", "Synonymes et antonymes", 10, false),
        mkLesson("e2l4", "Expressions idiomatiques", 12, false),
        mkLesson("e2l5", "Quiz vocabulaire", 6, false),
        mkLesson("e2l6", "Révisions", 8, false),
      ]},
      { id: "e3", title: "Reformulation et cohérence", lessons: [
        mkLesson("e3l1", "Reformulation de phrases", 12, false),
        mkLesson("e3l2", "Cohérence textuelle", 10, false),
        mkLesson("e3l3", "Connecteurs logiques", 8, false),
        mkLesson("e3l4", "Exercices pratiques", 14, false),
        mkLesson("e3l5", "Correction et analyse", 10, false),
        mkLesson("e3l6", "Entraînement intensif", 12, false),
      ]},
      { id: "e4", title: "Entraînement Expression", lessons: [
        mkLesson("e4l1", "Mini-test 1", 15, false),
        mkLesson("e4l2", "Mini-test 2", 15, false),
        mkLesson("e4l3", "Analyse d'erreurs", 12, false),
        mkLesson("e4l4", "Stratégie Expression", 10, false),
        mkLesson("e4l5", "Bilan", 8, false),
      ]},
    ],
  },
  {
    sectionId: "logique",
    chapters: [
      { id: "l1", title: "Séries de nombres", lessons: [
        mkLesson("l1l1", "Suites arithmétiques", 10, true),
        mkLesson("l1l2", "Suites géométriques", 10, true),
        mkLesson("l1l3", "Suites complexes", 12, true),
        mkLesson("l1l4", "Suites à double entrée", 14, false),
        mkLesson("l1l5", "Astuces", 6, false),
        mkExercise("l1ex", "Exercice — Séries de nombres", 10, false),
      ]},
      { id: "l2", title: "Séries de lettres", lessons: [
        mkLesson("l2l1", "Alphabet et position", 8, true),
        mkLesson("l2l2", "Séries simples", 10, false),
        mkLesson("l2l3", "Séries complexes", 12, false),
        mkLesson("l2l4", "Mélange chiffres/lettres", 10, false),
        mkExercise("l2ex", "Exercice — Séries de lettres", 10, false),
      ]},
      { id: "l3", title: "Séries de figures", lessons: [
        mkLesson("l3l1", "Rotation et symétrie", 10, false),
        mkLesson("l3l2", "Transformation", 12, false),
        mkLesson("l3l3", "Superposition", 10, false),
        mkLesson("l3l4", "Figures complexes", 14, false),
        mkLesson("l3l5", "Méthode rapide", 8, false),
        mkExercise("l3ex", "Exercice — Séries de figures", 10, false),
      ]},
      { id: "l4", title: "Damiers et grilles", lessons: [
        mkLesson("l4l1", "Comprendre les damiers", 10, false),
        mkLesson("l4l2", "Règles de remplissage", 12, false),
        mkLesson("l4l3", "Stratégie rapide", 10, false),
        mkLesson("l4l4", "Exercices guidés", 14, false),
        mkExercise("l4ex", "Exercice — Damiers et grilles", 10, false),
      ]},
      { id: "l5", title: "Entraînement Logique", lessons: [
        mkLesson("l5l1", "Mini-test 1", 15, false),
        mkLesson("l5l2", "Mini-test 2", 15, false),
        mkLesson("l5l3", "Analyse d'erreurs", 12, false),
        mkLesson("l5l4", "Stratégie Logique", 10, false),
        mkLesson("l5l5", "Dernières astuces", 8, false),
        mkExercise("l5ex", "Exercice — Entraînement final", 15, false),
      ]},
    ],
  },
];
