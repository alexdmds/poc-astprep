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
  useThemes,
  useUpsertTheme,
  useDeleteTheme,
} from "@/lib/queries/themes";
import { useSections } from "@/lib/queries/sections";
import type { Database } from "@/types/supabase";

type Theme = Database["public"]["Tables"]["themes"]["Row"];

const EMPTY_FORM = { id: "", name: "", section_id: "", sort_order: 0 };

export default function Themes() {
  const [sectionId, setSectionId] = useState<string | undefined>(undefined);
  const { data: themes = [], isLoading } = useThemes(sectionId);
  const { data: sections = [] } = useSections();
  const upsertTheme = useUpsertTheme();
  const deleteTheme = useDeleteTheme();

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openEdit(theme?: Theme) {
    setEditForm(
      theme
        ? {
            id: theme.id,
            name: theme.name,
            section_id: theme.section_id,
            sort_order: theme.sort_order,
          }
        : EMPTY_FORM,
    );
    setEditOpen(true);
  }

  function handleSave() {
    upsertTheme.mutate(editForm, {
      onSuccess: () => setEditOpen(false),
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteTheme.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<Theme>[] = [
    { accessorKey: "name", header: "Nom" },
    {
      accessorKey: "section_id",
      header: "Section",
      cell: ({ row }) => {
        const section = sections.find((s) => s.id === row.original.section_id);
        return section?.label ?? row.original.section_id;
      },
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
      <PageHeader title="Themes" description="Gestion des themes par section">
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

      <DataTable columns={columns} data={themes} isLoading={isLoading} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editForm.id ? "Modifier le theme" : "Nouveau theme"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
            <Button onClick={handleSave} disabled={upsertTheme.isPending}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer le theme"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer ce theme ?"
        onConfirm={handleDelete}
        loading={deleteTheme.isPending}
      />
    </div>
  );
}
