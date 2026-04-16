import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, ChevronLeft, ChevronRight, FileText, StickyNote, Pencil, MessageCircle,
  ThumbsUp, ThumbsDown, Star, Clock, CheckCircle2, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { lessonTranscript, drillQuestions, forumPosts } from "@/data/questions";

const speeds = ["0.75x", "1x", "1.25x", "1.5x", "2x"];

export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [speed, setSpeed] = useState("1x");
  const [notes, setNotes] = useState("Retenir : P(A) = cas favorables / cas possibles.\nAttention aux probabilités conditionnelles.\nToujours vérifier si les événements sont indépendants.");
  const [favorite, setFavorite] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillSubmitted, setDrillSubmitted] = useState(false);
  const [forumInput, setForumInput] = useState("");

  // Independent toggles for transcript (below) and drill (side panel)
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [sidePanelTab, setSidePanelTab] = useState<"drill" | "notes" | "forum" | null>(null);

  const hasSidePanel = sidePanelTab !== null;
  const drillCorrectCount = drillQuestions.filter(q => drillAnswers[q.id] === q.correctAnswer).length;

  const toggleSideTab = (tab: "drill" | "notes" | "forum") => {
    setSidePanelTab(sidePanelTab === tab ? null : tab);
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <button onClick={() => navigate("/cours")} className="hover:text-foreground transition-colors">Cours</button>
        <span>/</span>
        <span>Calcul</span>
        <span>/</span>
        <span>Probabilités</span>
        <span>/</span>
        <span className="text-foreground font-medium">Probabilités conditionnelles</span>
      </div>

      <div className={cn("transition-all duration-300", hasSidePanel ? "flex gap-6" : "")}>
        {/* Video zone + transcript below */}
        <div className={cn("transition-all duration-300", hasSidePanel ? "w-[55%] shrink-0" : "w-full max-w-4xl")}>
          {/* Video player placeholder */}
          <div className="aspect-video bg-foreground/90 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-card/30 transition-colors">
              <Play className="w-7 h-7 text-primary-foreground ml-1" />
            </div>
            <div className="absolute bottom-4 left-4 text-primary-foreground">
              <div className="text-sm font-medium">Probabilités conditionnelles</div>
              <div className="text-xs opacity-70">14:32</div>
            </div>
          </div>

          {/* Prof & controls */}
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">E</div>
              <div>
                <div className="text-sm font-medium">Étienne Albert</div>
                <div className="text-[11px] text-muted-foreground">Score 547/600</div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
              {speeds.map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={cn(
                    "px-2 py-1 rounded-md text-[11px] font-medium transition-colors",
                    s === speed ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Leçon 5/7</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~25 min restantes</span>
            <span>Drill : pas fait</span>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between mt-3">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Cours précédent
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Cours suivant <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* Transcript (opens BELOW the video) */}
          <AnimatePresence>
            {transcriptOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-card rounded-2xl border border-border p-5 mt-4 max-h-[50vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">Transcript du cours</h3>
                    <button onClick={() => setTranscriptOpen(false)} className="text-muted-foreground hover:text-foreground">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                  {lessonTranscript.map((item, i) => (
                    <div key={i}>
                      {item.type === "heading" && <h4 className="font-semibold text-sm mt-4 mb-1">{item.content}</h4>}
                      {item.type === "text" && <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>}
                      {item.type === "formula" && (
                        <div className="bg-primary/5 rounded-xl px-4 py-2 my-2 text-sm font-mono font-semibold text-primary">{item.content}</div>
                      )}
                      {item.type === "example" && (
                        <div className="border border-border rounded-xl px-4 py-3 my-2 text-sm bg-muted/30">{item.content}</div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Side panel: Drill / Notes / Forum */}
        {hasSidePanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 min-w-0"
          >
            <div className="bg-card rounded-2xl border border-border p-5 max-h-[70vh] overflow-y-auto">
              {sidePanelTab === "drill" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Drill — Compréhension</h3>
                  {drillQuestions.map((q, i) => (
                    <div key={q.id} className="border border-border rounded-xl p-4">
                      <p className="text-sm font-medium mb-3">{i + 1}. {q.text}</p>
                      <div className="space-y-1.5">
                        {q.choices.map(c => {
                          const selected = drillAnswers[q.id] === c.label;
                          const showResult = drillSubmitted;
                          const isCorrectChoice = c.label === q.correctAnswer;
                          return (
                            <button
                              key={c.label}
                              onClick={() => !drillSubmitted && setDrillAnswers(prev => ({ ...prev, [q.id]: c.label }))}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-xs text-left transition-all",
                                showResult && isCorrectChoice ? "border-success bg-success/5" :
                                showResult && selected && !isCorrectChoice ? "border-destructive bg-destructive/5" :
                                selected ? "border-primary bg-primary/5" :
                                "border-border hover:border-primary/30"
                              )}
                            >
                              <span className={cn(
                                "w-5 h-5 rounded flex items-center justify-center text-[10px] font-semibold shrink-0",
                                showResult && isCorrectChoice ? "bg-success text-success-foreground" :
                                showResult && selected && !isCorrectChoice ? "bg-destructive text-destructive-foreground" :
                                selected ? "bg-primary text-primary-foreground" :
                                "bg-muted text-muted-foreground"
                              )}>
                                {c.label}
                              </span>
                              {c.text}
                            </button>
                          );
                        })}
                      </div>
                      {drillSubmitted && (
                        <div className="mt-2 text-xs text-muted-foreground">{q.explanation}</div>
                      )}
                    </div>
                  ))}
                  {!drillSubmitted ? (
                    <Button
                      size="sm"
                      onClick={() => setDrillSubmitted(true)}
                      disabled={Object.keys(drillAnswers).length < drillQuestions.length}
                    >
                      Valider le drill
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Score : {drillCorrectCount}/{drillQuestions.length}</div>
                      <Button size="sm" variant="outline" onClick={() => navigate("/entrainement/demo")}>
                        Lancer un sous-test thématique →
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {sidePanelTab === "notes" && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Mes notes</h3>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[300px] text-sm"
                    placeholder="Prends des notes ici..."
                  />
                  <div className="text-[11px] text-muted-foreground">Sauvegarde automatique</div>
                </div>
              )}

              {sidePanelTab === "forum" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Ask an Expert</h3>
                  {forumPosts.map(post => (
                    <div key={post.id} className="border border-border rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">{post.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium">{post.author}</span>
                            <span className="text-[10px] text-muted-foreground">{post.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{post.question}</p>
                        </div>
                      </div>
                      <div className="ml-9 bg-primary/5 rounded-xl p-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium text-primary">{post.answer.author}</span>
                          <span className="text-[10px] text-muted-foreground">{post.answer.date}</span>
                        </div>
                        <p className="text-sm mt-1">{post.answer.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3">
                    <Textarea
                      value={forumInput}
                      onChange={e => setForumInput(e.target.value)}
                      placeholder="Poser ma question..."
                      className="text-sm min-h-[80px]"
                    />
                    <Button size="sm" className="mt-2" disabled={!forumInput.trim()}>Envoyer</Button>
                  </div>
                  <div className="mt-4 rounded-xl p-4 border border-border bg-muted/30">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Pour accéder à toutes les conversations et poser ta question aux profs
                    </p>
                    <a
                      href="https://discord.gg/astprep"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                      style={{ background: "#5865F2" }}
                    >
                      Rejoins le Discord →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Tab buttons */}
      <div className="flex items-center gap-2 mt-5">
        {/* Transcript toggle — opens below */}
        <button
          onClick={() => setTranscriptOpen(!transcriptOpen)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
            transcriptOpen
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
          )}
        >
          <FileText className="w-4 h-4" />
          Transcript
          {transcriptOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Side panel tabs */}
        {([
          { id: "notes" as const, label: "Mes notes", icon: StickyNote },
          { id: "drill" as const, label: "Lancer un drill", icon: Pencil },
          { id: "forum" as const, label: "Ask an Expert", icon: MessageCircle },
        ]).map(tab => {
          const Icon = tab.icon;
          const isActive = sidePanelTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => toggleSideTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                isActive
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">Cette leçon t'a aidé ?</span>
        <button
          onClick={() => setFeedback(feedback === "up" ? null : "up")}
          className={cn("p-1.5 rounded-lg transition-colors", feedback === "up" ? "bg-success/10 text-success" : "text-muted-foreground hover:text-foreground")}
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => setFeedback(feedback === "down" ? null : "down")}
          className={cn("p-1.5 rounded-lg transition-colors", feedback === "down" ? "bg-destructive/10 text-destructive" : "text-muted-foreground hover:text-foreground")}
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setFavorite(!favorite)}
          className={cn("p-1.5 rounded-lg transition-colors", favorite ? "text-warning" : "text-muted-foreground hover:text-foreground")}
        >
          <Star className={cn("w-4 h-4", favorite && "fill-warning")} />
        </button>
      </div>
    </div>
  );
}
