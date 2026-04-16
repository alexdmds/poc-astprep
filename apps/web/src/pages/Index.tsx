import { useState, useEffect } from "react";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, LineChart, Line
} from "recharts";
import { Clock, Flame, ArrowRight, TrendingUp, HelpCircle, BookOpen, Dumbbell, Layers, Settings, Bell, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { DailyChallengePopup } from "@/components/DailyChallengePopup";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/lib/auth";
import {
  useStreak,
  useErrorCount,
  useTmScores,
  useWeeklyMinutes,
  useNextLiveCourse,
  useEstimatedScore,
} from "@/lib/queries/dashboard";

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

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const { data: streak } = useStreak(user?.id);
  const { data: errorCount } = useErrorCount(user?.id);
  const { data: tmScores } = useTmScores(user?.id);
  const { data: weeklyMinutes } = useWeeklyMinutes(user?.id);
  const { data: nextLiveCourse } = useNextLiveCourse();
  const { data: estimatedScore } = useEstimatedScore(user?.id);

  const currentStreak = streak?.current_streak ?? 0;
  const errorsToReview = errorCount ?? 0;
  const hasTmScores = tmScores && tmScores.length > 0;
  const scoreHistory = tmScores?.map(s => s.score) ?? [];

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
          {hasTmScores ? (
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
                  <YAxis domain={[0, 600]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13, background: "hsl(var(--card))" }}
                    formatter={(value: number) => [`${value}/600`, "Score"]}
                  />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#purpleGrad)" dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--card))" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[calc(100%-32px)] flex flex-col items-center justify-center text-center gap-2">
              <p className="text-sm text-muted-foreground">Aucun test blanc complété.</p>
              <button
                onClick={() => navigate("/tests-blancs")}
                className="text-xs text-primary hover:underline font-medium"
              >
                Passer un test blanc →
              </button>
            </div>
          )}
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
                    Calculé à partir de la moyenne de tes 3 derniers TM blancs.
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
          {estimatedScore !== null && estimatedScore !== undefined ? (
            <>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-foreground">{estimatedScore}<span className="text-lg text-muted-foreground font-normal">/600</span></span>
                {scoreHistory.length >= 2 && <Sparkline data={scoreHistory} />}
              </div>
              {scoreHistory.length >= 2 && (
                <div className="flex items-center gap-1 mt-2 text-success text-xs font-medium">
                  <TrendingUp className="w-3 h-3" /> {scoreHistory[scoreHistory.length - 1] - scoreHistory[0] > 0 ? "+" : ""}{scoreHistory[scoreHistory.length - 1] - scoreHistory[0]} pts
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-2xl font-bold text-muted-foreground">—</span>
              <span className="text-xs text-muted-foreground">Passe un test blanc</span>
            </div>
          )}
        </div>

        {/* Temps */}
        <SmallCard>
          <BentoCardTitle>Temps cette semaine</BentoCardTitle>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-3xl font-bold">
              {weeklyMinutes ? formatMinutes(weeklyMinutes) : "—"}
            </span>
          </div>
          {!weeklyMinutes && (
            <div className="text-xs text-muted-foreground mt-2">Commence à étudier !</div>
          )}
        </SmallCard>

        {/* Mon programme du jour */}
        <button
          data-tour="programme"
          onClick={() => navigate("/parcours")}
          className="col-span-2 row-span-2 bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow overflow-hidden flex flex-col text-left cursor-pointer hover:border-primary/30"
        >
          <BentoCardTitle>Mon programme du jour</BentoCardTitle>
          <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center">
            <p className="text-sm text-muted-foreground">Configure ton parcours pour voir ton programme ici.</p>
            <span className="text-xs text-primary font-medium flex items-center gap-1">
              Voir mon parcours <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        {/* Cours live */}
        <div data-tour="cours-du-jour" className="col-span-2 row-span-1 bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow overflow-hidden flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <BentoCardTitle>Cours live</BentoCardTitle>
            {nextLiveCourse ? (
              <>
                <div className="text-sm font-medium text-foreground truncate">{nextLiveCourse.title}</div>
                <div className="text-[11px] text-muted-foreground">
                  {new Date(nextLiveCourse.scheduled_at).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  {nextLiveCourse.professor && ` · ${nextLiveCourse.professor}`}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Aucun cours live programmé</div>
            )}
          </div>
          {nextLiveCourse && (
            <button
              onClick={() => navigate("/cours-live")}
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-xs font-medium hover:bg-primary/90 transition-colors shrink-0"
            >
              Voir
            </button>
          )}
        </div>

        {/* Streak */}
        <div data-tour="streak" className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
          <BentoCardTitle>Streak</BentoCardTitle>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-warning" />
            <span className="text-3xl font-bold">{currentStreak}</span>
            <span className="text-sm text-muted-foreground">jours</span>
          </div>
          {currentStreak === 0 && (
            <div className="text-xs text-muted-foreground mt-1">Lance-toi aujourd'hui !</div>
          )}
        </div>

        {/* Erreurs à réviser */}
        <div data-tour="erreurs" className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
          <BentoCardTitle>Erreurs à réviser</BentoCardTitle>
          <div className="flex items-center gap-3">
            <span className={`text-3xl font-bold w-10 h-10 rounded-xl flex items-center justify-center ${errorsToReview > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {errorsToReview}
            </span>
          </div>
          {errorsToReview > 0 ? (
            <button onClick={() => navigate("/carnet")} className="inline-flex items-center gap-1 text-primary text-xs font-medium mt-2 hover:underline">
              Réviser <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <div className="text-xs text-muted-foreground mt-2">Aucune erreur à réviser</div>
          )}
        </div>
      </div>
    </div>
  );
}
