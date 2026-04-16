import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Settings, Trophy, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type Operation = "addition" | "soustraction" | "multiplication" | "mixte";
type Difficulty = "facile" | "moyen" | "difficile";
type Duration = 60 | 120 | 300;
type Phase = "config" | "session" | "result";

const opChips: { label: string; value: Operation }[] = [
  { label: "Addition", value: "addition" },
  { label: "Soustraction", value: "soustraction" },
  { label: "Multiplication", value: "multiplication" },
  { label: "Mixte", value: "mixte" },
];
const diffChips: { label: string; value: Difficulty }[] = [
  { label: "Facile", value: "facile" },
  { label: "Moyen", value: "moyen" },
  { label: "Difficile", value: "difficile" },
];
const durationChips: { label: string; value: Duration }[] = [
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "5 min", value: 300 },
];

const ranges: Record<Difficulty, [number, number]> = {
  facile: [1, 20],
  moyen: [10, 100],
  difficile: [50, 500],
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(op: Operation, diff: Difficulty) {
  const [min, max] = ranges[diff];
  let type = op;
  if (op === "mixte") {
    const ops: Operation[] = ["addition", "soustraction", "multiplication"];
    type = ops[Math.floor(Math.random() * 3)];
  }
  let a: number, b: number, answer: number, symbol: string;
  if (type === "multiplication") {
    const mRanges: Record<Difficulty, [number, number]> = {
      facile: [2, 12],
      moyen: [5, 20],
      difficile: [10, 30],
    };
    const [mMin, mMax] = mRanges[diff];
    a = rand(mMin, mMax);
    b = rand(mMin, mMax);
    answer = a * b;
    symbol = "×";
  } else if (type === "soustraction") {
    a = rand(min, max);
    b = rand(min, a);
    answer = a - b;
    symbol = "−";
  } else {
    a = rand(min, max);
    b = rand(min, max);
    answer = a + b;
    symbol = "+";
  }
  return { a, b, answer, symbol, display: `${a} ${symbol} ${b} = ?` };
}

const pseudos = ["MathKing", "CalcMaster", "SpeedCalc", "NumberNinja", "QuickMaths", "BrainPower", "FastFingers", "MentalAce", "CalcWiz"];

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 11) % 2147483647; return s / 2147483647; };
}

function generateLeaderboard(op: Operation, diff: Difficulty, dur: Duration) {
  const seed = op.length * 100 + diff.length * 10 + dur;
  const rng = seededRandom(seed);
  const baseScore = dur === 60 ? 12 : dur === 120 ? 22 : 40;
  const diffMult = diff === "facile" ? 1.3 : diff === "moyen" ? 1 : 0.8;
  const topScore = Math.round(baseScore * diffMult + rng() * 8);
  const userScore = Math.round(topScore * (0.6 + rng() * 0.2));
  const entries = pseudos.map((p, i) => ({
    rank: i + 1,
    pseudo: p,
    score: Math.max(1, Math.round(topScore - i * (topScore / 12) - rng() * 2)),
    isUser: false,
  }));
  const userRank = 2 + Math.floor(rng() * 3);
  entries.splice(userRank, 0, { rank: userRank + 1, pseudo: "Thomas L. (toi)", score: userScore, isUser: true });
  return entries.slice(0, 10).map((e, i) => ({ ...e, rank: i + 1 }));
}

export default function CalculMental() {
  const [phase, setPhase] = useState<Phase>("config");
  const [operation, setOperation] = useState<Operation>("multiplication");
  const [difficulty, setDifficulty] = useState<Difficulty>("moyen");
  const [duration, setDuration] = useState<Duration>(120);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState<ReturnType<typeof generateProblem> | null>(null);
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState<"correct" | "incorrect" | null>(null);
  const [shownAnswer, setShownAnswer] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem(operation, difficulty));
    setInput("");
    setShownAnswer(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [operation, difficulty]);

  const startSession = () => {
    setPhase("session");
    setScore(0);
    setTimeLeft(duration);
    nextProblem();
  };

  // Timer with visibility change pause
  useEffect(() => {
    if (phase !== "session") return;

    const handleVisibility = () => {
      if (document.hidden && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      } else if (!document.hidden && !timerRef.current) {
        timerRef.current = setInterval(() => {
          setTimeLeft(t => {
            if (t <= 1) { clearInterval(timerRef.current!); timerRef.current = null; setPhase("result"); return 0; }
            return t - 1;
          });
        }, 1000);
      }
    };

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); timerRef.current = null; setPhase("result"); return 0; }
        return t - 1;
      });
    }, 1000);

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "session") setTimeout(() => inputRef.current?.focus(), 100);
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || phase !== "session") return;
    const val = parseInt(input);
    if (val === problem.answer) {
      setFlash("correct");
      setScore(s => s + 1);
      setTimeout(() => { setFlash(null); nextProblem(); }, 300);
    } else {
      setFlash("incorrect");
      setShownAnswer(problem.answer);
      setTimeout(() => { setFlash(null); nextProblem(); }, 1000);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

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
    >{label}</button>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {phase === "config" && (
          <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-xl font-bold mb-1">Calcul mental</h1>
            <p className="text-sm text-muted-foreground mb-8">Entraîne ta vitesse de calcul</p>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Type d'opération</label>
                <div className="flex flex-wrap gap-2">
                  {opChips.map(c => <Chip key={c.value} label={c.label} active={operation === c.value} onClick={() => setOperation(c.value)} />)}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Difficulté</label>
                <div className="flex flex-wrap gap-2">
                  {diffChips.map(c => <Chip key={c.value} label={c.label} active={difficulty === c.value} onClick={() => setDifficulty(c.value)} />)}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Durée</label>
                <div className="flex flex-wrap gap-2">
                  {durationChips.map(c => <Chip key={c.value} label={c.label} active={duration === c.value} onClick={() => setDuration(c.value)} />)}
                </div>
              </div>

              <button onClick={startSession} className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-2.5 font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors min-h-[44px]">
                <Play className="w-4 h-4" /> Lancer
              </button>
            </div>

            {/* Leaderboard */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold">Classement — {opChips.find(o => o.value === operation)?.label} {diffChips.find(d => d.value === difficulty)?.label}, {durationChips.find(d => d.value === duration)?.label}</h2>
              </div>
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Pseudo</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generateLeaderboard(operation, difficulty, duration).map(e => (
                      <TableRow key={e.rank} className={cn(e.isUser && "bg-primary/5")}>
                        <TableCell className="font-medium">{e.rank}</TableCell>
                        <TableCell>{e.pseudo}</TableCell>
                        <TableCell className="text-right font-bold">{e.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "session" && (
          <motion.div key="session" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center pt-8">
            <div className="flex items-center justify-between w-full mb-8">
              <span className="text-sm font-medium text-muted-foreground">{score} bonnes réponses</span>
              <span className="text-4xl font-bold font-mono">{formatTime(timeLeft)}</span>
            </div>

            <div
              className={cn(
                "w-full rounded-xl border p-12 flex flex-col items-center transition-colors duration-300",
                flash === "correct" ? "bg-success/10 border-success dark:bg-success/5" : flash === "incorrect" ? "bg-destructive/10 border-destructive dark:bg-destructive/5" : "bg-card border-border"
              )}
            >
              {shownAnswer !== null ? (
                <div className="text-center">
                  <div className="text-3xl font-bold text-destructive mb-2 flex items-center gap-2 justify-center">
                    <X className="w-6 h-6" />
                    {problem?.display.replace("?", String(shownAnswer))}
                  </div>
                  <span className="text-sm text-muted-foreground">Bonne réponse</span>
                </div>
              ) : (
                <>
                  <div className="text-5xl font-bold mb-8">{problem?.display}</div>
                  <form onSubmit={handleSubmit}>
                    <label className="sr-only" htmlFor="calc-input">Réponse</label>
                    <input
                      id="calc-input"
                      ref={inputRef}
                      type="number"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      className="text-3xl text-center w-48 border-b-2 border-primary bg-transparent outline-none font-bold py-2 focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      autoFocus
                    />
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex flex-col items-center pt-12">
            <div className="text-6xl font-bold text-primary mb-2">{score}</div>
            <div className="text-lg text-muted-foreground mb-1">bonnes réponses</div>
            <div className="text-sm text-muted-foreground mb-6">
              en {durationChips.find(d => d.value === duration)?.label} — {opChips.find(o => o.value === operation)?.label} — {diffChips.find(d => d.value === difficulty)?.label}
            </div>
            <div className="text-sm text-muted-foreground mb-8">Ton record sur cette catégorie : 21</div>

            <div className="flex gap-3">
              <button onClick={startSession} className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-6 py-2.5 font-medium hover:bg-primary/90 transition-colors min-h-[44px]">
                <RotateCcw className="w-4 h-4" /> Rejouer
              </button>
              <button onClick={() => setPhase("config")} className="flex items-center gap-2 border border-border rounded-lg px-6 py-2.5 font-medium hover:bg-muted transition-colors min-h-[44px]">
                <Settings className="w-4 h-4" /> Paramètres
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
