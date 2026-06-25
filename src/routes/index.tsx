import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeBlock } from "@/components/code-block";
import {
  ArrowRight, Lock, Fingerprint, KeyRound, Users, Activity, Globe,
  Zap, Database, Boxes, ShieldCheck, Github, Terminal,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "next-auth-toolkit — Auth for Next.js, done right" },
      { name: "description", content: "OAuth, passkeys, 2FA, sessions, RBAC, organizations — all in one type-safe npm package. The complete authentication framework for Next.js." },
      { property: "og:title", content: "next-auth-toolkit" },
      { property: "og:description", content: "OAuth, passkeys, 2FA, sessions, RBAC — one install." },
    ],
  }),
  component: Index,
});

const installCmd = `npm install next-auth-toolkit
npx next-auth-toolkit init`;

const usageCode = `import { createAuth } from "next-auth-toolkit";
import { PrismaAdapter } from "next-auth-toolkit/adapters";

export const auth = createAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  providers: [
    Google({ clientId: env.GOOGLE_ID, clientSecret: env.GOOGLE_SECRET }),
    Github({ clientId: env.GH_ID, clientSecret: env.GH_SECRET }),
    Passkey(),
    EmailOTP({ sendCode: sendMail }),
  ],
  features: { twoFactor: true, organizations: true, auditLog: true },
});`;

const features = [
  { icon: Lock, title: "Every auth method", desc: "Email/password, OAuth, magic links, OTP, phone, SSO, passkeys — same API." },
  { icon: Fingerprint, title: "WebAuthn / Passkeys", desc: "Passwordless biometric auth built in. Apple, Google, 1Password compatible." },
  { icon: KeyRound, title: "2FA & backup codes", desc: "TOTP, SMS, recovery codes. Step-up auth for sensitive actions." },
  { icon: Users, title: "Orgs, teams, RBAC", desc: "Multi-tenant from day one. Roles, permissions, invitations, workspaces." },
  { icon: Activity, title: "Audit & device logs", desc: "Login history, session revocation, suspicious activity detection." },
  { icon: Database, title: "Any database", desc: "Postgres, MySQL, MongoDB, SQLite. Prisma, Drizzle, Kysely adapters." },
  { icon: ShieldCheck, title: "Secure by default", desc: "CSRF, rate limiting, OWASP Top 10. SOC2 and GDPR ready." },
  { icon: Zap, title: "Edge-ready", desc: "Runs on Edge Runtime. Sub-millisecond session checks with Redis." },
];

const providers = [
  "Google", "GitHub", "Microsoft", "Apple", "Discord", "Facebook",
  "LinkedIn", "Twitter", "Slack", "GitLab", "Bitbucket", "Spotify",
];

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 surface-grid opacity-[0.35]" aria-hidden />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="container-page relative pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <a href="#" className="chip mb-6 hover:border-primary/50 transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              v1.0 — Passkeys, Organizations & Audit Logs
              <ArrowRight className="h-3 w-3" />
            </a>

            <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
              Auth for Next.js,
              <br />
              <span className="text-gradient-amber">done right.</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              The complete authentication framework. OAuth, passkeys, 2FA, sessions,
              organizations, and RBAC — fully type-safe, edge-ready,
              <span className="text-foreground"> in one install.</span>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/docs/getting-started"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground glow-ring transition-all hover:brightness-110"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/playground"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 px-5 py-2.5 text-sm font-medium hover:bg-card transition-colors"
              >
                <Terminal className="h-4 w-4" /> Try the playground
              </Link>
            </div>

            <div className="mt-10 w-full max-w-xl">
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-code-border bg-code-bg/80 font-mono text-sm text-left">
                <span className="text-primary">$</span>
                <span className="text-muted-foreground">npm install</span>
                <span>next-auth-toolkit</span>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono text-muted-foreground">
              <span>Trusted by 12,400+ developers</span>
              <span className="hidden sm:inline">·</span>
              <span>4.2M weekly downloads</span>
              <span className="hidden sm:inline">·</span>
              <span>SOC2 Type II</span>
            </div>
          </div>
        </div>
      </section>

      {/* CODE PREVIEW */}
      <section className="container-page py-20">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
          <div>
            <div className="chip mb-4"><Boxes className="h-3 w-3" /> One config</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Configure once. Compose everything.
            </h2>
            <p className="mt-4 text-muted-foreground">
              A single <code className="font-mono text-primary">createAuth()</code> call wires up your
              providers, sessions, database adapter, and features. No magic, no boilerplate, just
              composable building blocks that scale from your side project to enterprise.
            </p>
            <Link
              to="/docs/getting-started"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Read the quickstart <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <CodeBlock filename="lib/auth.ts" code={usageCode} />
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-page py-20">
        <div className="max-w-2xl mb-12">
          <div className="chip mb-3">Features</div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Every authentication primitive you'll ever need.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative p-5 rounded-xl border border-border bg-card/60 hover:bg-card hover:border-primary/40 transition-all"
            >
              <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-primary/10 ring-1 ring-primary/25 mb-4">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROVIDERS */}
      <section className="container-page py-20">
        <div className="rounded-2xl border border-border bg-card/40 p-8 md:p-12">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-center">
            <div>
              <div className="chip mb-3"><Globe className="h-3 w-3" /> 30+ providers</div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                Plug in any identity provider in two lines.
              </h2>
              <p className="mt-4 text-muted-foreground text-sm">
                OAuth 2.0, OIDC, SAML, and custom providers — all with the same composable API and full
                TypeScript inference.
              </p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {providers.map((p) => (
                <div
                  key={p}
                  className="px-3 py-2.5 rounded-md border border-border bg-background/60 text-xs font-mono text-center hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INSTALL CTA */}
      <section className="container-page py-20">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="p-8 rounded-2xl border border-border bg-card/60 flex flex-col justify-between">
            <div>
              <Terminal className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-display text-2xl font-semibold">Install in 30 seconds</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The CLI scaffolds your auth routes, schema, and middleware. Pick your providers and ship.
              </p>
            </div>
            <CodeBlock filename="terminal" code={installCmd} />
          </div>
          <div className="p-8 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card/60 to-accent/5 flex flex-col justify-between">
            <div>
              <Github className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-display text-2xl font-semibold">Open source, forever.</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                MIT licensed. Built in the open. Backed by a community of 12,000+ developers.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <a
                href="https://github.com"
                className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Github className="h-4 w-4" /> Star on GitHub
              </a>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-card transition-colors"
              >
                Read docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
