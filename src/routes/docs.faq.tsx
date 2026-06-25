import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — next-auth-toolkit" },
      { name: "description", content: "Answers to the most common questions about next-auth-toolkit." },
      { property: "og:title", content: "FAQ" },
      { property: "og:description", content: "Common questions about next-auth-toolkit." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "How is this different from NextAuth.js / Auth.js?",
    a: "Auth.js is great for adding OAuth to an existing app. next-auth-toolkit is a full framework: it ships organizations, RBAC, audit logs, rate limiting, passkeys, 2FA, and a CLI out of the box. You don't need to glue together five extra libraries to ship a real product.",
  },
  {
    q: "Why not just use Clerk or Auth0?",
    a: "Clerk and Auth0 are excellent hosted solutions, but you're locked into a vendor, pay per active user, and your users' identities live on someone else's database. next-auth-toolkit is open source under MIT, runs on your infrastructure, and your user data stays in your database.",
  },
  {
    q: "Does this work outside of Next.js?",
    a: "The core package is framework-agnostic. We ship official adapters for Next.js, Remix, TanStack Start, Nuxt, and SvelteKit. The React hooks work in any React app.",
  },
  {
    q: "Which databases are supported?",
    a: "Postgres, MySQL, SQLite, and MongoDB — through Prisma, Drizzle, Kysely, or the official MongoDB driver. You can also write a custom adapter; the interface is ~10 methods.",
  },
  {
    q: "Can I use it with my existing user table?",
    a: "Yes. The adapter pattern lets you map our user model onto any schema. There's also a migration guide for moving from NextAuth, Clerk, and rolling-your-own.",
  },
  {
    q: "How does pricing work?",
    a: "next-auth-toolkit is free, MIT-licensed, forever. There is no paid tier and no telemetry. We make money via consulting and (eventually) optional hosted addons like a managed audit log sink.",
  },
  {
    q: "Is it production-ready?",
    a: "v1.0 is production-ready and used in real apps. The full test suite covers OAuth flows, session refresh, RBAC, and edge cases. We follow semantic versioning and document breaking changes in the changelog.",
  },
  {
    q: "What about edge runtimes?",
    a: "Yes. Sessions are validated at the edge in sub-millisecond. Redis is supported as an optional cache for rate limiting and session lookup.",
  },
];

function FaqPage() {
  return (
    <article>
      <div className="chip mb-4">Help</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Frequently asked questions</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Honest answers. If your question isn't here, open an issue on GitHub.
      </p>
      <div className="mt-10 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-xl border border-border bg-card/60 open:bg-card transition-colors">
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold flex items-center justify-between gap-3">
              <span>{f.q}</span>
              <span className="text-primary text-xl leading-none transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
          </details>
        ))}
      </div>
    </article>
  );
}
