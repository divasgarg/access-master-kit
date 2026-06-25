import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeBlock } from "@/components/code-block";
import { Rocket, Github, Twitter, MessageSquare, Youtube, Newspaper } from "lucide-react";

export const Route = createFileRoute("/launch")({
  head: () => ({
    meta: [
      { title: "Launch kit — next-auth-toolkit" },
      { name: "description", content: "Everything to launch next-auth-toolkit on Product Hunt, Hacker News, Reddit, X, and YouTube." },
      { property: "og:title", content: "Launch kit" },
      { property: "og:description", content: "Launch copy, README, and assets for next-auth-toolkit." },
    ],
  }),
  component: LaunchPage,
});

const readme = `# next-auth-toolkit

> The complete authentication framework for Next.js. OAuth, passkeys, 2FA, sessions, RBAC, organizations — in one install.

[![npm](https://img.shields.io/npm/v/next-auth-toolkit.svg)](https://npmjs.com/package/next-auth-toolkit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/your-org/next-auth-toolkit?style=social)](https://github.com/your-org/next-auth-toolkit)

## Why

Existing auth libraries do too little (forcing you to glue 5 things together) or too much (locking you into a vendor). next-auth-toolkit is the complete framework — OAuth, sessions, RBAC, orgs, passkeys, 2FA, audit logs — open source, on your infra, no per-user pricing.

## Install

\`\`\`bash
npm install next-auth-toolkit
npx next-auth-toolkit init
\`\`\`

## Usage

\`\`\`ts
import { createAuth, Google, Github } from "next-auth-toolkit";
import { PrismaAdapter } from "next-auth-toolkit/adapters";

export const auth = createAuth({
  adapter: PrismaAdapter(db),
  providers: [Google(...), Github(...)],
});
\`\`\`

Docs: https://next-auth-toolkit.dev/docs

## License

MIT`;

const phTagline = "next-auth-toolkit — OAuth, passkeys, 2FA, RBAC for Next.js in one install";
const phDescription = `next-auth-toolkit is the complete authentication framework for Next.js. Stop gluing together 5 libraries — get OAuth (30+ providers), passkeys, 2FA, RBAC, organizations, audit logs, and a CLI in one type-safe package. Open source, MIT licensed, runs on your infra.`;

const hnTitle = "Show HN: Next Auth Toolkit – OAuth, passkeys, RBAC, orgs in one Next.js package";
const hnBody = `Hey HN — I built this because every Next.js auth setup ended up the same way: NextAuth for OAuth, a separate library for 2FA, another for RBAC, a custom audit log, and so on. Five packages, all with different conventions.

next-auth-toolkit bundles all of that into one cohesive, type-safe API. Configure once with createAuth(), pick your providers, get organizations, teams, passkeys, 2FA, rate limiting, and audit logging for free.

- MIT licensed, no telemetry, no paid tier
- Adapters for Prisma, Drizzle, Kysely, MongoDB
- Edge Runtime ready
- Live playground: https://next-auth-toolkit.dev/playground

Happy to answer any questions about the design.`;

const tweetThread = [
  "I just shipped next-auth-toolkit v1.0 🎉\n\nThe complete auth framework for Next.js — OAuth, passkeys, 2FA, RBAC, organizations, audit logs — all in one install.\n\nMIT licensed. Runs on your infra. No per-user pricing.\n\nThread 🧵👇",
  "1/ The problem:\n\nEvery Next.js auth setup ends up the same:\n- NextAuth for OAuth\n- Separate lib for 2FA\n- Another for RBAC\n- DIY audit log\n- DIY rate limiting\n\n5 packages, 5 conventions, hours wasted glueing them together.",
  "2/ The solution:\n\nOne createAuth() call. Pick your providers. Get organizations, passkeys, 2FA, RBAC, and audit logs out of the box.\n\nFully type-safe. Edge-ready. Works with any database.",
  "3/ Try the live playground:\n\nhttps://next-auth-toolkit.dev/playground\n\nNo signup required to play. Real signup takes 10 seconds and gives you a real JWT, RLS-protected dashboard, and audit log.",
  "4/ Open source under MIT. Source on GitHub: github.com/your-org/next-auth-toolkit\n\nIf you've ever cursed at auth — give it a try. Reply with feedback 🙏",
];

const ytScript = `[0:00] Hook
"Authentication in Next.js is broken. You need 5 packages just to ship a basic app. Today I'll show you how to set up production-grade auth — OAuth, 2FA, RBAC, audit logs — in 5 minutes with one package."

[0:30] What we'll build
- Email/password + Google OAuth + GitHub OAuth
- Protected dashboard with role-based access
- Audit log of every sign-in

[1:00] Install
npm install next-auth-toolkit && npx next-auth-toolkit init

[2:00] Configure providers (createAuth + Google + GitHub)

[3:30] Add the route handler and middleware

[4:30] Use it: useSession on the client, getSession on the server

[6:00] Add RBAC: requireRole("admin")

[7:00] Open the dashboard, sign in, see the audit log

[8:00] Outro
Star on GitHub, link in description.`;

function LaunchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-12 max-w-4xl">
        <div className="chip mb-4">Launch kit</div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
          Ready to launch. Copy-paste away.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          README, Product Hunt copy, Hacker News post, X thread, and YouTube tutorial script — all written and ready
          for the day you ship.
        </p>

        <Section icon={Github} title="README.md">
          <CodeBlock filename="README.md" lang="md" code={readme} />
        </Section>

        <Section icon={Rocket} title="Product Hunt">
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Tagline (60 chars)</div>
              <div className="p-3 rounded-md border border-border bg-card/60">{phTagline}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Description</div>
              <div className="p-3 rounded-md border border-border bg-card/60 whitespace-pre-wrap">{phDescription}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Topics</div>
              <div className="flex flex-wrap gap-1.5">
                {["Developer Tools", "Open Source", "SaaS", "Next.js", "Authentication"].map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section icon={Newspaper} title="Hacker News (Show HN)">
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Title</div>
              <div className="p-3 rounded-md border border-border bg-card/60">{hnTitle}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Body</div>
              <div className="p-3 rounded-md border border-border bg-card/60 whitespace-pre-wrap">{hnBody}</div>
            </div>
          </div>
        </Section>

        <Section icon={Twitter} title="X / Twitter thread">
          <div className="space-y-2">
            {tweetThread.map((tw, i) => (
              <div key={i} className="p-4 rounded-lg border border-border bg-card/60 whitespace-pre-wrap text-sm">
                {tw}
                <div className="mt-2 text-[10px] font-mono text-muted-foreground">{tw.length}/280</div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={MessageSquare} title="Reddit (r/nextjs, r/webdev)">
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Title</div>
              <div className="p-3 rounded-md border border-border bg-card/60">
                I built a complete auth framework for Next.js — OAuth, passkeys, 2FA, RBAC in one install [open source]
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Body</div>
              <div className="p-3 rounded-md border border-border bg-card/60 text-sm">
                Reddit rewards informal, build-in-public posts. Lead with the pain point you solved, share what you
                learned, and ask for honest feedback. Skip the marketing voice.
              </div>
            </div>
          </div>
        </Section>

        <Section icon={Youtube} title="YouTube tutorial script (~8 min)">
          <CodeBlock filename="script.txt" lang="txt" code={ytScript} />
        </Section>

        <div className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
          <h2 className="font-display text-xl font-semibold">Want me to draft launch-day social posts?</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Once you have a launch date and your GitHub repo URL, ping me to generate timed posts for X, LinkedIn,
            Reddit, and Indie Hackers in your voice.
          </p>
          <Link
            to="/docs/contributing"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110"
          >
            Read the contributing guide
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-md flex items-center justify-center bg-primary/10 ring-1 ring-primary/25">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
