import { Link, useRouterState } from "@tanstack/react-router";

const sections = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", to: "/docs" },
      { label: "Installation", to: "/docs/getting-started" },
      { label: "Quick Start", to: "/docs/getting-started" },
    ],
  },
  {
    title: "Authentication",
    items: [
      { label: "OAuth Providers", to: "/docs/oauth" },
      { label: "Email & Password", to: "/docs/oauth" },
      { label: "Magic Links", to: "/docs/oauth" },
      { label: "Passkeys (WebAuthn)", to: "/docs/security" },
    ],
  },
  {
    title: "Security",
    items: [
      { label: "Sessions & JWT", to: "/docs/security" },
      { label: "Two-Factor Auth", to: "/docs/security" },
      { label: "Rate Limiting", to: "/docs/security" },
      { label: "Audit Logs", to: "/docs/security" },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "API Reference", to: "/api" },
      { label: "CLI", to: "/docs" },
      { label: "Adapters", to: "/docs" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <nav className="sticky top-20 space-y-6 text-sm">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className={`block px-2.5 py-1.5 rounded-md transition-colors ${
                        active
                          ? "text-primary bg-primary/10 font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {item.label}
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
