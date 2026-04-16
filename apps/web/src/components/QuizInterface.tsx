import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, ChevronLeft, ChevronRight, Clock, AlertTriangle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Question } from "@/data/questions";

interface QuizInterfaceProps {
  title: string;
  questions: Question[];
  timerSeconds?: number | null; // null = no timer
  immediateCorrection?: boolean; // true for carnet, false for test
  onFinish: (answers: Record<string, string>, flagged: Set<string>) => void;
}

export function QuizInterface({ title, questions, timerSeconds = null, immediateCorrection = false, onFinish }: QuizInterfaceProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);
  const [correctedCurrent, setCorrectedCurrent] = useState(false);

  const q = questions[current];
  const totalQuestions = questions.length;

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          onFinish(answers, flagged);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, answers, flagged, onFinish]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (label: string) => {
    if (immediateCorrection && correctedCurrent) return;
    setAnswers(prev => ({ ...prev, [q.id]: label }));
    if (immediateCorrection) {
      setCorrectedCurrent(true);
    }
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.add(q.id);
      return next;
    });
  };

  const goTo = (idx: number) => {
    setCurrent(idx);
    setCorrectedCurrent(false);
  };

  const goNext = () => {
    if (current < totalQuestions - 1) {
      setCurrent(current + 1);
      setCorrectedCurrent(false);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setCorrectedCurrent(false);
    }
  };

  const handleSubmit = () => {
    const unanswered = questions.filter(q => !answers[q.id]).length;
    if (unanswered > 0 && !showSubmitWarning) {
      setShowSubmitWarning(true);
      return;
    }
    onFinish(answers, flagged);
  };

  const isCorrect = immediateCorrection && correctedCurrent ? answers[q.id] === q.correctAnswer : null;

  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          {timeLeft !== null && timeLeft > 0 && (
            <div className={cn("flex items-center gap-1.5 text-sm font-mono font-semibold", timeLeft < 60 ? "text-destructive" : "text-foreground")}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        {/* Question grid */}
        <div className="flex gap-1.5 flex-wrap">
          {questions.map((question, i) => {
            const answered = !!answers[question.id];
            const isFlagged = flagged.has(question.id);
            const isCurrent = i === current;
            return (
              <button
                key={question.id}
                onClick={() => goTo(i)}
                className={cn(
                  "w-7 h-7 rounded-lg text-xs font-medium transition-all flex items-center justify-center",
                  isCurrent && "ring-2 ring-primary ring-offset-1",
                  isFlagged ? "bg-warning/20 text-warning" :
                  answered ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
          >
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
              Question {current + 1}/{totalQuestions}
            </div>
            <p className="text-base font-medium leading-relaxed mb-6">{q.text}</p>

            <div className="space-y-2.5">
              {q.choices.map(c => {
                const selected = answers[q.id] === c.label;
                const showCorrection = immediateCorrection && correctedCurrent;
                const isCorrectChoice = c.label === q.correctAnswer;
                const isWrong = showCorrection && selected && !isCorrectChoice;
                const isRight = showCorrection && isCorrectChoice;

                return (
                  <button
                    key={c.label}
                    onClick={() => handleAnswer(c.label)}
                    disabled={showCorrection}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all text-sm",
                      isRight ? "border-success bg-success/5" :
                      isWrong ? "border-destructive bg-destructive/5" :
                      selected ? "border-primary bg-primary-surface" :
                      "border-border hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <span className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0",
                      isRight ? "bg-success text-success-foreground" :
                      isWrong ? "bg-destructive text-destructive-foreground" :
                      selected ? "bg-primary text-primary-foreground" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {c.label}
                    </span>
                    <span className="flex-1">{c.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Immediate correction explanation */}
            {immediateCorrection && correctedCurrent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 rounded-xl bg-muted/50 border border-border"
              >
                <div className={cn("text-sm font-bold mb-2 flex items-center gap-1", isCorrect ? "text-success" : "text-destructive")}>
                  {isCorrect ? <><Check className="w-4 h-4" /> Bonne réponse !</> : <><X className="w-4 h-4" /> Mauvaise réponse</>}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={goPrev} disabled={current === 0}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Précédente
                </Button>
                {!immediateCorrection && (
                  <Button variant="ghost" size="sm" onClick={toggleFlag} className={cn(flagged.has(q.id) && "text-warning")}>
                    <Flag className="w-4 h-4 mr-1" /> {flagged.has(q.id) ? "Flaggé" : "Flagger"}
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {current < totalQuestions - 1 ? (
                  <Button size="sm" onClick={goNext}>
                    Suivante <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : !immediateCorrection ? (
                  <Button size="sm" onClick={handleSubmit}>
                    Soumettre le test
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => onFinish(answers, flagged)}>
                    Terminer la révision
                  </Button>
                )}
              </div>
            </div>

            {/* Submit warning */}
            {showSubmitWarning && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-xl bg-warning/10 border border-warning/30 flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                <div className="flex-1 text-sm">
                  <span className="font-medium">{questions.filter(q => !answers[q.id]).length} question(s) sans réponse.</span>{" "}
                  Soumettre quand même ?
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowSubmitWarning(false)}>Annuler</Button>
                <Button size="sm" onClick={() => onFinish(answers, flagged)}>Confirmer</Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
