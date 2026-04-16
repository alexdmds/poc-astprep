import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, BookOpen, Check, X, Dumbbell, MessageCircle, Flag, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Question } from "@/data/questions";

const errorCategories = ["Notion incomprise", "Piège", "Manque de temps", "Inattention", "Deviné"] as const;

interface CorrectionViewProps {
  questions: Question[];
  answers: Record<string, string>;
  showScoreSummary?: boolean;
  onBack?: () => void;
}

// Mock celebration logic
function getCelebrationMessage(correctCount: number, total: number) {
  const pct = correctCount / total;
  if (pct === 1) return { text: "Sans faute ! Tu maîtrises cette notion.", icon: "🏆" };
  if (pct >= 0.75) return { text: "Tu as battu ton score ! Bravo, continue comme ça.", icon: "🎉" };
  if (pct >= 0.5) return { text: "Bon travail ! Quelques thèmes à consolider.", icon: null };
  return null;
}

// Mock suggestions based on wrong answers
function getRecapSuggestions(questions: Question[], answers: Record<string, string>) {
  const wrongQs = questions.filter(q => answers[q.id] !== q.correctAnswer);
  const courses = [
    { label: "Probabilités conditionnelles", section: "Calcul" },
    { label: "Damiers niveau 2", section: "Logique" },
    { label: "Formules géométriques", section: "Calcul" },
  ].slice(0, Math.min(3, wrongQs.length));
  const exercises = [
    { label: `${Math.min(10, wrongQs.length)} questions Probabilités`, detail: "ton thème le plus faible" },
    { label: "Sous-test thématique Géométrie", detail: "" },
  ].slice(0, wrongQs.length > 0 ? 2 : 0);
  return { courses, exercises, hasErrors: wrongQs.length > 0 };
}

// Mock transcript for video correction
const mockTranscript = [
  "Bonjour, on corrige ensemble cette question sur les probabilités conditionnelles.",
  "L'astuce ici c'est de bien identifier l'événement conditionnel. On cherche P(A|B), pas P(A∩B).",
  "On applique la formule de Bayes : P(A|B) = P(B|A) × P(A) / P(B).",
  "Attention au piège classique : ne pas confondre P(A|B) et P(B|A). C'est l'erreur la plus fréquente.",
  "La bonne réponse est donc C. On retrouve 3/8 après simplification.",
];

export function CorrectionView({ questions, answers, showScoreSummary = true, onBack }: CorrectionViewProps) {
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const score = correctCount * 4;
  const q = questions[current];
  const studentAnswer = answers[q.id];
  const isCorrect = studentAnswer === q.correctAnswer;
  const isLastQuestion = current === questions.length - 1;
  const isFlagged = flagged.has(q.id);

  const celebration = getCelebrationMessage(correctCount, questions.length);
  const recap = getRecapSuggestions(questions, answers);

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.add(q.id);
      return next;
    });
  };

  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Celebration banner */}
      {showScoreSummary && celebration && !celebrationDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 rounded-xl p-4 mx-6 mt-6 flex items-center gap-3 cursor-pointer"
          onClick={() => setCelebrationDismissed(true)}
        >
          {celebration.icon && <span className="text-2xl">{celebration.icon}</span>}
          <span className="text-sm font-medium text-primary">{celebration.text}</span>
          <X className="w-4 h-4 text-muted-foreground ml-auto" />
        </motion.div>
      )}

      {/* Score summary */}
      {showScoreSummary && (
        <div className="bg-card border-b border-border px-6 py-6">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="text-5xl font-bold text-primary">{score}<span className="text-2xl text-muted-foreground font-normal">/60</span></div>
              <div className="text-sm text-muted-foreground mt-1">{correctCount}/{questions.length} bonnes réponses</div>
              <div className="text-xs text-muted-foreground mt-2">Moyenne ASTPrep sur ce sous-test : 37/60</div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Correction grid */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Correction</h2>
          {onBack && <Button variant="ghost" size="sm" onClick={onBack}>Retour</Button>}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {questions.map((question, i) => {
            const a = answers[question.id];
            const correct = a === question.correctAnswer;
            const unanswered = !a;
            const isCurrent = i === current;
            return (
              <button
                key={question.id}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-7 h-7 rounded-lg text-xs font-medium transition-all flex items-center justify-center",
                  isCurrent && "ring-2 ring-offset-1",
                  isCurrent && (correct ? "ring-success" : unanswered ? "ring-border" : "ring-destructive"),
                  unanswered ? "bg-muted text-muted-foreground" :
                  correct ? "bg-success/15 text-success" :
                  "bg-destructive/15 text-destructive"
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question correction */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
          >
            {/* Question header with flag */}
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Question {current + 1}/{questions.length}
              </div>
              <button
                onClick={toggleFlag}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors min-h-[44px]",
                  isFlagged
                    ? "text-warning bg-warning/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-label="Flagger cette question"
                aria-pressed={isFlagged}
              >
                <Flag className={cn("w-3.5 h-3.5", isFlagged && "fill-warning")} />
                {isFlagged ? "Flaggée" : "Flagger"}
              </button>
            </div>
            <p className="text-base font-medium leading-relaxed mb-6">{q.text}</p>

            <div className="space-y-2.5">
              {q.choices.map(c => {
                const isStudentAnswer = c.label === studentAnswer;
                const isCorrectChoice = c.label === q.correctAnswer;
                const isWrong = isStudentAnswer && !isCorrectChoice;
                const isRight = isCorrectChoice;

                return (
                  <div
                    key={c.label}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm",
                      isRight ? "border-success bg-success/5" :
                      isWrong ? "border-destructive bg-destructive/5" :
                      "border-border"
                    )}
                  >
                    <span className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0",
                      isRight ? "bg-success text-success-foreground" :
                      isWrong ? "bg-destructive text-destructive-foreground" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {c.label}
                    </span>
                    <span className="flex-1">{c.text}</span>
                    {isStudentAnswer && !isCorrectChoice && (
                      <span className="text-[10px] text-destructive font-medium">Ta réponse</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            <div className="mt-5 p-4 rounded-xl bg-muted/50 border border-border">
              <div className={cn("text-sm font-bold mb-2 flex items-center gap-1", isCorrect ? "text-success" : "text-destructive")}>
                {isCorrect ? <><Check className="w-4 h-4" /> Bonne réponse</> : <><X className="w-4 h-4" /> Mauvaise réponse</>}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
            </div>

            {/* Video correction */}
            <div className="mt-5">
              <div className="aspect-video max-w-md bg-foreground/90 rounded-xl flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                </div>
                <div className="absolute bottom-3 left-3 text-primary-foreground">
                  <div className="text-xs font-medium">Correction vidéo</div>
                  <div className="text-[10px] opacity-70">Étienne Albert · 3:45</div>
                </div>
              </div>

              {/* Transcript toggle */}
              <button
                onClick={() => setTranscriptOpen(!transcriptOpen)}
                className="flex items-center gap-2 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5" />
                Voir le transcript
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", transcriptOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {transcriptOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-muted/30 rounded-xl border border-border p-4 mt-1 space-y-2">
                      {mockTranscript.map((line, i) => (
                        <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action buttons row: Ask an Expert */}
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" className="text-xs">
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Ask an Expert
              </Button>
            </div>

            {/* Error categorization */}
            {!isCorrect && (
              <div className="mt-5">
                <div className="text-xs text-muted-foreground font-medium mb-2">Catégoriser cette erreur :</div>
                <div className="flex flex-wrap gap-1.5">
                  {errorCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategories(prev => ({ ...prev, [q.id]: cat }))}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-sm border transition-colors min-h-[44px] flex items-center",
                        categories[q.id] === cat
                          ? "bg-primary/10 text-primary border-primary font-medium"
                          : "text-muted-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" size="sm" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
                ← Précédente
              </Button>
              <Button size="sm" onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))} disabled={current === questions.length - 1}>
                Suivante →
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* End-of-session recap */}
        {isLastQuestion && recap.hasErrors && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-5 mt-8"
          >
            <h3 className="text-lg font-semibold mb-4">Pour progresser</h3>

            {recap.courses.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Cours à revoir
                </div>
                <ul className="space-y-1 ml-6">
                  {recap.courses.map(c => (
                    <li key={c.label}>
                      <a href="/cours" className="text-sm text-primary hover:underline">
                        {c.label} <span className="text-muted-foreground">({c.section})</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recap.exercises.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Dumbbell className="w-4 h-4 text-primary" />
                  Exercices suggérés
                </div>
                <ul className="space-y-1 ml-6">
                  {recap.exercises.map(e => (
                    <li key={e.label}>
                      <a href="/entrainement" className="text-sm text-primary hover:underline">
                        {e.label}
                        {e.detail && <span className="text-muted-foreground"> ({e.detail})</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
