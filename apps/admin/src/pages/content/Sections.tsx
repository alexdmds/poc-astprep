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
  useSections,
  useUpsertSection,
  useDeleteSection,
} from "@/lib/queries/sections";
import type { Database } from "@/types/supabase";

type Section = Database["public"]["Tables"]["sections"]["Row"];

const EMPTY_FORM = {
  id: "",
  label: "",
  short_label: "",
  product_id: "tage_mage",
  icon_name: "",
  color: "",
  hsl: "",
  sort_order: 0,
};

export default function Sections() {
  const { data: sections = [], isLoading } = useSections();
  const upsertSection = useUpsertSection();
  const deleteSection = useDeleteSection();

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openEdit(section?: Section) {
    setEditForm(
      section
        ? {
            id: section.id,
            label: section.label,
            short_label: section.short_label,
            product_id: section.product_id,
            icon_name: section.icon_name,
            color: section.color,
            hsl: section.hsl,
            sort_order: section.sort_order,
          }
        : EMPTY_FORM,
    );
    setEditOpen(true);
  }

  function handleSave() {
    upsertSection.mutate(editForm, {
      onSuccess: () => setEditOpen(false),
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteSection.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<Section>[] = [
    { accessorKey: "label", header: "Label" },
    { accessorKey: "short_label", header: "Label court" },
    { accessorKey: "icon_name", header: "Icone" },
    {
      accessorKey: "color",
      header: "Couleur",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: row.original.color }}
          />
          {row.original.color}
        </div>
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
      <PageHeader title="Sections" description="Gestion des sections" />

      <DataTable columns={columns} data={sections} isLoading={isLoading} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editForm.id ? "Modifier la section" : "Nouvelle section"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>ID</Label>
              <Input
                value={editForm.id}
                onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={editForm.label}
                onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Label court</Label>
              <Input
                value={editForm.short_label}
                onChange={(e) =>
                  setEditForm({ ...editForm, short_label: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Icone</Label>
              <Input
                value={editForm.icon_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, icon_name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Couleur</Label>
                <Input
                  value={editForm.color}
                  onChange={(e) =>
                    setEditForm({ ...editForm, color: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>HSL</Label>
                <Input
                  value={editForm.hsl}
                  onChange={(e) =>
                    setEditForm({ ...editForm, hsl: e.target.value })
                  }
                />
              </div>
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
            <Button onClick={handleSave} disabled={upsertSection.isPending}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer la section"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer cette section ?"
        onConfirm={handleDelete}
        loading={deleteSection.isPending}
      />
    </div>
  );
}
