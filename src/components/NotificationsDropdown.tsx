import { Video, Trophy, Dumbbell, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  { id: "n1", type: "live" as const, title: "Cours Live ce soir à 18h", desc: "Probabilités conditionnelles avec Etienne", time: "Il y a 2h", read: false },
  { id: "n2", type: "score" as const, title: "Nouveau record personnel !", desc: "Tu as obtenu 412/600 au TM n°7 🎉", time: "Hier", read: false },
  { id: "n3", type: "reminder" as const, title: "12 erreurs à réviser", desc: "Ton carnet d'erreurs t'attend", time: "Hier", read: false },
  { id: "n4", type: "streak" as const, title: "7 jours consécutifs 🔥", desc: "Continue comme ça !", time: "Il y a 2 jours", read: true },
  { id: "n5", type: "live" as const, title: "Replay disponible", desc: "Équations & Systèmes linéaires", time: "Il y a 3 jours", read: true },
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

export function NotificationsDropdown({ onViewAll }: { onViewAll: () => void }) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold">Notifications</span>
        <span className="text-[11px] text-muted-foreground">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</span>
      </div>

      <div className="max-h-[320px] overflow-y-auto">
        {notifications.map(n => {
          const Icon = iconMap[n.type];
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-2.5 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
                !n.read && "bg-primary/[0.03]"
              )}
            >
              <div className={cn("w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5", colorMap[n.type])}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn("text-[13px] font-medium leading-tight", !n.read ? "text-foreground" : "text-muted-foreground")}>
                  {n.title}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{n.desc}</div>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />}
            </div>
          );
        })}
      </div>

      <div className="border-t border-border px-4 py-2.5">
        <button
          onClick={onViewAll}
          className="w-full text-center text-xs text-primary font-medium hover:underline"
        >
          Voir toutes les notifications
        </button>
      </div>
    </div>
  );
}
