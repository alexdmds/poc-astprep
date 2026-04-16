import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Calculator } from "lucide-react";

const QUESTIONS = [
  {
    text: "Un article coûte 120 €. Après une hausse de 15 % puis une baisse de 10 %, quel est le prix final ?",
    choices: ["124,20 €", "126,00 €", "120,00 €", "123,00 €"],
    correct: 0,
    explanation: "120 × 1,15 = 138. Puis 138 × 0,90 = 124,20 €.",
  },
  {
    text: "Quelle est la fraction irréductible de 36/48 ?",
    choices: ["3/4", "9/12", "6/8", "12/16"],
    correct: 0,
    explanation: "PGCD(36, 48) = 12. Donc 36/48 = 3/4.",
  },
  {
    text: "Un sac contient 3 boules rouges et 7 bleues. Probabilité de tirer 2 rouges sans remise ?",
    choices: ["1/15", "3/10", "1/5", "9/100"],
    correct: 0,
    explanation: "P = (3/10) × (2/9) = 6/90 = 1/15.",
  },
  {
    text: "De combien de façons peut-on choisir 3 personnes parmi 8 ?",
    choices: ["56", "336", "24", "120"],
    correct: 0,
    explanation: "C(8,3) = 8!/(3!×5!) = 56.",
  },
  {
    text: "Le prix d'un article passe de 80 € à 100 €. Pourcentage d'augmentation ?",
    choices: ["25 %", "20 %", "15 %", "30 %"],
    correct: 0,
    explanation: "(100-80)/80 × 100 = 25 %.",
  },
];

export default function BienvenueExercice() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[current];
  const isCorrect = answered !== null && answered === q.correct;

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === q.correct) setCorrectCount(c => c + 1);
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
      setAnswered(null);
    } else {
      setDone(true);
    }
  };

  const handleFinish = () => {
    localStorage.setItem("bienvenue-step", "discord");
    navigate("/bienvenue/discord");
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Calculator className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Premier exercice terminé !</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {correctCount}/{QUESTIONS.length} bonnes réponses — {correctCount >= 4 ? "Excellent début !" : correctCount >= 3 ? "Bien joué !" : "C'est un bon départ, on va progresser ensemble."}
          </p>
        </div>
        <Button onClick={handleFinish} className="w-full py-3 text-base">
          Continuer →
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <Calculator className="w-3.5 h-3.5" /> Calcul · Niveau Facile
        </div>
        <h1 className="text-xl font-bold">Ton premier exercice</h1>
        <p className="text-sm text-muted-foreground mt-1">5 questions de calcul pour te familiariser avec l'interface</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground font-medium">{current + 1}/{QUESTIONS.length}</span>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold leading-relaxed">{q.text}</h2>
        <div className="space-y-2">
          {q.choices.map((choice, idx) => {
            const isSelected = answered === idx;
            const isCorrectChoice = idx === q.correct;
            const showCorrection = answered !== null;
            const isWrong = showCorrection && isSelected && !isCorrectChoice;
            const isRight = showCorrection && isCorrectChoice;

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={answered !== null}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all text-sm",
                  isRight ? "border-success bg-success/5" :
                  isWrong ? "border-destructive bg-destructive/5" :
                  isSelected ? "border-primary bg-primary/5" :
                  "border-border hover:border-primary/30 hover:bg-muted/50"
                )}
              >
                <span className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0",
                  isRight ? "bg-success text-success-foreground" :
                  isWrong ? "bg-destructive text-destructive-foreground" :
                  isSelected ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground"
                )}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{choice}</span>
                {isRight && <Check className="w-4 h-4 text-success" />}
                {isWrong && <X className="w-4 h-4 text-destructive" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Correction */}
      {answered !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className={cn("p-4 rounded-xl border", isCorrect ? "bg-success/5 border-success/30" : "bg-destructive/5 border-destructive/30")}>
            <div className={cn("text-sm font-bold mb-1 flex items-center gap-1", isCorrect ? "text-success" : "text-destructive")}>
              {isCorrect ? <><Check className="w-4 h-4" /> Bonne réponse !</> : <><X className="w-4 h-4" /> Mauvaise réponse</>}
            </div>
            <p className="text-sm text-muted-foreground">{q.explanation}</p>
          </div>
          <Button onClick={handleNext} className="w-full">
            {current < QUESTIONS.length - 1 ? "Question suivante" : "Voir les résultats"}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
