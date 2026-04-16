import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2, CreditCard } from "lucide-react";

export default function OnboardingPaiement() {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState("");
  const [expM, setExpM] = useState("");
  const [expY, setExpY] = useState("");
  const [cvc, setCvc] = useState("");

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(async () => {
      localStorage.setItem("onboarding-complete", "true");
      localStorage.setItem("onboarding-step", "bienvenue");
      try { await updateProfile({ onboarding_complete: true }); } catch (_) {}
      navigate("/bienvenue");
    }, 1500);
  };

  const plan = localStorage.getItem("onboarding-plan") || "month";
  const priceLabel = plan === "week" ? "14,90 €/semaine" : plan === "quarter" ? "29,90 €/mois" : "39,90 €/mois";

  return (
    <div className="space-y-6 max-w-sm mx-auto">
      {/* Summary */}
      <div className="bg-muted/50 rounded-xl p-4 text-center space-y-1">
        <p className="text-sm font-medium">Essai gratuit 5 jours puis {priceLabel}</p>
        <p className="text-xs text-muted-foreground">Tu peux annuler à tout moment</p>
      </div>

      {/* Card form */}
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="4242 4242 4242 4242"
            value={card}
            onChange={e => setCard(formatCard(e.target.value))}
            className="pr-24"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
            <CreditCard className="w-4 h-4" />
            <span className="text-[10px]">Visa</span>
            <span className="text-[10px]">MC</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Input placeholder="MM" value={expM} onChange={e => setExpM(e.target.value.replace(/\D/g, "").slice(0, 2))} className="w-20" />
          <Input placeholder="AA" value={expY} onChange={e => setExpY(e.target.value.replace(/\D/g, "").slice(0, 2))} className="w-20" />
          <Input placeholder="CVC" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))} className="flex-1" />
        </div>
      </div>

      <Button onClick={handleConfirm} disabled={loading} className="w-full py-3 text-base">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Traitement...</> : "Confirmer et commencer"}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="w-3 h-3" />
        <span>Paiement sécurisé. Tes données bancaires sont protégées.</span>
      </div>
    </div>
  );
}
