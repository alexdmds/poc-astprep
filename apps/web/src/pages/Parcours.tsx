import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, List, CalendarDays, Check, BookOpen, Dumbbell, FileText, RotateCcw, AlertTriangle, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday as isDateToday, isSameWeek, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { weekPlan, typeIcons, pastWorkedDates } from "@/data/parcours";
import type { Activity, DayPlan } from "@/data/parcours";

const activityIcon = (type: Activity["type"]) => typeIcons[type];

// Mock: student has been below target for 2 weeks
const WEEKS_BELOW_TARGET = 2;
const HOURS_DONE = 2;
const HOURS_TARGET = 8;

export default function Parcours() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [hours, setHours] = useState([1, 1, 0.5, 1.5, 0.5, 2, 1.5]);
  const [objectif, setObjectif] = useState([450]);
  const [examDate, setExamDate] = useState<Date>(new Date(2026, 5, 15));
  const [regenerating, setRegenerating] = useState(false);
  const [warningDismissed, setWarningDismissed] = useState(false);

  const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      setCustomizeOpen(false);
    }, 1500);
  };

  const warningMessage = WEEKS_BELOW_TARGET >= 3
    ? `Ça fait ${WEEKS_BELOW_TARGET} semaines que tu es en dessous de ton objectif. Pour viser ${objectif[0]}, il faut accélérer. On ajuste ?`
    : `Tu as fait ${HOURS_DONE}h cette semaine sur ${HOURS_TARGET}h prévues. Pas de panique, on peut adapter ton planning.`;

  return (
    <div className="p-6 py-8">
      {/* Coaching warning */}
      {!warningDismissed && HOURS_DONE < HOURS_TARGET && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-l-4 border-warning bg-warning/5 rounded-xl p-4 mb-6 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{warningMessage}</p>
            <div className="flex items-center gap-3 mt-2">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setCustomizeOpen(true)}>
                Personnaliser mon parcours
              </Button>
              <button onClick={() => setWarningDismissed(true)} className="text-xs text-muted-foreground hover:text-foreground">
                Ignorer
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Mon Parcours</h1>
          <p className="text-sm text-muted-foreground mt-1">87 jours avant ton examen — Objectif {objectif[0]}/600</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setView("list")}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 min-h-[44px]",
                view === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
            >
              <List className="w-3.5 h-3.5" /> Liste
            </button>
            <button
              onClick={() => setView("calendar")}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 min-h-[44px]",
                view === "calendar" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Calendrier
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setCustomizeOpen(true)} className="text-xs min-h-[44px]">
            <Settings className="w-3.5 h-3.5 mr-1.5" /> Personnaliser
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-4 bg-card rounded-xl border border-border px-4 py-2.5 mb-6 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-muted-foreground font-medium">Progression</span>
          <Progress value={43} className="flex-1 h-1.5" />
          <span className="font-bold">43%</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div><span className="text-muted-foreground">Score estimé</span> <span className="font-bold ml-1">387</span></div>
        <div className="w-px h-4 bg-border" />
        <div><span className="text-muted-foreground">Objectif</span> <span className="font-bold ml-1">{objectif[0]}</span></div>
      </div>

      {/* Views */}
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <WeekListView weekPlan={weekPlan} />
          </motion.div>
        ) : (
          <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <MonthCalendar weekPlan={weekPlan} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customize modal */}
      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Personnaliser mon parcours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <div className="text-sm font-medium mb-2">Heures par jour</div>
              <div className="grid grid-cols-7 gap-2">
                {dayLabels.map((d, i) => (
                  <div key={d} className="text-center">
                    <div className="text-[11px] text-muted-foreground mb-1">{d}</div>
                    <label className="sr-only" htmlFor={`hours-${d}`}>Heures {d}</label>
                    <input
                      id={`hours-${d}`}
                      type="number"
                      min={0}
                      max={8}
                      step={0.5}
                      value={hours[i]}
                      onChange={e => {
                        const next = [...hours];
                        next[i] = parseFloat(e.target.value) || 0;
                        setHours(next);
                      }}
                      className="w-full h-9 rounded-lg border border-border bg-background text-center text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                    />
                    <div className="text-[10px] text-muted-foreground mt-0.5">{hours[i]}h</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Objectif score</span>
                <span className="text-sm font-bold text-primary">{objectif[0]}/600</span>
              </div>
              <Slider min={200} max={600} step={10} value={objectif} onValueChange={setObjectif} />
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Date d'examen</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {format(examDate, "d MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={examDate}
                    onSelect={d => d && setExamDate(d)}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <p className="text-xs text-muted-foreground">Tu ne perdras pas ta progression.</p>

            <Button className="w-full" onClick={handleRegenerate} disabled={regenerating}>
              {regenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                "Regénérer mon parcours"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WeekListView({ weekPlan }: { weekPlan: DayPlan[] }) {
  // Group days into weeks (Mon-Sun)
  const weeks = useMemo(() => {
    const grouped: DayPlan[][] = [];
    let currentWeek: DayPlan[] = [];
    let currentWeekStart: string | null = null;

    weekPlan.forEach(day => {
      const date = parseISO(day.fullDate);
      const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
      if (weekStart !== currentWeekStart) {
        if (currentWeek.length > 0) grouped.push(currentWeek);
        currentWeek = [day];
        currentWeekStart = weekStart;
      } else {
        currentWeek.push(day);
      }
    });
    if (currentWeek.length > 0) grouped.push(currentWeek);
    return grouped;
  }, [weekPlan]);

  // Find which week contains today
  const currentWeekIndex = useMemo(() => {
    const idx = weeks.findIndex(w => w.some(d => d.isToday));
    return idx >= 0 ? idx : 0;
  }, [weeks]);

  const [weekIdx, setWeekIdx] = useState(currentWeekIndex);
  const days = weeks[weekIdx] || [];
  const isCurrentWeek = weekIdx === currentWeekIndex;

  const firstDate = days[0] ? parseISO(days[0].fullDate) : new Date();
  const lastDate = days[days.length - 1] ? parseISO(days[days.length - 1].fullDate) : new Date();
  const weekLabel = `${format(firstDate, "d", { locale: fr })} – ${format(lastDate, "d MMMM", { locale: fr })}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setWeekIdx(i => Math.max(0, i - 1))}
          disabled={weekIdx === 0}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <h3 className="text-sm font-bold capitalize">{weekLabel}</h3>
          {isCurrentWeek && (
            <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Semaine en cours</span>
          )}
        </div>
        <button
          onClick={() => setWeekIdx(i => Math.min(weeks.length - 1, i + 1))}
          disabled={weekIdx === weeks.length - 1}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border z-0" />
        <div className="relative z-10 space-y-2">
          {days.map((day, i) => {
            const isLeft = i % 2 === 0;
            const isPast = !day.isToday && new Date(day.fullDate) < new Date();
            const allDone = day.activities.every(a => a.done);
            const hasMissed = isPast && !allDone && day.activities.some(a => !a.done);
            return (
              <motion.div key={day.date} initial={{ opacity: 0, x: isLeft ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.2 }} className="flex items-start">
                {isLeft ? (
                  <div className="w-[46%] flex justify-end pr-4"><DayCard day={day} align="right" /></div>
                ) : (
                  <div className="w-[46%]" />
                )}
                <div className="w-[8%] flex justify-center pt-3">
                  <div className={cn("rounded-full border-4 border-background",
                    day.isToday ? "w-4 h-4 bg-primary shadow-lg shadow-primary/30" :
                    hasMissed ? "w-3 h-3 bg-destructive" :
                    allDone && isPast ? "w-3 h-3 bg-success" :
                    "w-3 h-3 bg-border"
                  )} />
                </div>
                {!isLeft ? (
                  <div className="w-[46%] pl-4"><DayCard day={day} align="left" /></div>
                ) : (
                  <div className="w-[46%]" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, align }: { day: DayPlan; align: "left" | "right" }) {
  const isPast = !day.isToday && new Date(day.fullDate) < new Date();
  const hasMissed = isPast && day.activities.some(a => !a.done);

  return (
    <div className={cn(
      "rounded-xl border p-3 w-full max-w-[280px]",
      day.isToday ? "border-primary bg-primary/10 shadow-sm" :
      hasMissed ? "border-destructive/30 bg-card" :
      "border-border bg-card"
    )}>
      <div className={cn("flex items-center gap-2 mb-2", align === "right" && "justify-end")}>
        <span className={cn("text-xs font-bold", day.isToday ? "text-primary" : "text-muted-foreground")}>{day.date}</span>
        {day.isToday && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Auj.</span>}
      </div>
      <div className="space-y-1.5">
        {day.activities.map(a => {
          const Icon = activityIcon(a.type);
          const isMissed = isPast && !a.done;
          const badge = (
            <span className={cn("text-[11px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
              isMissed ? "bg-destructive/10 text-destructive" :
              a.done ? "bg-muted text-muted-foreground" :
              "bg-primary/10 text-primary"
            )}>{a.duration}</span>
          );
          const icon = a.done ? (
            <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-success-foreground" /></div>
          ) : isMissed ? (
            <div className="w-5 h-5 flex items-center justify-center shrink-0"><AlertCircle className="w-3 h-3 text-destructive" /></div>
          ) : (
            <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Icon className="w-3 h-3 text-primary" /></div>
          );
          const title = (
            <span className={cn("text-[13px] font-medium truncate",
              a.done && "text-muted-foreground line-through",
              isMissed && "text-destructive"
            )}>{a.title}</span>
          );

          if (align === "right") {
            return <div key={a.id} className="flex items-center gap-2 justify-end">{badge}{title}{icon}</div>;
          }
          return <div key={a.id} className="flex items-center gap-2">{icon}{title}{badge}</div>;
        })}
      </div>
    </div>
  );
}

function MonthCalendar({ weekPlan }: { weekPlan: DayPlan[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const today = new Date();

  const activitiesByDate = useMemo(() => {
    const map: Record<string, DayPlan> = {};
    weekPlan.forEach(day => { map[day.fullDate] = day; });
    return map;
  }, [weekPlan]);

  const workedDays = useMemo(() => {
    const days = new Set<string>(pastWorkedDates);
    weekPlan.forEach(day => {
      if (day.activities.some(a => a.done)) days.add(day.fullDate);
    });
    return days;
  }, [weekPlan]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const dayHeaders = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const selectedKey = format(selectedDate, "yyyy-MM-dd");
  const selectedDayPlan = activitiesByDate[selectedKey];

  return (
    <div className="flex gap-5">
      {/* Left: Calendar */}
      <div className="bg-card rounded-xl border border-border p-5 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-bold capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: fr })}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayHeaders.map(d => (
            <div key={d} className="text-center text-[11px] font-medium text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {allDays.map(day => {
            const key = format(day, "yyyy-MM-dd");
            const inMonth = isSameMonth(day, currentMonth);
            const isDayToday = isDateToday(day);
            const worked = workedDays.has(key);
            const isCurrentWeek = isSameWeek(day, today, { weekStartsOn: 1 });
            const isSelected = isSameDay(day, selectedDate);
            const hasActivities = !!activitiesByDate[key];
            const dayPlan = activitiesByDate[key];
            const isPastDay = day < today && !isDayToday;
            const hasMissedActivities = isPastDay && dayPlan && dayPlan.activities.some(a => !a.done);

            return (
              <button
                key={key}
                onClick={() => inMonth && setSelectedDate(day)}
                className={cn(
                  "relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all",
                  !inMonth && "text-muted-foreground/30 cursor-default",
                  inMonth && "cursor-pointer hover:bg-muted/50",
                  inMonth && isCurrentWeek && !isSelected && "bg-primary/5",
                  isDayToday && !isSelected && "ring-2 ring-primary font-bold",
                  isSelected && "bg-primary text-primary-foreground font-bold ring-0",
                  hasMissedActivities && inMonth && !isSelected && "bg-destructive/5",
                )}
              >
                {worked && inMonth && !isSelected && !hasMissedActivities && (
                  <div className="absolute inset-1 rounded-lg bg-success/20" />
                )}
                {hasActivities && !worked && inMonth && !isSelected && !hasMissedActivities && (
                  <div className="absolute inset-1 rounded-lg bg-muted/50" />
                )}
                <span className="relative z-10">{format(day, "d")}</span>
                {(worked || hasActivities) && inMonth && !isSelected && (
                  <div className={cn("absolute bottom-1 w-1.5 h-1.5 rounded-full z-10",
                    hasMissedActivities ? "bg-destructive" :
                    worked ? "bg-success" : "bg-primary/50"
                  )} />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded bg-success/20 border border-success/30" />
            Fait
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded bg-destructive/5 border border-destructive/30" />
            Manqué
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded bg-muted/50 border border-border" />
            À faire
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded bg-primary/5 border border-primary/20" />
            Semaine en cours
          </div>
        </div>
      </div>

      {/* Right: Day detail */}
      <div className="w-[340px] shrink-0">
        <div className="bg-card rounded-xl border border-border p-5 sticky top-6">
          <h4 className="text-sm font-bold capitalize mb-1">
            {format(selectedDate, "EEEE d MMMM", { locale: fr })}
          </h4>
          {isDateToday(selectedDate) && (
            <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Aujourd'hui</span>
          )}

          {selectedDayPlan ? (
            <div className="space-y-2 mt-4">
              {selectedDayPlan.activities.map(a => {
                const Icon = typeIcons[a.type];
                const isPastDay = selectedDate < today && !isDateToday(selectedDate);
                const isMissed = isPastDay && !a.done;
                return (
                  <div key={a.id} className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                    a.done ? "bg-success/5 border-success/20" :
                    isMissed ? "bg-destructive/5 border-destructive/20" :
                    "bg-card border-border"
                  )}>
                    {a.done ? (
                      <div className="w-7 h-7 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-success" />
                      </div>
                    ) : isMissed ? (
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-sm font-medium",
                        a.done && "line-through text-muted-foreground",
                        isMissed && "text-destructive"
                      )}>{a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.duration}</div>
                    </div>
                  </div>
                );
              })}
              <div className="text-xs text-muted-foreground pt-2 border-t border-border mt-3">
                {selectedDayPlan.activities.filter(a => a.done).length}/{selectedDayPlan.activities.length} activités terminées
              </div>
            </div>
          ) : workedDays.has(selectedKey) ? (
            <div className="mt-4 p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Travail effectué</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Les détails de cette journée ne sont plus disponibles.</p>
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">Aucune activité ce jour.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
