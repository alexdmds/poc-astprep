export interface MockTest {
  id: string;
  title: string;
  difficulty?: "Facile" | "Moyen" | "Difficile";
  score: number | null;
  date: string | null;
  avgScore: number;
  isMonthly?: boolean;
  monthLabel?: string;
}

export const classicTests: MockTest[] = [
  { id: "tm-1", title: "TM n°1", difficulty: "Facile", score: 312, date: "15 fév", avgScore: 340 },
  { id: "tm-2", title: "TM n°2", difficulty: "Facile", score: 345, date: "28 fév", avgScore: 348 },
  { id: "tm-3", title: "TM n°3", difficulty: "Facile", score: null, date: null, avgScore: 352 },
  { id: "tm-4", title: "TM n°4", difficulty: "Facile", score: null, date: null, avgScore: 345 },
  { id: "tm-5", title: "TM n°5", difficulty: "Moyen", score: 367, date: "10 mars", avgScore: 358 },
  { id: "tm-6", title: "TM n°6", difficulty: "Moyen", score: 389, date: "18 mars", avgScore: 362 },
  { id: "tm-7", title: "TM n°7", difficulty: "Moyen", score: 412, date: "25 mars", avgScore: 368 },
  { id: "tm-8", title: "TM n°8", difficulty: "Moyen", score: null, date: null, avgScore: 365 },
  { id: "tm-9", title: "TM n°9", difficulty: "Moyen", score: null, date: null, avgScore: 370 },
  { id: "tm-10", title: "TM n°10", difficulty: "Moyen", score: null, date: null, avgScore: 355 },
  { id: "tm-11", title: "TM n°11", difficulty: "Difficile", score: null, date: null, avgScore: 375 },
  { id: "tm-12", title: "TM n°12", difficulty: "Difficile", score: null, date: null, avgScore: 380 },
  { id: "tm-13", title: "TM n°13", difficulty: "Difficile", score: null, date: null, avgScore: 372 },
  { id: "tm-14", title: "TM n°14", difficulty: "Difficile", score: null, date: null, avgScore: 378 },
  { id: "tm-15", title: "TM n°15", difficulty: "Moyen", score: null, date: null, avgScore: 360 },
  { id: "tm-16", title: "TM n°16", difficulty: "Moyen", score: null, date: null, avgScore: 358 },
  { id: "tm-17", title: "TM n°17", difficulty: "Facile", score: null, date: null, avgScore: 342 },
  { id: "tm-18", title: "TM n°18", difficulty: "Difficile", score: null, date: null, avgScore: 376 },
  { id: "tm-19", title: "TM n°19", difficulty: "Difficile", score: null, date: null, avgScore: 380 },
  { id: "tm-20", title: "TM n°20", difficulty: "Difficile", score: null, date: null, avgScore: 374 },
];

export const monthlyTests: MockTest[] = [
  { id: "tm-m-sept", title: "TM Mensuel : Septembre", isMonthly: true, monthLabel: "Sept.", score: 298, date: "28 sept", avgScore: 340 },
  { id: "tm-m-oct", title: "TM Mensuel : Octobre", isMonthly: true, monthLabel: "Oct.", score: 325, date: "26 oct", avgScore: 348 },
  { id: "tm-m-nov", title: "TM Mensuel : Novembre", isMonthly: true, monthLabel: "Nov.", score: 356, date: "30 nov", avgScore: 355 },
  { id: "tm-m-dec", title: "TM Mensuel : Décembre", isMonthly: true, monthLabel: "Déc.", score: 378, date: "28 déc", avgScore: 362 },
  { id: "tm-m-jan", title: "TM Mensuel : Janvier", isMonthly: true, monthLabel: "Jan.", score: 395, date: "25 jan", avgScore: 368 },
  { id: "tm-m-fev", title: "TM Mensuel : Février", isMonthly: true, monthLabel: "Fév.", score: null, date: null, avgScore: 370 },
];
