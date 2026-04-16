import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { useQuestions, useDeleteQuestion } from "@/lib/queries/questions";
import { useSections } from "@/lib/queries/sections";

interface QuestionRow {
  id: string;
  text: string;
  section_id: string;
  product_id: string;
  theme: string;
  difficulty: string;
  correct_answer: string;
  sections: { id: string; label: string } | null;
}

const DIFFICULTY_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  facile: "secondary",
  moyen: "default",
  difficile: "destructive",
};

export default function Questions() {
  const navigate = useNavigate();
  const [sectionId, setSectionId] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");

  const { data: questions = [], isLoading } = useQuestions({
    sectionId,
    difficulty,
    search: search || undefined,
  });
  const { data: sections = [] } = useSections();
  const deleteQuestion = useDeleteQuestion();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleDelete() {
    if (!deleteId) return;
    deleteQuestion.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  const columns: ColumnDef<QuestionRow>[] = [
    { accessorKey: "id", header: "ID" },
    {
      accessorKey: "text",
      header: "Texte",
      cell: ({ row }) => {
        const text = row.original.text;
        return text.length > 80 ? `${text.slice(0, 80)}...` : text;
      },
    },
    {
      id: "section",
      header: "Section",
      cell: ({ row }) => row.original.sections?.label ?? row.original.section_id,
    },
    {
      accessorKey: "theme",
      header: "Theme",
      cell: ({ row }) => <Badge variant="outline">{row.original.theme}</Badge>,
    },
    {
      accessorKey: "difficulty",
      header: "Difficulte",
      cell: ({ row }) => (
        <Badge variant={DIFFICULTY_VARIANT[row.original.difficulty] ?? "default"}>
          {row.original.difficulty}
        </Badge>
      ),
    },
    { accessorKey: "correct_answer", header: "Reponse" },
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
              onClick={() => navigate(`/content/questions/${row.original.id}`)}
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
      <PageHeader title="Questions" description="Gestion des questions">
        <Button onClick={() => navigate("/content/questions/new")}>
          Nouvelle question
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-4">
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
          value={difficulty ?? "all"}
          onValueChange={(v) => setDifficulty(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Difficulte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="facile">Facile</SelectItem>
            <SelectItem value="moyen">Moyen</SelectItem>
            <SelectItem value="difficile">Difficile</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="text-sm text-muted-foreground">
        {questions.length} question{questions.length !== 1 ? "s" : ""}
      </div>

      <DataTable
        columns={columns}
        data={questions as QuestionRow[]}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer la question"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer cette question ?"
        onConfirm={handleDelete}
        loading={deleteQuestion.isPending}
      />
    </div>
  );
}
