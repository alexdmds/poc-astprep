import { useState } from "react";
import { Trophy, Medal, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const tabs = ["Ce mois", "Ce trimestre"] as const;

const monthlyData = [
  { rank: 1, pseudo: "StudyBeast", points: 340, challenges: 28 },
  { rank: 2, pseudo: "TageKiller", points: 312, challenges: 25 },
  { rank: 3, pseudo: "MathGenius", points: 298, challenges: 24 },
  { rank: 4, pseudo: "Thomas L.", points: 127, challenges: 12, isMe: true },
  { rank: 5, pseudo: "PrepMaster", points: 118, challenges: 11 },
  { rank: 6, pseudo: "QuizHero", points: 105, challenges: 10 },
  { rank: 7, pseudo: "BrainPower", points: 96, challenges: 9 },
  { rank: 8, pseudo: "AceMath", points: 82, challenges: 8 },
  { rank: 9, pseudo: "LogicPro", points: 74, challenges: 7 },
  { rank: 10, pseudo: "SpeedCalc", points: 61, challenges: 6 },
];

const quarterlyData = [
  { rank: 1, pseudo: "TageKiller", points: 980, challenges: 78 },
  { rank: 2, pseudo: "StudyBeast", points: 945, challenges: 75 },
  { rank: 3, pseudo: "MathGenius", points: 870, challenges: 68 },
  { rank: 4, pseudo: "PrepMaster", points: 620, challenges: 50 },
  { rank: 5, pseudo: "Thomas L.", points: 485, challenges: 42, isMe: true },
  { rank: 6, pseudo: "QuizHero", points: 430, challenges: 38 },
  { rank: 7, pseudo: "BrainPower", points: 395, challenges: 34 },
  { rank: 8, pseudo: "AceMath", points: 340, challenges: 29 },
  { rank: 9, pseudo: "LogicPro", points: 290, challenges: 25 },
  { rank: 10, pseudo: "SpeedCalc", points: 215, challenges: 20 },
];

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Medal className="w-5 h-5 text-warning" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-warning/70" />;
  return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
};

export default function Classement() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("Ce mois");
  const data = tab === "Ce mois" ? monthlyData : quarterlyData;
  const myRank = data.find(r => r.isMe);

  return (
    <div className="p-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">Classement des défis</h1>
        </div>
      </div>

      {/* My position card */}
      {myRank && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">#{myRank.rank}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Ta position</div>
            <div className="text-xs text-muted-foreground">{myRank.points} points · {myRank.challenges} défis complétés</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              {tab === "Ce mois" ? "Prochain : MathGenius" : "Prochain : PrepMaster"}
            </div>
            <div className="text-xs text-primary font-medium">
              {tab === "Ce mois" ? `${298 - myRank.points} pts d'écart` : `${620 - myRank.points} pts d'écart`}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-0.5 w-fit">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 rounded-md text-xs font-medium transition-colors min-h-[44px] flex items-center",
              t === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Podium top 3 */}
      <div className="flex items-end justify-center gap-3">
        {[data[1], data[0], data[2]].map((p, i) => {
          const heights = ["h-24", "h-32", "h-20"];
          const order = [1, 0, 2];
          return (
            <div key={p.rank} className="flex flex-col items-center gap-2">
              <div className="text-center">
                <div className={cn("text-sm font-bold", p.isMe && "text-primary")}>{p.pseudo}</div>
                <div className="text-xs text-muted-foreground">{p.points} pts</div>
              </div>
              <div className={cn(
                "w-20 rounded-t-xl flex items-start justify-center pt-3",
                heights[i],
                order[i] === 0 ? "bg-primary/15" : order[i] === 1 ? "bg-primary/10" : "bg-primary/5"
              )}>
                <RankBadge rank={p.rank} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rang</TableHead>
              <TableHead>Pseudo</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Défis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.rank} className={cn(row.isMe && "bg-primary/5")}>
                <TableCell>
                  <div className="flex items-center justify-center w-8">
                    <RankBadge rank={row.rank} />
                  </div>
                </TableCell>
                <TableCell className={cn("font-medium", row.isMe && "text-primary")}>
                  {row.pseudo} {row.isMe && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1">toi</span>}
                </TableCell>
                <TableCell className="text-right font-semibold">{row.points} pts</TableCell>
                <TableCell className="text-right text-muted-foreground">{row.challenges}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
