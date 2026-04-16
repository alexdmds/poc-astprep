import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Tags,
  BookOpen,
  Video,
  HelpCircle,
  ClipboardList,
  FileText,
  CreditCard,
  FileSpreadsheet,
  Radio,
  Users,
  BarChart3,
  PieChart,
  Activity,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navGroups = [
  {
    label: "DASHBOARD",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Tableau de bord", end: true },
    ],
  },
  {
    label: "CONTENU",
    items: [
      { to: "/content/sections", icon: Layers, label: "Sections" },
      { to: "/content/themes", icon: Tags, label: "Themes" },
      { to: "/content/chapters", icon: BookOpen, label: "Chapitres" },
      { to: "/content/lessons", icon: Video, label: "Cours" },
      { to: "/content/questions", icon: HelpCircle, label: "Questions" },
      { to: "/content/subtests", icon: ClipboardList, label: "Sous-tests" },
      { to: "/content/mock-tests", icon: FileText, label: "Tests blancs" },
      { to: "/content/flashcards", icon: CreditCard, label: "Flashcards" },
      { to: "/content/fiches", icon: FileSpreadsheet, label: "Fiches" },
      { to: "/content/live-courses", icon: Radio, label: "Cours live" },
    ],
  },
  {
    label: "UTILISATEURS",
    items: [{ to: "/users", icon: Users, label: "Liste" }],
  },
  {
    label: "ANALYTICS",
    items: [
      { to: "/analytics", icon: BarChart3, label: "Vue d'ensemble", end: true },
      { to: "/analytics/quizzes", icon: PieChart, label: "Quiz" },
      { to: "/analytics/engagement", icon: Activity, label: "Engagement" },
    ],
  },
];

export default function AdminSidebar({ open, onClose }: SidebarProps) {
  const { signOut } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <span className="text-lg font-bold">ASTPrep Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-primary",
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t p-3">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Se deconnecter
          </button>
        </div>
      </aside>
    </>
  );
}
