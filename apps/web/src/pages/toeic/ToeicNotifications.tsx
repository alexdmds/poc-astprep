import { Video, BookOpen, Target, TrendingUp, Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  { id: 1, icon: Video, color: "text-destructive", title: "Cours live ce soir", desc: "Session Listening avec Prof. Williams — 20h", time: "il y a 2h", read: false },
  { id: 2, icon: BookOpen, color: "text-sky-500", title: "Nouveau cours disponible", desc: "Phrasal Verbs — Part 5", time: "il y a 5h", read: false },
  { id: 3, icon: Target, color: "text-violet-500", title: "Défi du jour", desc: "15 questions Part 5 niveau Hard", time: "il y a 8h", read: true },
  { id: 4, icon: TrendingUp, color: "text-orange-500", title: "Recommandation post-blanc", desc: "Travaille les Modaux et Phrasal Verbs", time: "hier", read: true },
  { id: 5, icon: Bell, color: "text-sky-500", title: "Rappel parcours", desc: "Tu as 3 activités prévues aujourd'hui", time: "hier", read: true },
];

export default function ToeicNotifications() {
  return (
    <div className="p-6 py-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Notifications TOEIC</h1>
      {notifications.map(n => {
        const Icon = n.icon;
        return (
          <div key={n.id} className={cn("bg-card rounded-xl border border-border p-4 flex items-start gap-3 transition-colors", !n.read && "bg-sky-500/5 border-sky-500/20")}>
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", n.read ? "bg-muted" : "bg-sky-500/10")}>
              <Icon className={cn("w-4 h-4", n.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{n.title}</div>
              <div className="text-xs text-muted-foreground">{n.desc}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
            </div>
            {!n.read && <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />}
          </div>
        );
      })}
    </div>
  );
}
