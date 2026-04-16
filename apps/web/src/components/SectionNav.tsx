import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Section } from "@/data/sections";

interface SectionNavProps {
  sections: Section[];
  activeSection: string;
  onSelect: (id: string) => void;
  layoutId: string;
}

export function SectionNav({ sections, activeSection, onSelect, layoutId }: SectionNavProps) {
  return (
    <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-sm border-b border-border pb-4 pt-2 mb-6">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {sections.map(s => {
          const isActive = s.id === activeSection;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="flex flex-col items-center gap-1.5 relative min-h-[44px]"
              aria-selected={isActive}
              role="tab"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                  isActive ? "shadow-lg" : "bg-muted hover:bg-muted/80"
                )}
                style={isActive ? { background: s.hsl, boxShadow: `0 4px 12px color-mix(in srgb, ${s.hsl} 30%, transparent)` } : {}}
              >
                <Icon
                  className="w-[17px] h-[17px]"
                  style={{ color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))" }}
                />
              </div>
              <span className={cn("text-[10px] leading-tight font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                {s.shortLabel}
              </span>
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute -bottom-4 h-[2px] w-6 rounded-full bg-primary"
                  style={{ background: s.hsl }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
