import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const records = [
  { name: "Calcul", score: "48/60", date: "18 mars", recent: false },
  { name: "Logique", score: "50/60", date: "25 mars", recent: true },
  { name: "Expression", score: "53/60", date: "10 mars", recent: false },
  { name: "R&A", score: "43/60", date: "25 mars", recent: true },
  { name: "Conditions Min.", score: "36/60", date: "18 mars", recent: false },
  { name: "Compréhension", score: "50/60", date: "25 mars", recent: true },
];

const tmRecord = { score: "412/600", date: "25 mars", tm: "TM #45", recent: true };

export function PersonalRecords() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        Mes records
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {/* TM blanc record — spans 2 cols */}
        <div className="col-span-2 bg-card rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Meilleur TM blanc</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold">{tmRecord.score}</span>
            {tmRecord.recent && (
              <span className="bg-primary/10 text-primary text-[10px] rounded-full px-2 py-0.5 font-medium">Nouveau !</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{tmRecord.tm} — {tmRecord.date}</div>
        </div>

        {/* Sub-test records */}
        {records.map(r => (
          <div key={r.name} className="bg-card rounded-xl border border-border p-3">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{r.name}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xl font-bold">{r.score}</span>
              {r.recent && (
                <span className="bg-primary/10 text-primary text-[10px] rounded-full px-2 py-0.5 font-medium">Nouveau !</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{r.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
