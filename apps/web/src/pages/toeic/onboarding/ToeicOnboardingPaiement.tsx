import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, Star, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  { name: "Maxime T.", score: "890/990", text: "Le mode examen pour le listening m'a préparé parfaitement aux conditions réelles.", avatar: "M" },
  { name: "Sarah B.", score: "940/990", text: "En 6 semaines j'ai atteint mon objectif. Les corrections vidéo font la différence.", avatar: "S" },
  { name: "Antoine G.", score: "815/990", text: "Le parcours adaptatif a ciblé mes faiblesses en grammaire. Score +150 points.", avatar: "A" },
];

const FEATURES = [
  "Parcours adaptatif selon ton niveau",
  "15 TOEIC blancs en conditions réelles",
  "Listening trainer avec audio natif",
  "1500+ flashcards vocabulaire",
];

export default function ToeicOnboardingPaiement() {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(async () => {
      localStorage.setItem("toeic-onboarding-complete", "true");
      try { await updateProfile({ toeic_onboarding_complete: true, current_product: "toeic" }); } catch (_) {}
      navigate("/toeic/bienvenue");
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[calc(100vh-60px)]">
      {/* Left — Testimonials + recap */}
      <div className="hidden lg:flex flex-col justify-center px-12 bg-sky-500/5 border-r border-border">
        <div className="max-w-md mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Ce qui t'attend</h2>
            <div className="space-y-2 mt-4">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 font-bold text-sm shrink-0">{t.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{t.name}</span>
                      <span className="text-[10px] bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded-full font-medium">{t.score}</span>
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {Array(5).fill(0).map((_, j) => <Star key={j} className="w-3 h-3 fill-warning text-warning" />)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">"{t.text}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Payment */}
      <div className="flex flex-col justify-center px-8 lg:px-12">
        <div className="max-w-md mx-auto w-full space-y-5">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="text-sm font-medium">Essai gratuit 5 jours puis 39,90 €/mois</div>
            <div className="text-xs text-muted-foreground mt-1">Tu peux annuler à tout moment</div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Numéro de carte</label>
              <Input placeholder="4242 4242 4242 4242" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Expiration</label>
                <div className="flex gap-2">
                  <Input placeholder="MM" className="w-16" />
                  <Input placeholder="AA" className="w-16" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">CVC</label>
                <Input placeholder="123" className="w-20" />
              </div>
            </div>
          </div>
          <Button onClick={handlePay} disabled={loading} className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmer et commencer"}
          </Button>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" /> Paiement sécurisé
          </div>
        </div>
      </div>
    </div>
  );
}
