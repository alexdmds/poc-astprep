import { motion } from "framer-motion";
import { Target, Dumbbell, Calculator, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DailyChallengePopupProps {
  open: boolean;
  onClose: () => void;
  onViewLeaderboard: () => void;
}

const challenges = [
  {
    icon: Dumbbell,
    title: "Fais le sous-test Calcul #14",
    reward: "+15 points",
    route: "/entrainement/calcul-14",
  },
  {
    icon: Calculator,
    title: "Fais 2 minutes de calcul mental",
    reward: "+10 points",
    route: "/outils/calcul-mental",
  },
];

export function DailyChallengePopup({ open, onClose, onViewLeaderboard }: DailyChallengePopupProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Ton défi du jour</h2>
          </div>

          <div className="space-y-3 mb-5">
            {challenges.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.reward}</div>
                  </div>
                  <Button
                    size="sm"
                    className="text-xs shrink-0"
                    onClick={() => { onClose(); navigate(c.route); }}
                  >
                    C'est parti <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <div className="text-sm text-muted-foreground">127 points ce mois</div>
              <button
                onClick={() => { onClose(); onViewLeaderboard(); }}
                className="text-sm text-primary font-medium hover:underline"
              >
                Voir le classement →
              </button>
            </div>
            <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
              Pas maintenant
            </button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
