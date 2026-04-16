import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/lib/auth";

const SECTION_TITLES = ["Profil", "Apparence", "Notifications", "Score estimé", "Compte"];

export default function ToeicParametres() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { user } = useAuth();
  const [open, setOpen] = useState<string | null>("Profil");
  const [darkMode, setDarkMode] = useState(true);
  const [notifs, setNotifs] = useState({ cours: true, defis: true, rappels: false });

  const sections = SECTION_TITLES.map(title => ({
    title,
    content: title === "Profil"
      ? `Email : ${profile?.email ?? user?.email ?? "—"} · Nom : ${profile?.full_name ?? "—"}`
      : "",
  }));

  return (
    <div className="p-6 py-8 max-w-xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <h1 className="text-xl font-bold">Paramètres TOEIC</h1>
      </div>
      {sections.map(s => (
        <div key={s.title} className="bg-card rounded-xl border border-border overflow-hidden">
          <button onClick={() => setOpen(open === s.title ? null : s.title)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50">
            <span className="text-sm font-semibold">{s.title}</span>
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", open === s.title && "rotate-180")} />
          </button>
          {open === s.title && (
            <div className="px-4 pb-4 text-sm text-muted-foreground">
              {s.title === "Apparence" && (
                <div className="flex items-center justify-between">
                  <span>Mode sombre</span>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              )}
              {s.title === "Notifications" && (
                <div className="space-y-3">
                  {[{ k: "cours", l: "Nouveaux cours" }, { k: "defis", l: "Défis du jour" }, { k: "rappels", l: "Rappels parcours" }].map(n => (
                    <div key={n.k} className="flex items-center justify-between">
                      <span>{n.l}</span>
                      <Switch checked={notifs[n.k as keyof typeof notifs]} onCheckedChange={v => setNotifs(prev => ({...prev, [n.k]: v}))} />
                    </div>
                  ))}
                </div>
              )}
              {s.title === "Score estimé" && (
                <button onClick={() => navigate("/toeic/faq-score")} className="text-sky-500 hover:underline">Comment est calculé ton score estimé ? →</button>
              )}
              {s.title !== "Apparence" && s.title !== "Notifications" && s.title !== "Score estimé" && <p>{s.content}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
