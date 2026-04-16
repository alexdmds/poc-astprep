import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, RotateCcw, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toeicFlashcardThemes, toeicFlashcards } from "@/data/toeic";

type Phase = "config" | "session" | "done";
type Rating = "incorrect" | "correct" | "easy";

export default function ToeicFlashcards() {
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<Phase>("config");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);

  const cards = selectedThemes.size > 0 ? toeicFlashcards.filter(c => selectedThemes.has(c.theme)) : toeicFlashcards;
  const sessionCards = cards.slice(0, 20);

  const toggleTheme = (t: string) => { setSelectedThemes(prev => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n; }); };

  const handleRate = (r: Rating) => {
    setRatings(prev => [...prev, r]);
    if (currentIndex < sessionCards.length - 1) {
      setTimeout(() => { setCurrentIndex(i => i + 1); setFlipped(false); }, 500);
    } else {
      setPhase("done");
    }
  };

  if (phase === "done") {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card rounded-xl border border-border p-8 text-center max-w-md">
          <PartyPopper className="w-10 h-10 text-sky-500 mx-auto mb-2" />
          <h2 className="text-lg font-bold mb-1">Session terminée !</h2>
          <p className="text-sm text-muted-foreground mb-4">{ratings.length} cartes révisées</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" onClick={() => setPhase("config")}>Retour</Button>
            <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white" onClick={() => { setCurrentIndex(0); setRatings([]); setFlipped(false); setPhase("session"); }}>Nouvelle session</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === "session") {
    const card = sessionCards[currentIndex];
    if (!card) return null;
    return (
      <div className="p-6 flex flex-col items-center">
        <div className="text-sm text-muted-foreground mb-1 font-medium">{currentIndex + 1}/{sessionCards.length}</div>
        <div className="w-full max-w-[500px] h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / sessionCards.length) * 100}%` }} />
        </div>
        <div onClick={() => !flipped && setFlipped(true)}
          className="w-full max-w-[500px] min-h-[280px] bg-card rounded-xl border border-border p-6 cursor-pointer flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground mb-4">{card.theme}</span>
          <p className={cn("text-center", flipped ? "text-sm text-muted-foreground" : "text-base font-medium")}>{flipped ? card.back : card.front}</p>
          {!flipped && <span className="text-xs text-muted-foreground mt-4">Clique pour retourner</span>}
        </div>
        {flipped && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mt-4">
            <Button onClick={() => handleRate("incorrect")} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" size="sm"><X className="w-4 h-4 mr-1" /> Incorrect</Button>
            <Button onClick={() => handleRate("correct")} className="bg-success hover:bg-success/90 text-success-foreground" size="sm"><Check className="w-4 h-4 mr-1" /> Correct</Button>
            <Button onClick={() => handleRate("easy")} variant="secondary" size="sm"><Zap className="w-4 h-4 mr-1" /> Facile</Button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-bold mb-2">Flashcards TOEIC</h1>
      <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-bold mb-4">
        <RotateCcw className="w-4 h-4" /> {toeicFlashcards.filter(f => f.status === "due").length} à réviser
      </div>
      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Thèmes vocabulaire</div>
          <div className="flex flex-wrap gap-2">
            {toeicFlashcardThemes.map(t => (
              <button key={t} onClick={() => toggleTheme(t)}
                className={cn("rounded-full px-4 py-1.5 text-sm border transition-colors",
                  selectedThemes.has(t) ? "bg-sky-500/10 text-sky-500 border-sky-500 font-medium" : "text-muted-foreground border-border")}>{t}</button>
            ))}
          </div>
        </div>
        <div className="bg-muted/50 rounded-xl px-4 py-3 text-sm text-muted-foreground">
          {sessionCards.length} cartes sélectionnées
        </div>
        <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white" onClick={() => setPhase("session")} disabled={sessionCards.length === 0}>
          Lancer la session
        </Button>
      </div>
    </div>
  );
}
