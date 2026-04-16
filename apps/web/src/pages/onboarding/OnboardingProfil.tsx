import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const ECOLES = [
  "HEC", "ESSEC", "ESCP", "emlyon", "EDHEC", "SKEMA", "Audencia",
  "Grenoble EM", "Neoma", "Kedge", "TBS", "Rennes SB", "Montpellier BS",
  "ICN", "EM Strasbourg", "ESC Clermont", "Autre",
];

const ANGLAIS_OPTIONS = ["TOEIC", "TOEFL", "IELTS", "Pas encore"] as const;

export default function OnboardingProfil() {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  const [ecole, setEcole] = useState("");
  const [ecoleAutre, setEcoleAutre] = useState("");
  const [ecoleOpen, setEcoleOpen] = useState(false);
  const [hasTM, setHasTM] = useState(false);
  const [tmScore, setTmScore] = useState("");
  const [anglais, setAnglais] = useState<string>("");
  const [anglaisScore, setAnglaisScore] = useState<number[]>([500]);

  const getSliderConfig = () => {
    if (anglais === "TOEIC") return { min: 0, max: 990, step: 5, marks: [0, 500, 700, 850, 990] };
    if (anglais === "TOEFL") return { min: 0, max: 120, step: 1, marks: [60, 80, 100] };
    if (anglais === "IELTS") return { min: 0, max: 9, step: 0.5, marks: [4, 5.5, 6.5, 7.5] };
    return null;
  };

  const sliderCfg = getSliderConfig();

  const handleContinue = async () => {
    const schoolValue = ecole === "Autre" ? ecoleAutre : ecole;
    localStorage.setItem("onboarding-profil", JSON.stringify({
      ecole: schoolValue,
      tmScore: hasTM ? tmScore : null,
      anglais,
      anglaisScore: sliderCfg ? anglaisScore[0] : null,
    }));
    localStorage.setItem("onboarding-step", "tour");
    try { await updateProfile({ school: schoolValue }); } catch (_) {}
    navigate("/onboarding/tour");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Parle-nous de toi</h1>
      </div>

      {/* École */}
      <div className="space-y-2">
        <Label>Quelle école vises-tu ?</Label>
        <Popover open={ecoleOpen} onOpenChange={setEcoleOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
              {ecole || "Sélectionne une école"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Rechercher..." />
              <CommandList>
                <CommandEmpty>Aucun résultat.</CommandEmpty>
                <CommandGroup>
                  {ECOLES.map(e => (
                    <CommandItem key={e} value={e} onSelect={() => { setEcole(e); setEcoleOpen(false); }}>
                      <Check className={cn("mr-2 h-4 w-4", ecole === e ? "opacity-100" : "opacity-0")} />
                      {e}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {ecole === "Autre" && (
          <Input placeholder="Nom de l'école" value={ecoleAutre} onChange={e => setEcoleAutre(e.target.value)} className="mt-2" />
        )}
      </div>

      {/* Score précédent */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Tu as déjà passé le TAGE MAGE ?</Label>
          <Switch checked={hasTM} onCheckedChange={setHasTM} />
        </div>
        {hasTM && (
          <Input type="number" placeholder="Ex: 350" min={0} max={600} value={tmScore} onChange={e => setTmScore(e.target.value)} />
        )}
      </div>

      {/* Score anglais */}
      <div className="space-y-3">
        <Label>Tu as déjà un score d'anglais ?</Label>
        <div className="flex gap-2 flex-wrap">
          {ANGLAIS_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => { setAnglais(opt); setAnglaisScore([opt === "TOEIC" ? 500 : opt === "TOEFL" ? 60 : opt === "IELTS" ? 5 : 0]); }}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border transition-colors",
                anglais === opt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {sliderCfg && (
          <div className="space-y-3 pt-2">
            <div className="text-center text-lg font-bold">{anglaisScore[0]}</div>
            <Slider
              min={sliderCfg.min}
              max={sliderCfg.max}
              step={sliderCfg.step}
              value={anglaisScore}
              onValueChange={setAnglaisScore}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
              {sliderCfg.marks.map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        )}
      </div>

      <Button onClick={handleContinue} className="w-full py-3">Continuer</Button>
    </div>
  );
}
