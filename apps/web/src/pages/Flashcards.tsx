import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, RotateCcw, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { sections } from "@/data/sections";
import { flashcardsData, deckStats, themeFlashcardCounts } from "@/data/flashcards";
import type { Flashcard } from "@/data/flashcards";

const statusOptions = [
  { id: "due", label: "À réviser aujourd'hui" },
  { id: "all", label: "Toutes" },
  { id: "new", label: "Nouvelles" },
  { id: "learning", label: "En apprentissage" },
  { id: "mastered", label: "Maîtrisées" },
];
const countOptions = ["5", "10", "15", "20", "Toutes les dues"] as const;
const timerOptions = ["10s", "15s", "30s", "1 min"] as const;

type Phase = "config" | "session" | "done";
type Rating = "incorrect" | "correct" | "easy";

export default function Flashcards() {
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState("due");
  const [count, setCount] = useState("10");
  const [chronoEnabled, setChronoEnabled] = useState(false);
  const [chronoDuration, setChronoDuration] = useState("15s");
  const [phase, setPhase] = useState<Phase>("config");

  // Session state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);
  const [exitDirection, setExitDirection] = useState<number>(0);

  const toggleSection = (id: string) => {
    setSelectedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setSelectedThemes(new Set());
  };

  const toggleTheme = (t: string) => {
    setSelectedThemes(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  };

  const availableThemes = useMemo(() => {
    const themes: { name: string; count: number }[] = [];
    selectedSections.forEach(sid => {
      const sectionThemes = themeFlashcardCounts[sid];
      if (sectionThemes) {
        Object.entries(sectionThemes).forEach(([name, c]) => themes.push({ name, count: c }));
      }
    });
    return themes;
  }, [selectedSections]);

  const sessionCards = useMemo(() => {
    let cards = flashcardsData;
    if (selectedSections.size > 0) cards = cards.filter(c => selectedSections.has(c.sectionId));
    if (selectedThemes.size > 0) cards = cards.filter(c => selectedThemes.has(c.theme));
    const max = count === "Toutes les dues" ? cards.length : parseInt(count);
    return cards.slice(0, max);
  }, [selectedSections, selectedThemes, count]);

  const summaryParts: string[] = [];
  summaryParts.push(`${sessionCards.length} cartes`);
  if (selectedSections.size > 0) {
    const names = Array.from(selectedSections).map(s => sections.find(sec => sec.id === s)?.shortLabel || s);
    summaryParts.push(`de ${names.join(", ")}`);
  }
  if (selectedThemes.size > 0) summaryParts.push(`> ${Array.from(selectedThemes).join(" + ")}`);
  const statusLabel = statusOptions.find(s => s.id === status)?.label || "";
  summaryParts.push(`— ${statusLabel}`);
  summaryParts.push(chronoEnabled ? `— Chrono ${chronoDuration}` : "— Sans chrono");

  const startSession = () => {
    setPhase("session");
    setCurrentIndex(0);
    setFlipped(false);
    setRatings([]);
    setReviewMsg(null);
  };

  const handleRate = (rating: Rating) => {
    const msg = rating === "incorrect" ? "Prochaine révision dans 1 jour"
      : rating === "correct" ? "Prochaine révision dans 7 jours"
      : "Prochaine révision dans 14 jours";

    setRatings(prev => [...prev, rating]);
    setReviewMsg(msg);
    setExitDirection(-1);

    setTimeout(() => {
      setReviewMsg(null);
      if (currentIndex < sessionCards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setFlipped(false);
        setExitDirection(1);
      } else {
        setPhase("done");
      }
    }, 1000);
  };

  // Chip component
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
    >
      {label}
    </button>
  );

  // DONE phase
  if (phase === "done") {
    const incorrect = ratings.filter(r => r === "incorrect").length;
    const correct = ratings.filter(r => r === "correct").length;
    const easy = ratings.filter(r => r === "easy").length;
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-xl border border-border p-8 text-center max-w-md shadow-sm"
        >
          <PartyPopper className="w-10 h-10 text-primary mx-auto mb-2" />
          <h2 className="text-lg font-bold mb-1">Session terminée !</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {ratings.length} cartes — {easy} Facile, {correct} Correct, {incorrect} Incorrect
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" onClick={() => setPhase("config")}>Retour aux flashcards</Button>
            <Button size="sm" onClick={startSession}>Nouvelle session</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // SESSION phase
  if (phase === "session") {
    const card = sessionCards[currentIndex];
    if (!card) return null;
    const section = sections.find(s => s.id === card.sectionId);
    const Icon = section?.icon;

    return (
      <div className="p-6 flex flex-col items-center">
        {/* Counter */}
        <div className="text-sm text-muted-foreground mb-1 font-medium">{currentIndex + 1}/{sessionCards.length}</div>
        <div className="w-full max-w-[500px] h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentIndex + 1) / sessionCards.length) * 100}%` }} />
        </div>

        {/* Review message */}
        <AnimatePresence>
          {reviewMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground mb-3 font-medium"
            >
              {reviewMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id + (flipped ? "-back" : "-front")}
            initial={{ opacity: 0, x: exitDirection * 60, rotateY: flipped ? 180 : 0 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[500px] min-h-[280px] bg-card rounded-xl border border-border shadow-sm p-6 cursor-pointer flex flex-col"
            onClick={() => !flipped && setFlipped(true)}
            style={{ perspective: 1000 }}
          >
            {/* Badges */}
            <div className="flex items-center justify-between mb-4">
              {section && Icon && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${section.hsl} 15%, transparent)` }}
                >
                  <Icon className="w-4 h-4" style={{ color: section.hsl }} />
                </div>
              )}
              <span className="text-xs text-muted-foreground">{card.theme}</span>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center">
              {!flipped ? (
                <p className="text-base font-medium text-center leading-relaxed">{card.front}</p>
              ) : (
                <p className="text-sm text-muted-foreground text-center leading-relaxed whitespace-pre-line">{card.back}</p>
              )}
            </div>

            {!flipped && (
              <div className="text-center mt-4">
                <span className="text-xs text-muted-foreground">Clique pour retourner</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        {flipped ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mt-4"
          >
            <Button
              onClick={() => handleRate("incorrect")}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              size="sm"
            >
              <X className="w-4 h-4 mr-1" /> Incorrect
            </Button>
            <Button
              onClick={() => handleRate("correct")}
              className="bg-success hover:bg-success/90 text-success-foreground"
              size="sm"
            >
              <Check className="w-4 h-4 mr-1" /> Correct
            </Button>
            <Button
              onClick={() => handleRate("easy")}
              variant="secondary"
              size="sm"
            >
              <Zap className="w-4 h-4 mr-1" /> Facile
            </Button>
          </motion.div>
        ) : (
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setFlipped(true)}>
            Retourner
          </Button>
        )}
      </div>
    );
  }

  // CONFIG phase
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-bold mb-2">Flashcards</h1>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold mb-4">
        <RotateCcw className="w-4 h-4" />
        {deckStats.due} à réviser aujourd'hui
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-6 text-xs">
        {[
          { label: "Total", value: deckStats.total },
          { label: "Maîtrisées", value: deckStats.mastered },
          { label: "En apprentissage", value: deckStats.learning },
          { label: "Nouvelles", value: deckStats.new },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border px-3 py-2">
            <div className="text-muted-foreground">{s.label}</div>
            <div className="font-bold text-base">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        {/* Section chips */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sous-test</div>
          <div className="flex flex-wrap gap-2">
            {sections.map(s => {
              const isActive = selectedSections.has(s.id);
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSection(s.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm border transition-colors min-h-[44px]",
                    isActive
                      ? "bg-primary/10 text-primary border-primary font-medium"
                      : "text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme chips */}
        <AnimatePresence>
          {availableThemes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Thème</div>
              <div className="flex flex-wrap gap-2">
                {availableThemes.map(t => (
                  <Chip key={t.name} label={`${t.name} (${t.count})`} active={selectedThemes.has(t.name)} onClick={() => toggleTheme(t.name)} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Statut</div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(s => (
              <Chip key={s.id} label={s.label} active={status === s.id} onClick={() => setStatus(s.id)} />
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nombre de cartes</div>
          <div className="flex gap-2">
            {countOptions.map(n => (
              <Chip key={n} label={n} active={count === n} onClick={() => setCount(n)} />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chrono</div>
            <Switch checked={chronoEnabled} onCheckedChange={setChronoEnabled} />
          </div>
          <AnimatePresence>
            {chronoEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="text-[11px] text-muted-foreground mb-1.5">Temps par flashcard</div>
                <div className="flex gap-2">
                  {timerOptions.map(t => (
                    <Chip key={t} label={t} active={chronoDuration === t} onClick={() => setChronoDuration(t)} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-muted/50 rounded-xl px-4 py-3 text-sm text-muted-foreground">
          {summaryParts.join(" ")}
        </div>

        <Button className="w-full" onClick={startSession} disabled={sessionCards.length === 0}>
          Lancer la session
        </Button>
      </div>
    </div>
  );
}
