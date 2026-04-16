import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function OnboardingCompte() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ email: "", prenom: "", nom: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.prenom.trim()) e.prenom = "Prénom requis";
    if (!form.nom.trim()) e.nom = "Nom requis";
    if (form.password.length < 8) e.password = "Minimum 8 caractères";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    setServerError(null);
    setLoading(true);
    const { error, session } = await signUp(form.email, form.password, {
      full_name: `${form.prenom} ${form.nom}`,
    });
    setLoading(false);
    if (error) {
      setServerError(
        error.message.includes("already registered") || error.message.includes("already been registered")
          ? "Cet email est déjà utilisé"
          : "Une erreur est survenue, réessaie"
      );
      return;
    }
    localStorage.setItem("onboarding-user", JSON.stringify(form));
    localStorage.setItem("onboarding-step", "profil");
    if (!session) {
      // Email confirmation requise
      setPendingEmail(form.email);
      return;
    }
    navigate("/onboarding/profil");
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResendLoading(true);
    await supabase.auth.resend({ type: "signup", email: pendingEmail });
    setResendLoading(false);
    setResendSent(true);
    setTimeout(() => setResendSent(false), 5000);
  };

  if (pendingEmail) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <MailCheck className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold">Vérifie ton email</h1>
          <p className="text-sm text-muted-foreground mt-2">
            On a envoyé un lien de confirmation à <strong>{pendingEmail}</strong>.
            Clique dessus pour activer ton compte et continuer.
          </p>
          <p className="text-xs text-muted-foreground mt-2">Pense à vérifier tes spams.</p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={resendLoading || resendSent}
        >
          {resendSent ? "Email renvoyé !" : resendLoading ? "Envoi..." : "Renvoyer l'email"}
        </Button>
        <button
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setPendingEmail(null)}
        >
          Utiliser une autre adresse
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Crée ton compte</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Rejoins 3 000 élèves qui préparent le TAGE MAGE avec ASTPrep
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Input placeholder="ton@email.com" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>
        <div>
          <Input placeholder="Prénom" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} />
          {errors.prenom && <p className="text-xs text-destructive mt-1">{errors.prenom}</p>}
        </div>
        <div>
          <Input placeholder="Nom" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
          {errors.nom && <p className="text-xs text-destructive mt-1">{errors.nom}</p>}
        </div>
        <div className="relative">
          <Input
            placeholder="Mot de passe"
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
        </div>
      </div>

      {serverError && <p className="text-xs text-destructive">{serverError}</p>}
      <Button onClick={handleContinue} disabled={loading} className="w-full py-3">
        {loading ? "Création du compte..." : "Continuer"}
      </Button>

      <p className="text-sm text-center">
        Déjà un compte ?{" "}
        <button className="text-primary underline" onClick={() => navigate("/login")}>Se connecter</button>
      </p>
    </div>
  );
}
