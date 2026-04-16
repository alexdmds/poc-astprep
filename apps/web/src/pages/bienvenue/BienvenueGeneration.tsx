import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const MESSAGES = [
  "Analyse de tes réponses...",
  "Identification de tes points forts...",
  "Création de ton parcours personnalisé...",
];

export default function BienvenueGeneration() {
  const navigate = useNavigate();
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex(i => (i < MESSAGES.length - 1 ? i + 1 : i));
    }, 1000);

    const progInterval = setInterval(() => {
      setProgress(p => Math.min(p + 100 / 30, 100));
    }, 100);

    const timeout = setTimeout(() => {
      localStorage.setItem("bienvenue-step", "exercice");
      navigate("/bienvenue/exercice");
    }, 3000);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <motion.p key={msgIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-muted-foreground">
        {MESSAGES[msgIndex]}
      </motion.p>
      <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
      </div>
    </div>
  );
}
