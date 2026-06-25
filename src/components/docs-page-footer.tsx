import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { getPrevNext } from "@/lib/docs-registry";

const LAST_UPDATED = "Jun 25, 2026";
const EDIT_BASE =
  "https://github.com/your-org/next-auth-toolkit/edit/main/src/routes";

function pathToFile(pathname: string): string {
  if (pathname === "/docs") return "/docs.index.tsx";
  return pathname.replace(/^\//, "/").replace(/\//g, ".") + ".tsx";
}

export function DocsPageFooter({ pathname }: { pathname: string }) {
  const { prev, next } = getPrevNext(pathname);

  return (
    <footer className="mt-16 border-t border-border pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <a
          href={`${EDIT_BASE}${pathToFile(pathname)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Pencil className="h-3 w-3" /> Edit this page on GitHub
        </a>
        <span className="font-mono">Last updated · {LAST_UPDATED}</span>
      </div>

      {(prev || next) && (
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {prev ? (
            <Link
              to={prev.to}
              className="group p-4 rounded-lg border border-border bg-card/40 hover:border-primary/40 hover:bg-card transition-all"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <ArrowLeft className="h-3 w-3" /> Previous
              </div>
              <div className="mt-1.5 font-semibold text-sm group-hover:text-primary transition-colors">
                {prev.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to={next.to}
              className="group p-4 rounded-lg border border-border bg-card/40 hover:border-primary/40 hover:bg-card transition-all sm:text-right"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground sm:justify-end">
                Next <ArrowRight className="h-3 w-3" />
              </div>
              <div className="mt-1.5 font-semibold text-sm group-hover:text-primary transition-colors">
                {next.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </footer>
  );
}
