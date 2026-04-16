import { useState, useCallback, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { QuizInterface } from "@/components/QuizInterface";
import { CorrectionView } from "@/components/CorrectionView";
import { PersonalBestScreen } from "@/components/PersonalBestScreen";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calculQuestions } from "@/data/questions";

type Phase = "test" | "personal-best" | "summary-full" | "correction";

const PREVIOUS_RECORD = 38;

interface Notion { name: string; correct: number; total: number; slug: string; }

export default function Entrainement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startWithCorrection = searchParams.get("correction") === "true";
  const [phase, setPhase] = useState<Phase>(startWithCorrection ? "correction" : "test");
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [summaryExpanded, setSummaryExpanded] = useState(true);

  const handleFinish = useCallback((answers: Record<string, string>) => {
    setFinalAnswers(answers);
    const correctCount = calculQuestions.filter(q => answers[q.id] === q.correctAnswer).length;
    const score = correctCount * 4;
    setPhase(score > PREVIOUS_RECORD ? "personal-best" : "summary-full");
    window.scrollTo(0, 0);
  }, []);

  const correctCount = calculQuestions.filter(q => finalAnswers[q.id] === q.correctAnswer).length;
  const score = correctCount * 4;
  const notions = useMemo(() => [
    { name: "Probabilités conditionnelles", correct: 1, total: 3, slug: "probabilites-conditionnelles" },
    { name: "Géométrie dans l'espace", correct: 1, total: 2, slug: "geometrie-espace" },
    { name: "Dénombrement", correct: 0, total: 2, slug: "denombrement" },
  ], []);

  const weakThemes = notions.filter(n => (n.correct / n.total) < 0.6);
  const feedbackType = score > PREVIOUS_RECORD ? "record" : score >= PREVIOUS_RECORD - 4 ? "progress" : "decline";

  const feedbackMessages: Record<string, string> = {
    record: "Bravo, c'est ton meilleur score sur ce type ! Continue sur cette lancée.",
    progress: "Tu progresses — +4 points vs ta moyenne. Continue comme ça !",
    decline: "Session difficile — c'est normal, ça fait partie du processus. L'important c'est de retravailler les notions ci-dessous.",
    first: "Première session terminée ! Tu as une base de référence maintenant.",
  };

  const handleLaunchTraining = () => {
    const themeParams = weakThemes.map(n => n.slug).join(",");
    navigate(`/generateur?section=calcul&theme=${themeParams}`);
  };

  if (phase === "test") {
    return (
      <QuizInterface
        title="Calcul — Sous-test #12"
        questions={calculQuestions}
        timerSeconds={20 * 60}
        immediateCorrection={false}
        onFinish={handleFinish}
      />
    );
  }

  if (phase === "personal-best") {
    return (
      <PersonalBestScreen
        newScore={score}
        maxScore={60}
        oldRecord={PREVIOUS_RECORD}
        subtitle={`${correctCount}/${calculQuestions.length} bonnes réponses`}
        onContinue={() => { setPhase("summary-full"); window.scrollTo(0, 0); }}
      />
    );
  }

  // Full-screen debrief
  if (phase === "summary-full") {
    return (
      <motion.div
        className="min-h-[calc(100vh-3rem)] flex items-center justify-center p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold">
              {score}<span className="text-lg text-muted-foreground font-normal">/{60}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {correctCount}/{calculQuestions.length} bonnes réponses
            </div>
          </div>

          {/* Global debrief */}
          <div className="bg-card rounded-xl border border-border p-5 mb-6">
            <h3 className="text-sm font-semibold mb-3">Ton bilan</h3>
            <p className="text-sm text-muted-foreground mb-4">{feedbackMessages[feedbackType]}</p>

            {weakThemes.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notions à retravailler</div>
                {weakThemes.map(n => {
                  const pct = Math.round((n.correct / n.total) * 100);
                  return (
                    <div
                      key={n.name}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-3 py-2",
                        pct < 40 ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"
                      )}
                    >
                      <span className="text-sm font-medium">{n.name}</span>
                      <span className="text-xs text-muted-foreground">{n.correct}/{n.total} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={() => { setPhase("correction"); setSummaryExpanded(true); window.scrollTo(0, 0); }}
              className="rounded-lg px-6 py-3 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Voir la correction
            </Button>
            <button onClick={() => navigate("/")} className="text-sm text-muted-foreground underline hover:text-foreground">
              Retour au dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Correction phase: compact summary on top + correction below
  return (
    <div>
      {/* Compact summary card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, type: "spring", stiffness: 200, damping: 25 }}
        className="bg-card border border-border rounded-xl mx-6 mt-6 overflow-hidden"
      >
        <button
          onClick={() => setSummaryExpanded(e => !e)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">
              {score}<span className="text-sm text-muted-foreground font-normal">/{60}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {correctCount}/{calculQuestions.length} bonnes réponses
            </div>
          </div>
          {summaryExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {summaryExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border px-5 pb-4"
            >
              <div className="mt-3">
                {weakThemes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {weakThemes.map(n => {
                      const pct = Math.round((n.correct / n.total) * 100);
                      return (
                        <span
                          key={n.name}
                          className={cn(
                            "px-3 py-1.5 rounded-lg border text-xs font-medium",
                            pct < 40 ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"
                          )}
                        >
                          {n.name} · {n.correct}/{n.total}
                        </span>
                      );
                    })}
                  </div>
                )}
                <p className="text-xs text-muted-foreground italic">{feedbackMessages[feedbackType]}</p>
                {weakThemes.length > 0 && (
                  <button
                    onClick={handleLaunchTraining}
                    className="mt-3 w-full rounded-xl px-4 py-3 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" /> Lancer un entraînement personnalisé
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <CorrectionView
        questions={calculQuestions}
        answers={finalAnswers}
        showScoreSummary={false}
        onBack={() => navigate("/")}
      />
    </div>
  );
}
