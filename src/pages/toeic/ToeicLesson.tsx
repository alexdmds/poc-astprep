import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toeicCourses } from "@/data/toeic";

export default function ToeicLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = toeicCourses.flatMap(c => c.lessons).find(l => l.id === lessonId);
  if (!lesson) return <div className="p-6">Leçon introuvable</div>;

  return (
    <div className="p-6 py-8 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Button>
      <h1 className="text-xl font-bold">{lesson.title}</h1>
      {/* Video placeholder */}
      <div className="aspect-video bg-foreground/90 rounded-xl flex items-center justify-center relative">
        <div className="w-14 h-14 rounded-full bg-sky-500/20 flex items-center justify-center"><Play className="w-6 h-6 text-sky-500 ml-1" /></div>
        <div className="absolute bottom-3 left-3 text-primary-foreground text-xs">Cours TOEIC · {lesson.duration}</div>
      </div>
      {/* Astuce card */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">Astuce</div>
          <p className="text-sm text-muted-foreground">Quand tu vois "by + date", c'est forcément un futur antérieur. Cette règle fonctionne dans 95% des cas au TOEIC.</p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">
        <p>Contenu de la leçon à venir. Ce cours couvre les points clés de grammaire et vocabulaire pour le TOEIC.</p>
      </div>
    </div>
  );
}
