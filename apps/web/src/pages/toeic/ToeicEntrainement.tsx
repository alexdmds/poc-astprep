import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Eye, RotateCcw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toeicParts } from "@/data/toeic";

const mockSubtests = toeicParts.flatMap(p =>
  Array.from({ length: p.id <= 4 ? 6 : 8 }, (_, i) => ({
    id: `toeic-st-p${p.id}-${i + 1}`,
    title: `${p.name.split(" — ")[1] || p.name} #${i + 1}`,
    part: p.id,
    partName: p.name,
    questions: p.questions,
    duration: p.id <= 4 ? "15 min" : "20 min",
    score: i < 3 ? Math.round(60 + Math.random() * 35) : null,
    avgScore: 72,
    thematic: i >= 4,
    theme: i >= 4 ? ["Present Perfect", "Phrasal Verbs", "Modaux", "Prépositions"][i % 4] : undefined,
  }))
);

export default function ToeicEntrainement() {
  const navigate = useNavigate();
  const [activePart, setActivePart] = useState(1);
  const [toggle, setToggle] = useState<"general" | "thematic">("general");

  const filtered = mockSubtests.filter(s => s.part === activePart && (toggle === "general" ? !s.thematic : s.thematic));

  return (
    <div className="p-6 py-8 space-y-6">
      <h1 className="text-xl font-bold">Entraînement TOEIC</h1>
      {/* Part nav */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {toeicParts.map(p => (
          <button key={p.id} onClick={() => setActivePart(p.id)}
            className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors",
              activePart === p.id ? "bg-sky-500/10 text-sky-500 border-sky-500" : "border-border text-muted-foreground hover:border-sky-500/30")}>
            Part {p.id}
          </button>
        ))}
      </div>
      {/* Toggle */}
      <div className="flex gap-1 bg-muted rounded-lg p-0.5 w-fit">
        {(["general", "thematic"] as const).map(t => (
          <button key={t} onClick={() => setToggle(t)}
            className={cn("px-4 py-2 rounded-md text-xs font-medium transition-colors",
              toggle === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>
            {t === "general" ? "Généralistes" : "Thématiques"}
          </button>
        ))}
      </div>
      {/* Cards */}
      <div className="grid grid-cols-4 gap-3">
        {filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {s.score !== null && <CheckCircle2 className="w-4 h-4 text-success" />}
                <h3 className="text-sm font-bold">{s.title}</h3>
              </div>
              {s.theme && <span className="inline-block text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium mb-2">Piège</span>}
              <div className="text-xs text-muted-foreground">{s.questions} questions · {s.duration}</div>
              {s.score !== null && (
                <div className="mt-2">
                  <span className={cn("text-lg font-bold", s.score >= 80 ? "text-success" : s.score >= 50 ? "text-warning" : "text-destructive")}>{s.score}%</span>
                  <span className="text-xs text-muted-foreground ml-2">Moyenne : {s.avgScore}%</span>
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              {s.score !== null && (
                <button onClick={() => navigate(`/toeic/entrainement/${s.id}?correction=true`)}
                  className="w-full rounded-lg px-3 py-2 text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Correction
                </button>
              )}
              <button onClick={() => navigate(`/toeic/entrainement/${s.id}`)}
                className={cn("w-full rounded-lg px-3 py-2 text-xs font-medium flex items-center justify-center gap-1.5",
                  s.score ? "bg-muted text-foreground hover:bg-muted/80" : "bg-sky-500 text-white hover:bg-sky-600")}>
                {s.score ? <><RotateCcw className="w-3.5 h-3.5" /> Refaire</> : <><Play className="w-3.5 h-3.5" /> Lancer</>}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
