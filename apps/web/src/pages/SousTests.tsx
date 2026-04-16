import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Play, Clock, Eye } from "lucide-react";
import { scoredSections } from "@/data/sections";
import { subtestData } from "@/data/subtests";
import type { Subtest } from "@/data/subtests";
import { cn } from "@/lib/utils";
import { SectionNav } from "@/components/SectionNav";

const scoreColor = (score: number, max: number) => {
  const pct = score / max;
  if (pct >= 0.7) return "text-success";
  if (pct >= 0.5) return "text-warning";
  return "text-destructive";
};

const scoreBarColor = (score: number, max: number) => {
  const pct = score / max;
  if (pct >= 0.7) return "bg-success";
  if (pct >= 0.5) return "bg-warning";
  return "bg-destructive";
};

const SubtestCard = ({ subtest, onLaunch, onCorrection }: { subtest: Subtest; onLaunch: () => void; onCorrection: () => void }) => {
  const isDone = subtest.score !== null;

  return (
    <div className="w-full flex items-center gap-3 p-4 border border-border rounded-xl bg-card text-left transition-all hover:shadow-sm hover:border-primary/30 min-h-[44px] group">
      {/* Status icon */}
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
        isDone ? "bg-success/10" : "bg-muted"
      )}>
        {isDone
          ? <CheckCircle2 className="w-[18px] h-[18px] text-success" />
          : <Play className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{subtest.title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{subtest.questions} questions</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <Clock className="w-3 h-3" /> {subtest.duration} min
          </span>
        </div>
      </div>

      {/* Score */}
      {isDone && (
        <div className="text-right shrink-0 w-20">
          <div className={cn("text-sm font-bold", scoreColor(subtest.score!, 60))}>
            {subtest.score}/60
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1 w-full">
            <div
              className={cn("h-full rounded-full transition-all", scoreBarColor(subtest.score!, 60))}
              style={{ width: `${((subtest.score ?? 0) / 60) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Moy. {subtest.avgScore}/60</div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {isDone && (
          <button
            onClick={onCorrection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Correction
          </button>
        )}
        <button
          onClick={onLaunch}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            isDone
              ? "bg-muted text-foreground hover:bg-muted/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Play className="w-3.5 h-3.5" /> {isDone ? "Relancer" : "Lancer"}
        </button>
      </div>
    </div>
  );
};

export default function Entrainement() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(scoredSections[0].id);
  const [exerciseTab, setExerciseTab] = useState<"generalistes" | "thematiques">("generalistes");

  const section = scoredSections.find(s => s.id === activeSection)!;
  const data = subtestData.find(d => d.sectionId === activeSection);
  const generalistes = data?.generalistes ?? [];
  const thematiques = data?.thematiques ?? [];
  const hasThematiques = thematiques.length > 0;

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    setExerciseTab("generalistes");
  };

  const visibleList = exerciseTab === "generalistes" ? generalistes : thematiques;

  return (
    <div className="p-6">
      <SectionNav
        sections={scoredSections}
        activeSection={activeSection}
        onSelect={handleSectionChange}
        layoutId="tab-line-training"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="max-w-2xl mx-auto px-6 py-2"
        >
          <h2 className="text-xl font-bold">{section.label}</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {generalistes.length + thematiques.length} sous-tests disponibles
          </p>

          {hasThematiques && (
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setExerciseTab("generalistes")}
                className={cn(
                  "flex-1 rounded-xl border-2 p-3 text-left transition-all",
                  exerciseTab === "generalistes"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className={cn("text-sm font-semibold", exerciseTab === "generalistes" ? "text-primary" : "text-foreground")}>
                  Généralistes
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{generalistes.length} sous-tests mixtes</div>
              </button>
              <button
                onClick={() => setExerciseTab("thematiques")}
                className={cn(
                  "flex-1 rounded-xl border-2 p-3 text-left transition-all",
                  exerciseTab === "thematiques"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className={cn("text-sm font-semibold", exerciseTab === "thematiques" ? "text-primary" : "text-foreground")}>
                  Thématiques
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{thematiques.length} par thème ciblé</div>
              </button>
            </div>
          )}

          <div className="space-y-2">
            {visibleList.map((st, i) => (
              <motion.div
                key={st.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <SubtestCard
                  subtest={st}
                  onLaunch={() => navigate(`/entrainement/${st.id}`)}
                  onCorrection={() => navigate(`/entrainement/${st.id}?correction=true`)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
