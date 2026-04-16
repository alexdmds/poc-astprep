import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function OnboardingCompte() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", prenom: "", nom: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.prenom.trim()) e.prenom = "Prénom requis";
    if (!form.nom.trim()) e.nom = "Nom requis";
    if (form.password.length < 8) e.password = "Minimum 8 caractères";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    localStorage.setItem("onboarding-user", JSON.stringify(form));
    localStorage.setItem("onboarding-step", "profil");
    navigate("/onboarding/profil");
  };

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

      <Button onClick={handleContinue} className="w-full py-3">Continuer</Button>

      <p className="text-sm text-center">
        Déjà un compte ?{" "}
        <button className="text-primary underline" onClick={() => navigate("/")}>Se connecter</button>
      </p>
    </div>
  );
}
