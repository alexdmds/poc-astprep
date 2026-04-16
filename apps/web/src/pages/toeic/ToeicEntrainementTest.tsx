import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Settings2, Play, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioPlayerToeic } from "@/components/toeic/AudioPlayerToeic";
import { QuizInterface } from "@/components/QuizInterface";
import { toeicQuestions } from "@/data/toeic";
import type { Question } from "@/data/questions";
import { cn } from "@/lib/utils";

type Phase = "setup" | "quiz" | "done";

export default function ToeicEntrainementTest() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("setup");
  const [audioMode, setAudioMode] = useState<"examen" | "entrainement">("entrainement");

  // Determine if this is a listening test (Part 1-4)
  const partMatch = testId?.match(/p(\d)/);
  const partNum = partMatch ? parseInt(partMatch[1]) : 5;
  const isListening = partNum <= 4;

  // Map toeic questions to Quiz questions format
  const questions: Question[] = toeicQuestions.slice(0, 15).map(q => ({
    id: q.id,
    number: q.number,
    text: q.text,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    section: q.theme,
    theme: q.microCompetence,
    difficulty: q.difficulty === "Easy" ? "Facile" as const : q.difficulty === "Medium" ? "Moyen" as const : "Difficile" as const,
  }));

  if (phase === "quiz") {
    return (
      <div>
        {/* Audio mode badge */}
        {isListening && (
          <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm px-6 py-2 border-b border-border">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
              audioMode === "examen" ? "bg-destructive/10 text-destructive" : "bg-sky-500/10 text-sky-500")}>
              {audioMode === "examen" ? "Mode Examen" : "Mode Entraînement"}
            </span>
          </div>
        )}
        <QuizInterface
          title={`Session TOEIC — ${testId}`}
          questions={questions}
          timerSeconds={isListening ? 45 * 60 : 75 * 60}
          onFinish={() => navigate("/toeic/entrainement")}
        />
      </div>
    );
  }

  return (
    <div className="p-6 py-8 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Configurer la session</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Test : {testId}</p>
        </div>
      </div>

      {isListening && (
        <AudioPlayerToeic
          phase="select"
          onStart={(mode) => { setAudioMode(mode); setPhase("quiz"); }}
        />
      )}

      <div className="bg-card rounded-xl border border-border p-4">
        <div className="text-sm font-medium mb-1">{questions.length} questions</div>
        <div className="text-xs text-muted-foreground">
          {isListening ? "Listening — 45 min" : "Reading — 75 min"}
        </div>
      </div>

      <Button
        onClick={() => setPhase("quiz")}
        className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white"
      >
        <Play className="w-4 h-4 mr-2" /> Lancer la session
      </Button>
    </div>
  );
}
