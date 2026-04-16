import { useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Play, Zap, Timer, Loader2 } from "lucide-react";
import { scoredSections } from "@/data/sections";
import { cn } from "@/lib/utils";
import { QuizInterface } from "@/components/QuizInterface";
import { CorrectionView } from "@/components/CorrectionView";
import { useQuestions } from "@/lib/queries/questions";
import { useSaveQuizSession, useSaveQuizAnswers } from "@/lib/queries/quiz-sessions";
import { useAddToErrorNotebook } from "@/lib/queries/error-notebook";
import { useAuth } from "@/lib/auth";

const questionCounts = ["5", "10", "15", "20", "Illimité"] as const;
const difficulties = ["Facile", "Moyen", "Difficile"] as const;
const durations = [
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "Illimité", value: null },
] as const;

type PageState = "config" | "quiz" | "done";

const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "rounded-full px-4 py-1.5 text-sm border transition-colors min-h-[40px] flex items-center",
      active
        ? "bg-primary/10 text-primary border-primary font-medium"
        : "text-muted-foreground border-border hover:border-primary/50"
    )}
  >
    {label}
  </button>
);

export default function Entrainement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedSection, setSelectedSection] = useState<string>(searchParams.get("section") || scoredSections[0].id);
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(() => {
    const theme = searchParams.get("theme");
    return theme ? new Set([theme]) : new Set();
  });
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<string>>(new Set());
  const [questionCount, setQuestionCount] = useState("10");
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [pageState, setPageState] = useState<PageState>("config");
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const startedAtRef = useRef<string>(new Date().toISOString());

  const { data: allSectionQuestions, isLoading } = useQuestions({ sectionId: selectedSection });

  const availableThemes = useMemo(() => {
    const themes = new Set<string>();
    for (const q of allSectionQuestions ?? []) if (q.theme) themes.add(q.theme);
    return Array.from(themes).sort();
  }, [allSectionQuestions]);

  const filteredQuestions = useMemo(() => {
    const limit = questionCount === "Illimité" ? 999 : parseInt(questionCount);
    return (allSectionQuestions ?? [])
      .filter(q => {
        if (selectedThemes.size > 0 && !selectedThemes.has(q.theme)) return false;
        if (selectedDifficulties.size > 0 && !selectedDifficulties.has(q.difficulty)) return false;
        return true;
      })
      .slice(0, limit);
  }, [allSectionQuestions, selectedThemes, selectedDifficulties, questionCount]);

  const saveSession = useSaveQuizSession();
  const saveAnswers = useSaveQuizAnswers();
  const addToErrorNotebook = useAddToErrorNotebook();

  const toggleSet = (set: Set<string>, val: string) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    return next;
  };

  const handleFinish = useCallback(async (answers: Record<string, string>, flagged: Set<string>) => {
    setFinalAnswers(answers);
    setFlaggedIds(flagged);
    setPageState("done");
    window.scrollTo(0, 0);

    if (!user) return;

    const correctCount = filteredQuestions.filter(q => answers[q.id] === q.correctAnswer).length;
    const score = correctCount * 4;

    try {
      const sessionId = await saveSession.mutateAsync({
        userId: user.id,
        type: "training",
        sectionId: selectedSection,
        score,
        correctCount,
        totalCount: filteredQuestions.length,
        maxScore: filteredQuestions.length * 4,
        startedAt: startedAtRef.current,
      });

      await saveAnswers.mutateAsync(
        filteredQuestions.map(q => ({
          sessionId,
          questionId: q.id,
          userAnswer: answers[q.id] ?? null,
          isCorrect: answers[q.id] === q.correctAnswer,
          isFlagged: flagged.has(q.id),
        }))
      );

      // Ajouter les mauvaises réponses au carnet d'erreurs
      const wrong = filteredQuestions.filter(q => answers[q.id] && answers[q.id] !== q.correctAnswer);
      for (const q of wrong) {
        addToErrorNotebook.mutate({
          userId: user.id,
          questionId: q.id,
          sectionId: selectedSection,
          theme: q.theme,
          studentAnswer: answers[q.id],
          sessionId,
        });
      }
    } catch {
      // Sauvegarde échouée silencieusement — l'expérience utilisateur n'est pas bloquée
    }
  }, [filteredQuestions, selectedSection, user, saveSession, saveAnswers, addToErrorNotebook]);

  const handleStartQuiz = () => {
    startedAtRef.current = new Date().toISOString();
    setPageState("quiz");
  };

  if (pageState === "quiz") {
    return (
      <QuizInterface
        title="Entraînement personnalisé"
        questions={filteredQuestions}
        timerSeconds={selectedDuration ? selectedDuration * 60 : null}
        immediateCorrection={false}
        onFinish={handleFinish}
      />
    );
  }

  if (pageState === "done") {
    return (
      <CorrectionView
        questions={filteredQuestions}
        answers={finalAnswers}
        showScoreSummary={true}
        onBack={() => setPageState("config")}
      />
    );
  }

  return (
    <div className="p-6 py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Entraînement</h1>
        <p className="text-sm text-muted-foreground mt-1">Génère un entraînement sur mesure</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-5">
        {/* Sous-test */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sous-test</div>
          <div className="flex flex-wrap gap-2">
            {scoredSections.map(s => (
              <Chip
                key={s.id}
                label={s.shortLabel}
                active={selectedSection === s.id}
                onClick={() => {
                  setSelectedSection(s.id);
                  setSelectedThemes(new Set());
                }}
              />
            ))}
          </div>
        </div>

        {/* Thèmes */}
        {!isLoading && availableThemes.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Thèmes <span className="font-normal">(optionnel — tous par défaut)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableThemes.map(t => (
                <Chip
                  key={t}
                  label={t}
                  active={selectedThemes.has(t)}
                  onClick={() => setSelectedThemes(toggleSet(selectedThemes, t))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Difficulté */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Difficulté <span className="font-normal">(optionnel — toutes par défaut)</span>
          </div>
          <div className="flex gap-2">
            {difficulties.map(d => (
              <Chip
                key={d}
                label={d}
                active={selectedDifficulties.has(d)}
                onClick={() => setSelectedDifficulties(toggleSet(selectedDifficulties, d))}
              />
            ))}
          </div>
        </div>

        {/* Durée */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" /> Durée
          </div>
          <div className="flex gap-2">
            {durations.map(d => (
              <Chip
                key={d.label}
                label={d.label}
                active={selectedDuration === d.value}
                onClick={() => setSelectedDuration(d.value)}
              />
            ))}
          </div>
        </div>

        {/* Nombre de questions */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nombre de questions</div>
          <div className="flex gap-2">
            {questionCounts.map(n => (
              <Chip key={n} label={n} active={questionCount === n} onClick={() => setQuestionCount(n)} />
            ))}
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-muted/50 rounded-xl px-4 py-3 text-sm text-muted-foreground">
          {isLoading ? (
            <span className="flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Chargement des questions…</span>
          ) : (
            <>
              {filteredQuestions.length} question{filteredQuestions.length > 1 ? "s" : ""} disponibles
              {selectedThemes.size > 0 && ` · ${Array.from(selectedThemes).join(", ")}`}
              {selectedDifficulties.size > 0 && ` · ${Array.from(selectedDifficulties).join(", ")}`}
              {selectedDuration !== null && ` · ${selectedDuration} min`}
            </>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => filteredQuestions.length > 0 && handleStartQuiz()}
          disabled={filteredQuestions.length === 0 || isLoading}
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2",
            filteredQuestions.length > 0 && !isLoading
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <Zap className="w-4 h-4" /> Lancer l'entraînement
        </button>
      </div>
    </div>
  );
}
