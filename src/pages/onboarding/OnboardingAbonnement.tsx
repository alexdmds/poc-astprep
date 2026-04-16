import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const PLANS = [
  { id: "week", label: "Semaine", price: "14,90 €", period: "/semaine", subtitle: "Idéal pour un sprint final", badge: null, badgeColor: "" },
  { id: "month", label: "Mois", price: "39,90 €", period: "/mois", subtitle: "Le choix de 70% des élèves", badge: "Le plus populaire", badgeColor: "bg-primary text-primary-foreground" },
  { id: "quarter", label: "Trimestre", price: "29,90 €", period: "/mois", subtitle: "Facturé 89,70 € tous les 3 mois", badge: "Meilleure offre", badgeColor: "bg-success text-success-foreground", oldPrice: "39,90 €" },
];

export default function OnboardingAbonnement() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("month");
  const [installments, setInstallments] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    localStorage.setItem("onboarding-plan", selected);
    localStorage.setItem("onboarding-step", "paiement");
    navigate("/onboarding/paiement");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold">Choisis ta formule</h1>
        <p className="text-sm text-muted-foreground mt-1">Essai gratuit de 5 jours. Tu peux annuler à tout moment.</p>
      </div>

      <div className="space-y-3">
        {PLANS.map(plan => (
          <div key={plan.id} className="relative">
            {plan.badge && (
              <span className={cn("absolute -top-2.5 left-4 text-[10px] rounded-full px-2 py-0.5 font-medium z-10", plan.badgeColor)}>
                {plan.badge}
              </span>
            )}
            <button
              onClick={() => setSelected(plan.id)}
              className={cn(
                "w-full bg-card border rounded-xl p-5 text-left transition-all",
                selected === plan.id ? "border-primary border-2 shadow-md" : "border-border hover:border-primary/30"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{plan.label}</div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                    {plan.oldPrice && <span className="text-sm text-muted-foreground line-through ml-1">{plan.oldPrice}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{plan.subtitle}</div>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  selected === plan.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                )}>
                  {selected === plan.id && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {selected === "quarter" && (
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <span className="text-sm">Paiement en 3x sans frais</span>
          <Switch checked={installments} onCheckedChange={setInstallments} />
        </div>
      )}

      <div className="flex items-start gap-2">
        <Checkbox id="cgu" checked={accepted} onCheckedChange={v => setAccepted(!!v)} className="mt-0.5" />
        <label htmlFor="cgu" className="text-sm text-muted-foreground">
          J'accepte les{" "}
          <button className="text-primary underline">conditions générales</button>
        </label>
      </div>

      <Button onClick={handleContinue} disabled={!accepted} className="w-full py-3 text-base">
        Commencer mon essai gratuit
      </Button>
    </div>
  );
}
