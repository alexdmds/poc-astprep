import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useChapters,
  useUpsertChapter,
  useDeleteChapter,
} from "@/lib/queries/chapters";
import { useSections } from "@/lib/queries/sections";

interface ChapterRow {
  id: string;
  title: string;
  section_id: string;
  sort_order: number;
  sections: { id: string; label: string } | null;
}

const EMPTY_FORM = { id: "", title: "", section_id: "", sort_order: 0 };

export default function Chapters() {
  const [sectionId, setSectionId] = useState<string | undefined>(undefined);
  const { data: chapters = [], isLoading } = useChapters(sectionId);
  const { data: sections = [] } = useSections();
  const upsertChapter = useUpsertChapter();
  const deleteChapter = useDeleteChapter();

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openEdit(chapter?: ChapterRow) {
    setEditForm(
      chapter
        ? {
            id: chapter.id,
            title: chapter.title,
            section_id: chapter.section_id,
            sort_order: chapter.sort_order,
          }
        : EMPTY_FORM,
    );
    setEditOpen(true);
  }

  function handleSave() {
    upsertChapter.mutate(editForm, {
      onSuccess: () => setEditOpen(false),
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteChapter.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<ChapterRow>[] = [
    { accessorKey: "title", header: "Titre" },
    {
      accessorKey: "section_id",
      header: "Section",
      cell: ({ row }) =>
        row.original.sections?.label ?? row.original.section_id,
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
            <DropdownMenuItem onClick={() => openEdit(row.original)}>
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
      <PageHeader title="Chapitres" description="Gestion des chapitres par section">
        <Select
          value={sectionId ?? "all"}
          onValueChange={(v) => setSectionId(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {sections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      <DataTable
        columns={columns}
        data={chapters as ChapterRow[]}
        isLoading={isLoading}
      />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editForm.id ? "Modifier le chapitre" : "Nouveau chapitre"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ID</Label>
              <Input
                value={editForm.id}
                onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select
                value={editForm.section_id}
                onValueChange={(v) => setEditForm({ ...editForm, section_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ordre</Label>
              <Input
                type="number"
                value={editForm.sort_order}
                onChange={(e) =>
                  setEditForm({ ...editForm, sort_order: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={upsertChapter.isPending}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer le chapitre"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer ce chapitre ?"
        onConfirm={handleDelete}
        loading={deleteChapter.isPending}
      />
    </div>
  );
}
