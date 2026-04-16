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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFiche, useUpsertFiche } from "@/lib/queries/fiches";
import { useSections } from "@/lib/queries/sections";

const schema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  section_id: z.string().min(1, "La section est requise"),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  pdf_url: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function FicheEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: fiche } = useFiche(id ?? "");
  const { data: sections } = useSections();
  const upsert = useUpsertFiche();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      section_id: "",
      title: "",
      description: "",
      pdf_url: "",
    },
  });

  useEffect(() => {
    if (fiche) {
      form.reset({
        id: fiche.id,
        section_id: fiche.section_id,
        title: fiche.title,
        description: fiche.description ?? "",
        pdf_url: fiche.pdf_url ?? "",
      });
    }
  }, [fiche, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await upsert.mutateAsync({
        id: values.id,
        section_id: values.section_id,
        title: values.title,
        description: values.description || "",
        pdf_url: values.pdf_url || null,
      });
      toast.success("Enregistre !");
      navigate("/content/fiches");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error("Erreur: " + message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/content/fiches")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Modifier la fiche" : "Nouvelle fiche"}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de la fiche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">Identifiant</Label>
              <Input id="id" disabled={isEdit} {...form.register("id")} />
              {form.formState.errors.id && (
                <p className="text-sm text-destructive">{form.formState.errors.id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Section *</Label>
              <Select
                value={form.watch("section_id")}
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
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...form.register("description")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf_url">URL du PDF</Label>
              <Input id="pdf_url" placeholder="https://..." {...form.register("pdf_url")} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/content/fiches")}>
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
