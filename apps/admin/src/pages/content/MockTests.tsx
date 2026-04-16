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
import { useMockTests, useDeleteMockTest } from "@/lib/queries/mock-tests";
import { useProducts } from "@/lib/queries/products";

interface MockTestRow {
  id: string;
  title: string;
  product_id: string;
  difficulty: string | null;
  is_monthly: boolean;
  avg_score: number;
  sort_order: number;
  products: { id: string; name: string } | null;
}

export default function MockTests() {
  const navigate = useNavigate();
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const { data: mockTests = [], isLoading } = useMockTests(productId);
  const { data: products = [] } = useProducts();
  const deleteMockTest = useDeleteMockTest();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleDelete() {
    if (!deleteId) return;
    deleteMockTest.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<MockTestRow>[] = [
    { accessorKey: "title", header: "Titre" },
    {
      id: "product",
      header: "Produit",
      cell: ({ row }) => row.original.products?.name ?? row.original.product_id,
    },
    {
      accessorKey: "difficulty",
      header: "Difficulte",
      cell: ({ row }) =>
        row.original.difficulty ? (
          <Badge variant="outline">{row.original.difficulty}</Badge>
        ) : (
          "-"
        ),
    },
    {
      accessorKey: "is_monthly",
      header: "Mensuel",
      cell: ({ row }) => (
        <Badge variant={row.original.is_monthly ? "default" : "secondary"}>
          {row.original.is_monthly ? "oui" : "non"}
        </Badge>
      ),
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
              onClick={() => navigate(`/content/mock-tests/${row.original.id}`)}
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
      <PageHeader title="Tests blancs" description="Gestion des tests blancs">
        <Button onClick={() => navigate("/content/mock-tests/new")}>
          Nouveau test
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <Select
          value={productId ?? "all"}
          onValueChange={(v) => setProductId(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Produit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les produits</SelectItem>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={mockTests as MockTestRow[]}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer le test blanc"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer ce test blanc ?"
        onConfirm={handleDelete}
        loading={deleteMockTest.isPending}
      />
    </div>
  );
}
