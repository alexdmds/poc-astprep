import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Settings, Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type LetterCount = 1 | 2 | 3;
type Duration = 120 | 300 | 600;
type Phase = "config" | "session" | "result";

const letterChips: { label: string; value: LetterCount }[] = [
  { label: "1 lettre", value: 1 },
  { label: "2 lettres", value: 2 },
  { label: "3 lettres", value: 3 },
];
const durationChips: { label: string; value: Duration }[] = [
  { label: "2 min", value: 120 },
  { label: "5 min", value: 300 },
  { label: "10 min", value: 600 },
];

function randLetters(count: LetterCount): { letters: string[]; answers: number[] } {
  const letters: string[] = [];
  const answers: number[] = [];
  for (let i = 0; i < count; i++) {
    const code = Math.floor(Math.random() * 26);
    letters.push(String.fromCharCode(65 + code));
    answers.push(code + 1);
  }
  return { letters, answers };
}

const pseudos = ["AlphaSpeed", "LetterPro", "ABCMaster", "RangKing", "AlphaWhiz", "QuickLetter", "CodeBreaker", "LetterDash", "AlphaRun"];

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 11) % 2147483647; return s / 2147483647; };
}

function generateLeaderboard(count: LetterCount, dur: Duration) {
  const seed = count * 1000 + dur;
  const rng = seededRandom(seed);
  const baseScore = dur === 120 ? 18 : dur === 300 ? 35 : 60;
  const countMult = count === 1 ? 1.2 : count === 2 ? 1 : 0.8;
  const topScore = Math.round(baseScore * countMult + rng() * 8);
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

export default function LectureAlphabetique() {
  const [phase, setPhase] = useState<Phase>("config");
  const [letterCount, setLetterCount] = useState<LetterCount>(1);
  const [duration, setDuration] = useState<Duration>(300);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState<{ letters: string[]; answers: number[] } | null>(null);
  const [inputs, setInputs] = useState<string[]>([]);
  const [flash, setFlash] = useState<"correct" | "incorrect" | null>(null);
  const [shownAnswers, setShownAnswers] = useState<number[] | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    const prob = randLetters(letterCount);
    setCurrent(prob);
    setInputs(Array(letterCount).fill(""));
    setShownAnswers(null);
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }, [letterCount]);

  const startSession = () => {
    setPhase("session");
    setScore(0);
    setTimeLeft(duration);
    next();
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
    if (phase === "session") setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || phase !== "session") return;
    const vals = inputs.map(v => parseInt(v));
    const allCorrect = vals.every((v, i) => v === current.answers[i]);
    if (allCorrect) {
      setFlash("correct");
      setScore(s => s + 1);
      setTimeout(() => { setFlash(null); next(); }, 300);
    } else {
      setFlash("incorrect");
      setShownAnswers(current.answers);
      setTimeout(() => { setFlash(null); next(); }, 1000);
    }
  };

  const updateInput = (idx: number, val: string) => {
    const newInputs = [...inputs];
    newInputs[idx] = val;
    setInputs(newInputs);
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Tab" && idx < letterCount - 1) {
      e.preventDefault();
      inputRefs.current[idx + 1]?.focus();
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
            <h1 className="text-xl font-bold mb-1">Lecture alphabétique</h1>
            <p className="text-sm text-muted-foreground mb-8">Entraîne-toi à connaître le rang de chaque lettre</p>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Nombre de lettres</label>
                <div className="flex flex-wrap gap-2">
                  {letterChips.map(c => <Chip key={c.value} label={c.label} active={letterCount === c.value} onClick={() => setLetterCount(c.value)} />)}
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

            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold">Classement — {letterChips.find(l => l.value === letterCount)?.label}, {durationChips.find(d => d.value === duration)?.label}</h2>
              </div>
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>Pseudo</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {generateLeaderboard(letterCount, duration).map(e => (
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

            <div className={cn(
              "w-full rounded-xl border p-12 flex flex-col items-center transition-colors duration-300",
              flash === "correct" ? "bg-success/10 border-success dark:bg-success/5" : flash === "incorrect" ? "bg-destructive/10 border-destructive dark:bg-destructive/5" : "bg-card border-border"
            )}>
              {shownAnswers ? (
                <div className="text-center">
                  <div className="flex gap-6 justify-center mb-2">
                    {current?.letters.map((l, i) => (
                      <div key={i} className="text-center">
                        <div className="text-5xl font-bold text-destructive flex items-center gap-1"><X className="w-5 h-5" />{l}</div>
                        <div className="text-xl font-bold mt-1">{shownAnswers[i]}</div>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">Bonne réponse</span>
                </div>
              ) : (
                <>
                  <div className="flex gap-8 mb-8">
                    {current?.letters.map((l, i) => (
                      <div key={i} className={cn("font-bold", letterCount === 1 ? "text-7xl" : letterCount === 2 ? "text-6xl" : "text-5xl")}>{l}</div>
                    ))}
                  </div>
                  <form onSubmit={handleSubmit} className="flex gap-4">
                    {Array.from({ length: letterCount }).map((_, i) => (
                      <div key={i}>
                        <label className="sr-only" htmlFor={`letter-input-${i}`}>Rang de la lettre {i + 1}</label>
                        <input
                          id={`letter-input-${i}`}
                          ref={el => { inputRefs.current[i] = el; }}
                          type="number"
                          value={inputs[i] || ""}
                          onChange={e => updateInput(i, e.target.value)}
                          onKeyDown={e => handleKeyDown(i, e)}
                          className="text-3xl text-center w-20 border-b-2 border-primary bg-transparent outline-none font-bold py-2 focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          autoFocus={i === 0}
                        />
                      </div>
                    ))}
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
              en {durationChips.find(d => d.value === duration)?.label} — {letterChips.find(l => l.value === letterCount)?.label}
            </div>
            <div className="text-sm text-muted-foreground mb-8">Ton record : 28</div>
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
