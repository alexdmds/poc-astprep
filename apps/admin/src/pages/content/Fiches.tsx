import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
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
import { useFiches, useDeleteFiche } from "@/lib/queries/fiches";
import { useSections } from "@/lib/queries/sections";

interface FicheRow {
  id: string;
  title: string;
  description: string;
  section_id: string;
  pdf_url: string | null;
  sections: { label: string } | null;
}

export default function Fiches() {
  const navigate = useNavigate();
  const [sectionId, setSectionId] = useState<string | undefined>(undefined);
  const { data: fiches = [], isLoading } = useFiches(sectionId);
  const { data: sections = [] } = useSections();
  const deleteFiche = useDeleteFiche();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleDelete() {
    if (!deleteId) return;
    deleteFiche.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<FicheRow>[] = [
    { accessorKey: "title", header: "Titre" },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const text = row.original.description;
        return text.length > 80 ? `${text.slice(0, 80)}...` : text;
      },
    },
    {
      id: "section",
      header: "Section",
      cell: ({ row }) => row.original.sections?.label ?? row.original.section_id,
    },
    {
      id: "pdf",
      header: "PDF",
      cell: ({ row }) =>
        row.original.pdf_url ? (
          <a
            href={row.original.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            <FileText className="h-4 w-4" />
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
              onClick={() => navigate(`/content/fiches/${row.original.id}`)}
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
      <PageHeader title="Fiches" description="Gestion des fiches">
        <Button onClick={() => navigate("/content/fiches/new")}>
          Nouvelle fiche
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
        data={fiches as FicheRow[]}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer la fiche"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer cette fiche ?"
        onConfirm={handleDelete}
        loading={deleteFiche.isPending}
      />
    </div>
  );
}
