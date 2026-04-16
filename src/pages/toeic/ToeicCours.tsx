import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Headphones, FileText, Target, CheckCircle2, Clock, Circle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toeicCourses, toeicCourseCategories } from "@/data/toeic";

const iconMap: Record<string, React.ElementType> = { BookOpen, Headphones, FileText, Target, Languages: BookOpen };

export default function ToeicCours() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("grammaire");
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());

  const filteredCourses = toeicCourses.filter(c => c.category === activeCategory);
  const cat = toeicCourseCategories.find(c => c.id === activeCategory);

  const toggleChapter = (id: string) => {
    setOpenChapters(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const statusIcon = (s: string) => s === "done" ? <CheckCircle2 className="w-4 h-4 text-success" /> : s === "in-progress" ? <Clock className="w-4 h-4 text-warning" /> : <Circle className="w-4 h-4 text-muted-foreground" />;

  return (
    <div className="p-6 py-8 space-y-6">
      <h1 className="text-xl font-bold">Cours TOEIC</h1>
      {/* Category nav */}
      <div className="flex gap-2 overflow-x-auto pb-1 relative">
        {toeicCourseCategories.map(c => {
          const Icon = iconMap[c.icon] || BookOpen;
          const isActive = activeCategory === c.id;
          return (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className={cn("flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                isActive ? `bg-sky-500/10 text-sky-500 border-sky-500` : "border-border text-muted-foreground hover:border-sky-500/30")}>
              <Icon className="w-4 h-4" />{c.label}
            </button>
          );
        })}
      </div>

      {/* Chapters */}
      <div className="space-y-3">
        {filteredCourses.map(course => {
          const isOpen = openChapters.has(course.id);
          const done = course.lessons.filter(l => l.status === "done").length;
          const pct = Math.round((done / course.lessons.length) * 100);
          return (
            <div key={course.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <button onClick={() => toggleChapter(course.id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{course.chapter}</span>
                  <span className="text-xs text-muted-foreground">{done}/{course.lessons.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-3 space-y-1">
                      {course.lessons.map(lesson => (
                        <button key={lesson.id} onClick={() => navigate(`/toeic/cours/${lesson.id}`)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left">
                          {statusIcon(lesson.status)}
                          <span className="text-sm flex-1">{lesson.title}</span>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
