import { useState, useMemo } from "react";
import { Search, CheckCircle2, XCircle, Flag, Filter } from "lucide-react";
import { calculQuestions, mockStudentAnswers, type Question } from "@/data/questions";
import { cn } from "@/lib/utils";

interface HistoryQuestion extends Question {
  studentAnswer: string;
  isCorrect: boolean;
  isFlagged: boolean;
  date: string;
}

const allHistoryQuestions: HistoryQuestion[] = calculQuestions.map((q, i) => ({
  ...q,
  studentAnswer: mockStudentAnswers[q.id] ?? "B",
  isCorrect: mockStudentAnswers[q.id] === q.correctAnswer,
  isFlagged: ["q6", "q8", "q12"].includes(q.id),
  date: i < 5 ? "25 mars" : i < 10 ? "18 mars" : "12 mars",
}));

const sectionOptions = ["Tous", "Calcul", "Logique", "R&A", "Conditions", "Expression"];
const difficultyOptions = ["Toutes", "Facile", "Moyen", "Difficile"];
const statusOptions = ["Toutes", "Réussies", "Erreurs", "Flaggées"];
const themeOptions = ["Tous", ...Array.from(new Set(allHistoryQuestions.map(q => q.theme)))];

export default function QuestionsHistory() {
  const [sectionFilter, setSectionFilter] = useState("Tous");
  const [themeFilter, setThemeFilter] = useState("Tous");
  const [difficultyFilter, setDifficultyFilter] = useState("Toutes");
  const [statusFilter, setStatusFilter] = useState("Toutes");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return allHistoryQuestions.filter(q => {
      if (sectionFilter !== "Tous" && q.section.toLowerCase() !== sectionFilter.toLowerCase()) return false;
      if (themeFilter !== "Tous" && q.theme !== themeFilter) return false;
      if (difficultyFilter !== "Toutes" && q.difficulty !== difficultyFilter) return false;
      if (statusFilter === "Réussies" && !q.isCorrect) return false;
      if (statusFilter === "Erreurs" && q.isCorrect) return false;
      if (statusFilter === "Flaggées" && !q.isFlagged) return false;
      if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [sectionFilter, themeFilter, difficultyFilter, statusFilter, search]);

  const activeFilterCount = [
    sectionFilter !== "Tous",
    themeFilter !== "Tous",
    difficultyFilter !== "Toutes",
    statusFilter !== "Toutes",
  ].filter(Boolean).length;

  const FilterDropdown = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => {
    const isActive = value !== options[0];
    return (
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</span>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label={label}
          className={cn(
            "appearance-none text-xs font-medium rounded-lg pl-3 pr-7 py-2 min-h-[36px] border outline-none cursor-pointer transition-colors",
            "focus:ring-2 focus:ring-primary/30",
            "bg-[length:12px] bg-[right_8px_center] bg-no-repeat",
            "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]",
            isActive
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-muted text-foreground border-transparent"
          )}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Historique des questions</h2>

      {/* Filters bar */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filtres</span>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setSectionFilter("Tous"); setThemeFilter("Tous"); setDifficultyFilter("Toutes"); setStatusFilter("Toutes"); }}
              className="text-[11px] text-primary font-medium hover:underline ml-auto"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-[180px] max-w-xs">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Recherche</span>
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher une question…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-muted text-foreground text-xs rounded-lg pl-9 pr-3 py-2 min-h-[36px] border border-transparent outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <FilterDropdown label="Sous-test" value={sectionFilter} onChange={setSectionFilter} options={sectionOptions} />
          <FilterDropdown label="Thème" value={themeFilter} onChange={setThemeFilter} options={themeOptions} />
          <FilterDropdown label="Difficulté" value={difficultyFilter} onChange={setDifficultyFilter} options={difficultyOptions} />
          <FilterDropdown label="Statut" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <span>{filtered.length} question{filtered.length > 1 ? "s" : ""}</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-success" /> {filtered.filter(q => q.isCorrect).length} réussies</span>
        <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-destructive" /> {filtered.filter(q => !q.isCorrect).length} erreurs</span>
        <span className="flex items-center gap-1"><Flag className="w-3 h-3 text-warning" /> {filtered.filter(q => q.isFlagged).length} flaggées</span>
      </div>

      {/* Questions list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Filter className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucune question ne correspond à ces filtres.</p>
          </div>
        ) : (
          filtered.map(q => (
            <div key={q.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  q.isCorrect ? "bg-success/10" : "bg-destructive/10"
                )}>
                  {q.isCorrect
                    ? <CheckCircle2 className="w-4 h-4 text-success" />
                    : <XCircle className="w-4 h-4 text-destructive" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{q.text}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {q.section}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {q.theme}
                    </span>
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded",
                      q.difficulty === "Facile" ? "bg-success/10 text-success" :
                      q.difficulty === "Moyen" ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    )}>
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{q.date}</span>
                  </div>
                  {!q.isCorrect && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span className="text-destructive font-medium">Ta réponse : {q.studentAnswer}</span>
                      <span className="mx-1.5">·</span>
                      <span className="text-success font-medium">Bonne réponse : {q.correctAnswer}</span>
                    </div>
                  )}
                </div>

                {q.isFlagged && (
                  <Flag className="w-4 h-4 text-warning shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
