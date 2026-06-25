import { Link, useRouterState } from "@tanstack/react-router";
import { groupedPages } from "@/lib/docs-registry";

export function DocsSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sections = groupedPages();

  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-6 text-sm pr-2">
        {sections.map((section) => (
          <div key={section.section}>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              {section.section}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`block px-2.5 py-1.5 rounded-md transition-colors ${
                        active
                          ? "text-primary bg-primary/10 font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
