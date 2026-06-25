import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";

export const Route = createFileRoute("/docs/migration")({
  head: () => ({
    meta: [
      { title: "Migration Guide — next-auth-toolkit" },
      { name: "description", content: "Migrate from NextAuth.js, Clerk, or a custom auth setup to next-auth-toolkit." },
      { property: "og:title", content: "Migration Guide" },
      { property: "og:description", content: "Migrate to next-auth-toolkit from NextAuth, Clerk, or DIY auth." },
    ],
  }),
  component: MigrationPage,
});

function MigrationPage() {
  return (
    <article>
      <div className="chip mb-4">Guides</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Migration guide</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Moving an existing app over takes about 30 minutes. Here's how.
      </p>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">From NextAuth.js / Auth.js</h2>
      <p className="text-muted-foreground">
        The mental model is similar — providers, callbacks, an adapter — so most code maps 1:1. Replace the import and
        rename a few options:
      </p>
      <CodeBlock filename="lib/auth.ts (before)" code={`import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export default NextAuth({
  adapter: PrismaAdapter(db),
  providers: [GoogleProvider({ clientId, clientSecret })],
});`} />
      <CodeBlock filename="lib/auth.ts (after)" code={`import { createAuth, Google } from "next-auth-toolkit";
import { PrismaAdapter } from "next-auth-toolkit/adapters";

export const auth = createAuth({
  adapter: PrismaAdapter(db),
  providers: [Google({ clientId, clientSecret })],
});`} />
      <p className="mt-3 text-muted-foreground text-sm">
        Run <code className="font-mono text-primary">npx next-auth-toolkit migrate next-auth</code> to copy user / account /
        session rows into the new schema.
      </p>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">From Clerk</h2>
      <p className="text-muted-foreground">
        Clerk users get exported via the Clerk Admin API. The CLI imports them, recreates organization memberships, and
        migrates passwords (when supplied as Clerk's password hash export):
      </p>
      <CodeBlock filename="terminal" code={`npx next-auth-toolkit migrate clerk --api-key=$CLERK_SECRET --include=organizations,memberships`} />

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">From a custom auth setup</h2>
      <p className="text-muted-foreground">
        Write a one-time backfill that inserts each user into our schema. Passwords are migrated as bcrypt or argon2 hashes
        and detected automatically on first sign-in:
      </p>
      <CodeBlock filename="scripts/import.ts" code={`import { adapter } from "@/lib/auth";

for (const u of legacyUsers) {
  await adapter.createUser({
    email: u.email,
    emailVerified: u.emailVerifiedAt,
    passwordHash: u.password_bcrypt,
  });
}`} />

      <div className="mt-12 p-5 rounded-xl border border-primary/30 bg-primary/5">
        <div className="font-semibold text-sm mb-1">Need help?</div>
        <p className="text-sm text-muted-foreground">
          Open a discussion on GitHub with your current setup and we'll help you map it. Most migrations have a documented
          recipe at this point.
        </p>
      </div>
    </article>
  );
}
