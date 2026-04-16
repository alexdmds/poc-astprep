import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSubtest, useUpsertSubtest, useSaveSubtestQuestions } from "@/lib/queries/subtests";
import { useQuestions } from "@/lib/queries/questions";
import { useSections } from "@/lib/queries/sections";

const schema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  title: z.string().min(1, "Le titre est requis"),
  section_id: z.string().min(1, "La section est requise"),
  type: z.string().min(1, "Le type est requis"),
  question_count: z.coerce.number().min(0).default(0),
  duration_minutes: z.coerce.number().min(0).default(0),
  avg_score: z.coerce.number().min(0).default(0),
  sort_order: z.coerce.number().min(0).default(0),
});

type FormValues = z.infer<typeof schema>;

export default function SubtestEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: subtest } = useSubtest(id ?? "");
  const { data: sections } = useSections();
  const upsert = useUpsertSubtest();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      title: "",
      section_id: "",
      type: "generaliste",
      question_count: 0,
      duration_minutes: 0,
      avg_score: 0,
      sort_order: 0,
    },
  });

  const sectionId = form.watch("section_id");
  const questionCount = form.watch("question_count");

  // Question assignment state
  const [assignedQuestionIds, setAssignedQuestionIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [poolSectionFilter, setPoolSectionFilter] = useState("__all__");

  // Use the subtest's section_id as default pool filter
  useEffect(() => {
    if (sectionId && poolSectionFilter === "__all__") {
      setPoolSectionFilter(sectionId);
    }
  }, [sectionId, poolSectionFilter]);

  const { data: questionsData } = useQuestions({
    sectionId: poolSectionFilter === "__all__" ? undefined : poolSectionFilter,
    search: searchQuery || undefined,
  });

  const poolQuestions = questionsData?.data ?? [];

  // Save subtest questions mutation - only available when editing
  const subtestId = form.watch("id") || id || "";
  const saveQuestions = useSaveSubtestQuestions(subtestId);

  useEffect(() => {
    if (subtest) {
      form.reset({
        id: subtest.id,
        title: subtest.title,
        section_id: subtest.section_id,
        type: subtest.type,
        question_count: subtest.question_count,
        duration_minutes: subtest.duration_minutes,
        avg_score: subtest.avg_score,
        sort_order: subtest.sort_order,
      });

      // Pre-fill assigned questions from junction table
      if (subtest.subtest_questions) {
        const sorted = [...subtest.subtest_questions].sort((a, b) => a.sort_order - b.sort_order);
        setAssignedQuestionIds(sorted.map((sq) => sq.question_id));
      }
    }
  }, [subtest, form]);

  const assignedSet = useMemo(() => new Set(assignedQuestionIds), [assignedQuestionIds]);

  // Build a lookup for question details
  const questionLookup = useMemo(() => {
    const map = new Map<string, (typeof poolQuestions)[number]>();
    for (const q of poolQuestions) {
      map.set(q.id, q);
    }
    return map;
  }, [poolQuestions]);

  const addQuestion = (questionId: string) => {
    setAssignedQuestionIds((prev) => [...prev, questionId]);
  };

  const removeQuestion = (questionId: string) => {
    setAssignedQuestionIds((prev) => prev.filter((qid) => qid !== questionId));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await upsert.mutateAsync({
        id: values.id,
        title: values.title,
        section_id: values.section_id,
        type: values.type,
        question_count: values.question_count,
        duration_minutes: values.duration_minutes,
        avg_score: values.avg_score,
        sort_order: values.sort_order,
      });

      // Save question assignments
      await saveQuestions.mutateAsync(
        assignedQuestionIds.map((qid, i) => ({
          question_id: qid,
          sort_order: i,
        })),
      );

      toast.success("Enregistre !");
      navigate("/content/subtests");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error("Erreur: " + message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/content/subtests")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Modifier le sous-test" : "Nouveau sous-test"}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Top section: subtest form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informations du sous-test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">Identifiant</Label>
                <Input id="id" disabled={isEdit} {...form.register("id")} />
                {form.formState.errors.id && (
                  <p className="text-sm text-destructive">{form.formState.errors.id.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input id="title" {...form.register("title")} />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section *</Label>
                <Select
                  value={sectionId}
                  onValueChange={(v) => form.setValue("section_id", v, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.section_id && (
                  <p className="text-sm text-destructive">{form.formState.errors.section_id.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={form.watch("type")}
                  onValueChange={(v) => form.setValue("type", v, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generaliste">Generaliste</SelectItem>
                    <SelectItem value="thematique">Thematique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="question_count">Nb questions</Label>
                <Input id="question_count" type="number" min={0} {...form.register("question_count")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duree (min)</Label>
                <Input id="duration_minutes" type="number" min={0} {...form.register("duration_minutes")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avg_score">Score moyen</Label>
                <Input id="avg_score" type="number" min={0} {...form.register("avg_score")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Ordre</Label>
                <Input id="sort_order" type="number" min={0} {...form.register("sort_order")} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom section: Question assignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Assigned questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Questions assignees</span>
                <Badge variant="outline">
                  {assignedQuestionIds.length} / {questionCount}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedQuestionIds.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Aucune question assignee
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {assignedQuestionIds.map((qid, index) => {
                    const q = questionLookup.get(qid);
                    return (
                      <div
                        key={qid}
                        className="flex items-center gap-2 border rounded-md p-2 text-sm"
                      >
                        <span className="text-muted-foreground shrink-0 w-6 text-center">
                          {index + 1}
                        </span>
                        <span className="truncate flex-1">
                          {q ? q.text.slice(0, 80) : qid}
                        </span>
                        {q && (
                          <Badge variant="secondary" className="shrink-0">
                            {q.theme}
                          </Badge>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => removeQuestion(qid)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Question pool */}
          <Card>
            <CardHeader>
              <CardTitle>Pool de questions</CardTitle>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={poolSectionFilter}
                  onValueChange={setPoolSectionFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Toutes sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Toutes</SelectItem>
                    {sections?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {poolQuestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Aucune question trouvee
                  </p>
                ) : (
                  poolQuestions.map((q) => {
                    const isAssigned = assignedSet.has(q.id);
                    return (
                      <div
                        key={q.id}
                        className={`flex items-center gap-2 border rounded-md p-2 text-sm ${
                          isAssigned ? "opacity-50" : ""
                        }`}
                      >
                        <span className="truncate flex-1">{q.text.slice(0, 80)}</span>
                        <Badge variant="secondary" className="shrink-0">
                          {q.theme}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="shrink-0"
                        >
                          {q.difficulty}
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isAssigned}
                          onClick={() => addQuestion(q.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/content/subtests")}>
            Annuler
          </Button>
          <Button type="submit" disabled={upsert.isPending || saveQuestions.isPending}>
            {upsert.isPending || saveQuestions.isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
