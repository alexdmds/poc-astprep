import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, HelpCircle, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const testQuestions = [
  { text: "The manager _____ the report before the meeting.", choices: ["had completed","has completed","completing","complete"], correct: 0, part: 5 },
  { text: "All employees must _____ their badges.", choices: ["wear","wore","wearing","to wear"], correct: 0, part: 5 },
  { text: "She has been here _____ five years.", choices: ["for","since","during","from"], correct: 0, part: 5 },
  { text: "The new policy _____ into effect next month.", choices: ["goes","go","going","went"], correct: 0, part: 5 },
  { text: "He is responsible _____ managing the budget.", choices: ["for","of","with","about"], correct: 0, part: 5 },
  { text: "The conference _____ postponed due to weather.", choices: ["was","is","been","being"], correct: 0, part: 7 },
  { text: "Please _____ the attached document.", choices: ["review","reviewing","reviewed","reviews"], correct: 0, part: 7 },
  { text: "They have _____ finished the renovation.", choices: ["already","yet","still","just"], correct: 0, part: 7 },
  { text: "[Listening] What does the speaker say about the schedule?", choices: ["It changed","It's the same","It's cancelled","It's delayed"], correct: 0, part: 2 },
  { text: "[Listening] Where is this announcement taking place?", choices: ["Airport","Office","Restaurant","Hospital"], correct: 0, part: 2 },
];

export default function ToeicBienvenueNiveau() {
  const navigate = useNavigate();
  const [choice, setChoice] = useState<"known" | "test" | null>(null);
  const [score, setScore] = useState([600]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (choice !== "test" || generating) return;
    if (timeLeft <= 0) {
      toast("Temps écoulé, soumission automatique");
      startGeneration();
      return;
    }
    const i = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(i);
  }, [choice, timeLeft, generating]);

  const startGeneration = () => {
    setGenerating(true);
    setTimeout(() => {
      localStorage.setItem("toeic-bienvenue-step", "discord");
      navigate("/toeic/bienvenue/discord");
    }, 3000);
  };

  const handleSkip = () => {
    localStorage.setItem("toeic-level", "B1");
    localStorage.setItem("toeic-bienvenue-step", "discord");
    navigate("/toeic/bienvenue/discord");
  };

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (current < testQuestions.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 300);
    } else {
      startGeneration();
    }
  };

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
        <p className="text-sm text-muted-foreground">Création de ton parcours personnalisé...</p>
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-sky-500 rounded-full" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3 }} />
        </div>
      </div>
    );
  }

  if (!choice) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <button onClick={handleSkip} className="text-xs text-muted-foreground underline">Skip</button>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold">Tu connais déjà ton niveau ?</h1>
          <p className="text-sm text-muted-foreground mt-1">On adapte ton parcours à ton niveau actuel</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setChoice("known")} className="text-left p-5 rounded-xl border border-border bg-card hover:border-sky-500/50 transition-all">
            <CheckCircle className="w-8 h-8 text-success mb-3" />
            <div className="text-sm font-semibold">Oui, je l'ai</div>
            <div className="text-xs text-muted-foreground mt-1">Tu as déjà passé un TOEIC, indique ton score</div>
          </button>
          <button onClick={() => setChoice("test")} className="text-left p-5 rounded-xl border border-border bg-card hover:border-sky-500/50 transition-all">
            <HelpCircle className="w-8 h-8 text-sky-500 mb-3" />
            <div className="text-sm font-semibold">Non, fais-moi évaluer</div>
            <div className="text-xs text-muted-foreground mt-1">Un test rapide de 10 questions</div>
          </button>
        </div>
      </div>
    );
  }

  if (choice === "known") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex justify-end">
          <button onClick={handleSkip} className="text-xs text-muted-foreground underline">Skip</button>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold">Indique ton score TOEIC</h1>
        </div>
        <div className="space-y-4 pt-4">
          <div className="text-center">
            <span className="text-4xl font-bold">{score[0]}</span>
            <span className="text-lg text-muted-foreground font-normal">/990</span>
          </div>
          <Slider min={0} max={990} step={10} value={score} onValueChange={setScore} />
        </div>
        <Button onClick={() => { localStorage.setItem("toeic-current-score", String(score[0])); startGeneration(); }}
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white">Générer mon parcours</Button>
      </motion.div>
    );
  }

  // Test mode
  const q = testQuestions[current];
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-sky-500 transition-all" style={{ width: `${((current + 1) / testQuestions.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-2 ml-3">
          <span className="text-xs text-muted-foreground">{current + 1}/{testQuestions.length}</span>
          <div className={cn("flex items-center gap-1 text-sm font-mono font-semibold", timeLeft < 60 ? "text-destructive" : "text-foreground")}>
            <Clock className="w-3.5 h-3.5" /> {m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}
          </div>
        </div>
      </div>
      <button onClick={handleSkip} className="text-xs text-muted-foreground underline">Skip</button>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
          <h2 className="text-base font-semibold leading-relaxed">{q.text}</h2>
          <div className="space-y-2">
            {q.choices.map((c, i) => (
              <button key={i} onClick={() => handleAnswer(i)}
                className="w-full text-left px-4 py-3 rounded-xl border border-border bg-card hover:border-sky-500/50 transition-all text-sm">
                <span className="text-muted-foreground mr-2 font-medium">{String.fromCharCode(65 + i)})</span>{c}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
