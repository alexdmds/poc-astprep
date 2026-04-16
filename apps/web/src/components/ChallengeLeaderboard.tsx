import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const tabs = ["Ce mois", "Ce trimestre"] as const;

const leaderboardData = [
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

export function ChallengeLeaderboard() {
  const [tab, setTab] = useState<string>("Ce mois");

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Classement des défis</h2>
      <div className="flex gap-1 mb-4">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] flex items-center",
              t === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rang</TableHead>
              <TableHead>Pseudo</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Défis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map(row => (
              <TableRow key={row.rank} className={cn(row.isMe && "bg-primary/5")}>
                <TableCell className="font-bold">{row.rank}</TableCell>
                <TableCell className={cn("font-medium", row.isMe && "text-primary")}>
                  {row.pseudo} {row.isMe && <span className="text-xs text-muted-foreground">(toi)</span>}
                </TableCell>
                <TableCell className="text-right">{row.points} pts</TableCell>
                <TableCell className="text-right">{row.challenges}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
