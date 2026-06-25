import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeBlock } from "@/components/code-block";

export const Route = createFileRoute("/api")({
  head: () => ({
    meta: [
      { title: "API Reference — next-auth-toolkit" },
      { name: "description", content: "Complete API reference for next-auth-toolkit: functions, hooks, components, and types." },
      { property: "og:title", content: "API Reference" },
      { property: "og:description", content: "Every function, hook, and component, fully typed." },
    ],
  }),
  component: ApiRef,
});

const apis = [
  {
    section: "Server",
    items: [
      { sig: "createAuth(config)", desc: "Create an auth instance with providers, adapter, and features." },
      { sig: "getSession()", desc: "Get the current session in a Server Component or Route Handler." },
      { sig: "requireSession()", desc: "Throw if not authenticated. Use in protected RSCs." },
      { sig: "requireRole(role)", desc: "Throw unless the user has the given role." },
      { sig: "requireStepUp(opts)", desc: "Require fresh auth or 2FA for sensitive operations." },
    ],
  },
  {
    section: "React (Client)",
    items: [
      { sig: "useSession()", desc: "React hook returning { data, status, update }." },
      { sig: "signIn(provider, opts?)", desc: "Initiate sign-in flow for a provider." },
      { sig: "signOut(opts?)", desc: "Clear session and redirect." },
      { sig: "useOrganization()", desc: "Current org, members, and switcher." },
      { sig: "<SignedIn> / <SignedOut>", desc: "Conditionally render based on auth state." },
    ],
  },
  {
    section: "Adapters",
    items: [
      { sig: "PrismaAdapter(db)", desc: "Persist to any Prisma-backed database." },
      { sig: "DrizzleAdapter(db)", desc: "Drizzle ORM adapter." },
      { sig: "MongoAdapter(client)", desc: "MongoDB adapter via official driver." },
      { sig: "KyselyAdapter(db)", desc: "Lightweight SQL adapter." },
    ],
  },
];

function ApiRef() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-12 max-w-4xl">
        <div className="chip mb-4">Reference</div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">API Reference</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every exported function, hook, and component — fully typed with TSDoc.
        </p>

        {apis.map((group) => (
          <section key={group.section} className="mt-12">
            <h2 className="font-display text-2xl font-semibold mb-4">{group.section}</h2>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              {group.items.map((item) => (
                <div key={item.sig} className="grid sm:grid-cols-[1fr_1.4fr] gap-4 p-4 hover:bg-card/40 transition-colors">
                  <code className="font-mono text-sm text-primary self-start">{item.sig}</code>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <h2 className="font-display text-2xl font-semibold mt-12 mb-3">Types</h2>
        <CodeBlock filename="types.ts" code={`interface Session {
  user: { id: string; email: string; name?: string; image?: string };
  expires: string;
  organization?: Organization;
  roles: string[];
}

interface AuthConfig {
  adapter: Adapter;
  secret: string;
  session: SessionConfig;
  providers: Provider[];
  features?: FeatureConfig;
  security?: SecurityConfig;
  callbacks?: AuthCallbacks;
}`} />
      </main>
      <SiteFooter />
    </div>
  );
}
