"use client";

import { Trash2, Clock, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RELIGION_META, RELIGION_ORDER } from "@/lib/constants";
import { formatHistoryDate } from "@/lib/history";
import type { HistoryEntry } from "@/lib/types";

interface HistoryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryPanel({
  open,
  onOpenChange,
  entries,
  onSelect,
  onRemove,
  onClearAll,
}: HistoryPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 bg-background"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold" />
              <SheetTitle className="font-display text-lg">Geçmiş Sorgular</SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => onOpenChange(false)}
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription className="text-xs">
            Son {entries.length} soru cihazınızda saklanır. Bir soruya dokunarak
            cevaplarını tekrar görüntüleyin.
          </SheetDescription>
        </SheetHeader>

        {entries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 text-muted-foreground">
            <Clock className="h-10 w-10 mb-3 opacity-40" />
            <p className="font-medium text-sm">Henüz geçmiş yok</p>
            <p className="text-xs mt-1 italic">
              Sorduğunuz sorular burada listelenecek.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1 px-3 py-3 elegant-scroll">
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="group rounded-xl border border-border bg-card hover:border-gold hover:shadow-sm transition-all p-3 cursor-pointer"
                  onClick={() => {
                    onSelect(entry);
                    onOpenChange(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                        {entry.question}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatHistoryDate(entry.createdAt)}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {RELIGION_ORDER.map((key) => {
                          const meta = RELIGION_META[key];
                          return (
                            <span
                              key={key}
                              className={`text-xs ${meta.accentClass}`}
                              aria-label={meta.name}
                              title={meta.name}
                            >
                              {meta.symbol}
                            </span>
                          );
                        })}
                        <span className="text-[10px] text-muted-foreground">
                          · 3 cevap
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(entry.id);
                      }}
                      aria-label="Bu soruyu sil"
                      className="shrink-0 p-1.5 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {entries.length > 0 && (
          <SheetFooter className="border-t border-border px-5 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="rounded-full w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Tüm Geçmişi Sil
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
