import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Rocket, Shield, Plug } from "lucide-react";

export const Route = createFileRoute("/docs/")({
  head: () => ({
    meta: [
      { title: "Documentation — next-auth-toolkit" },
      { name: "description", content: "Learn how to add authentication to your Next.js app with next-auth-toolkit." },
      { property: "og:title", content: "next-auth-toolkit Docs" },
      { property: "og:description", content: "Learn how to add authentication to your Next.js app." },
    ],
  }),
  component: DocsIndex,
});

const cards = [
  { icon: Rocket, title: "Getting Started", desc: "Install, configure, and ship auth in 5 minutes.", to: "/docs/getting-started" },
  { icon: Plug, title: "OAuth Providers", desc: "Wire up Google, GitHub, Apple, and 30+ others.", to: "/docs/oauth" },
  { icon: Shield, title: "Security & 2FA", desc: "Sessions, JWT, passkeys, rate limits, audit logs.", to: "/docs/security" },
  { icon: BookOpen, title: "API Reference", desc: "Every function, hook, and component, fully typed.", to: "/api" },
];

function DocsIndex() {
  return (
    <article>
      <div className="chip mb-4">Documentation</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Welcome to next-auth-toolkit</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        A complete authentication framework for Next.js applications. Built for production, designed
        for developer happiness, secure by default.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link
            key={c.title}
            to={c.to}
            className="group p-5 rounded-xl border border-border bg-card/60 hover:border-primary/40 hover:bg-card transition-all"
          >
            <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-primary/10 ring-1 ring-primary/25 mb-4">
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{c.title}</h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-2xl font-semibold mt-16 mb-4">What is next-auth-toolkit?</h2>
      <p className="text-muted-foreground leading-relaxed">
        next-auth-toolkit is a batteries-included authentication library that gives you everything you
        need to build secure, multi-tenant, production-grade Next.js applications — without stitching
        together a dozen packages. It bundles OAuth, passkeys, 2FA, sessions, organizations, RBAC,
        rate limiting, and audit logging behind one cohesive, type-safe API.
      </p>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-4">Why we built it</h2>
      <p className="text-muted-foreground leading-relaxed">
        Existing auth libraries either do too little (forcing you to build half the system yourself)
        or too much (locking you into a hosted vendor). next-auth-toolkit ships everything you need,
        open source under MIT, runs on your infrastructure, and stays out of your way.
      </p>
    </article>
  );
}
