import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";

function getSignInError(message: string): string {
  if (message.includes("Email not confirmed")) return "Vérifie ta boîte mail pour confirmer ton compte";
  if (message.includes("Invalid login credentials")) return "Email ou mot de passe incorrect";
  return "Email ou mot de passe incorrect";
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const err = searchParams.get("error");
    if (err === "lien_invalide") return "Ce lien est invalide ou a expiré. Demande-en un nouveau.";
    return null;
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!form.email || !form.password) {
      setError("Email et mot de passe requis");
      return;
    }
    setLoading(true);
    const { error: signInError } = await signIn(form.email, form.password);
    setLoading(false);
    if (signInError) {
      setError(getSignInError(signInError.message));
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold">Connexion</h1>
          <p className="text-sm text-muted-foreground mt-1">Bon retour sur ASTPrep</p>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="ton@email.com"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div>
            <div className="relative">
              <Input
                placeholder="Mot de passe"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/forgot-password")}
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full py-3">
          {loading ? "Connexion..." : "Se connecter"}
        </Button>

        <p className="text-sm text-center">
          Pas encore de compte ?{" "}
          <button className="text-primary underline" onClick={() => navigate("/onboarding")}>
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
}
