import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Target, Play, RotateCcw, CheckCircle2, Loader2 } from "lucide-react";
import { useMockTests, type MockTestRow } from "@/lib/queries/mock-tests";
import { cn } from "@/lib/utils";

function MockTestCard({ test, index }: { test: MockTestRow; index: number }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.15 }}
      className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold">{test.title}</h3>
          </div>
          {test.is_monthly && test.month_label && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{test.month_label}</span>
          )}
        </div>
        {test.difficulty && (
          <p className="text-[11px] text-muted-foreground mt-1">Difficulté : {test.difficulty}</p>
        )}
        <p className="text-[10px] text-muted-foreground mt-1">Moy. ASTPrep : {test.avg_score}/600</p>
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <button
          onClick={() => navigate(`/entrainement/${test.id}`)}
          className="w-full rounded-lg px-3 py-2 text-xs font-medium transition-colors min-h-[40px] flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Play className="w-3.5 h-3.5" /> Commencer
        </button>
      </div>
    </motion.div>
  );
}

export default function TestsBlancs() {
  const { data: mockTests, isLoading } = useMockTests();
  const classicTests = (mockTests ?? []).filter(t => !t.is_monthly);
  const monthlyTests = (mockTests ?? []).filter(t => t.is_monthly);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!mockTests?.length) {
    return (
      <div className="p-6 py-8">
        <h1 className="text-xl font-bold">Tests blancs</h1>
        <p className="text-sm text-muted-foreground mt-4">Aucun test blanc disponible pour le moment.</p>
      </div>
    );
  }

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
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Tests disponibles</div>
            <div className="text-xl font-bold">{mockTests.length}</div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Tests classiques</div>
            <div className="text-xl font-bold">{classicTests.length}</div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-warning" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Tests mensuels</div>
            <div className="text-xl font-bold">{monthlyTests.length}</div>
          </div>
        </div>
      </div>

      {classicTests.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">TAGE MAGE blancs</h2>
          <div className="grid grid-cols-4 gap-3">
            {classicTests.map((t, i) => (
              <MockTestCard key={t.id} test={t} index={i} />
            ))}
          </div>
        </div>
      )}

      {monthlyTests.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-1">TAGE MAGE mensuels</h2>
          <p className="text-sm text-muted-foreground mb-3">Un nouveau TM blanc chaque mois pour mesurer ta progression</p>
          <div className="grid grid-cols-4 gap-3">
            {monthlyTests.map((t, i) => (
              <MockTestCard key={t.id} test={t} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
