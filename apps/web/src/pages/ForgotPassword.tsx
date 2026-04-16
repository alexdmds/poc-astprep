import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MailCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Saisis une adresse email valide");
      return;
    }
    setLoading(true);
    await resetPasswordForEmail(email);
    setLoading(false);
    // On affiche toujours le succès (ne pas révéler si l'email existe)
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MailCheck className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold">Email envoyé</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Si un compte existe pour <strong>{email}</strong>, tu recevras un lien pour réinitialiser ton mot de passe.
            </p>
            <p className="text-xs text-muted-foreground mt-2">Pense à vérifier tes spams.</p>
          </div>
          <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div>
          <h1 className="text-xl font-bold">Mot de passe oublié ?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Saisis ton email et on t'envoie un lien de réinitialisation.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="ton@email.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full py-3">
          {loading ? "Envoi en cours..." : "Envoyer le lien"}
        </Button>
      </div>
    </div>
  );
}
