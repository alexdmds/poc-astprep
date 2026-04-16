import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Video, Users } from "lucide-react";

const PERKS = [
  { icon: MessageSquare, text: "Pose tes questions aux profs à tout moment" },
  { icon: Video, text: "Cours du soir en live tous les jours" },
  { icon: Users, text: "Rejoins une communauté motivée comme toi" },
];

export default function BienvenueDiscord() {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);

  const finish = () => {
    localStorage.setItem("bienvenue-complete", "true");
    navigate("/");
  };

  const handleJoin = () => {
    window.open("https://discord.gg/astprep", "_blank");
    setJoined(true);
  };

  return (
    <div className="space-y-6 text-center max-w-md mx-auto">
      <div>
        <h1 className="text-xl font-bold">Rejoins la communauté</h1>
        <p className="text-sm text-muted-foreground mt-1">
          3 000 élèves s'entraident sur le Discord ASTPrep. Profs dispos 7j/7, cours du soir en live, aide dossier.
        </p>
      </div>

      <div className="space-y-3 text-left">
        {PERKS.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm">{p.text}</span>
            </div>
          );
        })}
      </div>

      {!joined ? (
        <>
          <Button onClick={handleJoin} className="w-full py-3 text-base" style={{ backgroundColor: "#5865F2" }}>
            Rejoindre le Discord
          </Button>
          <button onClick={finish} className="text-sm text-muted-foreground underline">
            Je le ferai plus tard
          </button>
        </>
      ) : (
        <Button onClick={finish} className="w-full py-3 text-base">
          Super ! Accéder à mon dashboard
        </Button>
      )}
    </div>
  );
}
