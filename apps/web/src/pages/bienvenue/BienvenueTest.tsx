import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Calculator, Brain, Scale, PenTool, HelpCircle, Target, BookOpen, Clock } from "lucide-react";
import { toast } from "sonner";

interface Question {
  section: string;
  sectionColor: string;
  icon: React.ElementType;
  text: string;
  choices: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  // Compréhension (2)
  { section: "Compréhension", sectionColor: "bg-pink-500", icon: BookOpen,
    text: "Dans un texte argumentatif, l'auteur affirme que 'la croissance économique ne garantit pas le bien-être'. Quelle est la thèse défendue ?",
    choices: ["La croissance est nécessaire au bien-être", "Le bien-être ne dépend pas uniquement de la croissance", "La croissance est nuisible", "Le bien-être est impossible"], correct: 1 },
  { section: "Compréhension", sectionColor: "bg-pink-500", icon: BookOpen,
    text: "Un passage mentionne que 'les réseaux sociaux ont transformé la communication interpersonnelle'. Que peut-on en inférer ?",
    choices: ["Les gens communiquent moins", "Les modes de communication ont évolué", "Les réseaux sociaux sont dangereux", "La communication est devenue impossible"], correct: 1 },
  // Calcul (2)
  { section: "Calcul", sectionColor: "bg-amber-500", icon: Calculator,
    text: "Si un article coûte 80 € après une réduction de 20%, quel était le prix initial ?",
    choices: ["96 €", "100 €", "104 €", "120 €"], correct: 1 },
  { section: "Calcul", sectionColor: "bg-amber-500", icon: Calculator,
    text: "Un capital de 5 000 € est placé à 4% d'intérêts composés pendant 2 ans. Quel est le montant final ?",
    choices: ["5 408 €", "5 400 €", "5 200 €", "5 416 €"], correct: 0 },
  // R&A (2)
  { section: "R&A", sectionColor: "bg-green-500", icon: Scale,
    text: "Pierre est plus grand que Marie. Marie est plus grande que Luc. Donc :",
    choices: ["Luc est plus grand que Pierre", "Pierre est plus grand que Luc", "Marie est la plus petite", "On ne peut pas conclure"], correct: 1 },
  { section: "R&A", sectionColor: "bg-green-500", icon: Scale,
    text: "'Tous les médecins sont diplômés. Paul est diplômé.' Que peut-on conclure ?",
    choices: ["Paul est médecin", "Paul n'est pas médecin", "On ne peut rien conclure sur Paul", "Tous les diplômés sont médecins"], correct: 2 },
  // Conditions Minimales (2)
  { section: "Conditions Minimales", sectionColor: "bg-orange-500", icon: HelpCircle,
    text: "L'affirmation (1) seule permet de répondre. L'affirmation (2) seule permet de répondre. Quelle est la bonne réponse ?",
    choices: ["(1) seule suffit", "(2) seule suffit", "Les deux ensemble", "Chacune suffit", "Aucune ne suffit"], correct: 2 },
  { section: "Conditions Minimales", sectionColor: "bg-orange-500", icon: HelpCircle,
    text: "Peut-on déterminer l'âge de Marie ? (1) Marie a 3 ans de plus que Luc. (2) Luc a 25 ans.",
    choices: ["(1) seule suffit", "(2) seule suffit", "Les deux ensemble", "Chacune suffit", "Aucune ne suffit"], correct: 2 },
  // Expression (2)
  { section: "Expression", sectionColor: "bg-pink-500", icon: PenTool,
    text: "Quelle est la bonne orthographe ?",
    choices: ["Ils se sont rendus compte", "Ils se sont rendu compte", "Ils se sont rendues compte", "Ils se sont rendue compte"], correct: 1 },
  { section: "Expression", sectionColor: "bg-pink-500", icon: PenTool,
    text: "Quel mot complète : 'Il a agi _____ les consignes.'",
    choices: ["conformément à", "conformément aux", "en conformité de", "conformiste aux"], correct: 0 },
  // Logique (2)
  { section: "Logique", sectionColor: "bg-purple-500", icon: Brain,
    text: "Quel nombre complète la série : 2, 6, 18, 54, ... ?",
    choices: ["108", "162", "216", "72"], correct: 1 },
  { section: "Logique", sectionColor: "bg-purple-500", icon: Brain,
    text: "Si CHAT = 8, CHIEN = 10, alors LAPIN = ?",
    choices: ["10", "12", "14", "15"], correct: 0 },
];

const TIMER_SECONDS = 15 * 60; // 15 min

function getScoreDescription(score: number): { level: string; description: string; color: string } {
  if (score < 200) return { level: "Débutant", description: "Tu découvres le TAGE MAGE. Pas d'inquiétude, on part de zéro ensemble et on construit des bases solides.", color: "text-destructive" };
  if (score < 250) return { level: "Novice", description: "Tu as quelques notions mais il faut structurer ta prépa. On va reprendre les fondamentaux de chaque sous-test.", color: "text-destructive" };
  if (score < 300) return { level: "Intermédiaire -", description: "Tu as les bases en calcul et logique mais tu perds des points sur les sous-tests littéraires. On va équilibrer tout ça.", color: "text-warning" };
  if (score < 350) return { level: "Intermédiaire", description: "Tu as de bonnes bases en calcul et en raisonnement, mais tu peux encore progresser en expression et conditions minimales.", color: "text-warning" };
  if (score < 400) return { level: "Intermédiaire +", description: "Tu es solide sur la plupart des sous-tests. Il te manque de la régularité et de la vitesse pour passer le cap des 400.", color: "text-warning" };
  if (score < 450) return { level: "Avancé", description: "Tu es très solide en calcul et logique et tu veux perfectionner tes points faibles pour viser le top 15%.", color: "text-success" };
  if (score < 500) return { level: "Confirmé", description: "Tu maîtrises la majorité des notions. On va travailler la gestion du temps et les pièges classiques pour viser 500+.", color: "text-success" };
  if (score < 550) return { level: "Expert", description: "Tu es dans le top 5%. On va peaufiner ta stratégie et éliminer les dernières erreurs d'inattention.", color: "text-primary" };
  return { level: "Élite", description: "Score exceptionnel ! On va maintenir ce niveau et viser la perfection sur chaque sous-test.", color: "text-primary" };
}

function getSectionScores(answers: number[]) {
  const sectionMap: Record<string, { correct: number; total: number }> = {};
  QUESTIONS.forEach((q, i) => {
    if (!sectionMap[q.section]) sectionMap[q.section] = { correct: 0, total: 0 };
    sectionMap[q.section].total++;
    if (answers[i] === q.correct) sectionMap[q.section].correct++;
  });
  return Object.entries(sectionMap).map(([section, data]) => ({
    section,
    percent: Math.round((data.correct / data.total) * 100),
    correct: data.correct,
    total: data.total,
  }));
}

export default function BienvenueTest() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choice" | "test" | "slider" | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selfScore, setSelfScore] = useState<number[]>([350]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [showResults, setShowResults] = useState(false);
  const [resultScores, setResultScores] = useState<ReturnType<typeof getSectionScores>>([]);

  // Timer
  useEffect(() => {
    if (mode !== "test" || showResults) return;
    if (timeLeft <= 0) {
      toast("Temps écoulé, soumission automatique");
      finishTest([...answers]);
      return;
    }
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [mode, timeLeft, showResults]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const finishTest = useCallback((finalAnswers: number[]) => {
    // Fill missing answers with -1
    while (finalAnswers.length < QUESTIONS.length) finalAnswers.push(-1);
    const scores = getSectionScores(finalAnswers);
    setResultScores(scores);
    setShowResults(true);
    localStorage.setItem("positioning-answers", JSON.stringify(finalAnswers));
  }, []);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 300);
    } else {
      finishTest(newAnswers);
    }
  };

  // Show scores for 5s then navigate
  useEffect(() => {
    if (!showResults) return;
    const timeout = setTimeout(() => {
      localStorage.setItem("bienvenue-step", "generation");
      navigate("/bienvenue/generation");
    }, 5000);
    return () => clearTimeout(timeout);
  }, [showResults, navigate]);

  const handleSliderSubmit = () => {
    localStorage.setItem("positioning-self-score", String(selfScore[0]));
    localStorage.setItem("bienvenue-step", "generation");
    navigate("/bienvenue/generation");
  };

  // Score results screen
  if (showResults) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold">Tes résultats</h1>
          <p className="text-sm text-muted-foreground mt-1">Voici tes scores par domaine</p>
        </div>
        <div className="space-y-3">
          {resultScores.map(s => (
            <div key={s.section} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{s.section}</span>
                <span className="text-muted-foreground">{s.correct}/{s.total} ({s.percent}%)</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ background: s.percent >= 60 ? "hsl(var(--success))" : s.percent >= 40 ? "hsl(var(--warning))" : "hsl(var(--destructive))" }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center animate-pulse">Création de ton parcours en cours...</p>
      </motion.div>
    );
  }

  // Initial choice screen
  if (!mode) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <h1 className="text-xl font-bold">Où en es-tu aujourd'hui ?</h1>
          <p className="text-sm text-muted-foreground mt-1">On va calibrer ton parcours pour qu'il te corresponde.</p>
        </div>
        <div className="space-y-3">
          <button onClick={() => setMode("test")} className="w-full text-left px-5 py-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">Passer le mini-test</div>
                <div className="text-xs text-muted-foreground">12 questions · 15 minutes · 6 sous-tests</div>
              </div>
            </div>
          </button>
          <button onClick={() => setMode("slider")} className="w-full text-left px-5 py-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">Je connais déjà mon niveau</div>
                <div className="text-xs text-muted-foreground">Indique ton score estimé sur 600</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Slider self-assessment
  if (mode === "slider") {
    const desc = getScoreDescription(selfScore[0]);
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold">Estime ton niveau</h1>
          <p className="text-sm text-muted-foreground mt-1">Place le curseur sur ton score estimé au TAGE MAGE</p>
        </div>
        <div className="space-y-4 pt-4">
          <div className="text-center">
            <span className="text-4xl font-bold">{selfScore[0]}</span>
            <span className="text-lg text-muted-foreground font-normal">/600</span>
          </div>
          <Slider min={0} max={600} step={10} value={selfScore} onValueChange={setSelfScore} />
          <div className="flex justify-between text-[10px] text-muted-foreground px-1">
            <span>0</span><span>150</span><span>300</span><span>450</span><span>600</span>
          </div>
        </div>
        <motion.div key={desc.level} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-4 space-y-1">
          <div className={cn("text-sm font-bold", desc.color)}>Niveau : {desc.level}</div>
          <p className="text-xs text-muted-foreground leading-relaxed">{desc.description}</p>
        </motion.div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setMode(null)} className="flex-1">Retour</Button>
          <Button onClick={handleSliderSubmit} className="flex-1">Continuer</Button>
        </div>
      </div>
    );
  }

  // Quiz mode
  const q = QUESTIONS[current];
  if (!q) return null;
  const Icon = q.icon;

  return (
    <div className="space-y-6">
      {/* Progress + Timer */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-5 h-5 rounded flex items-center justify-center", q.sectionColor)}>
            <Icon className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">{current + 1}/{QUESTIONS.length}</span>
        </div>
      </div>

      {/* Timer */}
      <div className={cn("flex items-center gap-1.5 text-sm font-mono font-semibold justify-center", timeLeft < 60 ? "text-destructive" : "text-foreground")}>
        <Clock className="w-4 h-4" />
        {formatTime(timeLeft)}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{q.section}</div>
          <h2 className="text-base font-semibold leading-relaxed">{q.text}</h2>
          <div className="space-y-2">
            {q.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
              >
                <span className="text-muted-foreground mr-2 font-medium">{String.fromCharCode(65 + idx)})</span>
                {choice}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
