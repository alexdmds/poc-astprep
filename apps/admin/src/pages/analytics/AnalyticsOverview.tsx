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
import {
  useDashboardStats,
  useSignupTrend,
  useSessionTrend,
} from "@/lib/queries/analytics";

const PRIMARY_COLOR = "hsl(262, 52%, 37%)";

export default function AnalyticsOverview() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: signupTrend } = useSignupTrend();
  const { data: sessionTrend } = useSessionTrend();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytiques"
        description="Vue d'ensemble des metriques de la plateforme"
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

      {/* Signup trend chart */}
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

      {/* Session trend chart */}
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
  );
}
