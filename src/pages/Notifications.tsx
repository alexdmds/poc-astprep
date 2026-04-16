import { Bell, CheckCircle2, Video, Dumbbell, Trophy, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  { id: "n1", type: "live" as const, title: "Cours Live ce soir à 18h", desc: "Probabilités conditionnelles avec Etienne", time: "Il y a 2h", read: false },
  { id: "n2", type: "score" as const, title: "Nouveau record personnel !", desc: "Tu as obtenu 412/600 au TM n°7 🎉", time: "Hier", read: false },
  { id: "n3", type: "reminder" as const, title: "12 erreurs à réviser", desc: "Ton carnet d'erreurs t'attend — surtout les Probabilités", time: "Hier", read: false },
  { id: "n4", type: "streak" as const, title: "7 jours consécutifs 🔥", desc: "Continue comme ça, ta régularité paie !", time: "Il y a 2 jours", read: true },
  { id: "n5", type: "live" as const, title: "Replay disponible", desc: "Équations & Systèmes linéaires — 1h28", time: "Il y a 3 jours", read: true },
  { id: "n6", type: "info" as const, title: "Nouveau sous-test disponible", desc: "Calcul thématique : Géométrie avancée", time: "Il y a 5 jours", read: true },
  { id: "n7", type: "reminder" as const, title: "Tu n'as pas étudié hier", desc: "Reviens vite pour garder ton streak !", time: "Il y a 6 jours", read: true },
  { id: "n8", type: "score" as const, title: "Progression +23 pts", desc: "Ton score estimé est passé à 387/600", time: "Il y a 1 semaine", read: true },
];

const iconMap = {
  live: Video,
  score: Trophy,
  reminder: Dumbbell,
  streak: CheckCircle2,
  info: Info,
};

const colorMap = {
  live: "bg-destructive/10 text-destructive",
  score: "bg-success/10 text-success",
  reminder: "bg-warning/10 text-warning",
  streak: "bg-primary/10 text-primary",
  info: "bg-muted text-muted-foreground",
};

export default function Notifications() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</p>
        </div>
        <button className="text-xs text-primary font-medium hover:underline">Tout marquer comme lu</button>
      </div>

      <div className="space-y-2">
        {notifications.map(n => {
          const Icon = iconMap[n.type];
          return (
            <div
              key={n.id}
              className={cn(
                "bg-card rounded-xl border border-border p-4 flex items-start gap-3 transition-shadow hover:shadow-sm",
                !n.read && "border-l-4 border-l-primary"
              )}
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", colorMap[n.type])}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn("text-sm font-medium", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
              </div>
              <div className="text-[11px] text-muted-foreground shrink-0 mt-0.5">{n.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
