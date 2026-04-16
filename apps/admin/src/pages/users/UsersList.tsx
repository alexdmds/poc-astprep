import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/lib/queries/users";

interface UserRow {
  id: string;
  full_name: string | null;
  email: string;
  subscription_plan: string | null;
  subscription_status: string | null;
  product: string | null;
  created_at: string;
}

const PAGE_SIZE = 20;

const statusColorMap: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  trialing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  canceled: "bg-red-100 text-red-800 border-red-200",
};

const columns: ColumnDef<UserRow, unknown>[] = [
  {
    accessorKey: "full_name",
    header: "Nom",
    cell: ({ row }) => row.original.full_name ?? "—",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subscription_plan",
    header: "Plan",
    cell: ({ row }) => {
      const plan = row.original.subscription_plan;
      return plan ? <Badge variant="secondary">{plan}</Badge> : "—";
    },
  },
  {
    accessorKey: "subscription_status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.original.subscription_status;
      if (!status) return "—";
      return (
        <Badge className={statusColorMap[status] ?? ""} variant="outline">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "product",
    header: "Produit",
    cell: ({ row }) => row.original.product ?? "—",
  },
  {
    accessorKey: "created_at",
    header: "Inscrit le",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString("fr-FR"),
  },
];

export default function UsersList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(0);

  const filters = {
    search: search || undefined,
    plan: plan || undefined,
    status: status || undefined,
  };

  const { data, isLoading } = useUsers(filters, page);

  const clickableColumns: ColumnDef<UserRow, unknown>[] = columns.map((col) => ({
    ...col,
    cell: (info: { row: { original: UserRow }; getValue: () => unknown }) => {
      const original = col.cell
        ? typeof col.cell === "function"
          ? (col.cell as (ctx: typeof info) => React.ReactNode)(info)
          : null
        : String(info.getValue() ?? "");
      return (
        <span
          className="cursor-pointer"
          onClick={() => navigate(`/users/${info.row.original.id}`)}
        >
          {original}
        </span>
      );
    },
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Utilisateurs" description="Gestion des utilisateurs de la plateforme" />

      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="max-w-sm"
        />
        <Select
          value={plan}
          onValueChange={(v) => {
            setPlan(v === "all" ? "" : v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="quarter">Quarter</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v === "all" ? "" : v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trialing">Trialing</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={clickableColumns}
        data={(data?.data as UserRow[]) ?? []}
        isLoading={isLoading}
        pageCount={Math.ceil((data?.count ?? 0) / PAGE_SIZE)}
        pageIndex={page}
        pageSize={PAGE_SIZE}
        onPaginationChange={setPage}
      />
    </div>
  );
}
