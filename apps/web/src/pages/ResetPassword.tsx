import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword, session } = useAuth();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Pas de session → le lien est expiré ou l'utilisateur a accédé directement
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-xl font-bold">Lien expiré</h1>
          <p className="text-sm text-muted-foreground">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <Button className="w-full" onClick={() => navigate("/forgot-password")}>
            Demander un nouveau lien
          </Button>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.password.length < 8) e.password = "Minimum 8 caractères";
    if (form.password !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const { error } = await updatePassword(form.password);
    setLoading(false);
    if (error) {
      setErrors({ password: "Une erreur est survenue, réessaie" });
      return;
    }
    toast.success("Mot de passe mis à jour !");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold">Nouveau mot de passe</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choisis un mot de passe sécurisé d'au moins 8 caractères.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Nouveau mot de passe"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
          </div>

          <div>
            <Input
              placeholder="Confirmer le mot de passe"
              type={showPw ? "text" : "password"}
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            {errors.confirm && <p className="text-xs text-destructive mt-1">{errors.confirm}</p>}
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full py-3">
          {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
        </Button>
      </div>
    </div>
  );
}
