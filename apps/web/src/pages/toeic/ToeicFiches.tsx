import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["Grammaire", "Vocabulaire", "Listening Skills", "Reading Skills"] as const;
const fiches: Record<string, { id: string; title: string }[]> = {
  Grammaire: [
    { id: "tg1", title: "Les temps en anglais" },
    { id: "tg2", title: "Les modaux" },
    { id: "tg3", title: "Prépositions clés" },
    { id: "tg4", title: "Voix passive" },
    { id: "tg5", title: "Conditionnels" },
  ],
  Vocabulaire: [
    { id: "tv1", title: "Business English — 200 mots essentiels" },
    { id: "tv2", title: "HR & Recruitment" },
    { id: "tv3", title: "Finance & Banking" },
    { id: "tv4", title: "Travel & Transportation" },
  ],
  "Listening Skills": [
    { id: "tl1", title: "Stratégies d'écoute active" },
    { id: "tl2", title: "Repérer les mots clés" },
    { id: "tl3", title: "Types de questions Listening" },
  ],
  "Reading Skills": [
    { id: "tr1", title: "Skimming & Scanning" },
    { id: "tr2", title: "Inférence et déduction" },
    { id: "tr3", title: "Double & Triple passages" },
  ],
};

export default function ToeicFiches() {
  const [activeCat, setActiveCat] = useState<string>("Grammaire");
  const items = fiches[activeCat] || [];

  return (
    <div className="p-6 py-8 space-y-6">
      <h1 className="text-xl font-bold">Fiches PDF TOEIC</h1>
      <div className="flex gap-2 overflow-x-auto">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCat(c)}
            className={cn("px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-colors",
              activeCat === c ? "bg-sky-500/10 text-sky-500 border-sky-500" : "border-border text-muted-foreground")}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {items.map(f => (
          <div key={f.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
            <FileText className="w-5 h-5 text-sky-500 shrink-0" />
            <span className="text-sm font-medium flex-1">{f.title}</span>
            <button className="rounded-lg px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Télécharger
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
