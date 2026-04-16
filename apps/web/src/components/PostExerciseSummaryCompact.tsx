import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Notion {
  name: string;
  correct: number;
  total: number;
  slug: string;
}

interface PostExerciseSummaryCompactProps {
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  notions: Notion[];
  feedbackType: "record" | "progress" | "decline" | "first";
}

const feedbackMessages: Record<string, string> = {
  record: "Bravo, c'est ton meilleur score sur ce type ! Continue sur cette lancée.",
  progress: "Tu progresses — +4 points vs ta moyenne. Les Probabilités restent à consolider.",
  decline: "Session difficile — c'est normal, ça fait partie du processus. Concentre-toi sur les notions ci-dessous.",
  first: "Première session terminée ! Tu as une base de référence maintenant.",
};

export function PostExerciseSummaryCompact({
  score,
  maxScore,
  correctCount,
  totalQuestions,
  notions,
  feedbackType,
}: PostExerciseSummaryCompactProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-card border border-border rounded-xl mx-6 mt-6 overflow-hidden"
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">
            {score}<span className="text-sm text-muted-foreground font-normal">/{maxScore}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {correctCount}/{totalQuestions} bonnes réponses
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Expandable detail */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border px-5 pb-4"
        >
          {/* Notions */}
          {notions.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {notions.length} notions à travailler
              </h4>
              <div className="flex flex-wrap gap-2">
                {notions.map(n => {
                  const pct = Math.round((n.correct / n.total) * 100);
                  return (
                    <Link
                      to={`/generateur?theme=${n.slug}`}
                      key={n.name}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs transition-colors hover:bg-muted/40",
                        pct < 40 ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"
                      )}
                    >
                      <span className="font-medium">{n.name}</span>
                      <span className="text-muted-foreground ml-1.5">
                        {n.correct}/{n.total} ({pct}%)
                      </span>
                      <span className="text-primary font-medium ml-2">S'entraîner →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Micro-feedback */}
          <p className="text-xs text-muted-foreground italic mt-3">
            {feedbackMessages[feedbackType]}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
