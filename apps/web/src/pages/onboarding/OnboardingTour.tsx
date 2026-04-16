import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "@/pages/Index";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface TourStep {
  selector: string;
  title: string;
  description: string;
  position: "right" | "left" | "bottom" | "top";
}

const TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="programme"]',
    title: "Ton programme personnalisé",
    description: "Chaque jour, on te dit exactement quoi faire. Cours, exercices, révisions. Tu n'as qu'à suivre.",
    position: "right",
  },
  {
    selector: '[data-tour="score-estime"]',
    title: "Score estimé en temps réel",
    description: "On calcule ton score estimé à partir de tes performances. Tu sais où tu en es à tout moment.",
    position: "bottom",
  },
  {
    selector: '[data-tour="progression"]',
    title: "Ta courbe de progression",
    description: "Visualise l'évolution de tes scores aux TM blancs. L'objectif : voir cette courbe monter !",
    position: "right",
  },
  {
    selector: '[data-tour="streak"]',
    title: "Reste régulier",
    description: "Ton streak compte tes jours consécutifs de travail. La régularité fait la différence au TAGE MAGE.",
    position: "top",
  },
  {
    selector: '[data-tour="erreurs"]',
    title: "Tes erreurs deviennent ta force",
    description: "Les erreurs reviennent automatiquement à J+1 puis J+7. Tu ne peux plus les oublier.",
    position: "top",
  },
  {
    selector: '[data-tour="cours-du-jour"]',
    title: "Cours live avec des experts",
    description: "Des cours du soir en live chaque jour avec des profs qui ont eu 500+ au TAGE MAGE.",
    position: "top",
  },
];

export default function OnboardingTour() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelector(TOUR_STEPS[step].selector);
      if (el) {
        setSpotlightRect(el.getBoundingClientRect());
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [step]);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem("onboarding-step", "abonnement");
    navigate("/onboarding/abonnement");
  };

  const currentStep = TOUR_STEPS[step];

  const getBubbleStyle = (): React.CSSProperties => {
    if (!spotlightRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const pad = 16;
    const pos = currentStep.position;
    if (pos === "right") {
      return { top: spotlightRect.top + spotlightRect.height / 2, left: spotlightRect.right + pad, transform: "translateY(-50%)" };
    }
    if (pos === "left") {
      return { top: spotlightRect.top + spotlightRect.height / 2, left: spotlightRect.left - pad - 280, transform: "translateY(-50%)" };
    }
    if (pos === "bottom") {
      return { top: spotlightRect.bottom + pad, left: spotlightRect.left + spotlightRect.width / 2, transform: "translateX(-50%)" };
    }
    // top
    return { top: spotlightRect.top - pad - 120, left: spotlightRect.left + spotlightRect.width / 2, transform: "translateX(-50%)" };
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100]" style={{ margin: 0, maxWidth: "none" }}>
      {/* Dashboard underneath */}
      <div className="min-h-screen flex">
        <AppSidebar collapsed={false} onToggle={() => {}} />
        <main className="flex-1 min-h-screen bg-surface ml-60">
          <Dashboard />
        </main>
      </div>

      {/* Overlay with cutout */}
      <div className="fixed inset-0 z-[140] pointer-events-auto" onClick={handleNext}>
        <svg className="w-full h-full" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              {spotlightRect && (
                <rect
                  x={spotlightRect.left - 8}
                  y={spotlightRect.top - 8}
                  width={spotlightRect.width + 16}
                  height={spotlightRect.height + 16}
                  rx={12}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#spotlight-mask)" />
        </svg>

        {spotlightRect && (
          <div
            className="absolute ring-2 ring-primary ring-offset-4 rounded-xl pointer-events-none"
            style={{
              left: spotlightRect.left - 8,
              top: spotlightRect.top - 8,
              width: spotlightRect.width + 16,
              height: spotlightRect.height + 16,
              zIndex: 150,
            }}
          />
        )}
      </div>

      {/* Tooltip bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed z-[160] bg-card rounded-xl shadow-xl p-4 max-w-[280px] border border-border"
          style={getBubbleStyle()}
        >
          <h3 className="text-sm font-bold">{currentStep.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{currentStep.description}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">{step + 1}/{TOUR_STEPS.length}</span>
            <Button size="sm" className="px-3 py-1.5 text-xs h-auto" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
              {step === TOUR_STEPS.length - 1 ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Skip button */}
      <button
        onClick={handleFinish}
        className="fixed top-4 right-4 z-[170] text-xs text-muted-foreground underline hover:text-foreground"
      >
        Passer le tour
      </button>
    </div>
  );
}
