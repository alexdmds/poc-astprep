import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Play, Clock, Loader2 } from "lucide-react";
import { scoredSections } from "@/data/sections";
import { cn } from "@/lib/utils";
import { SectionNav } from "@/components/SectionNav";
import { useSubtests, type SubtestRow } from "@/lib/queries/subtests";

const SubtestCard = ({ subtest, onLaunch }: { subtest: SubtestRow; onLaunch: () => void }) => (
  <div className="w-full flex items-center gap-3 p-4 border border-border rounded-xl bg-card text-left transition-all hover:shadow-sm hover:border-primary/30 min-h-[44px] group">
    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-muted">
      <Play className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
    </div>

    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium">{subtest.title}</div>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-xs text-muted-foreground">{subtest.question_count} questions</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
          <Clock className="w-3 h-3" /> {subtest.duration_minutes} min
        </span>
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={onLaunch}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Play className="w-3.5 h-3.5" /> Lancer
      </button>
    </div>
  </div>
);

export default function SousTests() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(scoredSections[0].id);
  const [exerciseTab, setExerciseTab] = useState<"generalistes" | "thematiques">("generalistes");

  const section = scoredSections.find(s => s.id === activeSection)!;
  const { data: subtests, isLoading } = useSubtests(activeSection);

  const generalistes = (subtests ?? []).filter(s => s.type === "generaliste");
  const thematiques = (subtests ?? []).filter(s => s.type === "thematique");
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
            {isLoading ? "Chargement…" : `${(subtests ?? []).length} sous-tests disponibles`}
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : !subtests?.length ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Aucun sous-test disponible pour cette section.
            </div>
          ) : (
            <>
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
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
