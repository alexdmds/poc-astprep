import { Target, BookOpen, Calculator, Scale, GitBranch, PenTool, Puzzle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Section {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  color: string; // tailwind class suffix
  hsl: string; // hsl value for inline styles
}

export const sections: Section[] = [
  { id: "strategie", label: "Stratégie", shortLabel: "Stratégie", icon: Target, color: "strategie", hsl: "hsl(var(--section-strategie))" },
  { id: "comprehension", label: "Compréhension", shortLabel: "Compréh.", icon: BookOpen, color: "comprehension", hsl: "hsl(var(--section-comprehension))" },
  { id: "calcul", label: "Calcul", shortLabel: "Calcul", icon: Calculator, color: "calcul", hsl: "hsl(var(--section-calcul))" },
  { id: "ra", label: "Raisonnement & Argumentation", shortLabel: "R&A", icon: Scale, color: "ra", hsl: "hsl(var(--section-ra))" },
  { id: "conditions", label: "Conditions Minimales", shortLabel: "Conditions", icon: GitBranch, color: "conditions", hsl: "hsl(var(--section-conditions))" },
  { id: "expression", label: "Expression", shortLabel: "Expression", icon: PenTool, color: "expression", hsl: "hsl(var(--section-expression))" },
  { id: "logique", label: "Logique", shortLabel: "Logique", icon: Puzzle, color: "logique", hsl: "hsl(var(--section-logique))" },
];

// Sections that have scores (no Stratégie)
export const scoredSections = sections.filter(s => s.id !== "strategie");
