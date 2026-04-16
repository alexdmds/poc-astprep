import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ToeicFAQScore() {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-1" /> Retour
      </Button>
      <h1 className="text-xl font-bold mb-6">Comment est calculé ton score TOEIC estimé ?</h1>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>Le scoring TOEIC officiel (ETS) n'est <strong className="text-foreground">pas public</strong>. Le score affiché est une approximation basée sur tes performances.</p>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-foreground font-medium mb-2">Formule de scoring utilisée</div>
          <ul className="space-y-2 text-xs">
            <li><strong className="text-foreground">Listening (0-495)</strong> : marge de 7 erreurs gratuites (score max 495 maintenu), puis -5 points par erreur supplémentaire</li>
            <li><strong className="text-foreground">Reading (0-495)</strong> : -5 points par erreur dès la 1ère</li>
            <li><strong className="text-foreground">Total</strong> : Listening + Reading = /990</li>
          </ul>
        </div>
        <p>Ton score estimé est calculé à partir de tes <strong className="text-foreground">3 derniers TOEIC blancs</strong>, pondéré par la régularité de tes résultats.</p>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-foreground font-medium mb-2">Ton score estimé actuel : 780/990</div>
          <div className="text-xs space-y-1">
            <div>Basé sur :</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>TOEIC #6 — L:405/495 + R:375/495 = 780/990</li>
              <li>TOEIC #5 — L:390/495 + R:350/495 = 740/990</li>
              <li>TOEIC #4 — L:380/495 + R:310/495 = 690/990</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
