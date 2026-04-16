import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
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
import { useFlashcards, useDeleteFlashcard } from "@/lib/queries/flashcards";
import { useSections } from "@/lib/queries/sections";

interface FlashcardRow {
  id: string;
  front: string;
  back: string;
  section_id: string;
  theme: string;
  sections: { label: string } | null;
}

export default function Flashcards() {
  const navigate = useNavigate();
  const [sectionId, setSectionId] = useState<string | undefined>(undefined);
  const { data: flashcards = [], isLoading } = useFlashcards({
    sectionId,
  });
  const { data: sections = [] } = useSections();
  const deleteFlashcard = useDeleteFlashcard();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleDelete() {
    if (!deleteId) return;
    deleteFlashcard.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<FlashcardRow>[] = [
    {
      accessorKey: "front",
      header: "Recto",
      cell: ({ row }) => {
        const text = row.original.front;
        return text.length > 60 ? `${text.slice(0, 60)}...` : text;
      },
    },
    {
      accessorKey: "back",
      header: "Verso",
      cell: ({ row }) => {
        const text = row.original.back;
        return text.length > 60 ? `${text.slice(0, 60)}...` : text;
      },
    },
    {
      id: "section",
      header: "Section",
      cell: ({ row }) => row.original.sections?.label ?? row.original.section_id,
    },
    { accessorKey: "theme", header: "Theme" },
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
              onClick={() => navigate(`/content/flashcards/${row.original.id}`)}
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
      <PageHeader title="Flashcards" description="Gestion des flashcards">
        <Button onClick={() => navigate("/content/flashcards/new")}>
          Nouvelle flashcard
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
        data={flashcards as FlashcardRow[]}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer la flashcard"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer cette flashcard ?"
        onConfirm={handleDelete}
        loading={deleteFlashcard.isPending}
      />
    </div>
  );
}
