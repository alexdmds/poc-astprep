import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Target, Play, RotateCcw, CheckCircle2, Eye, Globe } from "lucide-react";
import { toeicMockTests } from "@/data/toeic";
import { cn } from "@/lib/utils";

export default function ToeicTestsBlancs() {
  const navigate = useNavigate();
  const done = toeicMockTests.filter(t => t.total !== null).length;
  const scores = toeicMockTests.filter(t => t.total !== null).map(t => t.total!);
  const best = scores.length ? Math.max(...scores) : 0;
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="p-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Tests blancs TOEIC</h1>
        <p className="text-sm text-muted-foreground mt-1">2h de test en conditions réelles — Listening 45 min + Reading 75 min</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Target, label: "TOEIC complétés", value: `${done}/${toeicMockTests.length}`, color: "sky" },
          { icon: Trophy, label: "Meilleur score", value: `${best}/990`, color: "success" },
          { icon: TrendingUp, label: "Moyenne", value: `${avg}/990`, color: "warning" },
        ].map(k => (
          <div key={k.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
              k.color === "sky" ? "bg-sky-500/10" : k.color === "success" ? "bg-success/10" : "bg-warning/10")}>
              <k.icon className={cn("w-5 h-5", k.color === "sky" ? "text-sky-500" : k.color === "success" ? "text-success" : "text-warning")} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{k.label}</div>
              <div className="text-xl font-bold">{k.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {toeicMockTests.map((t, i) => {
          const isDone = t.total !== null;
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isDone && <CheckCircle2 className="w-4 h-4 text-success" />}
                  <Globe className="w-4 h-4 text-sky-500" />
                  <h3 className="text-sm font-bold">{t.title}</h3>
                </div>
                {isDone && (
                  <div className="mt-2">
                    <div className="text-lg font-bold text-sky-500">{t.total}/990</div>
                    <div className="text-[11px] text-muted-foreground">L: {t.listening}/495 · R: {t.reading}/495</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{t.date}</div>
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                {isDone && (
                  <button className="w-full rounded-lg px-3 py-2 text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Correction
                  </button>
                )}
                <button className={cn("w-full rounded-lg px-3 py-2 text-xs font-medium flex items-center justify-center gap-1.5",
                  isDone ? "bg-muted text-foreground" : "bg-sky-500 text-white hover:bg-sky-600")}>
                  {isDone ? <><RotateCcw className="w-3.5 h-3.5" /> Refaire</> : <><Play className="w-3.5 h-3.5" /> Commencer</>}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
