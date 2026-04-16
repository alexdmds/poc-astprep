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
import { useSubtests, useDeleteSubtest } from "@/lib/queries/subtests";
import { useSections } from "@/lib/queries/sections";

interface SubtestRow {
  id: string;
  title: string;
  section_id: string;
  type: string;
  question_count: number;
  duration_minutes: number;
  avg_score: number;
  sort_order: number;
  sections: { id: string; label: string } | null;
}

export default function Subtests() {
  const navigate = useNavigate();
  const [sectionId, setSectionId] = useState<string | undefined>(undefined);
  const { data: subtests = [], isLoading } = useSubtests(sectionId);
  const { data: sections = [] } = useSections();
  const deleteSubtest = useDeleteSubtest();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleDelete() {
    if (!deleteId) return;
    deleteSubtest.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<SubtestRow>[] = [
    { accessorKey: "title", header: "Titre" },
    {
      id: "section",
      header: "Section",
      cell: ({ row }) => row.original.sections?.label ?? row.original.section_id,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.type === "generaliste" ? "default" : "secondary"}>
          {row.original.type}
        </Badge>
      ),
    },
    { accessorKey: "question_count", header: "Nb questions" },
    {
      accessorKey: "duration_minutes",
      header: "Duree",
      cell: ({ row }) => `${row.original.duration_minutes} min`,
    },
    {
      accessorKey: "avg_score",
      header: "Score moyen",
      cell: ({ row }) => `${row.original.avg_score}%`,
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
              onClick={() => navigate(`/content/subtests/${row.original.id}`)}
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
      <PageHeader title="Sous-tests" description="Gestion des sous-tests">
        <Button onClick={() => navigate("/content/subtests/new")}>
          Nouveau sous-test
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
      </div>

      <DataTable
        columns={columns}
        data={subtests as SubtestRow[]}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer le sous-test"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer ce sous-test ?"
        onConfirm={handleDelete}
        loading={deleteSubtest.isPending}
      />
    </div>
  );
}
