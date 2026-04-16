import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useLesson, useUpsertLesson } from "@/lib/queries/lessons";
import { useChapters } from "@/lib/queries/chapters";
import { useSections } from "@/lib/queries/sections";

const schema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  title: z.string().min(1, "Le titre est requis"),
  chapter_id: z.string().min(1, "Le chapitre est requis"),
  duration_minutes: z.coerce.number().min(0).default(0),
  professor: z.string().optional(),
  type: z.enum(["video", "exercise"]).default("video"),
  video_url: z.string().optional(),
  sort_order: z.coerce.number().min(0).default(0),
});

type FormValues = z.infer<typeof schema>;

export default function LessonEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: lesson } = useLesson(id ?? "");
  const { data: chapters } = useChapters();
  const { data: sections } = useSections();
  const upsert = useUpsertLesson();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      title: "",
      chapter_id: "",
      duration_minutes: 0,
      professor: "",
      type: "video",
      video_url: "",
      sort_order: 0,
    },
  });

  useEffect(() => {
    if (lesson) {
      form.reset({
        id: lesson.id,
        title: lesson.title,
        chapter_id: lesson.chapter_id,
        duration_minutes: lesson.duration_minutes,
        professor: lesson.professor ?? "",
        type: lesson.type as "video" | "exercise",
        video_url: lesson.video_url ?? "",
        sort_order: lesson.sort_order,
      });
    }
  }, [lesson, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await upsert.mutateAsync({
        id: values.id,
        title: values.title,
        chapter_id: values.chapter_id,
        duration_minutes: values.duration_minutes,
        professor: values.professor || null,
        type: values.type,
        video_url: values.video_url || null,
        sort_order: values.sort_order,
      });
      toast.success("Enregistre !");
      navigate("/content/lessons");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error("Erreur: " + message);
    }
  };

  // Group chapters by section
  const sectionMap = new Map<string, { label: string; chapters: typeof chapters }>();
  if (chapters && sections) {
    for (const section of sections) {
      sectionMap.set(section.id, { label: section.label, chapters: [] });
    }
    for (const chapter of chapters) {
      const entry = sectionMap.get(chapter.section_id);
      if (entry) {
        entry.chapters = [...(entry.chapters ?? []), chapter];
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/content/lessons")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">{isEdit ? "Modifier le cours" : "Nouveau cours"}</h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">Identifiant</Label>
              <Input
                id="id"
                placeholder="calc-9"
                disabled={isEdit}
                {...form.register("id")}
              />
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

            <div className="space-y-2">
              <Label>Chapitre *</Label>
              <Select
                value={form.watch("chapter_id")}
                onValueChange={(v) => form.setValue("chapter_id", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un chapitre" />
                </SelectTrigger>
                <SelectContent>
                  {[...sectionMap.entries()].map(([sectionId, { label, chapters: sChapters }]) => (
                    <SelectGroup key={sectionId}>
                      <SelectLabel>{label}</SelectLabel>
                      {(sChapters ?? []).map((ch) => (
                        <SelectItem key={ch.id} value={ch.id}>
                          {ch.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.chapter_id && (
                <p className="text-sm text-destructive">{form.formState.errors.chapter_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duree (minutes)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  min={0}
                  {...form.register("duration_minutes")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Ordre</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min={0}
                  {...form.register("sort_order")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professor">Professeur</Label>
              <Input id="professor" {...form.register("professor")} />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup
                value={form.watch("type")}
                onValueChange={(v) => form.setValue("type", v as "video" | "exercise")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="video" id="type-video" />
                  <Label htmlFor="type-video">Video</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="exercise" id="type-exercise" />
                  <Label htmlFor="type-exercise">Exercice</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_url">URL video (optionnel)</Label>
              <Input id="video_url" {...form.register("video_url")} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/content/lessons")}>
              Annuler
            </Button>
            <Button type="submit" disabled={upsert.isPending}>
              {upsert.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
