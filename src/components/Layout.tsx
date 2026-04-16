import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <main className={cn("flex-1 min-h-screen bg-surface transition-[margin] duration-200", collapsed ? "ml-0" : "ml-60")}>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="fixed top-4 left-4 z-50 w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Ouvrir le menu"
          >
            <PanelLeftOpen className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        <Outlet />
      </main>
    </div>
  );
}
