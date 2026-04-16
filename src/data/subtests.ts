export interface Subtest {
  id: string;
  title: string;
  questions: number;
  duration: number; // minutes
  score: number | null; // null = pas fait, score sur 60
  avgScore: number;
}

export interface SectionSubtests {
  sectionId: string;
  generalistes: Subtest[];
  thematiques: Subtest[];
}

const gen = (prefix: string, count: number, scores: (number | null)[], avg: number): Subtest[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix.toLowerCase().replace(/\s/g, "-")}-g${i + 1}`,
    title: `${prefix} n°${i + 1}`,
    questions: 15,
    duration: 20,
    score: scores[i] ?? null,
    avgScore: avg,
  }));

const thm = (sectionPrefix: string, items: { name: string; score: number | null; avg: number }[]): Subtest[] =>
  items.map((t, i) => ({
    id: `${sectionPrefix}-t${i + 1}`,
    title: t.name,
    questions: 10,
    duration: 13,
    score: t.score,
    avgScore: t.avg,
  }));

export const subtestData: SectionSubtests[] = [
  {
    sectionId: "comprehension",
    generalistes: gen("Compréhension", 6, [50, 46], 38),
    thematiques: [],
  },
  {
    sectionId: "calcul",
    generalistes: gen("Calcul", 12, [42, 38, 48], 36).map((s, i) => ({
      ...s,
      avgScore: [35, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36][i],
    })),
    thematiques: thm("calcul", [
      { name: "Probabilités", score: 24, avg: 30 },
      { name: "Géométrie", score: 44, avg: 38 },
      { name: "VTT", score: null, avg: 34 },
      { name: "Dénombrement", score: null, avg: 32 },
      { name: "Pourcentages", score: 48, avg: 40 },
      { name: "Fractions", score: null, avg: 35 },
      { name: "Équations", score: null, avg: 36 },
    ]),
  },
  {
    sectionId: "ra",
    generalistes: gen("R&A", 8, [38, 42], 35),
    thematiques: thm("ra", [
      { name: "Identifier la thèse", score: null, avg: 33 },
      { name: "Failles logiques", score: null, avg: 30 },
      { name: "Renforcer / affaiblir", score: null, avg: 32 },
    ]),
  },
  {
    sectionId: "conditions",
    generalistes: gen("CM", 6, [32], 30),
    thematiques: thm("conditions", [
      { name: "Pièges fréquents", score: null, avg: 28 },
      { name: "Cas particuliers", score: null, avg: 30 },
    ]),
  },
  {
    sectionId: "expression",
    generalistes: gen("Expression", 8, [48, 44, 52], 38),
    thematiques: thm("expression", [
      { name: "Conjugaisons pièges", score: 48, avg: 40 },
      { name: "Locutions et vocabulaire", score: null, avg: 36 },
      { name: "Syntaxe et reformulation", score: null, avg: 35 },
    ]),
  },
  {
    sectionId: "logique",
    generalistes: gen("Logique", 10, [50, 44], 37).map((s, i) => ({
      ...s,
      avgScore: [38, 37, 37, 37, 37, 37, 37, 37, 37, 37][i],
    })),
    thematiques: thm("logique", [
      { name: "Damiers", score: 36, avg: 32 },
      { name: "Séries numériques", score: null, avg: 34 },
      { name: "Figures et rotations", score: null, avg: 35 },
      { name: "Alphabétique", score: null, avg: 33 },
    ]),
  },
];
