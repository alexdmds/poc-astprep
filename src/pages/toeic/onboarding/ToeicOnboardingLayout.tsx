import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const STEPS = ["/toeic/onboarding", "/toeic/onboarding/profil", "/toeic/onboarding/objectif", "/toeic/onboarding/paiement"];

const testimonials = [
  { name: "Sarah M.", score: "920/990", text: "Grâce à ASTPrep, j'ai gagné 200 points en 2 mois. Les exercices de Listening sont incroyables." },
  { name: "Lucas D.", score: "875/990", text: "Le listening trainer m'a permis de passer de 650 à 875. Je recommande à 100%." },
  { name: "Emma R.", score: "945/990", text: "Les corrections vidéo et le parcours adaptatif font vraiment la différence." },
];

export default function ToeicOnboardingLayout() {
  const { pathname } = useLocation();
  const stepIndex = STEPS.findIndex(s => s === pathname);
  const progress = stepIndex >= 0 ? ((stepIndex + 1) / STEPS.length) * 100 : 0;
  const showTestimonials = pathname === STEPS[0] || pathname === STEPS[3];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-1 bg-muted w-full">
        <motion.div className="h-full bg-sky-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>
      <div className="px-6 pt-4">
        <span className="text-base font-bold text-sky-500">ASTPrep <span className="text-[10px] bg-sky-500/15 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full uppercase tracking-wider ml-1">TOEIC</span></span>
      </div>
      <div className="flex-1 flex">
        {showTestimonials && (
          <div className="hidden lg:flex w-1/2 flex-col justify-center px-12 space-y-6">
            <h2 className="text-lg font-bold text-sky-500">Ils ont réussi avec ASTPrep</h2>
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}
                className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground italic mb-2">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 text-xs font-bold">{t.name[0]}</div>
                  <span className="text-sm font-medium">{t.name}</span>
                  <span className="text-xs text-sky-500 font-semibold ml-auto">{t.score}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className={`flex-1 flex items-center justify-center px-4 py-8 ${showTestimonials ? 'lg:w-1/2' : ''}`}>
          <motion.div key={pathname} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-md">
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
