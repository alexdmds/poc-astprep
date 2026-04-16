import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";

const TESTIMONIALS = [
  { name: "Léa M.", score: "860/990", school: "ESSEC", text: "J'ai gagné 200 points en 2 mois grâce à ASTPrep. La méthode par Parts est top !", avatar: "L" },
  { name: "Hugo R.", score: "920/990", school: "HEC", text: "Le listening trainer m'a fait passer de 380 à 460 en Listening. Indispensable.", avatar: "H" },
  { name: "Clara D.", score: "780/990", school: "EDHEC", text: "Les flashcards et le parcours adaptatif sont incroyables. Je recommande à 100%.", avatar: "C" },
];

export default function ToeicOnboardingCompte() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ email: "", prenom: "", nom: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.includes("@")) e.email = "Email invalide";
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.nom.trim()) e.nom = "Requis";
    if (form.password.length < 8) e.password = "8 caractères minimum";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setServerError(null);
    setLoading(true);
    const { error } = await signUp(form.email, form.password, {
      full_name: `${form.prenom} ${form.nom}`,
    });
    setLoading(false);
    if (error) {
      setServerError(
        error.message.includes("already registered")
          ? "Cet email est déjà utilisé"
          : "Une erreur est survenue, réessaie"
      );
      return;
    }
    localStorage.setItem("toeic-onboarding-step", "profil");
    navigate("/toeic/onboarding/profil");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[calc(100vh-60px)]">
      {/* Left — Testimonials */}
      <div className="hidden lg:flex flex-col justify-center px-12 bg-sky-500/5 border-r border-border">
        <div className="max-w-md mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Rejoins 3 000 élèves</h2>
            <p className="text-sm text-muted-foreground mt-2">qui préparent le TOEIC avec ASTPrep</p>
          </div>

          <div className="space-y-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 font-bold text-sm shrink-0">{t.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{t.name}</span>
                      <span className="text-[10px] bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded-full font-medium">{t.score}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">{t.school}</div>
                    <div className="flex gap-0.5 mt-1">
                      {Array(5).fill(0).map((_, j) => <Star key={j} className="w-3 h-3 fill-warning text-warning" />)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">"{t.text}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-col justify-center px-8 lg:px-12">
        <div className="max-w-md mx-auto w-full space-y-5">
          <div>
            <h1 className="text-xl font-bold">Crée ton compte</h1>
            <p className="text-sm text-muted-foreground mt-1">Commence ta préparation TOEIC dès aujourd'hui</p>
          </div>
          <div className="space-y-3">
            <div>
              <Input placeholder="ton@email.com" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              {errors.email && <span className="text-xs text-destructive mt-1">{errors.email}</span>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Input placeholder="Prénom" value={form.prenom} onChange={e => setForm(f => ({...f, prenom: e.target.value}))} />
                {errors.prenom && <span className="text-xs text-destructive mt-1">{errors.prenom}</span>}</div>
              <div><Input placeholder="Nom" value={form.nom} onChange={e => setForm(f => ({...f, nom: e.target.value}))} />
                {errors.nom && <span className="text-xs text-destructive mt-1">{errors.nom}</span>}</div>
            </div>
            <div className="relative">
              <Input placeholder="Mot de passe" type={showPwd ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {errors.password && <span className="text-xs text-destructive mt-1">{errors.password}</span>}
            </div>
          </div>
          {serverError && <p className="text-xs text-destructive">{serverError}</p>}
          <Button onClick={handleSubmit} disabled={loading} className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white">
            {loading ? "Création du compte..." : "Continuer"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">Déjà un compte ? <button onClick={() => navigate("/login")} className="text-sky-500 underline">Se connecter</button></p>
        </div>
      </div>
    </div>
  );
}
