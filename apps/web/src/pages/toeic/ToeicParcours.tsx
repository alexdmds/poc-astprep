import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, List, CalendarDays, Check, BookOpen, Dumbbell, AlertCircle, ChevronLeft, ChevronRight, Heart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const HOURS_DONE = 3;
const HOURS_TARGET = 10;
const WEEKS_BELOW = 1;

const mockDays = Array.from({ length: 7 }, (_, i) => ({
  date: `${16 + i} avr`,
  fullDate: `2026-04-${16 + i}`,
  isToday: i === 0,
  activities: [
    { id: `ta${i}a`, title: i % 2 === 0 ? "Grammar: Modaux" : "Part 5 Training", type: "cours" as const, duration: "30 min", done: i < 2 },
    { id: `ta${i}b`, title: i % 3 === 0 ? "TOEIC Blanc #4" : "Listening Practice", type: "exercice" as const, duration: "45 min", done: i < 1 },
  ],
}));

export default function ToeicParcours() {
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [objectif, setObjectif] = useState([800]);
  const [examDate, setExamDate] = useState<Date>(new Date(2026, 5, 15));
  const [warningDismissed, setWarningDismissed] = useState(false);

  const warningTone = WEEKS_BELOW >= 3;

  return (
    <div className="p-6 py-8">
      {/* Coaching banner */}
      {!warningDismissed && HOURS_DONE < HOURS_TARGET && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={cn("rounded-xl p-4 mb-6 flex items-start gap-3 border-l-4",
            warningTone ? "bg-orange-500/5 border-orange-500" : "bg-sky-500/5 border-sky-500")}>
          {warningTone ? <TrendingUp className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /> : <Heart className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className="text-sm font-medium">{warningTone
              ? `Il faut accélérer. Tu es à ${HOURS_DONE}h sur ${HOURS_TARGET}h, soit ${Math.round(HOURS_DONE/HOURS_TARGET*100)}% de ton objectif.`
              : `On peut adapter ton planning si besoin. Tu as fait ${HOURS_DONE}h cette semaine sur l'objectif ${HOURS_TARGET}h.`}</p>
            <div className="flex gap-3 mt-2">
              <Button size="sm" className="text-xs bg-sky-500 hover:bg-sky-600 text-white" onClick={() => setCustomizeOpen(true)}>Personnaliser</Button>
              <button onClick={() => setWarningDismissed(true)} className="text-xs text-muted-foreground">Ignorer</button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Mon Parcours TOEIC</h1>
          <p className="text-sm text-muted-foreground mt-1">60 jours avant ton examen — Objectif {objectif[0]}/990</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setCustomizeOpen(true)} className="text-xs">
          <Settings className="w-3.5 h-3.5 mr-1.5" /> Personnaliser
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card rounded-xl border border-border px-4 py-2.5 mb-6 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-muted-foreground font-medium">Progression</span>
          <Progress value={35} className="flex-1 h-1.5" />
          <span className="font-bold">35%</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div><span className="text-muted-foreground">Score estimé</span> <span className="font-bold ml-1">780</span></div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {mockDays.map((day, i) => {
          const isPast = !day.isToday && new Date(day.fullDate) < new Date();
          const hasMissed = isPast && day.activities.some(a => !a.done);
          return (
            <div key={day.date} className={cn("bg-card rounded-xl border p-4",
              day.isToday ? "border-sky-500 bg-sky-500/5" : hasMissed ? "border-destructive/30" : "border-border")}>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("text-xs font-bold", day.isToday ? "text-sky-500" : "text-muted-foreground")}>{day.date}</span>
                {day.isToday && <span className="text-[10px] bg-sky-500 text-white px-1.5 py-0.5 rounded-full font-medium">Aujourd'hui</span>}
                {hasMissed && <span className="w-2 h-2 rounded-full bg-destructive" />}
              </div>
              <div className="space-y-1.5">
                {day.activities.map(a => (
                  <div key={a.id} className="flex items-center gap-2">
                    {a.done ? <Check className="w-4 h-4 text-success" /> : isPast ? <AlertCircle className="w-4 h-4 text-destructive" /> : <BookOpen className="w-4 h-4 text-sky-500" />}
                    <span className={cn("text-sm flex-1", a.done && "line-through text-muted-foreground")}>{a.title}</span>
                    <span className="text-xs text-muted-foreground">{a.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Personnaliser mon parcours TOEIC</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Score cible</span>
                <span className="text-sm font-bold text-sky-500">{objectif[0]}/990</span>
              </div>
              <Slider min={0} max={990} step={10} value={objectif} onValueChange={setObjectif} />
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Date d'examen TOEIC</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <CalendarDays className="w-4 h-4 mr-2" />{format(examDate, "d MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={examDate} onSelect={d => d && setExamDate(d)} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Niveau</div>
            <div className="flex gap-2">
              {["Débutant /700", "Intermédiaire", "Sprint /30j"].map(l => (
                <button key={l} className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-sky-500/50 transition-colors">{l}</button>
              ))}
            </div>
            <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white">Regénérer mon parcours</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
