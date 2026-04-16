import { Video, Play, Calendar, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const todayLive = {
  title: "Probabilités conditionnelles & Bayes",
  professor: "Etienne",
  professorScore: "513/600 au TAGE MAGE",
  date: "Mardi 8 avril · 18h00 – 19h30",
  section: "Calcul",
  liveUrl: "https://youtube.com/live/example",
  isLive: true,
};

const replays = [
  { id: "r1", title: "Équations & Systèmes linéaires", professor: "Etienne", section: "Calcul", date: "1er avril", duration: "1h28", views: 342 },
  { id: "r2", title: "Dénombrement avancé", professor: "Etienne", section: "Calcul", date: "25 mars", duration: "1h35", views: 518 },
  { id: "r3", title: "Pourcentages & Variations", professor: "Etienne", section: "Calcul", date: "18 mars", duration: "1h22", views: 673 },
  { id: "r4", title: "Conditions minimales — Méthode", professor: "Etienne", section: "Conditions", date: "11 mars", duration: "1h30", views: 421 },
  { id: "r5", title: "Logique : Damiers & Séries", professor: "Etienne", section: "Logique", date: "4 mars", duration: "1h25", views: 389 },
  { id: "r6", title: "R&A : Renforcer / Affaiblir", professor: "Etienne", section: "R&A", date: "25 fév", duration: "1h32", views: 456 },
  { id: "r7", title: "Géométrie & Formules clés", professor: "Etienne", section: "Calcul", date: "18 fév", duration: "1h18", views: 534 },
  { id: "r8", title: "Fractions & PGCD/PPCM", professor: "Etienne", section: "Calcul", date: "11 fév", duration: "1h20", views: 298 },
];

export default function CoursLive() {
  return (
    <div className="p-6 py-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold">Cours Live</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chaque semaine, un cours en direct avec Etienne pour approfondir un thème clé
        </p>
      </div>

      {/* Today's live */}
      <div className="bg-card rounded-xl border-2 border-primary p-5 relative overflow-hidden">
        {/* Live badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive" />
          </span>
          <span className="text-xs font-semibold text-destructive uppercase tracking-wider">En direct ce soir</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Video className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-primary mb-1">{todayLive.section}</div>
            <h2 className="text-lg font-bold text-foreground">{todayLive.title}</h2>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
              <span>avec <strong className="text-foreground">{todayLive.professor}</strong></span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{todayLive.professorScore}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {todayLive.date}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <a
            href={todayLive.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4" /> Rejoindre le live
          </a>
          <button className="border border-border text-foreground rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors inline-flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Ajouter au calendrier
          </button>
          <a
            href="#"
            className="border border-border text-foreground rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> Accéder au sujet
          </a>
        </div>
      </div>

      {/* Replays */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Replays des cours précédents</h2>
        <div className="space-y-2">
          {replays.map((r, i) => (
            <button
              key={r.id}
              className="w-full bg-card rounded-xl border border-border p-4 hover:shadow-sm hover:border-primary/30 transition-all flex items-center gap-4 text-left group"
            >
              {/* Thumbnail placeholder */}
              <div className="w-20 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0 relative overflow-hidden">
                <Play className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="absolute bottom-1 right-1 bg-foreground/80 text-background text-[9px] font-medium px-1 rounded">
                  {r.duration}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{r.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {r.section}
                  </span>
                  <span className="text-xs text-muted-foreground">avec {r.professor}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-muted-foreground">{r.date}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{r.views} vues</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
