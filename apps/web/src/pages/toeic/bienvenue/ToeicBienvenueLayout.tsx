import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const STEPS = ["/toeic/bienvenue", "/toeic/bienvenue/video", "/toeic/bienvenue/niveau", "/toeic/bienvenue/discord"];

export default function ToeicBienvenueLayout() {
  const { pathname } = useLocation();
  const stepIndex = STEPS.findIndex(s => s === pathname);
  const progress = stepIndex >= 0 ? ((stepIndex + 1) / 3) * 100 : 33;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-1 bg-muted w-full">
        <motion.div className="h-full bg-sky-500" initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 0.4 }} />
      </div>
      <div className="px-6 pt-4">
        <span className="text-base font-bold text-sky-500">ASTPrep <span className="text-[10px] bg-sky-500/15 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full uppercase tracking-wider ml-1">TOEIC</span></span>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div key={pathname} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-lg">
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
