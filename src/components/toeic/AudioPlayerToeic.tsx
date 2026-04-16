import { useState } from "react";
import { Lock, Settings2, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

type Mode = "examen" | "entrainement";

interface AudioPlayerToeicProps {
  /** Force a mode and disable toggle */
  forcedMode?: Mode;
  /** Called when mode is selected and user starts */
  onStart?: (mode: Mode) => void;
  /** Show the mode selector (pre-session) or the player (in-session) */
  phase?: "select" | "playing";
  /** Audio URL */
  src?: string;
}

export function AudioPlayerToeic({ forcedMode, onStart, phase = "select", src }: AudioPlayerToeicProps) {
  const [selectedMode, setSelectedMode] = useState<Mode>(forcedMode || "entrainement");
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState([0]);

  if (phase === "select") {
    return (
      <div className="space-y-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mode audio</div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => !forcedMode && setSelectedMode("examen")}
            disabled={forcedMode === "entrainement"}
            className={cn(
              "rounded-xl border p-4 text-left transition-all",
              selectedMode === "examen" ? "border-sky-500 bg-sky-500/5 ring-2 ring-sky-500/20" : "border-border hover:border-sky-500/30",
              forcedMode === "entrainement" && "opacity-50 cursor-not-allowed"
            )}
          >
            <Lock className={cn("w-5 h-5 mb-2", selectedMode === "examen" ? "text-sky-500" : "text-muted-foreground")} />
            <div className="text-sm font-semibold">Mode examen</div>
            <div className="text-xs text-muted-foreground mt-1">Audio joué une seule fois, pas de pause, conditions réelles</div>
          </button>
          <button
            onClick={() => !forcedMode && setSelectedMode("entrainement")}
            disabled={forcedMode === "examen"}
            className={cn(
              "rounded-xl border p-4 text-left transition-all",
              selectedMode === "entrainement" ? "border-sky-500 bg-sky-500/5 ring-2 ring-sky-500/20" : "border-border hover:border-sky-500/30",
              forcedMode === "examen" && "opacity-50 cursor-not-allowed"
            )}
          >
            <Settings2 className={cn("w-5 h-5 mb-2", selectedMode === "entrainement" ? "text-sky-500" : "text-muted-foreground")} />
            <div className="text-sm font-semibold">Mode entraînement</div>
            <div className="text-xs text-muted-foreground mt-1">Replay illimité, vitesse réglable</div>
          </button>
        </div>
        {forcedMode && (
          <div className="text-xs text-muted-foreground text-center">Mode imposé pour ce type d'exercice</div>
        )}
      </div>
    );
  }

  // In-session player
  const isExam = selectedMode === "examen";

  return (
    <div className="bg-card rounded-xl border border-border p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
          isExam ? "bg-destructive/10 text-destructive" : "bg-sky-500/10 text-sky-500")}>
          {isExam ? "Examen" : "Entraînement"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (isExam && played) return;
            setPlaying(!playing);
            if (!played) setPlayed(true);
          }}
          disabled={isExam && played}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all",
            isExam && played ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" : "bg-sky-500 text-white hover:bg-sky-600"
          )}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {!isExam && (
          <>
            <div className="flex-1">
              <Slider min={0} max={100} step={1} value={progress} onValueChange={setProgress} />
            </div>
            <button onClick={() => { setProgress([0]); setPlaying(false); }}
              className="text-muted-foreground hover:text-foreground">
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}

        {isExam && (
          <div className="flex-1 text-xs text-muted-foreground">
            {played ? "Audio déjà joué" : "Cliquez pour lancer l'audio"}
          </div>
        )}
      </div>

      {!isExam && (
        <div className="flex gap-1.5 mt-2">
          {[0.75, 1, 1.25, 1.5].map(s => (
            <button key={s} onClick={() => setSpeed(s)}
              className={cn("px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                speed === s ? "bg-sky-500/10 text-sky-500" : "text-muted-foreground hover:bg-muted")}>
              {s}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
