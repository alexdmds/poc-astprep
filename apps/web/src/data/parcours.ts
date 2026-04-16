import { BookOpen, Dumbbell, FileText, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Activity {
  id: string;
  title: string;
  duration: string;
  done: boolean;
  type: "cours" | "exercice" | "tm" | "carnet";
}

export interface DayPlan {
  date: string;
  fullDate: string;
  isToday: boolean;
  activities: Activity[];
}

const typeIcons: Record<Activity["type"], LucideIcon> = {
  cours: BookOpen,
  exercice: Dumbbell,
  tm: FileText,
  carnet: RotateCcw,
};

export { typeIcons };

export const weekPlan: DayPlan[] = [
  // --- Semaine passée (30 mars – 6 avril) ---
  {
    date: "Lun 30", fullDate: "2026-03-30", isToday: false,
    activities: [
      { id: "p1", title: "Cours Fractions et puissances", duration: "35 min", done: true, type: "cours" },
      { id: "p2", title: "Drill Calcul 10 questions", duration: "15 min", done: true, type: "exercice" },
      { id: "p3", title: "Sous-test Calcul #9", duration: "20 min", done: true, type: "exercice" },
    ],
  },
  {
    date: "Mar 31", fullDate: "2026-03-31", isToday: false,
    activities: [
      { id: "p4", title: "Cours Identifier la thèse", duration: "30 min", done: true, type: "cours" },
      { id: "p5", title: "Sous-test R&A #3", duration: "20 min", done: true, type: "exercice" },
      { id: "p6", title: "Carnet d'erreurs R&A", duration: "10 min", done: true, type: "carnet" },
    ],
  },
  {
    date: "Mer 1", fullDate: "2026-04-01", isToday: false,
    activities: [
      { id: "p7", title: "Cours Dénombrement", duration: "40 min", done: true, type: "cours" },
      { id: "p8", title: "Drill Logique 10 questions", duration: "15 min", done: true, type: "exercice" },
      { id: "p9", title: "Sous-test Logique #5", duration: "20 min", done: true, type: "exercice" },
      { id: "p10", title: "Carnet d'erreurs Logique", duration: "10 min", done: true, type: "carnet" },
    ],
  },
  {
    date: "Jeu 2", fullDate: "2026-04-02", isToday: false,
    activities: [
      { id: "p11", title: "Cours Conjugaisons pièges", duration: "25 min", done: true, type: "cours" },
      { id: "p12", title: "Sous-test Expression #4", duration: "20 min", done: false, type: "exercice" },
      { id: "p13", title: "Drill Expression 15 questions", duration: "20 min", done: true, type: "exercice" },
    ],
  },
  {
    date: "Ven 3", fullDate: "2026-04-03", isToday: false,
    activities: [
      { id: "p14", title: "Cours Conditions minimales", duration: "35 min", done: true, type: "cours" },
      { id: "p15", title: "Sous-test CM #3", duration: "20 min", done: true, type: "exercice" },
      { id: "p16", title: "Drill CM 10 questions", duration: "15 min", done: true, type: "exercice" },
      { id: "p17", title: "Carnet d'erreurs CM", duration: "10 min", done: true, type: "carnet" },
    ],
  },
  {
    date: "Sam 4", fullDate: "2026-04-04", isToday: false,
    activities: [
      { id: "p18", title: "TM Blanc #45", duration: "2h", done: true, type: "tm" },
      { id: "p19", title: "Correction TM #45", duration: "45 min", done: true, type: "tm" },
      { id: "p20", title: "Carnet d'erreurs TM", duration: "15 min", done: true, type: "carnet" },
    ],
  },
  {
    date: "Dim 5", fullDate: "2026-04-05", isToday: false,
    activities: [
      { id: "p21", title: "Révision points faibles Calcul", duration: "30 min", done: true, type: "cours" },
      { id: "p22", title: "Drill Calcul thématique Probas", duration: "20 min", done: true, type: "exercice" },
    ],
  },
  {
    date: "Lun 6", fullDate: "2026-04-06", isToday: false,
    activities: [
      { id: "p23", title: "Cours Séries numériques", duration: "30 min", done: true, type: "cours" },
      { id: "p24", title: "Sous-test Logique #6", duration: "20 min", done: true, type: "exercice" },
      { id: "p25", title: "Drill Compréhension 10 questions", duration: "15 min", done: true, type: "exercice" },
      { id: "p26", title: "Carnet d'erreurs Logique", duration: "10 min", done: true, type: "carnet" },
    ],
  },

  // --- Semaine en cours (7–13 avril) ---
  {
    date: "Mar 7", fullDate: "2026-04-07", isToday: false,
    activities: [
      { id: "a1", title: "Cours Probabilités conditionnelles", duration: "35 min", done: true, type: "cours" },
      { id: "a2", title: "Drill Calcul 15 questions", duration: "20 min", done: true, type: "exercice" },
      { id: "a12", title: "Sous-test Calcul #10", duration: "20 min", done: true, type: "exercice" },
      { id: "a13", title: "Carnet d'erreurs Calcul", duration: "10 min", done: true, type: "carnet" },
    ],
  },
  {
    date: "Mer 8", fullDate: "2026-04-08", isToday: true,
    activities: [
      { id: "a3", title: "Cours Renforcer/Affaiblir un argument", duration: "30 min", done: false, type: "cours" },
      { id: "a4", title: "Sous-test R&A #4", duration: "20 min", done: false, type: "exercice" },
      { id: "a14", title: "Drill R&A 10 questions", duration: "15 min", done: false, type: "exercice" },
      { id: "a15", title: "Carnet d'erreurs R&A", duration: "10 min", done: false, type: "carnet" },
    ],
  },
  {
    date: "Jeu 9", fullDate: "2026-04-09", isToday: false,
    activities: [
      { id: "a5", title: "Cours Arbres de probabilités", duration: "30 min", done: false, type: "cours" },
      { id: "a16", title: "Drill Calcul thématique Géométrie", duration: "20 min", done: false, type: "exercice" },
      { id: "a17", title: "Sous-test Calcul #11", duration: "20 min", done: false, type: "exercice" },
    ],
  },
  {
    date: "Ven 10", fullDate: "2026-04-10", isToday: false,
    activities: [
      { id: "a6", title: "Cours Damiers niveau 2", duration: "30 min", done: false, type: "cours" },
      { id: "a7", title: "Sous-test Logique #7", duration: "20 min", done: false, type: "exercice" },
      { id: "a18", title: "Drill Logique 15 questions", duration: "20 min", done: false, type: "exercice" },
      { id: "a19", title: "Carnet d'erreurs Logique", duration: "10 min", done: false, type: "carnet" },
    ],
  },
  {
    date: "Sam 11", fullDate: "2026-04-11", isToday: false,
    activities: [
      { id: "a8", title: "Cours Syntaxe et reformulation", duration: "25 min", done: false, type: "cours" },
      { id: "a20", title: "Sous-test Expression #5", duration: "20 min", done: false, type: "exercice" },
      { id: "a21", title: "Drill Expression 10 questions", duration: "15 min", done: false, type: "exercice" },
    ],
  },
  {
    date: "Dim 12", fullDate: "2026-04-12", isToday: false,
    activities: [
      { id: "a9", title: "TM Blanc #46", duration: "2h", done: false, type: "tm" },
      { id: "a22", title: "Correction TM #46", duration: "45 min", done: false, type: "tm" },
      { id: "a10", title: "Carnet d'erreurs TM", duration: "15 min", done: false, type: "carnet" },
    ],
  },
  {
    date: "Lun 13", fullDate: "2026-04-13", isToday: false,
    activities: [
      { id: "a11", title: "Révision Compréhension textes longs", duration: "35 min", done: false, type: "cours" },
      { id: "a23", title: "Sous-test Compréhension #3", duration: "20 min", done: false, type: "exercice" },
      { id: "a24", title: "Drill Compréhension 10 questions", duration: "15 min", done: false, type: "exercice" },
    ],
  },

  // --- Semaine suivante (14–20 avril) ---
  {
    date: "Mar 14", fullDate: "2026-04-14", isToday: false,
    activities: [
      { id: "f1", title: "Cours Pourcentages avancés", duration: "35 min", done: false, type: "cours" },
      { id: "f2", title: "Sous-test Calcul #12", duration: "20 min", done: false, type: "exercice" },
      { id: "f3", title: "Drill Calcul 15 questions", duration: "20 min", done: false, type: "exercice" },
      { id: "f4", title: "Carnet d'erreurs Calcul", duration: "10 min", done: false, type: "carnet" },
    ],
  },
  {
    date: "Mer 15", fullDate: "2026-04-15", isToday: false,
    activities: [
      { id: "f5", title: "Cours Failles logiques", duration: "30 min", done: false, type: "cours" },
      { id: "f6", title: "Sous-test R&A #5", duration: "20 min", done: false, type: "exercice" },
      { id: "f7", title: "Drill R&A 10 questions", duration: "15 min", done: false, type: "exercice" },
    ],
  },
  {
    date: "Jeu 16", fullDate: "2026-04-16", isToday: false,
    activities: [
      { id: "f8", title: "Cours Figures et rotations", duration: "30 min", done: false, type: "cours" },
      { id: "f9", title: "Sous-test Logique #8", duration: "20 min", done: false, type: "exercice" },
      { id: "f10", title: "Drill Logique thématique Damiers", duration: "15 min", done: false, type: "exercice" },
      { id: "f11", title: "Carnet d'erreurs Logique", duration: "10 min", done: false, type: "carnet" },
    ],
  },
  {
    date: "Ven 17", fullDate: "2026-04-17", isToday: false,
    activities: [
      { id: "f12", title: "Cours Locutions et vocabulaire", duration: "25 min", done: false, type: "cours" },
      { id: "f13", title: "Sous-test Expression #6", duration: "20 min", done: false, type: "exercice" },
      { id: "f14", title: "Drill Expression 15 questions", duration: "20 min", done: false, type: "exercice" },
    ],
  },
  {
    date: "Sam 18", fullDate: "2026-04-18", isToday: false,
    activities: [
      { id: "f15", title: "Cours Pièges CM fréquents", duration: "30 min", done: false, type: "cours" },
      { id: "f16", title: "Sous-test CM #4", duration: "20 min", done: false, type: "exercice" },
      { id: "f17", title: "Drill CM 10 questions", duration: "15 min", done: false, type: "exercice" },
      { id: "f18", title: "Carnet d'erreurs CM", duration: "10 min", done: false, type: "carnet" },
    ],
  },
  {
    date: "Dim 19", fullDate: "2026-04-19", isToday: false,
    activities: [
      { id: "f19", title: "TM Blanc #47", duration: "2h", done: false, type: "tm" },
      { id: "f20", title: "Correction TM #47", duration: "45 min", done: false, type: "tm" },
      { id: "f21", title: "Carnet d'erreurs TM", duration: "15 min", done: false, type: "carnet" },
    ],
  },
  {
    date: "Lun 20", fullDate: "2026-04-20", isToday: false,
    activities: [
      { id: "f22", title: "Révision points faibles Logique", duration: "30 min", done: false, type: "cours" },
      { id: "f23", title: "Drill Logique 15 questions", duration: "20 min", done: false, type: "exercice" },
      { id: "f24", title: "Sous-test Compréhension #4", duration: "20 min", done: false, type: "exercice" },
    ],
  },
];

// Older past worked dates (no detail)
export const pastWorkedDates: string[] = [
  "2026-03-16", "2026-03-17", "2026-03-18", "2026-03-19", "2026-03-20",
  "2026-03-23", "2026-03-24", "2026-03-25", "2026-03-26", "2026-03-27",
];
