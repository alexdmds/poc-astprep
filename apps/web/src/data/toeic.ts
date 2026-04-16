// TOEIC mock data
export interface ToeicQuestion {
  id: string;
  number: number;
  text: string;
  choices: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  part: number; // 1-7
  theme: string;
  microCompetence: string;
  difficulty: "Easy" | "Medium" | "Hard";
  audioUrl?: string;
}

export const toeicParts = [
  { id: 1, name: "Part 1 — Photos", type: "Listening", color: "bg-cyan-500", questions: 6 },
  { id: 2, name: "Part 2 — Questions-Réponses", type: "Listening", color: "bg-blue-500", questions: 25 },
  { id: 3, name: "Part 3 — Conversations", type: "Listening", color: "bg-indigo-500", questions: 39 },
  { id: 4, name: "Part 4 — Talks", type: "Listening", color: "bg-violet-500", questions: 30 },
  { id: 5, name: "Part 5 — Incomplete Sentences", type: "Reading", color: "bg-amber-500", questions: 30 },
  { id: 6, name: "Part 6 — Text Completion", type: "Reading", color: "bg-orange-500", questions: 16 },
  { id: 7, name: "Part 7 — Reading Comprehension", type: "Reading", color: "bg-rose-500", questions: 54 },
];

export const toeicThemes: Record<number, string[]> = {
  1: ["Office", "Transportation", "Construction", "Restaurant"],
  2: ["Scheduling", "Requests", "Offers", "Information"],
  3: ["Meeting", "Travel", "Project", "HR"],
  4: ["Announcement", "Advertisement", "News", "Tour"],
  5: ["Present Perfect", "Modaux", "Prépositions", "Conditionnels", "Voix Passive", "Phrasal Verbs", "Relatives", "Gérondif"],
  6: ["Cohérence textuelle", "Transitions", "Vocabulaire contextuel", "Temps verbaux"],
  7: ["Business", "HR", "Travel", "Finance", "Office", "Manufacturing", "Health", "Dining"],
};

export const toeicMicroCompetences: Record<string, { name: string; percent: number; questions: number }[]> = {
  grammaire: [
    { name: "Present Perfect", percent: 34, questions: 12 },
    { name: "Modaux", percent: 42, questions: 15 },
    { name: "Prépositions", percent: 48, questions: 20 },
    { name: "Conditionnels", percent: 55, questions: 10 },
    { name: "Voix Passive", percent: 62, questions: 8 },
    { name: "Phrasal Verbs", percent: 38, questions: 18 },
    { name: "Relatives", percent: 70, questions: 12 },
    { name: "Gérondif", percent: 58, questions: 8 },
  ],
  vocabulaire: [
    { name: "Business", percent: 65, questions: 25 },
    { name: "HR", percent: 55, questions: 15 },
    { name: "Travel", percent: 72, questions: 12 },
    { name: "Finance", percent: 40, questions: 18 },
    { name: "Office", percent: 78, questions: 20 },
    { name: "Manufacturing", percent: 35, questions: 10 },
    { name: "Health", percent: 60, questions: 8 },
    { name: "Dining", percent: 82, questions: 6 },
  ],
  listening: [
    { name: "Photos descriptions", percent: 75, questions: 6 },
    { name: "Short questions", percent: 58, questions: 25 },
    { name: "Conversations", percent: 52, questions: 39 },
    { name: "Talks / Announcements", percent: 48, questions: 30 },
  ],
  reading: [
    { name: "Incomplete sentences", percent: 68, questions: 30 },
    { name: "Text completion", percent: 55, questions: 16 },
    { name: "Single passages", percent: 62, questions: 29 },
    { name: "Double passages", percent: 45, questions: 25 },
  ],
  strategie: [
    { name: "Gestion du temps", percent: 50, questions: 0 },
    { name: "Élimination", percent: 65, questions: 0 },
    { name: "Écoute active", percent: 55, questions: 0 },
  ],
};

// Mock TOEIC questions (Part 5 grammar)
export const toeicQuestions: ToeicQuestion[] = Array.from({ length: 30 }, (_, i) => ({
  id: `tq${i + 1}`,
  number: i + 1,
  text: [
    "The manager _____ the report before the meeting started.",
    "All employees must _____ their ID badges at all times.",
    "The conference room is _____ the second floor.",
    "She has been working here _____ five years.",
    "The company _____ its quarterly earnings next week.",
    "If I _____ more time, I would complete the project.",
    "The documents need to be _____ by Friday.",
    "He is responsible _____ managing the budget.",
    "The new policy _____ into effect next month.",
    "They have _____ finished the renovation.",
  ][i % 10],
  choices: [
    { label: "A", text: ["had completed", "wear", "on", "for", "will announce", "had", "submitted", "for", "goes", "already"][i % 10] },
    { label: "B", text: ["has completed", "wore", "at", "since", "announced", "have", "submit", "of", "go", "yet"][i % 10] },
    { label: "C", text: ["completing", "wearing", "in", "during", "announcing", "would have", "submitting", "with", "going", "still"][i % 10] },
    { label: "D", text: ["complete", "to wear", "by", "from", "to announce", "has had", "to submit", "about", "went", "just"][i % 10] },
  ],
  correctAnswer: "A",
  explanation: "The correct answer requires the appropriate tense/preposition in this business context.",
  part: i < 6 ? 1 : i < 12 ? 2 : i < 18 ? 5 : i < 24 ? 6 : 7,
  theme: toeicThemes[5][i % toeicThemes[5].length],
  microCompetence: toeicThemes[5][i % toeicThemes[5].length],
  difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
  audioUrl: i < 12 ? "/audio/placeholder.mp3" : undefined,
}));

export const toeicMockTests = Array.from({ length: 15 }, (_, i) => ({
  id: `toeic-blanc-${i + 1}`,
  title: `TOEIC Blanc #${i + 1}`,
  listening: i < 8 ? Math.round(300 + Math.random() * 195) : null,
  reading: i < 8 ? Math.round(280 + Math.random() * 215) : null,
  get total() { return this.listening && this.reading ? this.listening + this.reading : null; },
  date: i < 8 ? `${15 - i} mars` : null,
  avgTotal: 680,
}));

export const toeicScoreHistory = [
  { date: "Jan", score: 620 },
  { date: "Fév", score: 645 },
  { date: "Mar", score: 660 },
  { date: "Avr", score: 690 },
  { date: "Mai", score: 715 },
  { date: "Juin", score: 740 },
  { date: "Juil", score: 780 },
];

export const toeicCourseCategories = [
  { id: "grammaire", label: "Grammaire", icon: "BookOpen", color: "amber-500" },
  { id: "vocabulaire", label: "Vocabulaire", icon: "Languages", color: "green-500" },
  { id: "listening", label: "Listening Skills", icon: "Headphones", color: "cyan-500" },
  { id: "reading", label: "Reading Skills", icon: "FileText", color: "rose-500" },
  { id: "parts", label: "Maîtriser les Parts", icon: "Target", color: "violet-500" },
];

export const toeicCourses = [
  { id: "tg1", category: "grammaire", chapter: "Les temps", lessons: [
    { id: "tgl1", title: "Present Simple vs Continuous", duration: "12 min", status: "done" },
    { id: "tgl2", title: "Present Perfect", duration: "15 min", status: "done" },
    { id: "tgl3", title: "Past Perfect", duration: "10 min", status: "in-progress" },
    { id: "tgl4", title: "Future Forms", duration: "14 min", status: "not-started" },
  ]},
  { id: "tg2", category: "grammaire", chapter: "Les modaux", lessons: [
    { id: "tgl5", title: "Can / Could / Be able to", duration: "11 min", status: "done" },
    { id: "tgl6", title: "Must / Have to / Should", duration: "13 min", status: "not-started" },
  ]},
  { id: "tg3", category: "grammaire", chapter: "Prépositions", lessons: [
    { id: "tgl7", title: "Prépositions de temps", duration: "10 min", status: "not-started" },
    { id: "tgl8", title: "Prépositions de lieu", duration: "12 min", status: "not-started" },
  ]},
  { id: "tv1", category: "vocabulaire", chapter: "Business English", lessons: [
    { id: "tvl1", title: "Meeting Vocabulary", duration: "8 min", status: "done" },
    { id: "tvl2", title: "Email & Communication", duration: "10 min", status: "in-progress" },
    { id: "tvl3", title: "Financial Terms", duration: "12 min", status: "not-started" },
  ]},
  { id: "tv2", category: "vocabulaire", chapter: "Professional Contexts", lessons: [
    { id: "tvl4", title: "Office Vocabulary", duration: "9 min", status: "not-started" },
    { id: "tvl5", title: "Travel & Transportation", duration: "11 min", status: "not-started" },
  ]},
  { id: "tl1", category: "listening", chapter: "Écoute active", lessons: [
    { id: "tll1", title: "Identifier le sujet principal", duration: "14 min", status: "done" },
    { id: "tll2", title: "Repérer les détails clés", duration: "12 min", status: "not-started" },
  ]},
  { id: "tr1", category: "reading", chapter: "Compréhension écrite", lessons: [
    { id: "trl1", title: "Skimming & Scanning", duration: "15 min", status: "not-started" },
    { id: "trl2", title: "Inférence dans les textes", duration: "13 min", status: "not-started" },
  ]},
  { id: "tp1", category: "parts", chapter: "Stratégies par Part", lessons: [
    { id: "tpl1", title: "Comment aborder Part 1", duration: "8 min", status: "done" },
    { id: "tpl2", title: "Comment aborder Part 2", duration: "10 min", status: "not-started" },
    { id: "tpl3", title: "Comment aborder Part 3", duration: "12 min", status: "not-started" },
    { id: "tpl4", title: "Comment aborder Part 4", duration: "11 min", status: "not-started" },
    { id: "tpl5", title: "Comment aborder Part 5", duration: "9 min", status: "done" },
    { id: "tpl6", title: "Comment aborder Part 6", duration: "10 min", status: "not-started" },
    { id: "tpl7", title: "Comment aborder Part 7", duration: "14 min", status: "not-started" },
  ]},
];

export const toeicFlashcardThemes = [
  "Business", "HR", "Travel", "Finance", "Office", "Manufacturing",
  "Health", "Dining", "Entertainment", "Housing", "Personnel", "Technical",
];

export const toeicFlashcards = Array.from({ length: 60 }, (_, i) => ({
  id: `tf${i + 1}`,
  front: [
    "to schedule a meeting", "quarterly report", "deadline", "invoice",
    "to negotiate", "budget", "to implement", "assessment",
    "revenue", "to comply with", "benchmark", "stakeholder",
  ][i % 12],
  back: [
    "Planifier une réunion", "Rapport trimestriel", "Date limite", "Facture",
    "Négocier", "Budget", "Mettre en œuvre", "Évaluation",
    "Chiffre d'affaires", "Se conformer à", "Référence / point de comparaison", "Partie prenante",
  ][i % 12],
  theme: toeicFlashcardThemes[i % toeicFlashcardThemes.length],
  status: i % 5 === 0 ? "mastered" : i % 3 === 0 ? "learning" : "due",
}));

// TOEIC error categories
export const toeicErrorCategories = [
  "Vocabulaire", "Grammaire", "Compréhension", "Manque de temps", "Question piégeuse", "Autre",
] as const;

// Scoring function
export function calculateToeicScore(listeningCorrect: number, listeningTotal: number, readingCorrect: number, readingTotal: number) {
  // Listening: 7 free errors, then -5 per error
  const listeningErrors = listeningTotal - listeningCorrect;
  const listeningScore = Math.max(5, 495 - Math.max(0, listeningErrors - 7) * 5);

  // Reading: -5 per error from first
  const readingErrors = readingTotal - readingCorrect;
  const readingScore = Math.max(5, 495 - readingErrors * 5);

  return { listening: listeningScore, reading: readingScore, total: listeningScore + readingScore };
}
