import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FAQScore() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-1" /> Retour
      </Button>

      <h1 className="text-xl font-bold mb-6">Comment est calculé ton score estimé ?</h1>

      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          Ton score estimé est basé sur tes <strong className="text-foreground">3 derniers TAGE MAGE blancs</strong>.
        </p>
        <p>
          Pour chaque sous-test, on prend ta moyenne, pondérée par la régularité
          de tes performances. Un sous-test où tu es régulier pèse plus qu'un
          sous-test où tes scores varient beaucoup.
        </p>
        <p>
          Le score est légèrement déflaté pour rester conservateur — mieux vaut
          une bonne surprise le jour J qu'une mauvaise.
        </p>

        <div className="bg-card border border-border rounded-xl p-4 mt-6">
          <div className="text-foreground font-medium mb-2">Ton score estimé actuel : 387/600</div>
          <div className="text-xs space-y-1">
            <div>Basé sur :</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>TM #31 — 389/600</li>
              <li>TM #45 — 412/600</li>
              <li>TM #22 — 367/600</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
