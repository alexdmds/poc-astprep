import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function QuizAnalytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytiques Quiz"
        description="Analyse detaillee des performances quiz"
      />
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">
            Analytiques quiz detaillees - a venir
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
