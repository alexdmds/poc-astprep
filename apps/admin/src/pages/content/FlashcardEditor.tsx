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

import { useFlashcard, useUpsertFlashcard } from "@/lib/queries/flashcards";
import { useSections } from "@/lib/queries/sections";

const schema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  section_id: z.string().min(1, "La section est requise"),
  theme: z.string().min(1, "Le theme est requis"),
  front: z.string().min(1, "Le recto est requis"),
  back: z.string().min(1, "Le verso est requis"),
});

type FormValues = z.infer<typeof schema>;

export default function FlashcardEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: flashcard } = useFlashcard(id ?? "");
  const { data: sections } = useSections();
  const upsert = useUpsertFlashcard();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: crypto.randomUUID(),
      section_id: "",
      theme: "",
      front: "",
      back: "",
    },
  });

  useEffect(() => {
    if (flashcard) {
      form.reset({
        id: flashcard.id,
        section_id: flashcard.section_id,
        theme: flashcard.theme,
        front: flashcard.front,
        back: flashcard.back,
      });
    }
  }, [flashcard, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await upsert.mutateAsync({
        id: values.id,
        section_id: values.section_id,
        theme: values.theme,
        front: values.front,
        back: values.back,
      });
      toast.success("Enregistre !");
      navigate("/content/flashcards");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error("Erreur: " + message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/content/flashcards")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Modifier la flashcard" : "Nouvelle flashcard"}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de la flashcard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">Identifiant (UUID)</Label>
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
              <Label htmlFor="theme">Theme *</Label>
              <Input id="theme" {...form.register("theme")} />
              {form.formState.errors.theme && (
                <p className="text-sm text-destructive">{form.formState.errors.theme.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="front">Recto *</Label>
              <Textarea id="front" rows={3} {...form.register("front")} />
              {form.formState.errors.front && (
                <p className="text-sm text-destructive">{form.formState.errors.front.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="back">Verso *</Label>
              <Textarea id="back" rows={3} {...form.register("back")} />
              {form.formState.errors.back && (
                <p className="text-sm text-destructive">{form.formState.errors.back.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/content/flashcards")}>
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
