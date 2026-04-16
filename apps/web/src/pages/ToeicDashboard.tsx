import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar
} from "recharts";
import { Clock, Flame, ArrowRight, TrendingUp, BookOpen, Dumbbell, Layers, Settings, Bell, Target, Headphones, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toeicScoreHistory } from "@/data/toeic";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { DailyChallengePopup } from "@/components/DailyChallengePopup";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/use-profile";

const sectionScores = [
  { name: "P1", score: 82 }, { name: "P2", score: 68 }, { name: "P3", score: 74 },
  { name: "P4", score: 71 }, { name: "P5", score: 85 }, { name: "P6", score: 62 }, { name: "P7", score: 77 },
];

const programme = [
  { icon: Headphones, type: "Listening", title: "Part 3 — Conversations #8", subtitle: "30 questions · 25 min" },
  { icon: BookOpen, type: "Cours", title: "Grammar: Phrasal Verbs", subtitle: "Grammaire · 12 min" },
  { icon: Layers, type: "Flashcards", title: "Business Vocabulary Set 14", subtitle: "24 cartes · 11 à réviser" },
];

const weakTopics = [
  { name: "Relative Clauses", pct: 34 },
  { name: "Phrasal Verbs", pct: 42 },
  { name: "Conditional Forms", pct: 48 },
  { name: "Passive Voice", pct: 55 },
];

const SmallCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow ${className}`}>{children}</div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">{children}</div>
);

// TOEIC daily challenges
const toeicChallenges = [
  { icon: Dumbbell, title: "15 questions de Part 5 niveau Hard", reward: "+15 points", route: "/toeic/entrainement/toeic-st-p5-1" },
  { icon: Headphones, title: "Session de Listening trainer 2 min", reward: "+10 points", route: "/toeic/outils/listening-trainer" },
];

export default function ToeicDashboard() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [challengeOpen, setChallengeOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastSeen = localStorage.getItem("lastDailyChallengeToeic");
    if (lastSeen !== today) {
      setChallengeOpen(true);
      localStorage.setItem("lastDailyChallengeToeic", today);
    }
  }, []);

  return (
    <div className="p-6 py-8">
      {/* TOEIC Daily Challenge */}
      <DailyChallengePopup
        open={challengeOpen}
        onClose={() => setChallengeOpen(false)}
        onViewLeaderboard={() => navigate("/toeic/classement")}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">
            {profile?.full_name?.split(" ")[0] ?? "Bienvenue"},{" "}
            objectif {profile?.target_score ?? "—"}/990{" "}
            {profile?.exam_date
              ? `dans ${Math.max(0, Math.ceil((new Date(profile.exam_date).getTime() - Date.now()) / 86400000))} jours !`
              : "!"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Continue comme ça, tu progresses bien.</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate("/toeic/notifications")}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <button onClick={() => navigate("/toeic/parametres")}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 auto-rows-[130px]">
        {/* Large chart */}
        <SmallCard className="col-span-2 row-span-3">
          <Label>Progression TOEIC blancs</Label>
          <div className="h-[calc(100%-32px)]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={toeicScoreHistory}>
                <defs>
                  <linearGradient id="toeicGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} className="fill-muted-foreground" />
                <YAxis domain={[500, 990]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} className="fill-muted-foreground" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13, background: "hsl(var(--card))" }} formatter={(v: number) => [`${v}/990`, "Score"]} />
                <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#toeicGrad)" dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "hsl(var(--card))" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SmallCard>

        {/* Score estimé */}
        <SmallCard>
          <Label>Score estimé</Label>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">780<span className="text-lg text-muted-foreground font-normal">/990</span></span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-success text-xs font-medium">
            <TrendingUp className="w-3 h-3" /> +40 pts en 30j
          </div>
        </SmallCard>

        {/* Listening / Reading */}
        <SmallCard>
          <Label>Listening / Reading</Label>
          <div className="flex gap-4 items-end">
            <div>
              <Headphones className="w-4 h-4 text-muted-foreground mb-1" />
              <span className="text-2xl font-bold">405</span>
              <span className="text-xs text-muted-foreground">/495</span>
            </div>
            <div>
              <BookOpen className="w-4 h-4 text-muted-foreground mb-1" />
              <span className="text-2xl font-bold">375</span>
              <span className="text-xs text-muted-foreground">/495</span>
            </div>
          </div>
        </SmallCard>

        {/* Programme du jour */}
        <button onClick={() => navigate("/toeic/parcours")}
          className="col-span-2 row-span-2 bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow overflow-hidden flex flex-col text-left cursor-pointer hover:border-sky-500/30">
          <Label>Mon programme du jour</Label>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {programme.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.type} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border">
                  <div className="w-8 h-8 rounded-md bg-sky-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-sky-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{s.type}</span>
                    <div className="text-[13px] font-medium truncate leading-tight">{s.title}</div>
                    <div className="text-[11px] text-muted-foreground leading-tight">{s.subtitle}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              );
            })}
          </div>
        </button>

        {/* Streak */}
        <SmallCard>
          <Label>Streak</Label>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-warning" />
            <span className="text-3xl font-bold">4</span>
            <span className="text-sm text-muted-foreground">jours</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Top 28% de la plateforme</div>
        </SmallCard>

        {/* Erreurs */}
        <SmallCard>
          <Label>Erreurs à réviser</Label>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold bg-sky-500 text-white w-10 h-10 rounded-xl flex items-center justify-center">34</span>
          </div>
          <button onClick={() => navigate("/toeic/carnet")} className="inline-flex items-center gap-1 text-sky-500 text-xs font-medium mt-2 hover:underline">
            Réviser <ArrowRight className="w-3 h-3" />
          </button>
        </SmallCard>

        {/* Score par section */}
        <SmallCard className="col-span-2 row-span-2">
          <Label>Score par Part</Label>
          <div className="h-[calc(100%-32px)]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionScores}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} className="fill-muted-foreground" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28} className="fill-muted-foreground" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13, background: "hsl(var(--card))" }} formatter={(v: number) => [`${v}%`, "Réussite"]} />
                <Bar dataKey="score" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SmallCard>

        {/* Weak topics */}
        <SmallCard className="col-span-2 row-span-2">
          <Label>Points faibles à travailler</Label>
          <div className="space-y-3 mt-1">
            {weakTopics.map(t => (
              <div key={t.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="text-xs font-bold" style={{ color: t.pct < 40 ? "hsl(var(--destructive))" : "hsl(var(--warning))" }}>{t.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${t.pct}%` }} transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full rounded-full" style={{ background: t.pct < 40 ? "hsl(var(--destructive))" : "hsl(var(--warning))" }} />
                  </div>
                </div>
                <button onClick={() => navigate(`/toeic/generateur?theme=${t.name}`)} className="text-xs text-sky-500 font-medium flex items-center gap-1 hover:underline whitespace-nowrap">
                  S'entraîner <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </SmallCard>

        {/* Temps */}
        <SmallCard>
          <Label>Temps cette semaine</Label>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-3xl font-bold">3h18</span>
          </div>
          <div className="text-success text-xs font-medium mt-2">+12% vs semaine dernière</div>
        </SmallCard>
      </div>
    </div>
  );
}
