import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip
} from "recharts";
import { Share2, Download, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock bell curve data
const generateBellCurve = (userScore: number) => {
  const mean = 350;
  const std = 60;
  const points = [];
  for (let x = 150; x <= 550; x += 5) {
    const z = (x - mean) / std;
    const y = Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI));
    points.push({ score: x, density: y * 1000 });
  }
  return points;
};

const subtestResults = [
  { name: "Compréhension", score: 72, avg: 65, max: 100, color: "hsl(var(--primary))" },
  { name: "Calcul", score: 58, avg: 62, max: 100, color: "hsl(var(--primary))" },
  { name: "Raisonnement", score: 80, avg: 60, max: 100, color: "hsl(var(--primary))" },
  { name: "Conditions min.", score: 45, avg: 55, max: 100, color: "hsl(var(--primary))" },
  { name: "Expression", score: 68, avg: 70, max: 100, color: "hsl(var(--primary))" },
  { name: "Logique", score: 89, avg: 58, max: 100, color: "hsl(var(--primary))" },
];

// Confetti particle component
function Confetti() {
  const colors = [
    "hsl(var(--primary))", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"
  ];
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 4 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: "100vh",
            rotate: p.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

interface TMBlancResultProps {
  score: number;
  testTitle: string;
  onBack: () => void;
  onCorrection: () => void;
}

export function TMBlancLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-16 h-16 rounded-full border-4 border-muted border-t-primary mb-6"
      />
      <h2 className="text-xl font-bold mb-2">Correction en cours...</h2>
      <p className="text-sm text-muted-foreground mb-6">Analyse de tes 90 réponses</p>
      <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{progress}%</p>
    </motion.div>
  );
}

export function TMBlancResult({ score, testTitle, onBack, onCorrection }: TMBlancResultProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const bellData = generateBellCurve(score);
  const navigate = useNavigate();

  // Calculate percentile (mock)
  const mean = 350;
  const std = 60;
  const z = (score - mean) / std;
  const percentile = Math.min(99, Math.max(1, Math.round(
    50 * (1 + (z > 0 ? 1 : -1) * Math.sqrt(1 - Math.exp(-2 * z * z / Math.PI)))
  )));

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleShareDiscord = () => {
    const text = `🎯 Je viens de scorer ${score}/600 au ${testTitle} sur ASTPrep ! Top ${100 - percentile}% des candidats. Rejoins-nous sur https://astprep.fr`;
    window.open(`https://discord.com/channels/@me?message=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="p-6 py-8 max-w-3xl mx-auto">
      {showConfetti && <Confetti />}

      {/* Score hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <Trophy className="w-4 h-4" /> {testTitle}
        </div>
        <div className="text-5xl font-bold">
          {score}<span className="text-2xl text-muted-foreground font-normal">/600</span>
        </div>
        <div className="text-lg text-muted-foreground mt-2">
          Top <span className="text-foreground font-semibold">{100 - percentile}%</span> des candidats ASTPrep
        </div>
      </motion.div>

      {/* Bell curve */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl border border-border p-5 mb-6"
      >
        <h3 className="text-sm font-semibold mb-1">Distribution des scores</h3>
        <p className="text-xs text-muted-foreground mb-4">Résultats de tous les candidats sur ce TM blanc</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bellData}>
              <defs>
                <linearGradient id="bellGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="score" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} className="fill-muted-foreground" />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12, background: "hsl(var(--card))" }}
                formatter={() => []}
                labelFormatter={(label) => `Score: ${label}/600`}
              />
              <Area
                type="monotone"
                dataKey="density"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#bellGrad)"
              />
              <ReferenceLine
                x={score}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: `Toi: ${score}`,
                  position: "top",
                  fill: "hsl(var(--primary))",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <ReferenceLine
                x={350}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={{
                  value: "Moy: 350",
                  position: "top",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Subtest detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-xl border border-border p-5 mb-6"
      >
        <h3 className="text-sm font-semibold mb-4">Détail par sous-test</h3>
        <div className="space-y-3">
          {subtestResults.map(st => {
            const pct = (st.score / st.max) * 100;
            const avgPct = (st.avg / st.max) * 100;
            const isAbove = st.score >= st.avg;
            return (
              <div key={st.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{st.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-sm font-bold", isAbove ? "text-success" : "text-destructive")}>
                      {st.score}/{st.max}
                    </span>
                    <span className="text-xs text-muted-foreground">Moy. {st.avg}</span>
                  </div>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", isAbove ? "bg-success" : "bg-destructive")}
                    style={{ width: `${pct}%` }}
                  />
                  {/* Average marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50"
                    style={{ left: `${avgPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col items-center gap-3"
      >
        {/* Share card */}
        <div className="w-full bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-3">Partage ton score</h3>
          <div className="bg-muted/50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold">ASTPrep — {testTitle}</div>
                <div className="text-lg font-bold text-primary">{score}/600</div>
                <div className="text-xs text-muted-foreground">Top {100 - percentile}% · {new Date().toLocaleDateString("fr-FR")}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShareDiscord}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "#5865F2" }}
            >
              <Share2 className="w-4 h-4" /> Partager sur Discord
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              <Download className="w-4 h-4" /> Télécharger
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button onClick={onCorrection} className="rounded-lg px-6">
            Voir la correction <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="outline" onClick={onBack} className="rounded-lg px-6">
            Retour
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
