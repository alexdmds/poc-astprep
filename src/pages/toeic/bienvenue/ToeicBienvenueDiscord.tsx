import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Video, Users } from "lucide-react";

export default function ToeicBienvenueDiscord() {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);

  const finish = () => {
    localStorage.setItem("toeic-bienvenue-complete", "true");
    navigate("/toeic");
  };

  return (
    <div className="space-y-6 text-center max-w-md mx-auto">
      <h1 className="text-xl font-bold">Rejoins la communauté TOEIC</h1>
      <p className="text-sm text-muted-foreground">2 500 élèves s'entraident sur le Discord. Profs d'anglais dispos 7j/7.</p>
      <div className="space-y-3 text-left">
        {[
          { icon: MessageSquare, text: "Pose tes questions aux profs à tout moment" },
          { icon: Video, text: "Sessions de listening en live" },
          { icon: Users, text: "Communauté motivée de préparants TOEIC" },
        ].map((p, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
              <p.icon className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-sm">{p.text}</span>
          </div>
        ))}
      </div>
      {!joined ? (
        <>
          <Button onClick={() => { window.open("https://discord.gg/astprep-toeic", "_blank"); setJoined(true); }}
            className="w-full py-3 text-base" style={{ backgroundColor: "#5865F2" }}>Rejoindre le Discord</Button>
          <button onClick={finish} className="text-sm text-muted-foreground underline">Je le ferai plus tard</button>
        </>
      ) : (
        <Button onClick={finish} className="w-full py-3 text-base bg-sky-500 hover:bg-sky-600 text-white">
          Continuer vers le dashboard
        </Button>
      )}
    </div>
  );
}
