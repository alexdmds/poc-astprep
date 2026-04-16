import { useParams, useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, BookOpen, Clock, Flame, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { useUser, useUserStats, useUserQuizSessions } from "@/lib/queries/users";

interface QuizSessionRow {
  id: string;
  quiz_type: string | null;
  section: string | null;
  score: number | null;
  max_score: number | null;
  duration_seconds: number | null;
  started_at: string;
}

const statusColorMap: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  trialing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  canceled: "bg-red-100 text-red-800 border-red-200",
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

const sessionColumns: ColumnDef<QuizSessionRow, unknown>[] = [
  {
    accessorKey: "quiz_type",
    header: "Type",
    cell: ({ row }) => row.original.quiz_type ?? "—",
  },
  {
    accessorKey: "section",
    header: "Section",
    cell: ({ row }) => row.original.section ?? "—",
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const { score, max_score } = row.original;
      if (score === null) return "—";
      return max_score ? `${score}/${max_score}` : String(score);
    },
  },
  {
    accessorKey: "duration_seconds",
    header: "Duree",
    cell: ({ row }) => formatDuration(row.original.duration_seconds),
  },
  {
    accessorKey: "started_at",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.original.started_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useUser(id!);
  const { data: stats } = useUserStats(id!);
  const { data: sessions, isLoading: sessionsLoading } = useUserQuizSessions(id!);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <p className="text-muted-foreground">Utilisateur introuvable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/users")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux utilisateurs
      </Button>

      {/* Profile card */}
      <Card>
        <CardContent className="flex items-start gap-6 p-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name ?? "Avatar"} />
            <AvatarFallback className="text-lg">{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{user.full_name ?? "Sans nom"}</h2>
              {user.subscription_plan && (
                <Badge variant="secondary">{user.subscription_plan}</Badge>
              )}
              {user.subscription_status && (
                <Badge
                  className={statusColorMap[user.subscription_status] ?? ""}
                  variant="outline"
                >
                  {user.subscription_status}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
              {user.school && <span>Ecole: {user.school}</span>}
              {user.exam_date && (
                <span>
                  Date d'examen:{" "}
                  {new Date(user.exam_date).toLocaleDateString("fr-FR")}
                </span>
              )}
              {user.target_score !== null && user.target_score !== undefined && (
                <span>Score cible: {user.target_score}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total sessions"
          value={stats?.totalSessions ?? 0}
          icon={BookOpen}
          description="Sessions de quiz completees"
        />
        <StatCard
          title="Score moyen"
          value={stats?.avgScore ?? 0}
          icon={Target}
          description="Score moyen sur toutes les sessions"
        />
        <StatCard
          title="Streak actuel"
          value={stats?.streak ?? 0}
          icon={Flame}
          description="Jours consecutifs d'activite"
        />
        <StatCard
          title="Heures etudiees"
          value="—"
          icon={Clock}
          description="Temps total d'etude"
        />
      </div>

      {/* Quiz history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique des quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={sessionColumns}
            data={(sessions?.data as QuizSessionRow[]) ?? []}
            isLoading={sessionsLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
