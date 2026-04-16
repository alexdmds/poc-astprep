import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Loader2 } from "lucide-react";
import { scoredSections } from "@/data/sections";
import { cn } from "@/lib/utils";
import { SectionNav } from "@/components/SectionNav";
import { useFiches } from "@/lib/queries/fiches";

export default function Fiches() {
  const [activeSection, setActiveSection] = useState(scoredSections[0].id);
  const section = scoredSections.find(s => s.id === activeSection)!;
  const { data: fiches, isLoading } = useFiches(activeSection);

  return (
    <div className="p-6">
      <SectionNav
        sections={scoredSections}
        activeSection={activeSection}
        onSelect={setActiveSection}
        layoutId="tab-line-fiches"
      />

      <AnimatePresence mode="wait">
        <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="max-w-2xl mx-auto px-6 py-2">
          <h2 className="text-xl font-bold">{section.label}</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            {isLoading ? "Chargement…" : `${fiches?.length ?? 0} fiches disponibles`}
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : !fiches?.length ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Aucune fiche disponible pour cette section.
            </div>
          ) : (
            <div className="space-y-3">
              {fiches.map((f, i) => (
                <motion.div key={f.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card hover:shadow-sm transition-shadow">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in srgb, ${section.hsl} 15%, transparent)` }}
                    >
                      <FileText className="w-[17px] h-[17px]" style={{ color: section.hsl }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{f.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{f.description}</div>
                    </div>
                    {f.pdf_url && (
                      <a
                        href={f.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted min-h-[44px]"
                        aria-label={`Télécharger ${f.title}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
