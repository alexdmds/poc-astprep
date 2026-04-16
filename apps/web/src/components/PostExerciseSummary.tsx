import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notion {
  name: string;
  correct: number;
  total: number;
  slug: string;
}

interface PostExerciseSummaryProps {
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  notions: Notion[];
  feedbackType: "record" | "progress" | "decline" | "first";
  onShowCorrection: () => void;
  onBackToDashboard: () => void;
}

const feedbackMessages: Record<string, string> = {
  record: "Bravo, c'est ton meilleur score sur ce type ! Continue sur cette lancée.",
  progress: "Tu progresses — +4 points vs ta moyenne. Les Probabilités restent à consolider.",
  decline: "Session difficile — c'est normal, ça fait partie du processus. Concentre-toi sur les 3 notions ci-dessus.",
  first: "Première session terminée ! Tu as une base de référence maintenant.",
};

export function PostExerciseSummary({
  score,
  maxScore,
  correctCount,
  totalQuestions,
  notions,
  feedbackType,
  onShowCorrection,
  onBackToDashboard,
}: PostExerciseSummaryProps) {
  return (
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full"
      >
        {/* Score */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold">
            {score}<span className="text-lg text-muted-foreground font-normal">/{maxScore}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {correctCount}/{totalQuestions} bonnes réponses
          </div>
        </div>

        {/* Notions à travailler */}
        {notions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">{notions.length} notions à travailler</h3>
            <div className="space-y-2">
              {notions.map(n => {
                const pct = Math.round((n.correct / n.total) * 100);
                return (
                  <Link
                    to={`/generateur?theme=${n.slug}`}
                    key={n.name}
                    className={cn(
                      "block rounded-xl border p-3 transition-colors hover:bg-muted/30",
                      pct < 40 ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{n.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {n.correct}/{n.total} correct ({pct}%)
                      </span>
                    </div>
                    <span className="text-xs text-primary font-medium mt-1 block">
                      S'entraîner sur ce thème →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Micro-feedback */}
        <p className="text-sm text-muted-foreground italic text-center mb-8">
          {feedbackMessages[feedbackType]}
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-2">
          <Button onClick={onShowCorrection} className="rounded-lg px-6 py-3 text-base font-medium">
            Afficher la correction
          </Button>
          <button onClick={onBackToDashboard} className="text-sm text-muted-foreground underline hover:text-foreground">
            Retour au dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
