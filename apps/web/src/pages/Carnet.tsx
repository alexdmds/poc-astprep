import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Trash2, RotateCcw, Check, X } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { QuizInterface } from "@/components/QuizInterface";
import { CorrectionView } from "@/components/CorrectionView";
import { errorEntries } from "@/data/questions";
import { scoredSections } from "@/data/sections";
import { themesBySection, errorDistribution } from "@/data/stats";

const difficulties = ["Facile", "Moyen", "Difficile"] as const;
const questionCounts = ["5", "10", "15", "Illimité"] as const;
const timerOptions = ["30s", "1 min", "1min30", "2 min"] as const;

type PageState = "config" | "quiz" | "done";

export default function Carnet() {
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set(["calcul"]));
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<string>>(new Set());
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [questionCount, setQuestionCount] = useState("5");
  const [chronoEnabled, setChronoEnabled] = useState(false);
  const [chronoDuration, setChronoDuration] = useState("1 min");
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [pageState, setPageState] = useState<PageState>("config");
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});

  const toggleSet = (set: Set<string>, val: string) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    return next;
  };

  const todayErrors = errorEntries.filter(e => e.nextReview === "Aujourd'hui");
  const availableThemes = Array.from(selectedSections).flatMap(s =>
    (themesBySection[s] || []).map(t => t.name)
  );

  const quizQuestions = errorEntries
    .filter(e => {
      if (selectedSections.size > 0 && !selectedSections.has(e.question.section)) return false;
      return true;
    })
    .slice(0, questionCount === "Illimité" ? 999 : parseInt(questionCount))
    .map(e => e.question);

  const sectionCounts: Record<string, number> = {};
  errorEntries.forEach(e => {
    const sid = e.section.toLowerCase().replace("r&a", "ra").replace("conditions", "conditions");
    sectionCounts[sid] = (sectionCounts[sid] || 0) + 1;
  });

  const summaryParts: string[] = [];
  if (quizQuestions.length > 0) summaryParts.push(`${quizQuestions.length} questions`);
  if (selectedSections.size > 0) {
    const names = Array.from(selectedSections).map(s => scoredSections.find(sec => sec.id === s)?.shortLabel || s);
    summaryParts.push(`de ${names.join(", ")}`);
  }
  if (selectedThemes.size > 0) summaryParts.push(`— ${Array.from(selectedThemes).join(" + ")}`);
  summaryParts.push(chronoEnabled ? `— Chrono ${chronoDuration}` : "— Mode sans chrono");

  const timerSeconds = chronoEnabled
    ? quizQuestions.length * (chronoDuration === "30s" ? 30 : chronoDuration === "1 min" ? 60 : chronoDuration === "1min30" ? 90 : 120)
    : null;

  const handleFinish = useCallback((answers: Record<string, string>) => {
    setFinalAnswers(answers);
    setPageState("done");
    window.scrollTo(0, 0);
  }, []);

  // Chip component
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

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Carnet d'erreurs</h1>
          <p className="text-sm text-muted-foreground mt-1">{errorEntries.length} erreurs enregistrées</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold">
          <RotateCcw className="w-4 h-4" />
          {todayErrors.length} à réviser aujourd'hui
        </div>
      </div>

      {/* Main layout: Generator left + Chart right */}
      <div className="flex gap-5">
        {/* Left: Session generator */}
        <div className="flex-1 min-w-0 bg-card rounded-xl border border-border p-5 space-y-4">
          <h2 className="text-sm font-bold">Générer une session de révision</h2>

          {/* Section chips */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sous-test</div>
            <div className="flex flex-wrap gap-2">
              {scoredSections.map(s => {
                const count = sectionCounts[s.id] || 0;
                return (
                  <Chip key={s.id} label={`${s.shortLabel} (${count})`} active={selectedSections.has(s.id)} onClick={() => setSelectedSections(toggleSet(selectedSections, s.id))} />
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Difficulté <span className="font-normal">(optionnel)</span>
            </div>
            <div className="flex gap-2">
              {difficulties.map(d => (
                <Chip key={d} label={d} active={selectedDifficulties.has(d)} onClick={() => setSelectedDifficulties(toggleSet(selectedDifficulties, d))} />
              ))}
            </div>
          </div>

          {/* Themes */}
          {availableThemes.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Thème <span className="font-normal">(optionnel)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableThemes.map(t => (
                  <Chip key={t} label={t} active={selectedThemes.has(t)} onClick={() => setSelectedThemes(toggleSet(selectedThemes, t))} />
                ))}
              </div>
            </div>
          )}

          {/* Question count */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nombre de questions</div>
            <div className="flex gap-2">
              {questionCounts.map(n => (
                <Chip key={n} label={n} active={questionCount === n} onClick={() => setQuestionCount(n)} />
              ))}
            </div>
          </div>

          {/* Timer */}
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

          {/* Summary + CTA */}
          <div className="bg-muted/50 rounded-xl px-4 py-3 text-sm text-muted-foreground">
            {summaryParts.join(" ")}
          </div>

          <Button className="w-full" onClick={() => setPageState("quiz")} disabled={quizQuestions.length === 0}>
            <RotateCcw className="w-4 h-4 mr-2" /> Lancer la révision
          </Button>
        </div>

        {/* Right: Chart + Stats */}
        <div className="w-[320px] shrink-0 space-y-5">
          {/* Error distribution chart */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="text-sm font-bold mb-4">Répartition des erreurs</div>
            <div className="w-full h-44 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={errorDistribution} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={2} strokeWidth={0}>
                    {errorDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13, background: "hsl(var(--card))" }} formatter={(v: number) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {errorDistribution.map(e => (
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                    <span className="text-foreground">{e.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${e.value}%`, background: e.color }} />
                    </div>
                    <span className="text-muted-foreground font-medium w-8 text-right">{e.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <div className="text-sm font-bold">Résumé</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-foreground">{errorEntries.length}</div>
                <div className="text-[11px] text-muted-foreground">Erreurs totales</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">{todayErrors.length}</div>
                <div className="text-[11px] text-muted-foreground">À réviser</div>
              </div>
              <div className="bg-success/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-success">{errorEntries.filter(e => e.status === "maîtrisé").length}</div>
                <div className="text-[11px] text-muted-foreground">Acquises</div>
              </div>
              <div className="bg-warning/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-warning">{errorEntries.filter(e => e.status === "en cours").length}</div>
                <div className="text-[11px] text-muted-foreground">En cours</div>
              </div>
            </div>
          </div>

          {/* Spaced repetition info */}
          <div className="text-xs text-muted-foreground bg-muted/30 rounded-xl px-4 py-3 border border-border">
            <span className="font-medium">Répétition espacée :</span> Une erreur revient après 1j. Réussie → 7j. Encore → elle sort du carnet.
          </div>
        </div>
      </div>

      {/* Toggle all errors */}
      <div className="mt-6">
        <button
          onClick={() => setShowAllErrors(!showAllErrors)}
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1 min-h-[44px]"
        >
          {showAllErrors ? "Masquer toutes mes erreurs" : "Voir toutes mes erreurs"} ({errorEntries.length})
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
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ajouté</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Révision</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {errorEntries.map(e => (
                    <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5 max-w-[200px] truncate text-xs">{e.question.text}</td>
                      <td className="px-4 py-2.5 text-xs">{e.section}</td>
                      <td className="px-4 py-2.5 text-xs">{e.theme}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{e.dateAdded}</td>
                      <td className="px-4 py-2.5 text-xs">
                        <span className={cn(
                          e.nextReview === "Aujourd'hui" ? "text-primary font-medium" : "text-muted-foreground"
                        )}>
                          {e.nextReview}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-medium",
                          e.status === "à réviser" ? "bg-primary/10 text-primary" :
                          e.status === "en cours" ? "bg-warning/10 text-warning" :
                          "bg-success/10 text-success"
                        )}>
                          {e.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <button className="text-muted-foreground hover:text-destructive transition-colors min-h-[44px] flex items-center" aria-label="Supprimer cette erreur">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
