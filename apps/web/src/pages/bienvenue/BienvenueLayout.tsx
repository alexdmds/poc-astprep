import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const STEPS = ["/bienvenue", "/bienvenue/test", "/bienvenue/generation", "/bienvenue/exercice", "/bienvenue/discord"];

export default function BienvenueLayout() {
  const { pathname } = useLocation();
  const stepIndex = STEPS.findIndex(s => s === pathname);
  // generation is a transition screen, so: video=1, test=2, exercice=3, discord=4
  const totalVisible = 4;
  const visibleStep = stepIndex <= 1 ? stepIndex : stepIndex === 2 ? 1 : stepIndex === 3 ? 2 : 3;
  const progress = visibleStep >= 0 ? ((visibleStep + 1) / totalVisible) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-1 bg-muted w-full">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="px-6 pt-4">
        <span className="text-base font-bold text-primary">ASTPrep</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
