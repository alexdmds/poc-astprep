export const tmScores = [
  { date: "15 fév", score: 312 },
  { date: "28 fév", score: 345 },
  { date: "10 mars", score: 367 },
  { date: "18 mars", score: 389 },
  { date: "25 mars", score: 412 },
];

export const lastTmScores = [
  { section: "Calcul", score: 41 },
  { section: "Logique", score: 50 },
  { section: "Expression", score: 53 },
  { section: "R&A", score: 43 },
  { section: "Conditions", score: 36 },
  { section: "Compréhension", score: 50 },
];

export const errorDistribution = [
  { name: "Notion incomprise", value: 35, color: "hsl(var(--primary))" },
  { name: "Piège", value: 25, color: "hsl(var(--primary) / 0.7)" },
  { name: "Temps", value: 20, color: "hsl(var(--primary) / 0.5)" },
  { name: "Inattention", value: 15, color: "hsl(var(--muted-foreground))" },
  { name: "Deviné", value: 5, color: "hsl(var(--border))" },
];

export const estimatedScoreHistory = [362, 370, 375, 381, 387];

export const themesBySection: Record<string, { name: string; percent: number; questions: number }[]> = {
  calcul: [
    { name: "Probabilités", percent: 38, questions: 12 },
    { name: "VTT", percent: 42, questions: 15 },
    { name: "Dénombrement", percent: 65, questions: 8 },
    { name: "Géométrie", percent: 71, questions: 20 },
    { name: "Pourcentages", percent: 78, questions: 18 },
    { name: "Fractions", percent: 83, questions: 10 },
    { name: "Équations", percent: 69, questions: 14 },
  ],
  logique: [
    { name: "Damiers", percent: 60, questions: 15 },
    { name: "Séries", percent: 75, questions: 12 },
    { name: "Figures", percent: 80, questions: 10 },
    { name: "Alphabétique", percent: 68, questions: 8 },
  ],
  comprehension: [
    { name: "Textes argumentatifs", percent: 72, questions: 18 },
    { name: "Textes narratifs", percent: 65, questions: 12 },
    { name: "Vocabulaire", percent: 58, questions: 10 },
    { name: "Inférence", percent: 45, questions: 8 },
  ],
  ra: [
    { name: "Renforcer/Affaiblir", percent: 55, questions: 14 },
    { name: "Hypothèse nécessaire", percent: 48, questions: 10 },
    { name: "Parallélisme", percent: 62, questions: 8 },
    { name: "Conclusion", percent: 70, questions: 12 },
  ],
  conditions: [
    { name: "Conditions numériques", percent: 40, questions: 12 },
    { name: "Conditions géométriques", percent: 52, questions: 8 },
    { name: "Suffisance simple", percent: 75, questions: 15 },
    { name: "Combinaison", percent: 35, questions: 10 },
  ],
  expression: [
    { name: "Grammaire", percent: 82, questions: 20 },
    { name: "Vocabulaire", percent: 76, questions: 15 },
    { name: "Reformulation", percent: 68, questions: 12 },
    { name: "Cohérence", percent: 55, questions: 8 },
  ],
};

// Activity heatmap: 6 weeks × 7 days, minutes of study per day
export const activityHeatmap: number[][] = [
  [45, 90, 0, 120, 30, 150, 60],
  [0, 60, 45, 0, 90, 120, 30],
  [30, 0, 60, 90, 45, 0, 150],
  [120, 60, 90, 30, 0, 45, 60],
  [60, 90, 120, 60, 45, 30, 0],
  [90, 120, 0, 60, 30, 90, 45],
];
