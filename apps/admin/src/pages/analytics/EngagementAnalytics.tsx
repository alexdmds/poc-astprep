import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function EngagementAnalytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Engagement"
        description="Metriques d'engagement des utilisateurs"
      />
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">
            Analytiques d'engagement - a venir
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
