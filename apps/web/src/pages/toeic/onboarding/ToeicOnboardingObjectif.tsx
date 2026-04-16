import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function getCECRL(score: number) {
  if (score < 250) return { level: "A1", label: "Débutant", color: "text-destructive" };
  if (score < 550) return { level: "A2", label: "Pré-intermédiaire", color: "text-warning" };
  if (score < 785) return { level: "B1", label: "Intermédiaire", color: "text-warning" };
  if (score < 945) return { level: "B2", label: "Intermédiaire avancé", color: "text-success" };
  return { level: "C1", label: "Avancé", color: "text-sky-500" };
}

export default function ToeicOnboardingObjectif() {
  const navigate = useNavigate();
  const [target, setTarget] = useState([750]);
  const cecrl = getCECRL(target[0]);

  const handleContinue = () => {
    localStorage.setItem("toeic-target-score", String(target[0]));
    localStorage.setItem("toeic-onboarding-step", "paiement");
    navigate("/toeic/onboarding/paiement");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Ton objectif TOEIC</h1>
        <p className="text-sm text-muted-foreground mt-1">Quel score vises-tu ?</p>
      </div>

      <div className="space-y-4 pt-4">
        <div className="text-center">
          <span className="text-4xl font-bold">{target[0]}</span>
          <span className="text-lg text-muted-foreground font-normal">/990</span>
        </div>
        <Slider min={0} max={990} step={10} value={target} onValueChange={setTarget} />
        <div className="flex justify-between text-[10px] text-muted-foreground px-1">
          <span>0</span><span>250</span><span>550</span><span>785</span><span>990</span>
        </div>
      </div>

      <motion.div key={cecrl.level} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-4 text-center">
        <div className={cn("text-2xl font-bold", cecrl.color)}>Niveau {cecrl.level}</div>
        <div className="text-sm text-muted-foreground">{cecrl.label}</div>
      </motion.div>

      <Button onClick={handleContinue} className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white">Continuer</Button>
    </div>
  );
}
