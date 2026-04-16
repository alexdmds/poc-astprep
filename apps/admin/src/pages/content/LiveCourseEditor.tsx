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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { useLiveCourse, useUpsertLiveCourse } from "@/lib/queries/live-courses";
import { useSections } from "@/lib/queries/sections";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  professor: z.string().optional(),
  section_id: z.string().optional(),
  scheduled_at: z.string().min(1, "La date est requise"),
  join_url: z.string().optional(),
  replay_url: z.string().optional(),
  is_live: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

export default function LiveCourseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: liveCourse } = useLiveCourse(id ?? "");
  const { data: sections } = useSections();
  const upsert = useUpsertLiveCourse();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: undefined,
      title: "",
      professor: "",
      section_id: "",
      scheduled_at: "",
      join_url: "",
      replay_url: "",
      is_live: false,
    },
  });

  useEffect(() => {
    if (liveCourse) {
      form.reset({
        id: liveCourse.id,
        title: liveCourse.title,
        professor: liveCourse.professor ?? "",
        section_id: liveCourse.section_id ?? "",
        scheduled_at: liveCourse.scheduled_at
          ? liveCourse.scheduled_at.slice(0, 16)
          : "",
        join_url: liveCourse.join_url ?? "",
        replay_url: liveCourse.replay_url ?? "",
        is_live: liveCourse.is_live,
      });
    }
  }, [liveCourse, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await upsert.mutateAsync({
        ...(isEdit ? { id } : {}),
        title: values.title,
        professor: values.professor || null,
        section_id: values.section_id || null,
        scheduled_at: values.scheduled_at,
        join_url: values.join_url || null,
        replay_url: values.replay_url || null,
        is_live: values.is_live,
      });
      toast.success("Enregistre !");
      navigate("/content/live-courses");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error("Erreur: " + message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/content/live-courses")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Modifier le cours live" : "Nouveau cours live"}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du cours live</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="professor">Professeur</Label>
              <Input id="professor" {...form.register("professor")} />
            </div>

            <div className="space-y-2">
              <Label>Section (optionnel)</Label>
              <Select
                value={form.watch("section_id") ?? ""}
                onValueChange={(v) => form.setValue("section_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucune section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune</SelectItem>
                  {sections?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Date et heure *</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                {...form.register("scheduled_at")}
              />
              {form.formState.errors.scheduled_at && (
                <p className="text-sm text-destructive">{form.formState.errors.scheduled_at.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="join_url">URL de connexion</Label>
              <Input id="join_url" placeholder="https://..." {...form.register("join_url")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="replay_url">URL du replay</Label>
              <Input id="replay_url" placeholder="https://..." {...form.register("replay_url")} />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.watch("is_live")}
                onCheckedChange={(v) => form.setValue("is_live", v)}
              />
              <Label>En direct</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/content/live-courses")}>
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
