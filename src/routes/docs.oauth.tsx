import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";

export const Route = createFileRoute("/docs/oauth")({
  head: () => ({
    meta: [
      { title: "OAuth Providers — next-auth-toolkit" },
      { name: "description", content: "Add Google, GitHub, Apple, Microsoft, and 30+ OAuth providers to your Next.js app." },
      { property: "og:title", content: "OAuth Providers" },
      { property: "og:description", content: "Add 30+ OAuth providers with a single line of config." },
    ],
  }),
  component: OAuthPage,
});

const providers = [
  { name: "Google", scopes: "openid email profile", env: "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET" },
  { name: "GitHub", scopes: "read:user user:email", env: "GH_CLIENT_ID, GH_CLIENT_SECRET" },
  { name: "Microsoft", scopes: "openid email profile", env: "MS_CLIENT_ID, MS_CLIENT_SECRET" },
  { name: "Apple", scopes: "email name", env: "APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID" },
  { name: "Discord", scopes: "identify email", env: "DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET" },
  { name: "Facebook", scopes: "email public_profile", env: "FB_CLIENT_ID, FB_CLIENT_SECRET" },
];

function OAuthPage() {
  return (
    <article>
      <div className="chip mb-4">Authentication</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">OAuth Providers</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Add any of the 30+ built-in OAuth providers, or write your own.
      </p>

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Configuration</h2>
      <p className="text-muted-foreground">
        Each provider is a factory function. Import it, pass credentials, and add it to your
        providers array:
      </p>
      <CodeBlock filename="lib/auth.ts" code={`import { Google, Github, Apple, Microsoft } from "next-auth-toolkit/providers";

providers: [
  Google({ clientId: env.GOOGLE_ID, clientSecret: env.GOOGLE_SECRET }),
  Github({ clientId: env.GH_ID, clientSecret: env.GH_SECRET, scope: "read:user user:email" }),
  Apple({ clientId: env.APPLE_ID, teamId: env.APPLE_TEAM, keyId: env.APPLE_KEY, privateKey: env.APPLE_PEM }),
  Microsoft({ clientId: env.MS_ID, clientSecret: env.MS_SECRET, tenant: "common" }),
],`} />

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Available providers</h2>
      <div className="mt-4 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs font-mono text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2.5">Provider</th>
              <th className="text-left px-4 py-2.5 hidden sm:table-cell">Default scopes</th>
              <th className="text-left px-4 py-2.5">Env vars</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p, i) => (
              <tr key={p.name} className={i % 2 ? "bg-card/40" : ""}>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden sm:table-cell">{p.scopes}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.env}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Custom providers</h2>
      <p className="text-muted-foreground">
        Any OAuth 2.0 / OIDC compliant provider works. Define endpoints, scopes, and a profile mapper:
      </p>
      <CodeBlock filename="providers/custom.ts" code={`import { OAuth2Provider } from "next-auth-toolkit/providers";

export const Notion = OAuth2Provider({
  id: "notion",
  name: "Notion",
  authorization: "https://api.notion.com/v1/oauth/authorize",
  token: "https://api.notion.com/v1/oauth/token",
  userinfo: "https://api.notion.com/v1/users/me",
  profile: (raw) => ({ id: raw.id, email: raw.email, name: raw.name }),
});`} />

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Account linking</h2>
      <p className="text-muted-foreground">
        Users with the same verified email across providers are linked automatically — configurable
        via the <code className="font-mono text-primary">accountLinking</code> option.
      </p>
    </article>
  );
}
