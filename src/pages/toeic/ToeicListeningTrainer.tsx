import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Headphones, Trophy, Play, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const phrases = [
  { text: "The meeting has been rescheduled to Friday", answer: "the meeting has been rescheduled to friday" },
  { text: "Please submit your report by end of day", answer: "please submit your report by end of day" },
  { text: "The quarterly results exceeded expectations", answer: "the quarterly results exceeded expectations" },
  { text: "All employees must attend the training session", answer: "all employees must attend the training session" },
  { text: "The conference room is available this afternoon", answer: "the conference room is available this afternoon" },
];

export default function ToeicListeningTrainer() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"config" | "session" | "done">("config");
  const [audioType, setAudioType] = useState("Phrases courtes");
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<"green" | "red" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "session") return;
    if (timeLeft <= 0) { setPhase("done"); return; }
    const i = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(i);
  }, [phase, timeLeft]);

  const startSession = () => {
    setPhase("session");
    setTimeLeft(duration);
    setCurrent(0);
    setScore(0);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = input.toLowerCase().trim() === phrases[current % phrases.length].answer;
    if (correct) {
      setScore(s => s + 1);
      setFlash("green");
    } else {
      setFlash("red");
    }
    setTimeout(() => { setFlash(null); setInput(""); setCurrent(c => c + 1); inputRef.current?.focus(); }, correct ? 300 : 1000);
  };

  if (phase === "done") {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <Trophy className="w-10 h-10 text-sky-500 mx-auto mb-3" />
          <div className="text-3xl font-bold">{score}</div>
          <div className="text-sm text-muted-foreground mb-6">bonnes réponses en {duration}s</div>
          <div className="flex gap-3 justify-center">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white" onClick={startSession}><RotateCcw className="w-4 h-4 mr-1" /> Refaire</Button>
            <Button variant="outline" onClick={() => setPhase("config")}>Retour</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === "session") {
    const phrase = phrases[current % phrases.length];
    return (
      <div className={cn("min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300",
        flash === "green" ? "bg-success/10" : flash === "red" ? "bg-destructive/10" : "bg-background")}>
        <div className="text-3xl font-mono font-bold mb-8">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</div>
        <div className="text-sm text-muted-foreground mb-2">Écoute et tape ce que tu entends</div>
        <div className="bg-card rounded-xl border border-border p-6 max-w-md w-full mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Headphones className="w-5 h-5 text-sky-500" />
            <span className="text-sm font-medium">[Audio] "{phrase.text}"</span>
          </div>
          <form onSubmit={handleSubmit}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} autoFocus
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              placeholder="Tape ta réponse..." />
          </form>
        </div>
        <div className="text-sm font-bold text-sky-500">Score : {score}</div>
        {flash === "red" && <div className="text-sm text-destructive mt-2">Réponse : {phrase.answer}</div>}
      </div>
    );
  }

  return (
    <div className="p-6 py-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <h1 className="text-xl font-bold">Listening Trainer</h1>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[{ label: "Record", value: "42" }, { label: "Sessions", value: "18" }, { label: "Phrases", value: "156" }, { label: "Taux réussite", value: "72%" }].map(k => (
          <div key={k.label} className="bg-card rounded-xl border border-border p-3 text-center">
            <div className="text-lg font-bold">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Type d'audio</div>
          <div className="flex gap-2">
            {["Phrases courtes", "Dialogues courts", "Annonces"].map(t => (
              <button key={t} onClick={() => setAudioType(t)}
                className={cn("rounded-full px-4 py-1.5 text-sm border transition-colors",
                  audioType === t ? "bg-sky-500/10 text-sky-500 border-sky-500 font-medium" : "text-muted-foreground border-border")}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Durée</div>
          <div className="flex gap-2">
            {[{ label: "1 min", v: 60 }, { label: "2 min", v: 120 }, { label: "5 min", v: 300 }].map(d => (
              <button key={d.label} onClick={() => setDuration(d.v)}
                className={cn("rounded-full px-4 py-1.5 text-sm border transition-colors",
                  duration === d.v ? "bg-sky-500/10 text-sky-500 border-sky-500 font-medium" : "text-muted-foreground border-border")}>{d.label}</button>
            ))}
          </div>
        </div>
        <Button onClick={startSession} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
          <Play className="w-4 h-4 mr-2" /> Démarrer
        </Button>
      </div>
    </div>
  );
}
