import { useState } from "react";
import { Trophy, Medal, ArrowLeft, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const tabs = ["Ce mois", "Ce trimestre"] as const;
const subTabs = ["Défis", "Listening Trainer"] as const;

const challengeData = [
  { rank: 1, pseudo: "EnglishPro", points: 285, challenges: 24 },
  { rank: 2, pseudo: "ToeicAce", points: 260, challenges: 22 },
  { rank: 3, pseudo: "WordMaster", points: 240, challenges: 20 },
  { rank: 4, pseudo: "Thomas L.", points: 165, challenges: 15, isMe: true },
  { rank: 5, pseudo: "ListenUp", points: 142, challenges: 13 },
];

const listeningData = [
  { rank: 1, pseudo: "ListenUp", points: 420, sessions: 35 },
  { rank: 2, pseudo: "EnglishPro", points: 380, sessions: 30 },
  { rank: 3, pseudo: "Thomas L.", points: 310, sessions: 24, isMe: true },
  { rank: 4, pseudo: "ToeicAce", points: 280, sessions: 22 },
  { rank: 5, pseudo: "WordMaster", points: 250, sessions: 20 },
];

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Medal className="w-5 h-5 text-warning" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-warning/70" />;
  return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
};

export default function ToeicClassement() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Ce mois");
  const [subTab, setSubTab] = useState("Défis");
  const data = subTab === "Défis" ? challengeData : listeningData;
  const myRank = data.find(r => r.isMe);

  return (
    <div className="p-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <Trophy className="w-5 h-5 text-sky-500" />
        <h1 className="text-xl font-bold">Classement TOEIC</h1>
      </div>

      {myRank && (
        <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <span className="text-lg font-bold text-sky-500">#{myRank.rank}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Ta position</div>
            <div className="text-xs text-muted-foreground">{myRank.points} points</div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-4 py-2 rounded-md text-xs font-medium transition-colors",
                t === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>{t}</button>
          ))}
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          {subTabs.map(t => (
            <button key={t} onClick={() => setSubTab(t)}
              className={cn("px-4 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                t === subTab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>
              {t === "Listening Trainer" && <Headphones className="w-3.5 h-3.5" />}{t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rang</TableHead>
              <TableHead>Pseudo</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">{subTab === "Défis" ? "Défis" : "Sessions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.rank} className={cn(row.isMe && "bg-sky-500/5")}>
                <TableCell><div className="flex items-center justify-center w-8"><RankBadge rank={row.rank} /></div></TableCell>
                <TableCell className={cn("font-medium", row.isMe && "text-sky-500")}>
                  {row.pseudo} {row.isMe && <span className="text-[10px] bg-sky-500/10 text-sky-500 px-1.5 py-0.5 rounded-full ml-1">toi</span>}
                </TableCell>
                <TableCell className="text-right font-semibold">{row.points} pts</TableCell>
                <TableCell className="text-right text-muted-foreground">{'challenges' in row ? row.challenges : (row as any).sessions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
