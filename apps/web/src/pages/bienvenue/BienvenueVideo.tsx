import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function BienvenueVideo() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Bienvenue dans ASTPrep !</h1>
        <p className="text-sm text-muted-foreground mt-1">Un petit mot de Simon et Grégoire avant de commencer</p>
      </div>

      {/* Video placeholder */}
      <div className="aspect-video max-w-lg mx-auto rounded-xl bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg">
            <Play className="w-7 h-7 ml-1" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left">
          <p className="text-white text-sm font-medium">Simon Lamouche & Grégoire Le Roch</p>
          <p className="text-white/70 text-xs">2 min</p>
        </div>
      </div>

      <Button onClick={() => { localStorage.setItem("bienvenue-step", "test"); navigate("/bienvenue/test"); }} className="px-6 py-3 text-base">
        C'est parti !
      </Button>
    </div>
  );
}
