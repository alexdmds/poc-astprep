import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Play, Zap, Timer } from "lucide-react";
import { scoredSections } from "@/data/sections";
import { themesBySection } from "@/data/stats";
import { cn } from "@/lib/utils";
import { QuizInterface } from "@/components/QuizInterface";
import { CorrectionView } from "@/components/CorrectionView";
import { calculQuestions, drillQuestions } from "@/data/questions";

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

  const toggleSet = (set: Set<string>, val: string) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    return next;
  };

  const availableThemes = (themesBySection[selectedSection] || []).map(t => t.name);

  const allQuestions = [...calculQuestions, ...drillQuestions];
  const filteredQuestions = allQuestions
    .filter(q => {
      if (q.section !== selectedSection) return false;
      if (selectedThemes.size > 0 && !selectedThemes.has(q.theme)) return false;
      if (selectedDifficulties.size > 0 && !selectedDifficulties.has(q.difficulty)) return false;
      return true;
    })
    .slice(0, questionCount === "Illimité" ? 999 : parseInt(questionCount));

  const handleFinish = useCallback((answers: Record<string, string>) => {
    setFinalAnswers(answers);
    setPageState("done");
    window.scrollTo(0, 0);
  }, []);

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
        {availableThemes.length > 0 && (
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
          {filteredQuestions.length} question{filteredQuestions.length > 1 ? "s" : ""} disponibles
          {selectedThemes.size > 0 && ` · ${Array.from(selectedThemes).join(", ")}`}
          {selectedDifficulties.size > 0 && ` · ${Array.from(selectedDifficulties).join(", ")}`}
          {selectedDuration !== null && ` · ${selectedDuration} min`}
          {selectedDuration === null && ""}
        </div>

        {/* CTA */}
        <button
          onClick={() => filteredQuestions.length > 0 && setPageState("quiz")}
          disabled={filteredQuestions.length === 0}
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2",
            filteredQuestions.length > 0
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
