import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLessons, useDeleteLesson } from "@/lib/queries/lessons";
import { useSections } from "@/lib/queries/sections";

interface LessonRow {
  id: string;
  title: string;
  type: string;
  duration_minutes: number;
  professor: string | null;
  sort_order: number;
  chapter_id: string;
  chapters: {
    id: string;
    title: string;
    section_id: string;
    sections: { id: string; label: string } | null;
  } | null;
}

export default function Lessons() {
  const navigate = useNavigate();
  const [sectionId, setSectionId] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const { data: lessons = [], isLoading } = useLessons({
    sectionId,
    type: typeFilter,
  });
  const { data: sections = [] } = useSections();
  const deleteLesson = useDeleteLesson();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleDelete() {
    if (!deleteId) return;
    deleteLesson.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<LessonRow>[] = [
    { accessorKey: "title", header: "Titre" },
    {
      id: "chapter",
      header: "Chapitre",
      cell: ({ row }) => row.original.chapters?.title ?? "-",
    },
    {
      accessorKey: "duration_minutes",
      header: "Duree",
      cell: ({ row }) => `${row.original.duration_minutes} min`,
    },
    {
      accessorKey: "professor",
      header: "Professeur",
      cell: ({ row }) => row.original.professor ?? "-",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.type === "video" ? "default" : "secondary"}>
          {row.original.type}
        </Badge>
      ),
    },
    { accessorKey: "sort_order", header: "Ordre" },
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
              onClick={() => navigate(`/content/lessons/${row.original.id}`)}
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
      <PageHeader title="Cours" description="Gestion des cours">
        <Button onClick={() => navigate("/content/lessons/new")}>
          Nouveau cours
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <Select
          value={sectionId ?? "all"}
          onValueChange={(v) => setSectionId(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sections</SelectItem>
            {sections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={typeFilter ?? "all"}
          onValueChange={(v) => setTypeFilter(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="exercise">Exercise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={lessons as LessonRow[]}
        searchKey="title"
        searchPlaceholder="Rechercher un cours..."
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer le cours"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer ce cours ?"
        onConfirm={handleDelete}
        loading={deleteLesson.isPending}
      />
    </div>
  );
}
