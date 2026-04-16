import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function ToeicBienvenueVideo() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-2xl font-bold">Bienvenue dans ASTPrep TOEIC !</h1>
      <p className="text-sm text-muted-foreground">Un petit mot de Simon et Grégoire avant de commencer</p>
      <div className="aspect-video max-w-lg mx-auto rounded-xl bg-muted/50 flex items-center justify-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-sky-500 text-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
          <Play className="w-6 h-6 ml-1" />
        </div>
        <div className="absolute bottom-3 left-3 text-left">
          <div className="text-xs font-medium text-foreground">Simon Lamouche & Grégoire Le Roch</div>
          <div className="text-[10px] text-muted-foreground">2 min</div>
        </div>
      </div>
      <Button onClick={() => { localStorage.setItem("toeic-bienvenue-step", "niveau"); navigate("/toeic/bienvenue/niveau"); }}
        className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 text-base">C'est parti !</Button>
    </div>
  );
}
