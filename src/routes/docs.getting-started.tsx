import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";

export const Route = createFileRoute("/docs/getting-started")({
  head: () => ({
    meta: [
      { title: "Getting Started — next-auth-toolkit" },
      { name: "description", content: "Install and configure next-auth-toolkit in your Next.js app in under 5 minutes." },
      { property: "og:title", content: "Getting Started" },
      { property: "og:description", content: "Install and configure next-auth-toolkit in under 5 minutes." },
    ],
  }),
  component: GettingStarted,
});

function GettingStarted() {
  return (
    <article className="prose-docs">
      <div className="chip mb-4">Getting Started</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Quickstart</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Get authentication running in your Next.js app in under five minutes.
      </p>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">1. Install</h2>
      <p className="text-muted-foreground">Add the package and run the init CLI:</p>
      <CodeBlock filename="terminal" code={`npm install next-auth-toolkit
npx next-auth-toolkit init`} />

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">2. Configure providers</h2>
      <p className="text-muted-foreground">
        Create <code className="font-mono text-primary">lib/auth.ts</code> and register the providers
        you need:
      </p>
      <CodeBlock filename="lib/auth.ts" code={`import { createAuth, Google, Github, EmailOTP } from "next-auth-toolkit";
import { PrismaAdapter } from "next-auth-toolkit/adapters";
import { db } from "./db";

export const auth = createAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  providers: [
    Google({ clientId: env.GOOGLE_ID, clientSecret: env.GOOGLE_SECRET }),
    Github({ clientId: env.GH_ID, clientSecret: env.GH_SECRET }),
    EmailOTP({ sendCode: async (email, code) => sendMail(email, code) }),
  ],
});`} />

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">3. Mount the handler</h2>
      <p className="text-muted-foreground">
        Create the App Router route at <code className="font-mono text-primary">app/api/auth/[...auth]/route.ts</code>:
      </p>
      <CodeBlock filename="app/api/auth/[...auth]/route.ts" code={`import { auth } from "@/lib/auth";

export const { GET, POST } = auth.handler;`} />

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">4. Use it in your app</h2>
      <p className="text-muted-foreground">React Server Components and Client hooks are both supported:</p>
      <CodeBlock filename="app/page.tsx" code={`import { getSession } from "next-auth-toolkit/server";

export default async function Page() {
  const session = await getSession();
  if (!session) return <SignIn />;
  return <Dashboard user={session.user} />;
}`} />
      <CodeBlock filename="components/profile.tsx" code={`"use client";
import { useSession, signOut } from "next-auth-toolkit/react";

export function Profile() {
  const { data, status } = useSession();
  if (status === "loading") return <Spinner />;
  return <button onClick={() => signOut()}>Sign out {data?.user.name}</button>;
}`} />

      <div className="mt-12 p-5 rounded-xl border border-primary/30 bg-primary/5">
        <div className="font-semibold text-sm mb-1">That's it.</div>
        <p className="text-sm text-muted-foreground">
          You now have sessions, OAuth, email OTP, CSRF protection, and rate limiting wired up. Head
          to the playground to try it live, or explore the API reference.
        </p>
      </div>
    </article>
  );
}
