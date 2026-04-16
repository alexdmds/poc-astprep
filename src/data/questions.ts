export interface Question {
  id: string;
  number: number;
  text: string;
  choices: { label: string; text: string }[];
  correctAnswer: string; // "A","B","C","D","E"
  explanation: string;
  theme: string;
  section: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
}

export const calculQuestions: Question[] = [
  {
    id: "q1", number: 1,
    text: "Un sac contient 3 boules rouges et 7 boules bleues. On tire 2 boules successivement sans remise. Quelle est la probabilité que les deux boules soient rouges ?",
    choices: [
      { label: "A", text: "1/15" },
      { label: "B", text: "3/10" },
      { label: "C", text: "1/5" },
      { label: "D", text: "9/100" },
      { label: "E", text: "7/45" },
    ],
    correctAnswer: "A", explanation: "P = (3/10) × (2/9) = 6/90 = 1/15. On multiplie les probabilités conditionnelles pour des tirages sans remise.",
    theme: "Probabilités", section: "calcul", difficulty: "Moyen",
  },
  {
    id: "q2", number: 2,
    text: "Un article coûte 120 €. Après une hausse de 15 % puis une baisse de 10 %, quel est le prix final ?",
    choices: [
      { label: "A", text: "124,20 €" },
      { label: "B", text: "126,00 €" },
      { label: "C", text: "120,00 €" },
      { label: "D", text: "123,00 €" },
      { label: "E", text: "125,40 €" },
    ],
    correctAnswer: "A", explanation: "120 × 1,15 = 138. Puis 138 × 0,90 = 124,20 €. Les variations successives ne s'annulent pas.",
    theme: "Pourcentages", section: "calcul", difficulty: "Facile",
  },
  {
    id: "q3", number: 3,
    text: "Combien y a-t-il de façons de choisir 3 personnes parmi 8 pour former un comité ?",
    choices: [
      { label: "A", text: "56" },
      { label: "B", text: "336" },
      { label: "C", text: "24" },
      { label: "D", text: "120" },
      { label: "E", text: "40320" },
    ],
    correctAnswer: "A", explanation: "C(8,3) = 8! / (3! × 5!) = (8×7×6) / (3×2×1) = 56. C'est une combinaison sans ordre.",
    theme: "Dénombrement", section: "calcul", difficulty: "Moyen",
  },
  {
    id: "q4", number: 4,
    text: "Un triangle rectangle a des côtés de 5 cm et 12 cm. Quelle est la longueur de l'hypoténuse ?",
    choices: [
      { label: "A", text: "13 cm" },
      { label: "B", text: "17 cm" },
      { label: "C", text: "14 cm" },
      { label: "D", text: "11 cm" },
      { label: "E", text: "15 cm" },
    ],
    correctAnswer: "A", explanation: "Par le théorème de Pythagore : √(5² + 12²) = √(25 + 144) = √169 = 13 cm.",
    theme: "Géométrie", section: "calcul", difficulty: "Facile",
  },
  {
    id: "q5", number: 5,
    text: "Résoudre : 3x² - 12x + 9 = 0",
    choices: [
      { label: "A", text: "x = 1 ou x = 3" },
      { label: "B", text: "x = -1 ou x = -3" },
      { label: "C", text: "x = 1 ou x = -3" },
      { label: "D", text: "x = 3" },
      { label: "E", text: "x = -1 ou x = 3" },
    ],
    correctAnswer: "A", explanation: "3(x² - 4x + 3) = 0 → 3(x-1)(x-3) = 0. Donc x = 1 ou x = 3.",
    theme: "Équations", section: "calcul", difficulty: "Moyen",
  },
  {
    id: "q6", number: 6,
    text: "Un placement rapporte 5 % par an. Un capital de 10 000 € est placé pendant 3 ans. Quel est le VTT (valeur totale du capital) ?",
    choices: [
      { label: "A", text: "11 576,25 €" },
      { label: "B", text: "11 500 €" },
      { label: "C", text: "11 250 €" },
      { label: "D", text: "11 600 €" },
      { label: "E", text: "12 000 €" },
    ],
    correctAnswer: "A", explanation: "10 000 × (1,05)³ = 10 000 × 1,157625 = 11 576,25 €. Intérêts composés.",
    theme: "VTT", section: "calcul", difficulty: "Moyen",
  },
  {
    id: "q7", number: 7,
    text: "Quelle est la fraction irréductible de 36/48 ?",
    choices: [
      { label: "A", text: "3/4" },
      { label: "B", text: "9/12" },
      { label: "C", text: "6/8" },
      { label: "D", text: "12/16" },
      { label: "E", text: "18/24" },
    ],
    correctAnswer: "A", explanation: "PGCD(36, 48) = 12. Donc 36/48 = 3/4.",
    theme: "Fractions", section: "calcul", difficulty: "Facile",
  },
  {
    id: "q8", number: 8,
    text: "Dans une urne, P(A) = 0,4 et P(B) = 0,3. A et B sont indépendants. Calculer P(A ∪ B).",
    choices: [
      { label: "A", text: "0,58" },
      { label: "B", text: "0,70" },
      { label: "C", text: "0,12" },
      { label: "D", text: "0,52" },
      { label: "E", text: "0,65" },
    ],
    correctAnswer: "A", explanation: "P(A∪B) = P(A) + P(B) − P(A∩B) = 0,4 + 0,3 − (0,4×0,3) = 0,7 − 0,12 = 0,58.",
    theme: "Probabilités", section: "calcul", difficulty: "Difficile",
  },
  {
    id: "q9", number: 9,
    text: "Le prix d'un article passe de 80 € à 100 €. Quel est le pourcentage d'augmentation ?",
    choices: [
      { label: "A", text: "25 %" },
      { label: "B", text: "20 %" },
      { label: "C", text: "15 %" },
      { label: "D", text: "30 %" },
      { label: "E", text: "10 %" },
    ],
    correctAnswer: "A", explanation: "Augmentation = (100-80)/80 × 100 = 20/80 × 100 = 25 %.",
    theme: "Pourcentages", section: "calcul", difficulty: "Facile",
  },
  {
    id: "q10", number: 10,
    text: "De combien de manières peut-on ranger 4 livres différents sur une étagère ?",
    choices: [
      { label: "A", text: "24" },
      { label: "B", text: "12" },
      { label: "C", text: "16" },
      { label: "D", text: "64" },
      { label: "E", text: "256" },
    ],
    correctAnswer: "A", explanation: "4! = 4 × 3 × 2 × 1 = 24 permutations.",
    theme: "Dénombrement", section: "calcul", difficulty: "Facile",
  },
  {
    id: "q11", number: 11,
    text: "L'aire d'un disque de rayon 7 cm vaut :",
    choices: [
      { label: "A", text: "49π cm²" },
      { label: "B", text: "14π cm²" },
      { label: "C", text: "28π cm²" },
      { label: "D", text: "7π cm²" },
      { label: "E", text: "98π cm²" },
    ],
    correctAnswer: "A", explanation: "A = πr² = π × 7² = 49π cm².",
    theme: "Géométrie", section: "calcul", difficulty: "Facile",
  },
  {
    id: "q12", number: 12,
    text: "Un capital double en 10 ans à intérêts composés. Quel est le taux annuel approximatif ?",
    choices: [
      { label: "A", text: "7,2 %" },
      { label: "B", text: "10 %" },
      { label: "C", text: "5 %" },
      { label: "D", text: "8 %" },
      { label: "E", text: "6,5 %" },
    ],
    correctAnswer: "A", explanation: "Règle de 72 : taux ≈ 72/10 = 7,2 %. Vérification : (1,072)¹⁰ ≈ 2,006.",
    theme: "VTT", section: "calcul", difficulty: "Difficile",
  },
  {
    id: "q13", number: 13,
    text: "Simplifier : (2/3 + 1/4) × 6",
    choices: [
      { label: "A", text: "11/2" },
      { label: "B", text: "5" },
      { label: "C", text: "6" },
      { label: "D", text: "13/3" },
      { label: "E", text: "4" },
    ],
    correctAnswer: "A", explanation: "2/3 + 1/4 = 8/12 + 3/12 = 11/12. Puis 11/12 × 6 = 66/12 = 11/2.",
    theme: "Fractions", section: "calcul", difficulty: "Moyen",
  },
  {
    id: "q14", number: 14,
    text: "Résoudre le système : x + y = 7 et 2x - y = 5",
    choices: [
      { label: "A", text: "x = 4, y = 3" },
      { label: "B", text: "x = 3, y = 4" },
      { label: "C", text: "x = 5, y = 2" },
      { label: "D", text: "x = 2, y = 5" },
      { label: "E", text: "x = 6, y = 1" },
    ],
    correctAnswer: "A", explanation: "En additionnant : 3x = 12 → x = 4. Puis y = 7 - 4 = 3.",
    theme: "Équations", section: "calcul", difficulty: "Moyen",
  },
  {
    id: "q15", number: 15,
    text: "Un magasin solde un article à -30 %, puis fait une remise supplémentaire de -20 % sur le prix soldé. Quelle est la réduction totale ?",
    choices: [
      { label: "A", text: "44 %" },
      { label: "B", text: "50 %" },
      { label: "C", text: "36 %" },
      { label: "D", text: "48 %" },
      { label: "E", text: "40 %" },
    ],
    correctAnswer: "A", explanation: "Coeff = 0,70 × 0,80 = 0,56. Réduction = 1 − 0,56 = 0,44 = 44 %.",
    theme: "Pourcentages", section: "calcul", difficulty: "Moyen",
  },
];

// Pre-set student answers for the mock test: 10 correct, 5 wrong
export const mockStudentAnswers: Record<string, string> = {
  q1: "A", q2: "A", q3: "A", q4: "A", q5: "A",
  q6: "B", q7: "A", q8: "D", q9: "A", q10: "A",
  q11: "A", q12: "C", q13: "A", q14: "B", q15: "A",
};

export interface ErrorEntry {
  id: string;
  questionId: string;
  question: Question;
  section: string;
  theme: string;
  dateAdded: string;
  nextReview: string;
  status: "à réviser" | "en cours" | "maîtrisé";
  studentAnswer: string;
}

export const errorEntries: ErrorEntry[] = [
  { id: "e1", questionId: "q6", question: calculQuestions[5], section: "Calcul", theme: "VTT", dateAdded: "18 mars", nextReview: "Aujourd'hui", status: "à réviser", studentAnswer: "B" },
  { id: "e2", questionId: "q8", question: calculQuestions[7], section: "Calcul", theme: "Probabilités", dateAdded: "18 mars", nextReview: "Aujourd'hui", status: "à réviser", studentAnswer: "D" },
  { id: "e3", questionId: "q12", question: calculQuestions[11], section: "Calcul", theme: "VTT", dateAdded: "18 mars", nextReview: "Aujourd'hui", status: "à réviser", studentAnswer: "C" },
  { id: "e4", questionId: "q14", question: calculQuestions[13], section: "Calcul", theme: "Équations", dateAdded: "18 mars", nextReview: "Aujourd'hui", status: "à réviser", studentAnswer: "B" },
  { id: "e5", questionId: "q1", question: { ...calculQuestions[0], id: "qe5", text: "On lance 2 dés. Quelle est la probabilité d'obtenir une somme de 7 ?" }, section: "Calcul", theme: "Probabilités", dateAdded: "15 mars", nextReview: "Aujourd'hui", status: "à réviser", studentAnswer: "C" },
  { id: "e6", questionId: "q2", question: { ...calculQuestions[1], id: "qe6", text: "Un prix augmente de 20% puis diminue de 20%. Le prix final est-il le même que le prix initial ?" }, section: "Calcul", theme: "Pourcentages", dateAdded: "15 mars", nextReview: "Aujourd'hui", status: "à réviser", studentAnswer: "C" },
  { id: "e7", questionId: "q3", question: { ...calculQuestions[2], id: "qe7", text: "Avec 5 couleurs, combien de drapeaux à 3 bandes peut-on créer ?" }, section: "Logique", theme: "Séries", dateAdded: "14 mars", nextReview: "Aujourd'hui", status: "à réviser", studentAnswer: "B" },
  { id: "e8", questionId: "q4", question: { ...calculQuestions[3], id: "qe8", text: "Dans un damier 4×4, combien de carrés peut-on compter au total ?" }, section: "Logique", theme: "Damiers", dateAdded: "12 mars", nextReview: "25 mars", status: "en cours", studentAnswer: "D" },
  { id: "e9", questionId: "q5", question: { ...calculQuestions[4], id: "qe9", text: "Renforcer l'argument : 'Les étudiants studieux réussissent mieux.'" }, section: "R&A", theme: "Renforcer/Affaiblir", dateAdded: "10 mars", nextReview: "26 mars", status: "en cours", studentAnswer: "C" },
  { id: "e10", questionId: "q6", question: { ...calculQuestions[5], id: "qe10", text: "Identifier l'hypothèse nécessaire dans le raisonnement suivant..." }, section: "R&A", theme: "Hypothèse nécessaire", dateAdded: "10 mars", nextReview: "27 mars", status: "en cours", studentAnswer: "E" },
  { id: "e11", questionId: "q7", question: { ...calculQuestions[6], id: "qe11", text: "Quelle est la condition suffisante pour affirmer que x > 5 ?" }, section: "Conditions", theme: "Suffisance simple", dateAdded: "8 mars", nextReview: "28 mars", status: "en cours", studentAnswer: "B" },
  { id: "e12", questionId: "q8", question: { ...calculQuestions[7], id: "qe12", text: "Choisir le mot correct : 'Quoique / Quoi que' il fasse..." }, section: "Expression", theme: "Grammaire", dateAdded: "5 mars", nextReview: "Aujourd'hui", status: "à réviser", studentAnswer: "D" },
];

export const drillQuestions: Question[] = [
  {
    id: "d1", number: 1,
    text: "Que représente P(A|B) ?",
    choices: [
      { label: "A", text: "La probabilité de A sachant B" },
      { label: "B", text: "La probabilité de A et B" },
      { label: "C", text: "La probabilité de A ou B" },
      { label: "D", text: "Le complémentaire de A" },
      { label: "E", text: "La probabilité de B sachant A" },
    ],
    correctAnswer: "A", explanation: "P(A|B) est la probabilité conditionnelle de A sachant que B est réalisé.",
    theme: "Probabilités", section: "calcul", difficulty: "Facile",
  },
  {
    id: "d2", number: 2,
    text: "Si P(A∩B) = 0,12 et P(B) = 0,4, que vaut P(A|B) ?",
    choices: [
      { label: "A", text: "0,3" },
      { label: "B", text: "0,48" },
      { label: "C", text: "0,52" },
      { label: "D", text: "3" },
      { label: "E", text: "0,12" },
    ],
    correctAnswer: "A", explanation: "P(A|B) = P(A∩B) / P(B) = 0,12 / 0,4 = 0,3.",
    theme: "Probabilités", section: "calcul", difficulty: "Moyen",
  },
  {
    id: "d3", number: 3,
    text: "Deux événements indépendants A et B. P(A) = 0,5 et P(B) = 0,6. Que vaut P(A∩B) ?",
    choices: [
      { label: "A", text: "0,3" },
      { label: "B", text: "1,1" },
      { label: "C", text: "0,5" },
      { label: "D", text: "0,11" },
      { label: "E", text: "0,8" },
    ],
    correctAnswer: "A", explanation: "Si A et B sont indépendants, P(A∩B) = P(A) × P(B) = 0,5 × 0,6 = 0,3.",
    theme: "Probabilités", section: "calcul", difficulty: "Moyen",
  },
  {
    id: "d4", number: 4,
    text: "Quelle formule lie P(A∪B), P(A), P(B) et P(A∩B) ?",
    choices: [
      { label: "A", text: "P(A∪B) = P(A) + P(B) − P(A∩B)" },
      { label: "B", text: "P(A∪B) = P(A) × P(B)" },
      { label: "C", text: "P(A∪B) = P(A) + P(B)" },
      { label: "D", text: "P(A∪B) = P(A) − P(B) + P(A∩B)" },
      { label: "E", text: "P(A∪B) = 1 − P(A∩B)" },
    ],
    correctAnswer: "A", explanation: "C'est la formule d'inclusion-exclusion : P(A∪B) = P(A) + P(B) − P(A∩B).",
    theme: "Probabilités", section: "calcul", difficulty: "Facile",
  },
  {
    id: "d5", number: 5,
    text: "Dans un arbre de probabilités, comment obtient-on P(A∩B) ?",
    choices: [
      { label: "A", text: "En multipliant les probabilités le long de la branche" },
      { label: "B", text: "En additionnant P(A) et P(B)" },
      { label: "C", text: "En divisant P(A) par P(B)" },
      { label: "D", text: "En prenant le maximum de P(A) et P(B)" },
      { label: "E", text: "En soustrayant P(B) de P(A)" },
    ],
    correctAnswer: "A", explanation: "Dans un arbre, on multiplie les probabilités le long d'une branche : P(A∩B) = P(A) × P(B|A).",
    theme: "Probabilités", section: "calcul", difficulty: "Facile",
  },
];

export const forumPosts = [
  {
    id: "f1",
    author: "Marie D.",
    avatar: "M",
    date: "il y a 3 jours",
    question: "Je ne comprends pas pourquoi on divise par P(B) dans la formule de Bayes. Quelqu'un peut m'expliquer ?",
    answer: { author: "Prof. Albert", avatar: "E", text: "P(B) sert à « normaliser » la probabilité. On se place dans l'univers réduit où B est déjà réalisé. P(B) est la taille de ce nouvel univers, d'où la division.", date: "il y a 2 jours" },
  },
  {
    id: "f2",
    author: "Lucas T.",
    avatar: "L",
    date: "il y a 5 jours",
    question: "Comment savoir si deux événements sont indépendants dans un problème ?",
    answer: { author: "Prof. Albert", avatar: "E", text: "Deux événements sont indépendants si P(A∩B) = P(A)×P(B). En pratique, cherchez des indices dans l'énoncé : « sans influence », « au hasard et indépendamment ».", date: "il y a 4 jours" },
  },
  {
    id: "f3",
    author: "Camille R.",
    avatar: "C",
    date: "il y a 1 semaine",
    question: "Est-ce que l'arbre de probabilité marche toujours pour les conditionnelles ?",
    answer: { author: "Prof. Albert", avatar: "E", text: "Oui, l'arbre est l'outil le plus fiable. Chaque branche représente P(B|A) et on multiplie le long des branches pour obtenir P(A∩B).", date: "il y a 6 jours" },
  },
];

export const lessonTranscript = [
  { type: "heading" as const, content: "1. Introduction aux probabilités conditionnelles" },
  { type: "text" as const, content: "Les probabilités conditionnelles permettent de calculer la probabilité d'un événement A sachant qu'un autre événement B est déjà réalisé. C'est un concept fondamental qui revient très fréquemment au TAGE MAGE." },
  { type: "formula" as const, content: "P(A|B) = P(A ∩ B) / P(B)" },
  { type: "text" as const, content: "Cette formule se lit : « la probabilité de A sachant B est égale à la probabilité de l'intersection de A et B, divisée par la probabilité de B »." },
  { type: "heading" as const, content: "2. Événements indépendants" },
  { type: "text" as const, content: "Deux événements A et B sont dits indépendants si la réalisation de l'un n'affecte pas la probabilité de l'autre. Formellement :" },
  { type: "formula" as const, content: "A et B indépendants ⟺ P(A ∩ B) = P(A) × P(B)" },
  { type: "text" as const, content: "Dans ce cas, P(A|B) = P(A). La connaissance de B n'apporte aucune information sur A." },
  { type: "example" as const, content: "Exemple : On lance un dé et une pièce. L'événement « obtenir 6 » et « obtenir pile » sont indépendants. P(6 ∩ pile) = 1/6 × 1/2 = 1/12." },
  { type: "heading" as const, content: "3. Formule des probabilités totales" },
  { type: "text" as const, content: "Si B₁, B₂, ..., Bₙ forment une partition de l'univers, alors pour tout événement A :" },
  { type: "formula" as const, content: "P(A) = Σ P(A|Bᵢ) × P(Bᵢ)" },
  { type: "text" as const, content: "Cette formule est très utile quand on ne connaît pas P(A) directement mais qu'on connaît les probabilités conditionnelles." },
];
