import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";
import { Clock, Flame, ArrowRight, TrendingUp, HelpCircle, BookOpen, Dumbbell, Layers, Settings, Bell, Video, Trophy, CheckCircle2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { tmScores, estimatedScoreHistory } from "@/data/stats";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { DailyChallengePopup } from "@/components/DailyChallengePopup";
import { useProfile } from "@/hooks/use-profile";

const SmallCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow ${className}`}>
    {children}
  </div>
);

const BentoCardTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">{children}</div>
);

const Sparkline = ({ data }: { data: number[] }) => (
  <div className="w-16 h-6">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.map((v, i) => ({ v, i }))}>
        <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [challengeOpen, setChallengeOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastSeen = localStorage.getItem("challenge-last-seen");
    if (lastSeen !== today) {
      setChallengeOpen(true);
      localStorage.setItem("challenge-last-seen", today);
    }
  }, []);

  const programme = [
    {
      icon: BookOpen,
      type: "Cours",
      title: "Probabilités conditionnelles",
      subtitle: "Calcul · 14 min",
    },
    {
      icon: Dumbbell,
      type: "Sous-test",
      title: "Calcul — Sous-test #13",
      subtitle: "15 questions · 20 min",
    },
    {
      icon: Layers,
      type: "Flashcards",
      title: "Deck Probabilités",
      subtitle: "18 cartes · 8 à réviser",
    },
  ];

  return (
    <div className="p-6 py-8">
      <DailyChallengePopup
        open={challengeOpen}
        onClose={() => setChallengeOpen(false)}
        onViewLeaderboard={() => navigate("/classement")}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">
          {profile?.full_name?.split(" ")[0] ?? "Bienvenue"},{" "}
          {profile?.exam_date
            ? `il te reste ${Math.max(0, Math.ceil((new Date(profile.exam_date).getTime() - Date.now()) / 86400000))} jours avant ton examen !`
            : "bonne préparation !"}
        </h1>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="relative w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[360px] p-0" align="end" sideOffset={8}>
              <NotificationsDropdown onViewAll={() => navigate("/notifications")} />
            </PopoverContent>
          </Popover>
          <button
            onClick={() => navigate("/parametres")}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Paramètres"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 auto-rows-[130px]">
        {/* Large: TM progression */}
        <div data-tour="progression" className="col-span-2 row-span-3 bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
          <BentoCardTitle>Progression TAGE MAGE blancs</BentoCardTitle>
          <div className="h-[calc(100%-32px)]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tmScores}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} className="fill-muted-foreground" />
                <YAxis domain={[250, 450]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} className="fill-muted-foreground" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13, background: "hsl(var(--card))" }}
                  formatter={(value: number) => [`${value}/600`, "Score"]}
                />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#purpleGrad)" dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--card))" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score estimé */}
        <div data-tour="score-estime" className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
          <BentoCardTitle>
            <span className="flex items-center gap-1.5">
              Score estimé
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex" aria-label="Comment est calculé le score estimé ?">
                    <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="text-sm max-w-xs" side="bottom">
                  <p className="text-foreground font-medium mb-1">Score estimé</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Ton score estimé est calculé à partir de la moyenne de tes 3 derniers TM blancs, pondérée par la variance de tes sous-tests.
                  </p>
                  <button
                    onClick={() => navigate("/faq-score")}
                    className="text-xs text-primary font-medium mt-2 hover:underline"
                  >
                    En savoir plus →
                  </button>
                </PopoverContent>
              </Popover>
            </span>
          </BentoCardTitle>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-foreground">387<span className="text-lg text-muted-foreground font-normal">/600</span></span>
            <Sparkline data={estimatedScoreHistory} />
          </div>
          <div className="flex items-center gap-1 mt-2 text-success text-xs font-medium">
            <TrendingUp className="w-3 h-3" /> +23 pts en 30j
          </div>
        </div>

        {/* Temps */}
        <SmallCard>
          <BentoCardTitle>Temps cette semaine</BentoCardTitle>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-3xl font-bold">4h32</span>
          </div>
          <div className="text-success text-xs font-medium mt-2">+33% vs semaine dernière</div>
        </SmallCard>

        {/* Mon programme du jour */}
        <button
          data-tour="programme"
          onClick={() => navigate("/parcours")}
          className="col-span-2 row-span-2 bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow overflow-hidden flex flex-col text-left cursor-pointer hover:border-primary/30"
        >
          <BentoCardTitle>Mon programme du jour</BentoCardTitle>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {programme.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.type} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
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

        {/* Cours du jour */}
        <div data-tour="cours-du-jour" className="col-span-2 row-span-1 bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow overflow-hidden flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <BentoCardTitle>Cours du jour</BentoCardTitle>
            <div className="text-sm font-medium text-foreground">Calcul avec Etienne</div>
            <div className="text-[11px] text-muted-foreground">513/600 au TAGE MAGE</div>
          </div>
          <button
            onClick={() => navigate("/cours-live")}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-xs font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            Accéder au cours
          </button>
        </div>

        {/* Streak */}
        <div data-tour="streak" className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
          <BentoCardTitle>Streak</BentoCardTitle>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-warning" />
            <span className="text-3xl font-bold">7</span>
            <span className="text-sm text-muted-foreground">jours</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Top 12% de la plateforme</div>
        </div>

        {/* Erreurs à réviser */}
        <div data-tour="erreurs" className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
          <BentoCardTitle>Erreurs à réviser</BentoCardTitle>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold bg-primary text-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center">12</span>
          </div>
          <button onClick={() => navigate("/carnet")} className="inline-flex items-center gap-1 text-primary text-xs font-medium mt-2 hover:underline">
            Réviser <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
