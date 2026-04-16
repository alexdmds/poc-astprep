import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Zap, Timer } from "lucide-react";
import { toeicParts, toeicThemes } from "@/data/toeic";
import { cn } from "@/lib/utils";

const difficulties = ["Easy", "Medium", "Hard"] as const;
const durations = [{ label: "5 min", v: 5 }, { label: "10 min", v: 10 }, { label: "15 min", v: 15 }, { label: "30 min", v: 30 }];
const questionCounts = ["5", "10", "15", "20", "30"] as const;

const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={cn("rounded-full px-4 py-1.5 text-sm border transition-colors min-h-[40px]",
    active ? "bg-sky-500/10 text-sky-500 border-sky-500 font-medium" : "text-muted-foreground border-border hover:border-sky-500/30")}>{label}</button>
);

export default function ToeicGenerateur() {
  const [searchParams] = useSearchParams();
  const [selectedPart, setSelectedPart] = useState<number>(parseInt(searchParams.get("part") || "5"));
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(() => {
    const t = searchParams.get("theme"); return t ? new Set([t]) : new Set();
  });
  const [selectedDiffs, setSelectedDiffs] = useState<Set<string>>(new Set());
  const [duration, setDuration] = useState<number | null>(null);
  const [count, setCount] = useState("10");
  const [questionType, setQuestionType] = useState("Toutes");

  const themes = toeicThemes[selectedPart] || [];
  const isListening = selectedPart <= 4;

  const toggle = (set: Set<string>, val: string) => { const n = new Set(set); n.has(val) ? n.delete(val) : n.add(val); return n; };

  return (
    <div className="p-6 py-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-1">Générateur TOEIC</h1>
      <p className="text-sm text-muted-foreground mb-6">Génère un entraînement sur mesure</p>

      <div className="bg-card rounded-xl border border-border p-5 space-y-5">
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Type</div>
          <div className="flex gap-2">
            {["Toutes", "Mes erreurs", "Mes flaggées"].map(t => (
              <Chip key={t} label={t} active={questionType === t} onClick={() => setQuestionType(t)} />
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Part</div>
          <div className="flex flex-wrap gap-2">
            {toeicParts.map(p => <Chip key={p.id} label={`Part ${p.id}`} active={selectedPart === p.id} onClick={() => { setSelectedPart(p.id); setSelectedThemes(new Set()); }} />)}
          </div>
        </div>

        {themes.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Thème</div>
            <div className="flex flex-wrap gap-2">
              {themes.map(t => <Chip key={t} label={t} active={selectedThemes.has(t)} onClick={() => setSelectedThemes(toggle(selectedThemes, t))} />)}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Difficulté</div>
          <div className="flex gap-2">
            {difficulties.map(d => <Chip key={d} label={d} active={selectedDiffs.has(d)} onClick={() => setSelectedDiffs(toggle(selectedDiffs, d))} />)}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" /> Durée
          </div>
          <div className="flex gap-2">
            {durations.map(d => <Chip key={d.label} label={d.label} active={duration === d.v} onClick={() => setDuration(d.v)} />)}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nombre de questions</div>
          <div className="flex gap-2">
            {questionCounts.map(n => <Chip key={n} label={n} active={count === n} onClick={() => setCount(n)} />)}
          </div>
        </div>

        {isListening && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mode audio</div>
            <div className="flex gap-2">
              <Chip label="Examen" active={false} onClick={() => {}} />
              <Chip label="Entraînement" active={true} onClick={() => {}} />
            </div>
          </div>
        )}

        <button className="w-full rounded-xl px-4 py-3 text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" /> Lancer l'entraînement
        </button>
      </div>
    </div>
  );
}
