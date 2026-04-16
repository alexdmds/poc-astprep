import { useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Zap, Loader2 } from "lucide-react";
import { QuizInterface } from "@/components/QuizInterface";
import { CorrectionView } from "@/components/CorrectionView";
import { PersonalBestScreen } from "@/components/PersonalBestScreen";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSubtestQuestions } from "@/lib/queries/questions";
import { useSubtest } from "@/lib/queries/subtests";
import { useSaveQuizSession, useSaveQuizAnswers } from "@/lib/queries/quiz-sessions";
import { useAddToErrorNotebook } from "@/lib/queries/error-notebook";
import { useAuth } from "@/lib/auth";

type Phase = "test" | "personal-best" | "summary-full" | "correction";

export default function EntrainementTest() {
  const navigate = useNavigate();
  const { testId: subtestId } = useParams<{ testId: string }>();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const startWithCorrection = searchParams.get("correction") === "true";

  const [phase, setPhase] = useState<Phase>(startWithCorrection ? "correction" : "test");
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const startedAtRef = useRef<string>(new Date().toISOString());

  const { data: subtest, isLoading: loadingSubtest } = useSubtest(subtestId ?? "");
  const { data: questions, isLoading: loadingQuestions } = useSubtestQuestions(subtestId ?? "");

  const saveSession = useSaveQuizSession();
  const saveAnswers = useSaveQuizAnswers();
  const addToErrorNotebook = useAddToErrorNotebook();

  const correctCount = (questions ?? []).filter(q => finalAnswers[q.id] === q.correctAnswer).length;
  const score = correctCount * 4;
  const maxScore = (questions ?? []).length * 4;

  // Thèmes faibles pour le debrief
  const themeStats: Record<string, { correct: number; total: number }> = {};
  for (const q of questions ?? []) {
    if (!themeStats[q.theme]) themeStats[q.theme] = { correct: 0, total: 0 };
    themeStats[q.theme].total++;
    if (finalAnswers[q.id] === q.correctAnswer) themeStats[q.theme].correct++;
  }
  const weakThemes = Object.entries(themeStats)
    .filter(([, s]) => s.total > 0 && s.correct / s.total < 0.6)
    .map(([name, s]) => ({ name, ...s }));

  const feedbackType = score >= maxScore * 0.7 ? "record" : score >= maxScore * 0.5 ? "progress" : "decline";
  const feedbackMessages: Record<string, string> = {
    record: "Excellent score ! Continue sur cette lancée.",
    progress: "Tu progresses — bon travail !",
    decline: "Session difficile — c'est normal. L'important c'est de retravailler les notions ci-dessous.",
  };

  const handleFinish = useCallback(async (answers: Record<string, string>, flagged: Set<string>) => {
    setFinalAnswers(answers);
    setFlaggedIds(flagged);
    setPhase("summary-full");
    window.scrollTo(0, 0);

    if (!user || !questions?.length) return;

    const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const sc = correct * 4;

    try {
      const sessionId = await saveSession.mutateAsync({
        userId: user.id,
        type: "subtest",
        sectionId: subtest?.section_id,
        subtestId: subtestId,
        score: sc,
        correctCount: correct,
        totalCount: questions.length,
        maxScore: questions.length * 4,
        startedAt: startedAtRef.current,
      });

      setSavedSessionId(sessionId);

      await saveAnswers.mutateAsync(
        questions.map(q => ({
          sessionId,
          questionId: q.id,
          userAnswer: answers[q.id] ?? null,
          isCorrect: answers[q.id] === q.correctAnswer,
          isFlagged: flagged.has(q.id),
        }))
      );

      // Ajouter les mauvaises réponses au carnet d'erreurs
      const wrong = questions.filter(q => answers[q.id] && answers[q.id] !== q.correctAnswer);
      for (const q of wrong) {
        addToErrorNotebook.mutate({
          userId: user.id,
          questionId: q.id,
          sectionId: subtest?.section_id ?? "",
          theme: q.theme,
          studentAnswer: answers[q.id],
          sessionId,
        });
      }
    } catch {
      // Sauvegarde échouée silencieusement
    }
  }, [questions, subtest, subtestId, user, saveSession, saveAnswers, addToErrorNotebook]);

  const handleLaunchTraining = () => {
    const section = subtest?.section_id ?? "";
    const themes = weakThemes.map(n => n.name).join(",");
    navigate(`/generateur?section=${section}&theme=${themes}`);
  };

  if (loadingSubtest || loadingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!subtest || !questions?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Ce sous-test n'existe pas ou ne contient aucune question.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Retour</Button>
      </div>
    );
  }

  if (phase === "test") {
    return (
      <QuizInterface
        title={subtest.title}
        questions={questions}
        timerSeconds={subtest.duration_minutes * 60}
        immediateCorrection={false}
        onFinish={handleFinish}
      />
    );
  }

  if (phase === "personal-best") {
    return (
      <PersonalBestScreen
        newScore={score}
        maxScore={maxScore}
        oldRecord={0}
        subtitle={`${correctCount}/${questions.length} bonnes réponses`}
        onContinue={() => { setPhase("summary-full"); window.scrollTo(0, 0); }}
      />
    );
  }

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
              {score}<span className="text-lg text-muted-foreground font-normal">/{maxScore}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {correctCount}/{questions.length} bonnes réponses
            </div>
          </div>

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

  // Correction phase
  return (
    <div>
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
              {score}<span className="text-sm text-muted-foreground font-normal">/{maxScore}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {correctCount}/{questions.length} bonnes réponses
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
        questions={questions}
        answers={finalAnswers}
        showScoreSummary={false}
        onBack={() => navigate("/")}
      />
    </div>
  );
}
