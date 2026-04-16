import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, BookOpen, Dumbbell, FileText, RotateCcw,
  BarChart3, Route, Layers, Wrench, ChevronDown,
  LayoutGrid, Calculator, BookOpenText, Video, PanelLeftClose,
  Headphones, Target, GraduationCap, LogOut
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";

// ── TAGE MAGE navigation ──
const tageGroup1 = [
  { label: "Mon parcours", icon: Route, to: "/parcours" },
  { label: "Cours", icon: BookOpen, to: "/cours", tour: "cours" },
  { label: "Statistiques", icon: BarChart3, to: "/statistiques", tour: "statistiques" },
  { label: "Cours Live", icon: Video, to: "/cours-live" },
];
const tageGroup2 = [
  { label: "Sous-tests", icon: FileText, to: "/sous-tests", tour: "sous-tests" },
  { label: "Tests blancs", icon: FileText, to: "/tests-blancs" },
  { label: "Carnet d'erreurs", icon: RotateCcw, to: "/carnet", badge: 12, tour: "carnet" },
  { label: "Entraînement", icon: Dumbbell, to: "/generateur" },
];
const tageTools = [
  { label: "Calcul mental", icon: Calculator, to: "/outils/calcul-mental" },
  { label: "Lecture alphabétique", icon: BookOpenText, to: "/outils/lecture-alphabetique" },
  { label: "Fiches PDF", icon: FileText, to: "/outils/fiches" },
  { label: "Flashcards", icon: Layers, to: "/flashcards" },
];

// ── TOEIC navigation ──
const toeicGroup1 = [
  { label: "Cours", icon: BookOpen, to: "/toeic/cours" },
  { label: "Entraînement", icon: Dumbbell, to: "/toeic/entrainement" },
  { label: "Tests blancs", icon: FileText, to: "/toeic/tests-blancs" },
  { label: "Mon parcours", icon: Route, to: "/toeic/parcours" },
];
const toeicGroup2 = [
  { label: "Statistiques", icon: BarChart3, to: "/toeic/statistiques" },
  { label: "Générateur", icon: Target, to: "/toeic/generateur" },
  { label: "Carnet d'erreurs", icon: RotateCcw, to: "/toeic/carnet", badge: 34 },
];
const toeicTools = [
  { label: "Flashcards", icon: Layers, to: "/toeic/flashcards" },
  { label: "Listening trainer", icon: Headphones, to: "/toeic/outils/listening-trainer" },
  { label: "Fiches PDF", icon: FileText, to: "/toeic/outils/fiches" },
];

function NavItem({ item, accent }: { item: { label: string; icon: any; to: string; badge?: number; tour?: string }; accent?: string }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === "/" || item.to === "/toeic"}
      data-tour={item.tour}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
          isActive
            ? accent ? `bg-[hsl(var(--chart-1))]/10 text-[hsl(var(--chart-1))]` : "bg-primary/10 text-primary"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
        )
      }
      style={({ isActive }) => isActive && accent ? { background: `${accent}15`, color: accent } : {}}
    >
      <item.icon className="w-[18px] h-[18px]" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
          accent ? "bg-sky-500 text-white" : "bg-primary text-primary-foreground")}>
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1">{children}</div>
  );
}

interface AppSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AppSidebar({ collapsed = false, onToggle }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const [productOpen, setProductOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  const isToeic = location.pathname.startsWith("/toeic");
  const activeProduct = isToeic ? "TOEIC" : "TAGE MAGE";
  const toeicAccent = "#0ea5e9"; // sky-500

  useEffect(() => {
    if (toolsOpen && toolsRef.current) {
      setTimeout(() => {
        toolsRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 50);
    }
  }, [toolsOpen]);

  const handleProductSwitch = (product: string) => {
    setProductOpen(false);
    localStorage.setItem("lastProduct", product === "TOEIC" ? "toeic" : "tage");
    if (product === "TOEIC" && !isToeic) navigate("/toeic");
    if (product === "TAGE MAGE" && isToeic) navigate("/");
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 bottom-0 w-60 bg-card border-r border-border flex flex-col z-50 transition-all duration-200",
      collapsed && "-translate-x-full"
    )}>
      {/* Logo + collapse */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <span className={cn("text-xl font-bold tracking-tight", isToeic ? "text-sky-500" : "text-primary")}>
          ASTPrep
        </span>
        {isToeic && (
          <span className="text-[10px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
            TOEIC
          </span>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Masquer le menu"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product selector */}
      <div className="px-3 pb-3">
        <div className="relative">
          <button
            onClick={() => setProductOpen(!productOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border text-sm font-medium hover:bg-muted transition-colors min-h-[44px]"
          >
            <LayoutGrid className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-left">{activeProduct}</span>
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", productOpen && "rotate-180")} />
          </button>
          {productOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg py-1 z-10">
              {["TAGE MAGE", "TOEIC"].map(p => (
                <button
                  key={p}
                  onClick={() => handleProductSwitch(p)}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left font-medium transition-colors",
                    p === activeProduct
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {p}
                </button>
              ))}
              {["Oraux", "Dossier"].map(p => (
                <div key={p} className="px-3 py-2 text-sm text-muted-foreground flex items-center justify-between cursor-not-allowed">
                  {p}
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">Bientôt</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 overflow-y-auto px-3", isToeic && "[&_*]:transition-colors")}>
        {isToeic ? (
          <>
            <div className="space-y-0.5">
              <NavItem item={{ label: "Dashboard", icon: LayoutDashboard, to: "/toeic" }} accent={toeicAccent} />
            </div>

            <div className="h-5" />
            <GroupLabel>Apprentissage</GroupLabel>
            <div className="space-y-0.5">
              {toeicGroup1.map(item => <NavItem key={item.to} item={item} accent={toeicAccent} />)}
            </div>

            <div className="h-5" />
            <GroupLabel>Sous-tests</GroupLabel>
            <div className="space-y-0.5">
              {toeicGroup2.map(item => <NavItem key={item.to} item={item} accent={toeicAccent} />)}
            </div>

            <div className="h-5" />
            <div className="space-y-0.5" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors min-h-[44px]"
              >
                <Wrench className="w-[18px] h-[18px]" />
                <span className="flex-1 text-left">Outils</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", toolsOpen && "rotate-180")} />
              </button>
              {toolsOpen && (
                <div className="ml-4 space-y-0.5">
                  {toeicTools.map(t => (
                    <NavLink
                      key={t.to}
                      to={t.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] transition-colors min-h-[44px]",
                          isActive ? "text-sky-500" : "text-foreground/60 hover:bg-muted"
                        )
                      }
                      style={({ isActive }) => isActive ? { background: `${toeicAccent}15`, color: toeicAccent } : {}}
                    >
                      <t.icon className="w-4 h-4" />
                      {t.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-0.5">
              <NavItem item={{ label: "Dashboard", icon: LayoutDashboard, to: "/" }} />
            </div>

            <div className="h-6" />
            <div className="space-y-0.5">
              {tageGroup1.map(item => <NavItem key={item.to} item={item} />)}
            </div>

            <div className="h-6" />
            <div className="space-y-0.5">
              {tageGroup2.map(item => <NavItem key={item.to} item={item} />)}
            </div>

            <div className="h-6" />
            <div className="space-y-0.5" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors min-h-[44px]"
              >
                <Wrench className="w-[18px] h-[18px]" />
                <span className="flex-1 text-left">Outils</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", toolsOpen && "rotate-180")} />
              </button>
              {toolsOpen && (
                <div className="ml-4 space-y-0.5">
                  {tageTools.map(t => (
                    <NavLink
                      key={t.to}
                      to={t.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] transition-colors min-h-[44px]",
                          isActive ? "bg-primary/10 text-primary" : "text-foreground/60 hover:bg-muted"
                        )
                      }
                    >
                      <t.icon className="w-4 h-4" />
                      {t.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-border flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
          isToeic ? "bg-sky-500/10 text-sky-500" : "bg-primary/10 text-primary")}>
          {profile?.full_name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{profile?.full_name ?? "—"}</div>
        </div>
        <button
          onClick={async () => {
            await signOut();
            window.location.href = "/login";
          }}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Se deconnecter"
          title="Se deconnecter"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
