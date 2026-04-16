import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart,
  BarChart, Bar, ReferenceLine
} from "recharts";
import { TrendingUp, ArrowRight } from "lucide-react";
import { tmScores, lastTmScores, themesBySection } from "@/data/stats";
import { scoredSections } from "@/data/sections";
import { cn } from "@/lib/utils";
import QuestionsHistory from "@/components/QuestionsHistory";

const timeFilters = ["Tout", "Semaine", "30 jours", "Depuis dernier TM"] as const;
const chartTabs = ["TM blancs", "Par sous-test"] as const;

const getThemeColor = (p: number) => p < 40 ? "hsl(var(--destructive))" : p < 70 ? "hsl(var(--warning))" : "hsl(var(--success))";

export default function Statistiques() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<string>("Tout");
  const [chartTab, setChartTab] = useState<string>("TM blancs");
  const [themeSection, setThemeSection] = useState("calcul");

  const themes = themesBySection[themeSection] ?? [];

  return (
    <div className="p-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Statistiques</h1>
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          {timeFilters.map(f => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors min-h-[44px] flex items-center",
                f === timeFilter ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Score estimé", value: "387/600", sub: <span className="text-success flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +23 pts</span> },
          { label: "Temps d'étude total", value: "42h", sub: "4h32 cette semaine" },
          { label: "Questions répondues", value: "847", sub: "64% réussite" },
          { label: "Jours actifs ce mois", value: "18/30", sub: "" },
        ].map(k => (
          <div key={k.label} className="bg-card rounded-xl border border-border p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{k.label}</div>
            <div className="text-2xl font-bold mt-1">{k.value}</div>
            {k.sub && <div className="text-xs text-muted-foreground mt-1">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex gap-1 mb-4">
          {chartTabs.map(t => (
            <button
              key={t}
              onClick={() => setChartTab(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] flex items-center",
                t === chartTab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartTab === "TM blancs" ? (
              <AreaChart data={tmScores}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} className="fill-muted-foreground" />
                <YAxis domain={[250, 450]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} className="fill-muted-foreground" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13, background: "hsl(var(--card))" }} formatter={(v: number) => [`${v}/600`, "Score"]} />
                <ReferenceLine y={368} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label={{ value: "Moy. ASTPrep", position: "right", fontSize: 10 }} />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#grad)" dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--card))" }} />
              </AreaChart>
            ) : (
              <BarChart data={lastTmScores} layout="vertical">
                <XAxis type="number" domain={[0, 60]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} className="fill-muted-foreground" />
                <YAxis type="category" dataKey="section" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={100} className="fill-muted-foreground" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13, background: "hsl(var(--card))" }} formatter={(v: number) => [`${v}/60`, "Score"]} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail by theme */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Détail par thème</h2>

        <div className="flex gap-2 mb-4" role="tablist">
          {scoredSections.map(s => {
            const isActive = themeSection === s.id;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setThemeSection(s.id)}
                className="flex flex-col items-center gap-1 min-h-[44px]"
                role="tab"
                aria-selected={isActive}
              >
                <div
                  className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-all", !isActive && "bg-muted hover:bg-muted/80")}
                  style={isActive ? { background: s.hsl, boxShadow: `0 4px 12px color-mix(in srgb, ${s.hsl} 30%, transparent)` } : {}}
                >
                  <Icon className="w-[17px] h-[17px]" style={{ color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))" }} />
                </div>
                <span className={cn("text-[10px] font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>{s.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          {themes.sort((a, b) => a.percent - b.percent).map(t => (
            <div key={t.name} className="bg-card rounded-xl border border-border p-3 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium">{t.name}</span>
                  <span className="text-xs text-muted-foreground">({t.questions} questions)</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${t.percent}%`, background: getThemeColor(t.percent) }} />
                </div>
              </div>
              <span className="text-sm font-bold w-10 text-right" style={{ color: getThemeColor(t.percent) }}>{t.percent}%</span>
              <button
                onClick={() => navigate(`/generateur?section=${encodeURIComponent(themeSection)}&theme=${encodeURIComponent(t.name)}`)}
                className="text-xs text-primary font-medium flex items-center gap-1 hover:underline whitespace-nowrap min-h-[44px]"
              >
                S'entraîner <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Questions History */}
      <QuestionsHistory />
    </div>
  );
}
