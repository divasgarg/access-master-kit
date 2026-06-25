import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="font-display font-semibold">next-auth-toolkit</div>
          <p className="text-sm text-muted-foreground max-w-xs">
            The complete authentication framework for modern Next.js applications.
          </p>
          <div className="chip">npm i next-auth-toolkit</div>
        </div>
        {[
          { title: "Product", links: [["Docs", "/docs"], ["Playground", "/playground"], ["Examples", "/examples"], ["API", "/api"]] },
          { title: "Resources", links: [["Getting Started", "/docs/getting-started"], ["OAuth Setup", "/docs/oauth"], ["Security", "/docs/security"], ["Changelog", "/docs"]] },
          { title: "Community", links: [["GitHub", "/"], ["Discord", "/"], ["Twitter", "/"], ["Contributing", "/docs"]] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-sm font-semibold mb-3">{col.title}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="hover:text-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page border-t border-border/60 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-mono text-xs text-muted-foreground">© 2026 next-auth-toolkit · MIT License</p>
        <p className="font-mono text-xs text-muted-foreground">Built with TanStack Start</p>
      </div>
    </footer>
  );
}
