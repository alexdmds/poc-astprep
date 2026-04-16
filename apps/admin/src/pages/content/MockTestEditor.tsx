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

import { useMockTest, useUpsertMockTest } from "@/lib/queries/mock-tests";
import { useProducts } from "@/lib/queries/products";

const schema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  title: z.string().min(1, "Le titre est requis"),
  product_id: z.string().min(1, "Le produit est requis"),
  difficulty: z.string().optional(),
  is_monthly: z.boolean().default(false),
  month_label: z.string().optional(),
  avg_score: z.coerce.number().min(0).default(0),
  sort_order: z.coerce.number().min(0).default(0),
});

type FormValues = z.infer<typeof schema>;

export default function MockTestEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: mockTest } = useMockTest(id ?? "");
  const upsert = useUpsertMockTest();
  const { data: products = [] } = useProducts();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      title: "",
      product_id: "tage_mage",
      difficulty: "",
      is_monthly: false,
      month_label: "",
      avg_score: 0,
      sort_order: 0,
    },
  });

  useEffect(() => {
    if (mockTest) {
      form.reset({
        id: mockTest.id,
        title: mockTest.title,
        product_id: mockTest.product_id,
        difficulty: mockTest.difficulty ?? "",
        is_monthly: mockTest.is_monthly,
        month_label: mockTest.month_label ?? "",
        avg_score: mockTest.avg_score,
        sort_order: mockTest.sort_order,
      });
    }
  }, [mockTest, form]);

  const isMonthly = form.watch("is_monthly");

  const onSubmit = async (values: FormValues) => {
    try {
      await upsert.mutateAsync({
        id: values.id,
        title: values.title,
        product_id: values.product_id,
        difficulty: values.difficulty || null,
        is_monthly: values.is_monthly,
        month_label: values.is_monthly ? values.month_label || null : null,
        avg_score: values.avg_score,
        sort_order: values.sort_order,
      });
      toast.success("Enregistre !");
      navigate("/content/mock-tests");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error("Erreur: " + message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/content/mock-tests")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Modifier le test blanc" : "Nouveau test blanc"}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du test blanc</CardTitle>
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
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Produit *</Label>
              <Select
                value={form.watch("product_id")}
                onValueChange={(v) => form.setValue("product_id", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.product_id && (
                <p className="text-sm text-destructive">{form.formState.errors.product_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Difficulte</Label>
              <Select
                value={form.watch("difficulty") ?? ""}
                onValueChange={(v) => form.setValue("difficulty", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une difficulte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facile">Facile</SelectItem>
                  <SelectItem value="Moyen">Moyen</SelectItem>
                  <SelectItem value="Difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={isMonthly}
                onCheckedChange={(v) => form.setValue("is_monthly", v)}
              />
              <Label>Test mensuel</Label>
            </div>

            {isMonthly && (
              <div className="space-y-2">
                <Label htmlFor="month_label">Label du mois</Label>
                <Input id="month_label" placeholder="Janvier 2026" {...form.register("month_label")} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
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
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/content/mock-tests")}>
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
