import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { toeicParts } from "@/data/toeic";

const errorData = [
  { name: "Vocabulaire", value: 28, color: "#0ea5e9" },
  { name: "Grammaire", value: 22, color: "#6366f1" },
  { name: "Compréhension", value: 18, color: "#f59e0b" },
  { name: "Manque de temps", value: 15, color: "#ef4444" },
  { name: "Question piégeuse", value: 12, color: "#10b981" },
  { name: "Autre", value: 5, color: "#94a3b8" },
];

const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={cn("rounded-full px-4 py-1.5 text-sm border transition-colors",
    active ? "bg-sky-500/10 text-sky-500 border-sky-500 font-medium" : "text-muted-foreground border-border hover:border-sky-500/30")}>{label}</button>
);

export default function ToeicCarnet() {
  const [selectedPart, setSelectedPart] = useState<number | null>(null);

  return (
    <div className="p-6 py-8">
      <h1 className="text-xl font-bold mb-6">Carnet d'erreurs TOEIC</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Generator */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold">Générer une révision</h2>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Part</div>
            <div className="flex flex-wrap gap-2">
              {toeicParts.map(p => (
                <Chip key={p.id} label={`Part ${p.id} (${Math.floor(Math.random() * 20 + 5)})`}
                  active={selectedPart === p.id} onClick={() => setSelectedPart(p.id)} />
              ))}
            </div>
          </div>
          <button className="w-full rounded-xl px-4 py-3 text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors">
            Lancer la révision
          </button>
        </div>

        {/* Right: Stats */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold mb-4">Répartition des erreurs</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={errorData} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {errorData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13, background: "hsl(var(--card))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[
              { label: "Erreurs totales", value: "87" },
              { label: "À réviser", value: "34" },
              { label: "En cours", value: "28" },
              { label: "Acquises", value: "25" },
            ].map(m => (
              <div key={m.label} className="text-center">
                <div className="text-lg font-bold">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
