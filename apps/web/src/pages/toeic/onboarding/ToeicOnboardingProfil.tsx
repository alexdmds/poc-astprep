import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const schools = ["HEC","ESSEC","ESCP","emlyon","EDHEC","SKEMA","Audencia","Grenoble EM","Neoma","Kedge","TBS","Rennes SB","Montpellier BS","ICN","EM Strasbourg","ESC Clermont","IESEG","EM Normandie","ISC Paris","INSEEC","PSB","EDC","EMLV","ESSCA","ISG","Autre"];

export default function ToeicOnboardingProfil() {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  const [school, setSchool] = useState("");
  const [examDate, setExamDate] = useState<Date | undefined>(undefined);
  const [hours, setHours] = useState([10]);

  const handleContinue = async () => {
    localStorage.setItem("toeic-school", school);
    if (examDate) localStorage.setItem("toeic-exam-date", examDate.toISOString());
    localStorage.setItem("toeic-hours-week", String(hours[0]));
    localStorage.setItem("toeic-onboarding-step", "objectif");
    try {
      await updateProfile({
        school,
        exam_date: examDate ? examDate.toISOString() : null,
        hours_per_week: hours[0],
      });
    } catch (_) {}
    navigate("/toeic/onboarding/objectif");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Parle-nous de toi</h1>
        <p className="text-sm text-muted-foreground mt-1">On adapte ton parcours TOEIC</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">École visée</label>
          <select value={school} onChange={e => setSchool(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm">
            <option value="">Sélectionner une école</option>
            {schools.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Date de passage TOEIC</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-sm">
                <CalendarDays className="w-4 h-4 mr-2" />
                {examDate ? format(examDate, "d MMMM yyyy") : "Choisir une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={examDate} onSelect={setExamDate}
                disabled={(d) => d < new Date()} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Heures dispo / semaine</label>
            <span className="text-sm font-bold text-sky-500">{hours[0]}h</span>
          </div>
          <Slider min={0} max={30} step={1} value={hours} onValueChange={setHours} />
        </div>
      </div>
      <Button onClick={handleContinue} className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white">Continuer</Button>
    </div>
  );
}
