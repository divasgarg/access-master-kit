import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DOC_PAGES, type DocPage } from "@/lib/docs-registry";

const RECENT_KEY = "nak-recent-docs";

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function pushRecent(to: string) {
  if (typeof window === "undefined") return;
  const list = [to, ...loadRecent().filter((x) => x !== to)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRecent(loadRecent());
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const recentPages = useMemo(
    () =>
      recent
        .map((to) => DOC_PAGES.find((p) => p.to === to))
        .filter((x): x is DocPage => !!x),
    [recent],
  );

  const go = (p: DocPage) => {
    pushRecent(p.to);
    setOpen(false);
    navigate({ to: p.to });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        className="hidden md:inline-flex items-center gap-2 h-9 w-56 rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search docs…</span>
        <kbd className="font-mono text-[10px] rounded border border-border bg-background px-1.5 py-0.5">
          ⌘K
        </kbd>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <Search className="h-4 w-4" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search documentation, guides, providers…" />
        <CommandList>
          <CommandEmpty>
            <div className="py-6 text-center text-sm">
              <div className="text-muted-foreground">No results found.</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Try a different keyword, or open an issue on GitHub.
              </div>
            </div>
          </CommandEmpty>

          {recentPages.length > 0 && (
            <>
              <CommandGroup heading="Recent">
                {recentPages.map((p) => (
                  <CommandItem key={`r-${p.to}`} value={`recent ${p.title} ${p.to}`} onSelect={() => go(p)}>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{p.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="Documentation">
            {DOC_PAGES.map((p) => (
              <CommandItem
                key={p.to}
                value={`${p.title} ${p.description} ${p.section} ${p.keywords ?? ""}`}
                onSelect={() => go(p)}
              >
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm">{p.title}</span>
                  <span className="text-[11px] text-muted-foreground">{p.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
