export interface Flashcard {
  id: string;
  sectionId: string;
  theme: string;
  front: string;
  back: string;
}

export const flashcardsData: Flashcard[] = [
  {
    id: "fc1", sectionId: "calcul", theme: "Probabilités",
    front: "Quelle est la formule de la probabilité conditionnelle P(A|B) ?",
    back: "P(A|B) = P(A ∩ B) / P(B)\n\nC'est la probabilité de A sachant que B est réalisé. On « réduit » l'univers à B.",
  },
  {
    id: "fc2", sectionId: "calcul", theme: "Probabilités",
    front: "Deux événements A et B sont indépendants si et seulement si…",
    back: "P(A ∩ B) = P(A) × P(B)\n\nÉquivalent à : P(A|B) = P(A). La réalisation de B n'affecte pas A.",
  },
  {
    id: "fc3", sectionId: "calcul", theme: "VTT",
    front: "Quelle est la formule du coefficient multiplicateur global pour des variations successives de +a% puis -b% ?",
    back: "CM global = (1 + a/100) × (1 - b/100)\n\nAttention : +20% puis -20% ≠ prix initial ! Le CM = 0,96 soit -4%.",
  },
  {
    id: "fc4", sectionId: "expression", theme: "Grammaire",
    front: "Quand utilise-t-on le subjonctif après « bien que » ?",
    back: "Toujours le subjonctif !\n\n« Bien que » exprime une concession et exige le subjonctif.\nEx : Bien qu'il soit fatigué (et non « est »).",
  },
  {
    id: "fc5", sectionId: "logique", theme: "Damiers",
    front: "Dans un damier 4×4, comment compter le nombre total de carrés ?",
    back: "On additionne les carrés de chaque taille :\n4² + 3² + 2² + 1² = 16 + 9 + 4 + 1 = 30 carrés\n\nFormule générale pour n×n : n(n+1)(2n+1)/6",
  },
  {
    id: "fc6", sectionId: "ra", theme: "Renforcer/Affaiblir",
    front: "Comment distinguer « renforcer » et « affaiblir » un argument au TAGE MAGE ?",
    back: "Renforcer = ajouter un élément qui rend la conclusion PLUS probable.\nAffaiblir = ajouter un élément qui rend la conclusion MOINS probable.\n\nAstuce : la bonne réponse n'est jamais un simple rappel de la conclusion.",
  },
  {
    id: "fc7", sectionId: "conditions", theme: "Suffisance simple",
    front: "Quelle est la différence entre condition suffisante et condition nécessaire ?",
    back: "Suffisante : A ⇒ B (A seul suffit pour conclure B)\nNécessaire : B ⇒ A (sans A, pas de B)\n\nEx : « Être à Paris » est suffisant pour « être en France », mais pas nécessaire.",
  },
  {
    id: "fc8", sectionId: "calcul", theme: "Dénombrement",
    front: "Quelle est la différence entre un arrangement et une combinaison ?",
    back: "Arrangement A(n,p) = n!/(n-p)! → l'ordre compte\nCombinaison C(n,p) = n!/(p!(n-p)!) → l'ordre ne compte pas\n\nEx : Choisir 3 personnes parmi 8 = C(8,3) = 56\nRanger 3 personnes parmi 8 = A(8,3) = 336",
  },
];

export const deckStats = {
  total: 142,
  due: 18,
  mastered: 87,
  learning: 37,
  new: 18,
};

export const themeFlashcardCounts: Record<string, Record<string, number>> = {
  calcul: { Probabilités: 12, Géométrie: 8, VTT: 6, Dénombrement: 5, Fractions: 4, Puissances: 3 },
  comprehension: { "Textes argumentatifs": 6, "Vocabulaire": 5, "Inférence": 4 },
  logique: { Damiers: 5, Séries: 4, Figures: 3, Alphabétique: 2 },
  ra: { "Renforcer/Affaiblir": 6, "Hypothèse nécessaire": 4, Parallélisme: 3 },
  conditions: { "Suffisance simple": 5, Combinaison: 4, "Conditions numériques": 3 },
  expression: { Grammaire: 8, Vocabulaire: 5, Reformulation: 4 },
  strategie: { Gestion: 3, Optimisation: 2 },
};
