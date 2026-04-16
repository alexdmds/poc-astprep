import type { ColumnDef } from "@tanstack/react-table";
import { Users, HelpCircle, BookOpen, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import {
  useDashboardStats,
  useSignupTrend,
  useSessionTrend,
  useRecentSessions,
} from "@/lib/queries/analytics";

interface RecentSessionRow {
  id: string;
  quiz_type: string | null;
  score: number | null;
  started_at: string;
  profiles: { full_name: string | null } | null;
}

const PRIMARY_COLOR = "hsl(262, 52%, 37%)";

const recentSessionColumns: ColumnDef<RecentSessionRow, unknown>[] = [
  {
    accessorKey: "profiles",
    header: "Utilisateur",
    cell: ({ row }) => row.original.profiles?.full_name ?? "—",
  },
  {
    accessorKey: "quiz_type",
    header: "Type",
    cell: ({ row }) => row.original.quiz_type ?? "—",
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => row.original.score ?? "—",
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

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: signupTrend } = useSignupTrend();
  const { data: sessionTrend } = useSessionTrend();
  const { data: recentSessions, isLoading: sessionsLoading } = useRecentSessions(10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de la plateforme"
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total utilisateurs"
          value={statsLoading ? "..." : (stats?.totalUsers ?? 0)}
          icon={Users}
        />
        <StatCard
          title="Questions"
          value={statsLoading ? "..." : (stats?.totalQuestions ?? 0)}
          icon={HelpCircle}
        />
        <StatCard
          title="Cours"
          value={statsLoading ? "..." : (stats?.totalLessons ?? 0)}
          icon={BookOpen}
        />
        <StatCard
          title="Sessions"
          value={statsLoading ? "..." : (stats?.totalSessions ?? 0)}
          icon={Activity}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inscriptions (30j)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={signupTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={PRIMARY_COLOR}
                  fill={PRIMARY_COLOR}
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sessions (30j)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sessions recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={recentSessionColumns}
            data={(recentSessions as RecentSessionRow[]) ?? []}
            isLoading={sessionsLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
