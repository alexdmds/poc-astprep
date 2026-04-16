import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Target, Play, RotateCcw, CheckCircle2, Eye } from "lucide-react";
import { classicTests, monthlyTests } from "@/data/mocktests";
import type { MockTest } from "@/data/mocktests";
import { cn } from "@/lib/utils";

function MockTestCard({ test, index }: { test: MockTest; index: number }) {
  const navigate = useNavigate();
  const isDone = test.score !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.15 }}
      className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow flex flex-col justify-between"
    >
      {/* Top */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {isDone && <CheckCircle2 className="w-4 h-4 text-success" />}
            <h3 className="text-sm font-bold">{test.title}</h3>
          </div>
          {(test.isMonthly && test.monthLabel) && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{test.monthLabel}</span>
          )}
        </div>

        {isDone && (
          <div className="mt-2 mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-primary">{test.score}/600</span>
              <span className="text-[11px] text-muted-foreground">{test.date}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${((test.score ?? 0) / 600) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Moy. ASTPrep : {test.avgScore}/600</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-3 flex flex-col gap-1.5">
        {isDone && (
          <button
            onClick={() => navigate(`/entrainement/${test.id}?correction=true`)}
            className="w-full rounded-lg px-3 py-2 text-xs font-medium transition-colors min-h-[36px] flex items-center justify-center gap-1.5 border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Eye className="w-3.5 h-3.5" /> Voir la correction
          </button>
        )}
        <button
          onClick={() => navigate(`/entrainement/${test.id}`)}
          className={cn(
            "w-full rounded-lg px-3 py-2 text-xs font-medium transition-colors min-h-[40px] flex items-center justify-center gap-1.5",
            isDone
              ? "bg-muted text-foreground hover:bg-muted/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isDone ? <><RotateCcw className="w-3.5 h-3.5" /> Refaire</> : <><Play className="w-3.5 h-3.5" /> Commencer</>}
        </button>
      </div>
    </motion.div>
  );
}

export default function TestsBlancs() {
  const all = [...classicTests, ...monthlyTests];
  const done = all.filter(t => t.score !== null).length;
  const allScores = all.filter(t => t.score !== null).map(t => t.score!);
  const best = allScores.length ? Math.max(...allScores) : 0;
  const avg = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  return (
    <div className="p-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Tests blancs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Entraîne-toi dans les conditions du vrai TAGE MAGE — 6 sections, 90 questions, 1h30
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">TM complétés</div>
            <div className="text-xl font-bold">{done}<span className="text-sm text-muted-foreground font-normal">/{all.length}</span></div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Meilleur score</div>
            <div className="text-xl font-bold">{best}<span className="text-sm text-muted-foreground font-normal">/600</span></div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-warning" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Moyenne</div>
            <div className="text-xl font-bold">{avg}<span className="text-sm text-muted-foreground font-normal">/600</span></div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">TAGE MAGE blancs</h2>
        <div className="grid grid-cols-4 gap-3">
          {classicTests.map((t, i) => (
            <MockTestCard key={t.id} test={t} index={i} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-1">TAGE MAGE mensuels</h2>
        <p className="text-sm text-muted-foreground mb-3">Un nouveau TM blanc chaque mois pour mesurer ta progression</p>
        <div className="grid grid-cols-4 gap-3">
          {monthlyTests.map((t, i) => (
            <MockTestCard key={t.id} test={t} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
