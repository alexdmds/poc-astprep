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
  useProducts,
  useUpsertProduct,
  useDeleteProduct,
} from "@/lib/queries/products";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function Products() {
  const { data: products = [], isLoading } = useProducts();
  const upsertProduct = useUpsertProduct();
  const deleteProduct = useDeleteProduct();

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", accent_color: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openEdit(product?: Product) {
    setEditForm(
      product
        ? { id: product.id, name: product.name, accent_color: product.accent_color }
        : { id: "", name: "", accent_color: "" },
    );
    setEditOpen(true);
  }

  function handleSave() {
    upsertProduct.mutate(editForm, {
      onSuccess: () => setEditOpen(false),
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteProduct.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Nom" },
    {
      accessorKey: "accent_color",
      header: "Couleur",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: row.original.accent_color }}
          />
          {row.original.accent_color}
        </div>
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
      <PageHeader title="Produits" description="Gestion des produits">
        <Button onClick={() => openEdit()}>Nouveau produit</Button>
      </PageHeader>
      <DataTable columns={columns} data={products} isLoading={isLoading} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editForm.id ? "Modifier le produit" : "Nouveau produit"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product-id">ID</Label>
              <Input
                id="product-id"
                value={editForm.id}
                onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
                disabled={!!editForm.id && products.some((p) => p.id === editForm.id)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-name">Nom</Label>
              <Input
                id="product-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-color">Couleur</Label>
              <Input
                id="product-color"
                value={editForm.accent_color}
                onChange={(e) =>
                  setEditForm({ ...editForm, accent_color: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={upsertProduct.isPending}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer le produit"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer ce produit ?"
        onConfirm={handleDelete}
        loading={deleteProduct.isPending}
      />
    </div>
  );
}
