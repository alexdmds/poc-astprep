import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, CheckCircle2, Dumbbell, Loader2 } from "lucide-react";
import { sections } from "@/data/sections";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionNav } from "@/components/SectionNav";
import { useChaptersWithLessons, useLessonProgress, useMarkLessonComplete, type ChapterRow, type LessonRow } from "@/lib/queries/lessons";
import { useAuth } from "@/lib/auth";

export default function Cours() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{
    lesson: LessonRow;
    chapter: ChapterRow;
    sectionLabel: string;
  } | null>(null);

  const section = sections.find(s => s.id === activeSection)!;
  const { data: chapters, isLoading } = useChaptersWithLessons(activeSection);
  const { data: lessonProgress } = useLessonProgress(user?.id);
  const markComplete = useMarkLessonComplete();

  const totalVideos = (chapters ?? []).reduce((a, c) => a + c.lessons.length, 0);
  const totalDuration = (chapters ?? []).reduce(
    (a, c) => a + c.lessons.reduce((b, l) => b + l.duration_minutes, 0),
    0
  );

  const chapterStatus = (ch: ChapterRow) => {
    if (!ch.lessons.length) return "todo";
    const done = ch.lessons.filter(l => lessonProgress?.[l.id]).length;
    if (done === ch.lessons.length) return "done";
    if (done > 0) return "progress";
    return "todo";
  };

  const handleWatch = () => {
    if (!selectedLesson) return;
    if (user) {
      markComplete.mutate({ userId: user.id, lessonId: selectedLesson.lesson.id });
    }
    setSelectedLesson(null);
    navigate(`/cours/${selectedLesson.lesson.id}`);
  };

  return (
    <div className="p-6">
      <SectionNav
        sections={sections}
        activeSection={activeSection}
        onSelect={(id) => { setActiveSection(id); setOpenChapter(null); }}
        layoutId="tab-line"
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
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            {isLoading ? "Chargement…" : `${totalVideos} vidéos · ${totalDuration} min`}
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : !chapters?.length ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Aucun cours disponible pour cette section.
            </div>
          ) : (
            <div className="space-y-3">
              {chapters.map((ch, i) => {
                const status = chapterStatus(ch);
                const isOpen = openChapter === ch.id;
                const done = ch.lessons.filter(l => lessonProgress?.[l.id]).length;
                const total = ch.lessons.length;
                const chDuration = ch.lessons.reduce((a, l) => a + l.duration_minutes, 0);

                return (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn("border rounded-xl bg-card transition-shadow", isOpen ? "shadow-sm" : "hover:shadow-sm")}
                  >
                    <button
                      onClick={() => setOpenChapter(isOpen ? null : ch.id)}
                      className="w-full flex items-center gap-3 p-4 text-left min-h-[44px]"
                    >
                      <div
                        className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold shrink-0")}
                        style={
                          status === "done"
                            ? { background: "hsl(var(--success) / 0.1)" }
                            : status === "progress"
                            ? { background: `color-mix(in srgb, ${section.hsl} 12%, transparent)` }
                            : {}
                        }
                      >
                        {status === "done" ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <span style={status === "progress" ? { color: section.hsl } : { color: "hsl(var(--muted-foreground))" }}>
                            {done}/{total}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className={cn("text-sm font-medium", status === "done" && "text-muted-foreground")}>
                          {ch.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" /> {chDuration} min · {total} vidéos
                        </div>
                      </div>

                      {status === "progress" && (
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(done / total) * 100}%`, background: section.hsl }} />
                        </div>
                      )}

                      <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3 space-y-0.5">
                            {ch.lessons.map(lesson => {
                              const isCompleted = !!lessonProgress?.[lesson.id];
                              const isExercise = lesson.type === "exercise";
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => setSelectedLesson({ lesson, chapter: ch, sectionLabel: section.label })}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/50 transition-colors text-left min-h-[44px]",
                                    isExercise && "bg-primary/5 border border-primary/15 mt-1"
                                  )}
                                >
                                  <div className={cn(
                                    "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                                    isCompleted
                                      ? "bg-success/10"
                                      : isExercise ? "bg-primary/10" : "bg-muted"
                                  )}>
                                    {isCompleted
                                      ? <CheckCircle2 className="w-3 h-3 text-success" />
                                      : isExercise
                                      ? <Dumbbell className="w-3 h-3 text-primary" />
                                      : null
                                    }
                                  </div>
                                  <span className={cn(
                                    "flex-1 text-[13px]",
                                    isCompleted ? "line-through text-muted-foreground" : isExercise ? "text-primary font-medium" : "text-foreground"
                                  )}>
                                    {lesson.title}
                                  </span>
                                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                    {isExercise ? <Dumbbell className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {lesson.duration_minutes} min
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedLesson && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLesson.lesson.title}</DialogTitle>
                <DialogDescription>
                  {selectedLesson.sectionLabel} · {selectedLesson.chapter.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Durée</span>
                  <span>{selectedLesson.lesson.duration_minutes} min</span>
                </div>
                {selectedLesson.lesson.professor && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Professeur</span>
                    <span>{selectedLesson.lesson.professor}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Statut</span>
                  <span className={lessonProgress?.[selectedLesson.lesson.id] ? "text-success" : "text-foreground"}>
                    {lessonProgress?.[selectedLesson.lesson.id] ? "Terminé" : "À regarder"}
                  </span>
                </div>
              </div>
              <Button className="w-full" onClick={handleWatch}>Regarder</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
