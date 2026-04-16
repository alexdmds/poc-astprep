import { useState } from "react";
import { User, Bell, Moon, Sun, Globe, Shield, HelpCircle, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { PersonalRecords } from "@/components/PersonalRecords";
import { ChallengeLeaderboard } from "@/components/ChallengeLeaderboard";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/lib/auth";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{title}</h2>
    <div className="bg-card rounded-xl border border-border divide-y divide-border overflow-hidden">
      {children}
    </div>
  </div>
);

const Row = ({ icon: Icon, label, children, danger }: { icon: any; label: string; children?: React.ReactNode; danger?: boolean }) => (
  <div className="flex items-center gap-3 px-4 py-3 min-h-[52px]">
    <Icon className={cn("w-[18px] h-[18px] shrink-0", danger ? "text-destructive" : "text-muted-foreground")} />
    <span className={cn("text-sm flex-1", danger ? "text-destructive font-medium" : "text-foreground")}>{label}</span>
    {children}
  </div>
);

export default function Parametres() {
  const { theme, toggle } = useTheme();
  const { profile } = useProfile();
  const { user } = useAuth();
  const darkMode = theme === "dark";
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifLive, setNotifLive] = useState(true);

  return (
    <div className="p-6 py-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-xl font-bold">Paramètres</h1>

      <Section title="Profil">
        <Row icon={User} label="Nom">
          <span className="text-sm text-muted-foreground">{profile?.full_name ?? "—"}</span>
        </Row>
        <Row icon={Globe} label="Email">
          <span className="text-sm text-muted-foreground">{profile?.email ?? user?.email ?? "—"}</span>
        </Row>
        <Row icon={Shield} label="Mot de passe">
          <button className="text-xs text-primary font-medium hover:underline">Modifier</button>
        </Row>
      </Section>

      <Section title="Apparence">
        <Row icon={darkMode ? Moon : Sun} label="Mode sombre">
          <Switch checked={darkMode} onCheckedChange={toggle} />
        </Row>
      </Section>

      <Section title="Notifications">
        <Row icon={Bell} label="Notifications par email">
          <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
        </Row>
        <Row icon={Bell} label="Notifications push">
          <Switch checked={notifPush} onCheckedChange={setNotifPush} />
        </Row>
        <Row icon={Bell} label="Rappels avant un cours live">
          <Switch checked={notifLive} onCheckedChange={setNotifLive} />
        </Row>
      </Section>

      <Section title="Score estimé">
        <Row icon={HelpCircle} label="Comment est calculé mon score ?">
          <a href="/faq-score" className="text-xs text-primary font-medium hover:underline">Voir</a>
        </Row>
      </Section>

      <Section title="Compte">
        <Row icon={LogOut} label="Se déconnecter" danger />
      </Section>

      {/* Personal Records */}
      <PersonalRecords />

      {/* Challenge Leaderboard */}
      <ChallengeLeaderboard />
    </div>
  );
}
