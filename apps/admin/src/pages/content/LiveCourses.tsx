import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useLiveCourses,
  useDeleteLiveCourse,
  useToggleLive,
} from "@/lib/queries/live-courses";

interface LiveCourseRow {
  id: string;
  title: string;
  professor: string | null;
  section_id: string | null;
  scheduled_at: string;
  is_live: boolean;
  replay_url: string | null;
  join_url: string | null;
  sections: { label: string } | null;
}

function LiveToggle({ row }: { row: LiveCourseRow }) {
  const toggleLive = useToggleLive(row.id);
  return (
    <Switch
      checked={row.is_live}
      onCheckedChange={(checked) => toggleLive.mutate(checked)}
      disabled={toggleLive.isPending}
    />
  );
}

export default function LiveCourses() {
  const navigate = useNavigate();
  const { data: courses = [], isLoading } = useLiveCourses();
  const deleteLiveCourse = useDeleteLiveCourse();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleDelete() {
    if (!deleteId) return;
    deleteLiveCourse.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<LiveCourseRow>[] = [
    { accessorKey: "title", header: "Titre" },
    {
      accessorKey: "professor",
      header: "Professeur",
      cell: ({ row }) => row.original.professor ?? "-",
    },
    {
      id: "section",
      header: "Section",
      cell: ({ row }) => row.original.sections?.label ?? "-",
    },
    {
      accessorKey: "scheduled_at",
      header: "Date",
      cell: ({ row }) =>
        format(new Date(row.original.scheduled_at), "dd/MM/yyyy HH:mm"),
    },
    {
      id: "is_live",
      header: "En direct",
      cell: ({ row }) => <LiveToggle row={row.original} />,
    },
    {
      id: "replay",
      header: "Replay",
      cell: ({ row }) =>
        row.original.replay_url ? (
          <a
            href={row.original.replay_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          "-"
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                navigate(`/content/live-courses/${row.original.id}`)
              }
            >
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(row.original.id)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Cours live" description="Gestion des cours en direct">
        <Button onClick={() => navigate("/content/live-courses/new")}>
          Nouveau cours
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={courses as LiveCourseRow[]}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer le cours live"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer ce cours live ?"
        onConfirm={handleDelete}
        loading={deleteLiveCourse.isPending}
      />
    </div>
  );
}
