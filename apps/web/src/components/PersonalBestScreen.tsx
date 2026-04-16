import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PersonalBestScreenProps {
  newScore: number;
  maxScore: number;
  oldRecord: number;
  subtitle?: string; // e.g. "11/15 bonnes réponses"
  onContinue: () => void;
}

function Confetti() {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--primary) / 0.6)",
    "hsl(var(--primary) / 0.3)",
    "hsl(var(--muted-foreground))",
  ];
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: colors[i % colors.length],
    size: 4 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          initial={{ y: -10, opacity: 1 }}
          animate={{ y: 500, opacity: 0 }}
          transition={{ duration: 2, delay: 1.5 + p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

export function PersonalBestScreen({ newScore, maxScore, oldRecord, subtitle, onContinue }: PersonalBestScreenProps) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(progress * newScore));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDone(true);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [newScore]);

  const diff = newScore - oldRecord;

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-primary/5 flex items-center justify-center relative">
      <Confetti />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="text-4xl font-bold text-primary">
          {count}<span className="text-xl text-muted-foreground font-normal">/{maxScore}</span>
        </div>
        {subtitle && <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>}

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0, duration: 0.4, type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center justify-center gap-2 mt-6">
              <Trophy className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold text-primary shadow-lg shadow-primary/20 rounded-lg px-3 py-1 bg-primary/10">
                Nouveau record !
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-3">
              Ancien record : {oldRecord}/{maxScore} → Nouveau : {newScore}/{maxScore} (+{diff})
            </div>
            <Button onClick={onContinue} className="mt-6 rounded-lg px-6">
              Voir la correction →
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
