import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";

const STEPS = ["/onboarding", "/onboarding/profil", "/onboarding/tour", "/onboarding/abonnement", "/onboarding/paiement"];

const TESTIMONIALS = [
  {
    name: "Léa M.",
    school: "Admise à l'ESSEC",
    score: "487/600",
    text: "J'ai gagné 120 points en 2 mois grâce à ASTPrep. Le programme personnalisé m'a fait gagner un temps fou.",
    avatar: "LM",
  },
  {
    name: "Thomas D.",
    school: "Admis à HEC",
    score: "523/600",
    text: "Les sous-tests en conditions réelles et le carnet d'erreurs ont été game-changers. Je recommande à 100%.",
    avatar: "TD",
  },
  {
    name: "Camille R.",
    school: "Admise à l'EDHEC",
    score: "412/600",
    text: "Avant ASTPrep je stagnais à 320. Les cours vidéo et les corrections détaillées m'ont débloquée.",
    avatar: "CR",
  },
  {
    name: "Hugo P.",
    school: "Admis à emlyon",
    score: "458/600",
    text: "Le Discord est incroyable, les profs répondent en quelques minutes. On se sent jamais seul dans la prépa.",
    avatar: "HP",
  },
];

function TestimonialsPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-center h-full bg-primary/5 rounded-2xl p-8 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Ils ont réussi avec ASTPrep</h2>
        <p className="text-sm text-muted-foreground mt-1">+3 000 élèves préparent le TAGE MAGE avec nous</p>
      </div>
      <div className="space-y-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="bg-card rounded-xl border border-border p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {t.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-[11px] text-muted-foreground">{t.school} · {t.score}</div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3 h-3 fill-warning text-warning" />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Quote className="w-4 h-4 text-primary/30 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{t.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export { TestimonialsPanel };

export default function OnboardingLayout() {
  const { pathname } = useLocation();
  const stepIndex = STEPS.findIndex(s => s === pathname);
  const progress = stepIndex >= 0 ? ((stepIndex + 1) / 4) * 100 : 0;

  const showTestimonials = pathname === "/onboarding" || pathname === "/onboarding/paiement";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-muted w-full">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Logo */}
      <div className="px-6 pt-4">
        <span className="text-base font-bold text-primary">ASTPrep</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {showTestimonials ? (
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <TestimonialsPanel />
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto lg:mx-0"
            >
              <Outlet />
            </motion.div>
          </div>
        ) : (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        )}
      </div>
    </div>
  );
}
