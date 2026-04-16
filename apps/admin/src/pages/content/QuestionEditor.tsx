import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuestion, useUpsertQuestion } from "@/lib/queries/questions";
import { useSections } from "@/lib/queries/sections";
import { useLessons } from "@/lib/queries/lessons";
import { useThemes } from "@/lib/queries/themes";

const LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

const choiceSchema = z.object({
  label: z.string(),
  text: z.string(),
});

const schema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  product_id: z.string().min(1, "Le produit est requis"),
  section_id: z.string().min(1, "La section est requise"),
  theme: z.string().min(1, "Le theme est requis"),
  number: z.coerce.number().optional(),
  text: z.string().min(1, "Le texte est requis"),
  choices: z.array(choiceSchema).min(2, "Au moins 2 choix"),
  correct_answer: z.string().min(1, "La reponse correcte est requise"),
  explanation: z.string().optional(),
  difficulty: z.string().min(1, "La difficulte est requise"),
  toeic_part: z.coerce.number().optional(),
  micro_competence: z.string().optional(),
  audio_url: z.string().optional(),
  linked_lesson_id: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function QuestionEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: question } = useQuestion(id ?? "");
  const upsert = useUpsertQuestion();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      product_id: "tage_mage",
      section_id: "",
      theme: "",
      number: undefined,
      text: "",
      choices: LABELS.slice(0, 5).map((l) => ({ label: l, text: "" })),
      correct_answer: "A",
      explanation: "",
      difficulty: "Moyen",
      toeic_part: undefined,
      micro_competence: "",
      audio_url: "",
      linked_lesson_id: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "choices",
  });

  const sectionId = form.watch("section_id");
  const watchedChoices = form.watch("choices");
  const watchedText = form.watch("text");
  const watchedCorrectAnswer = form.watch("correct_answer");
  const watchedExplanation = form.watch("explanation");

  const { data: sections } = useSections();
  const { data: lessons } = useLessons();
  const { data: themes } = useThemes(sectionId);

  const themeNames = useMemo(
    () => [...new Set(themes?.map((t) => t.name) ?? [])],
    [themes],
  );

  useEffect(() => {
    if (question) {
      const choices = Array.isArray(question.choices)
        ? (question.choices as { label: string; text: string }[])
        : LABELS.slice(0, 5).map((l) => ({ label: l, text: "" }));

      form.reset({
        id: question.id,
        product_id: "tage_mage",
        section_id: question.section_id,
        theme: question.theme,
        number: question.number ?? undefined,
        text: question.text,
        choices,
        correct_answer: question.correct_answer,
        explanation: question.explanation ?? "",
        difficulty: question.difficulty,
        toeic_part: question.toeic_part ?? undefined,
        micro_competence: question.micro_competence ?? "",
        audio_url: question.audio_url ?? "",
        linked_lesson_id: question.linked_lesson_id ?? "",
      });
    }
  }, [question, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await upsert.mutateAsync({
        id: values.id,
        product_id: values.product_id,
        section_id: values.section_id,
        theme: values.theme,
        number: values.number ?? null,
        text: values.text,
        choices: values.choices as unknown as Record<string, unknown>[],
        correct_answer: values.correct_answer,
        explanation: values.explanation || "",
        difficulty: values.difficulty,
        toeic_part: null,
        micro_competence: null,
        audio_url: null,
        linked_lesson_id: values.linked_lesson_id || null,
      });
      toast.success("Enregistre !");
      navigate("/content/questions");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error("Erreur: " + message);
    }
  };

  const addChoice = () => {
    const nextLabel = LABELS[fields.length] ?? `${fields.length + 1}`;
    append({ label: nextLabel, text: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/content/questions")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Modifier la question" : "Nouvelle question"}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form - left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de la question</CardTitle>
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
                    <Label htmlFor="number">Numero</Label>
                    <Input id="number" type="number" {...form.register("number")} />
                  </div>
                </div>

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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme *</Label>
                    <Input
                      id="theme"
                      list="theme-suggestions"
                      {...form.register("theme")}
                    />
                    <datalist id="theme-suggestions">
                      {themeNames.map((name) => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                    {form.formState.errors.theme && (
                      <p className="text-sm text-destructive">{form.formState.errors.theme.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Difficulte *</Label>
                    <Select
                      value={form.watch("difficulty")}
                      onValueChange={(v) => form.setValue("difficulty", v, { shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Facile">Facile</SelectItem>
                        <SelectItem value="Moyen">Moyen</SelectItem>
                        <SelectItem value="Difficile">Difficile</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.difficulty && (
                      <p className="text-sm text-destructive">{form.formState.errors.difficulty.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text">Enonce *</Label>
                  <Textarea id="text" rows={4} {...form.register("text")} />
                  {form.formState.errors.text && (
                    <p className="text-sm text-destructive">{form.formState.errors.text.message}</p>
                  )}
                </div>

                {/* Choices */}
                <div className="space-y-3">
                  <Label>Choix</Label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center shrink-0">
                        {LABELS[index] ?? index + 1}
                      </Badge>
                      <Input
                        className="flex-1"
                        placeholder={`Choix ${LABELS[index] ?? index + 1}`}
                        {...form.register(`choices.${index}.text`)}
                      />
                      {fields.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            remove(index);
                            // Re-label remaining choices
                            const current = form.getValues("choices");
                            current.forEach((_, i) => {
                              form.setValue(`choices.${i}.label`, LABELS[i] ?? `${i + 1}`);
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {fields.length < LABELS.length && (
                    <Button type="button" variant="outline" size="sm" onClick={addChoice}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter un choix
                    </Button>
                  )}
                  {form.formState.errors.choices && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.choices.message ?? form.formState.errors.choices.root?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Reponse correcte *</Label>
                  <Select
                    value={watchedCorrectAnswer}
                    onValueChange={(v) => form.setValue("correct_answer", v, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {watchedChoices.map((_, i) => (
                        <SelectItem key={LABELS[i]} value={LABELS[i]}>
                          {LABELS[i]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.correct_answer && (
                    <p className="text-sm text-destructive">{form.formState.errors.correct_answer.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">Explication</Label>
                  <Textarea id="explanation" rows={3} {...form.register("explanation")} />
                </div>

                <div className="space-y-2">
                  <Label>Cours lie (optionnel)</Label>
                  <Select
                    value={form.watch("linked_lesson_id") ?? ""}
                    onValueChange={(v) => form.setValue("linked_lesson_id", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Aucun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {lessons?.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate("/content/questions")}>
                  Annuler
                </Button>
                <Button type="submit" disabled={upsert.isPending}>
                  {upsert.isPending ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Preview - right 1/3 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Apercu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {watchedText ? (
                  <p className="text-sm whitespace-pre-wrap">{watchedText}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Aucun enonce saisi</p>
                )}

                <div className="space-y-2">
                  {watchedChoices.map((choice, i) => {
                    const label = LABELS[i];
                    const isCorrect = label === watchedCorrectAnswer;
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-2 rounded-md border p-2 text-sm ${
                          isCorrect
                            ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                            : ""
                        }`}
                      >
                        <Badge
                          variant={isCorrect ? "default" : "secondary"}
                          className={`shrink-0 ${isCorrect ? "bg-green-600" : ""}`}
                        >
                          {label}
                        </Badge>
                        <span>{choice.text || "..."}</span>
                      </div>
                    );
                  })}
                </div>

                {watchedExplanation && (
                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Explication</p>
                    <p className="text-sm whitespace-pre-wrap">{watchedExplanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
