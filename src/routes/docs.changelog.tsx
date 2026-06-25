import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — next-auth-toolkit" },
      { name: "description", content: "Release notes and breaking changes for next-auth-toolkit." },
      { property: "og:title", content: "Changelog" },
      { property: "og:description", content: "Release notes and breaking changes." },
    ],
  }),
  component: Changelog,
});

const releases = [
  {
    version: "1.0.0",
    date: "Jun 25, 2026",
    badge: "Stable",
    notes: [
      "Production-ready 1.0 release",
      "Passkeys / WebAuthn shipped",
      "Organizations, teams, and invitations",
      "TOTP 2FA with backup codes",
      "Audit log with pluggable sinks (console, file, Postgres, S3)",
    ],
  },
  {
    version: "0.9.0",
    date: "May 2026",
    badge: "Beta",
    notes: [
      "RBAC with role + permission hierarchies",
      "Account linking across providers",
      "Edge Runtime support for session validation",
      "BREAKING: renamed `auth.callback` to `auth.handler`",
    ],
  },
  {
    version: "0.8.0",
    date: "Apr 2026",
    badge: "Beta",
    notes: [
      "Drizzle + Kysely adapters",
      "Magic link provider",
      "Step-up authentication helper",
    ],
  },
  {
    version: "0.7.0",
    date: "Mar 2026",
    badge: "Beta",
    notes: [
      "First public beta",
      "Email/password, JWT, Google, GitHub providers",
      "Prisma adapter",
    ],
  },
];

function Changelog() {
  return (
    <article>
      <div className="chip mb-4">Releases</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Changelog</h1>
      <p className="mt-4 text-lg text-muted-foreground">Following semver. Breaking changes are flagged.</p>

      <div className="mt-10 space-y-6">
        {releases.map((r) => (
          <div key={r.version} className="relative pl-6 border-l border-border">
            <div className="absolute left-0 top-1.5 -translate-x-1/2 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
            <div className="flex flex-wrap items-baseline gap-3 mb-3">
              <h2 className="font-display text-xl font-semibold">v{r.version}</h2>
              <span className="chip">{r.badge}</span>
              <span className="text-xs text-muted-foreground font-mono">{r.date}</span>
            </div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {r.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="text-primary">▸</span>
                  <span>{n.startsWith("BREAKING:") ? <><span className="text-destructive font-semibold">{n.split(":")[0]}:</span>{n.slice(n.indexOf(":") + 1)}</> : n}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
