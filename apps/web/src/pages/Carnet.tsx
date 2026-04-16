import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { QuizInterface } from "@/components/QuizInterface";
import { CorrectionView } from "@/components/CorrectionView";
import { scoredSections } from "@/data/sections";
import { useErrorNotebook, useUpdateErrorStatus } from "@/lib/queries/error-notebook";
import { useAuth } from "@/lib/auth";
import type { Question } from "@/data/questions";

const questionCounts = ["5", "10", "15", "Illimité"] as const;
const timerOptions = ["30s", "1 min", "1min30", "2 min"] as const;

type PageState = "config" | "quiz" | "done";

export default function Carnet() {
  const { user } = useAuth();
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [questionCount, setQuestionCount] = useState("5");
  const [chronoEnabled, setChronoEnabled] = useState(false);
  const [chronoDuration, setChronoDuration] = useState("1 min");
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [pageState, setPageState] = useState<PageState>("config");
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  const { data: entries, isLoading } = useErrorNotebook(user?.id);
  const updateStatus = useUpdateErrorStatus();

  const toggleSection = (id: string) => {
    setSelectedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of entries ?? []) counts[e.section_id] = (counts[e.section_id] ?? 0) + 1;
    return counts;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return (entries ?? []).filter(e => {
      if (selectedSections.size > 0 && !selectedSections.has(e.section_id)) return false;
      return e.question !== null;
    });
  }, [entries, selectedSections]);

  const sessionQuestions = useMemo(() => {
    const limit = questionCount === "Illimité" ? 999 : parseInt(questionCount);
    return filteredEntries.slice(0, limit).map(e => e.question!);
  }, [filteredEntries, questionCount]);

  const timerSeconds = chronoEnabled
    ? sessionQuestions.length * (
        chronoDuration === "30s" ? 30
        : chronoDuration === "1 min" ? 60
        : chronoDuration === "1min30" ? 90
        : 120
      )
    : null;

  const handleFinish = useCallback((answers: Record<string, string>) => {
    setFinalAnswers(answers);
    setPageState("done");
    window.scrollTo(0, 0);

    // Mettre à jour le statut des questions réussies
    if (!user) return;
    for (const q of quizQuestions) {
      const entry = (entries ?? []).find(e => e.question_id === q.id);
      if (!entry) continue;
      if (answers[q.id] === q.correctAnswer) {
        const newStatus = entry.status === "a_reviser" ? "en_cours" : "maitrise";
        updateStatus.mutate({ id: entry.id, status: newStatus, userId: user.id });
      }
    }
  }, [quizQuestions, entries, user, updateStatus]);

  const handleStartQuiz = () => {
    setQuizQuestions(sessionQuestions);
    setPageState("quiz");
  };

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm border transition-colors min-h-[44px] flex items-center",
        active
          ? "bg-primary/10 text-primary border-primary font-medium"
          : "text-muted-foreground border-border hover:border-primary/50"
      )}
    >
      {label}
    </button>
  );

  if (pageState === "quiz") {
    return (
      <QuizInterface
        title="Révision — Carnet d'erreurs"
        questions={quizQuestions}
        timerSeconds={timerSeconds}
        immediateCorrection={true}
        onFinish={handleFinish}
      />
    );
  }

  if (pageState === "done") {
    return (
      <CorrectionView
        questions={quizQuestions}
        answers={finalAnswers}
        showScoreSummary={true}
        onBack={() => setPageState("config")}
      />
    );
  }

  const totalEntries = entries?.length ?? 0;
  const toRevise = (entries ?? []).filter(e => e.status === "a_reviser").length;
  const inProgress = (entries ?? []).filter(e => e.status === "en_cours").length;
  const mastered = (entries ?? []).filter(e => e.status === "maitrise").length;

  const statusLabel: Record<string, string> = {
    a_reviser: "à réviser",
    en_cours: "en cours",
    maitrise: "maîtrisé",
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Carnet d'erreurs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Chargement…" : `${totalEntries} erreurs enregistrées`}
          </p>
        </div>
        {toRevise > 0 && (
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold">
            <RotateCcw className="w-4 h-4" />
            {toRevise} à réviser
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !totalEntries ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Ton carnet d'erreurs est vide. Les mauvaises réponses lors des quizs apparaîtront ici.
        </div>
      ) : (
        <div className="flex gap-5">
          {/* Left: Session generator */}
          <div className="flex-1 min-w-0 bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="text-sm font-bold">Générer une session de révision</h2>

            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sous-test</div>
              <div className="flex flex-wrap gap-2">
                {scoredSections.map(s => {
                  const cnt = sectionCounts[s.id] ?? 0;
                  return (
                    <Chip
                      key={s.id}
                      label={`${s.shortLabel} (${cnt})`}
                      active={selectedSections.has(s.id)}
                      onClick={() => toggleSection(s.id)}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nombre de questions</div>
              <div className="flex gap-2">
                {questionCounts.map(n => (
                  <Chip key={n} label={n} active={questionCount === n} onClick={() => setQuestionCount(n)} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chrono par question</div>
                <Switch checked={chronoEnabled} onCheckedChange={setChronoEnabled} />
              </div>
              {chronoEnabled && (
                <div className="flex gap-2">
                  {timerOptions.map(t => (
                    <Chip key={t} label={t} active={chronoDuration === t} onClick={() => setChronoDuration(t)} />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-muted/50 rounded-xl px-4 py-3 text-sm text-muted-foreground">
              {sessionQuestions.length} question{sessionQuestions.length > 1 ? "s" : ""} disponibles
              {selectedSections.size > 0 && ` · ${Array.from(selectedSections).map(s => scoredSections.find(sec => sec.id === s)?.shortLabel).join(", ")}`}
              {chronoEnabled && ` · Chrono ${chronoDuration}`}
            </div>

            <Button className="w-full" onClick={handleStartQuiz} disabled={sessionQuestions.length === 0}>
              <RotateCcw className="w-4 h-4 mr-2" /> Lancer la révision
            </Button>
          </div>

          {/* Right: Stats */}
          <div className="w-[280px] shrink-0 space-y-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="text-sm font-bold">Résumé</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-foreground">{totalEntries}</div>
                  <div className="text-[11px] text-muted-foreground">Erreurs totales</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary">{toRevise}</div>
                  <div className="text-[11px] text-muted-foreground">À réviser</div>
                </div>
                <div className="bg-success/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-success">{mastered}</div>
                  <div className="text-[11px] text-muted-foreground">Maîtrisées</div>
                </div>
                <div className="bg-warning/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-warning">{inProgress}</div>
                  <div className="text-[11px] text-muted-foreground">En cours</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/30 rounded-xl px-4 py-3 border border-border">
              <span className="font-medium">Répétition espacée :</span> Une erreur revient jusqu'à être maîtrisée.
            </div>
          </div>
        </div>
      )}

      {/* Toggle all errors */}
      {!isLoading && totalEntries > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowAllErrors(!showAllErrors)}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 min-h-[44px]"
          >
            {showAllErrors ? "Masquer toutes mes erreurs" : "Voir toutes mes erreurs"} ({totalEntries})
          </button>

          {showAllErrors && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 overflow-hidden"
            >
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Question</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sous-test</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thème</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(entries ?? []).map(e => (
                      <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 max-w-[240px] truncate text-xs">{e.question?.text ?? "—"}</td>
                        <td className="px-4 py-2.5 text-xs">{scoredSections.find(s => s.id === e.section_id)?.shortLabel ?? e.section_id}</td>
                        <td className="px-4 py-2.5 text-xs">{e.theme ?? "—"}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-medium",
                            e.status === "a_reviser" ? "bg-primary/10 text-primary" :
                            e.status === "en_cours" ? "bg-warning/10 text-warning" :
                            "bg-success/10 text-success"
                          )}>
                            {statusLabel[e.status] ?? e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
