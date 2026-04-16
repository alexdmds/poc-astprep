import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { TrendingUp, ArrowRight, Flame, Trophy } from "lucide-react";
import { toeicScoreHistory, toeicMicroCompetences, toeicParts } from "@/data/toeic";
import { cn } from "@/lib/utils";

const timeFilters = ["Tout", "Semaine", "30j", "Depuis dernier TOEIC"] as const;
const chartTabs = ["TOEIC blancs", "Par Part"] as const;
const competenceCategories = ["Grammaire", "Vocabulaire", "Listening", "Reading", "Stratégie"] as const;

const partScores = [
  { name: "Part 1", score: 82 }, { name: "Part 2", score: 68 }, { name: "Part 3", score: 74 },
  { name: "Part 4", score: 71 }, { name: "Part 5", score: 85 }, { name: "Part 6", score: 62 }, { name: "Part 7", score: 77 },
];

const heatmap = Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => Math.floor(Math.random() * 150)));

// Personal records — 7 parts + 1 TOEIC blanc
const partRecords = [
  { name: "Part 1", score: "92%", date: "12 avr", recent: false },
  { name: "Part 2", score: "76%", date: "15 avr", recent: true },
  { name: "Part 3", score: "80%", date: "10 avr", recent: false },
  { name: "Part 4", score: "74%", date: "8 avr", recent: false },
  { name: "Part 5", score: "88%", date: "15 avr", recent: true },
  { name: "Part 6", score: "70%", date: "5 avr", recent: false },
  { name: "Part 7", score: "82%", date: "14 avr", recent: true },
];
const toeicBlancRecord = { score: "780/990", listening: "405/495", reading: "375/495", date: "15 avr", recent: true };

export default function ToeicStatistiques() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("Tout");
  const [chartTab, setChartTab] = useState("TOEIC blancs");
  const [compCat, setCompCat] = useState("grammaire");

  const themes = toeicMicroCompetences[compCat] ?? [];

  return (
    <div className="p-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Statistiques TOEIC</h1>
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          {timeFilters.map(f => (
            <button key={f} onClick={() => setTimeFilter(f)}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                f === timeFilter ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Score estimé", value: "780/990", sub: <span className="text-success flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +40 pts</span> },
          { label: "Listening", value: "405/495", sub: "↑ tendance" },
          { label: "Reading", value: "375/495", sub: "↑ tendance" },
          { label: "Temps étudié", value: "38h", sub: "+12% vs sem." },
        ].map(k => (
          <div key={k.label} className="bg-card rounded-xl border border-border p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{k.label}</div>
            <div className="text-2xl font-bold mt-1">{k.value}</div>
            {k.sub && <div className="text-xs text-muted-foreground mt-1">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex gap-1 mb-4">
          {chartTabs.map(t => (
            <button key={t} onClick={() => setChartTab(t)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                t === chartTab ? "bg-sky-500/10 text-sky-500" : "text-muted-foreground hover:bg-muted")}>
              {t}
            </button>
          ))}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartTab === "TOEIC blancs" ? (
              <AreaChart data={toeicScoreHistory}>
                <defs><linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.15} /><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                </linearGradient></defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[500, 990]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13, background: "hsl(var(--card))" }} formatter={(v: number) => [`${v}/990`, "Score"]} />
                <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#skyGrad)" dot={{ r: 4, fill: "#0ea5e9" }} />
              </AreaChart>
            ) : (
              <BarChart data={partScores} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} formatter={(v: number) => [`${v}%`, "Réussite"]} />
                <Bar dataKey="score" fill="#0ea5e9" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Personal Records */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-sky-500" /> Mes records
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {/* TOEIC blanc record */}
          <div className="col-span-2 bg-card rounded-xl border border-border p-4 hover:scale-[1.02] hover:shadow-lg transition-all duration-200">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Meilleur TOEIC blanc</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold">{toeicBlancRecord.score}</span>
              {toeicBlancRecord.recent && (
                <span className="bg-sky-500/10 text-sky-500 text-[10px] rounded-full px-2 py-0.5 font-medium animate-pulse">Nouveau !</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">L: {toeicBlancRecord.listening} · R: {toeicBlancRecord.reading}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{toeicBlancRecord.date}</div>
          </div>

          {/* Part records */}
          {partRecords.map(r => (
            <div key={r.name} className="bg-card rounded-xl border border-border p-3 hover:scale-[1.02] hover:shadow-lg transition-all duration-200">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{r.name}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xl font-bold">{r.score}</span>
                {r.recent && (
                  <span className="bg-sky-500/10 text-sky-500 text-[10px] rounded-full px-2 py-0.5 font-medium animate-pulse">Nouveau !</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{r.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Micro-compétences */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Détail par micro-compétence</h2>
        <div className="flex gap-2 mb-4">
          {competenceCategories.map(c => (
            <button key={c} onClick={() => setCompCat(c.toLowerCase())}
              className={cn("px-4 py-2 rounded-full text-xs font-medium border transition-colors",
                compCat === c.toLowerCase() ? "bg-sky-500/10 text-sky-500 border-sky-500" : "border-border text-muted-foreground")}>
              {c}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {themes.sort((a, b) => a.percent - b.percent).map(t => (
            <div key={t.name} className="bg-card rounded-xl border border-border p-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium">{t.name}</span>
                  <span className="text-xs text-muted-foreground">({t.questions} q.)</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${t.percent}%`, background: t.percent < 30 ? "hsl(var(--destructive))" : t.percent < 60 ? "hsl(var(--warning))" : "hsl(var(--success))" }} />
                </div>
              </div>
              <span className="text-sm font-bold w-10 text-right" style={{ color: t.percent < 30 ? "hsl(var(--destructive))" : t.percent < 60 ? "hsl(var(--warning))" : "hsl(var(--success))" }}>{t.percent}%</span>
              <button onClick={() => navigate(`/toeic/generateur?theme=${t.name}`)} className="text-xs text-sky-500 font-medium flex items-center gap-1 hover:underline whitespace-nowrap">
                S'entraîner <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Activité</h2>
        <div className="grid grid-cols-7 gap-1">
          {heatmap.flat().map((v, i) => (
            <div key={i} className="aspect-square rounded-sm" style={{
              background: v === 0 ? "hsl(var(--muted))" : `rgba(14, 165, 233, ${Math.min(v / 150, 1)})`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
