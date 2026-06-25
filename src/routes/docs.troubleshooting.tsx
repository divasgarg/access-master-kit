import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/docs/troubleshooting")({
  head: () => ({
    meta: [
      { title: "Troubleshooting — next-auth-toolkit" },
      { name: "description", content: "Fixes for the most common errors and edge cases." },
      { property: "og:title", content: "Troubleshooting" },
      { property: "og:description", content: "Fix common errors quickly." },
    ],
  }),
  component: TroubleshootingPage,
});

const items = [
  {
    error: "Unsupported provider: <provider>",
    cause: "The provider was referenced in code but not registered in createAuth({ providers }).",
    fix: "Add the provider factory to your providers array and restart the dev server. Verify your env vars are set.",
  },
  {
    error: "Cookie not set after sign-in",
    cause: "Cookies are blocked when the app is served from a different origin than the auth handler, or when SameSite=Lax conflicts with a cross-site OAuth callback.",
    fix: "Mount the auth handler on the same origin, or set cookie.sameSite to 'none' and ensure secure cookies over HTTPS.",
  },
  {
    error: "JWT expired / invalid signature",
    cause: "AUTH_SECRET changed, the JWT was minted by a different deployment, or system clocks drift.",
    fix: "Keep AUTH_SECRET stable across deployments, rotate via the documented rotation flow, and use NTP-synced servers.",
  },
  {
    error: "redirect_uri_mismatch (OAuth)",
    cause: "The callback URL configured in the provider console doesn't match the one the SDK sends.",
    fix: "Add ${YOUR_URL}/api/auth/callback/<provider> to the provider console exactly — protocol, host, and path must match.",
  },
  {
    error: "RLS policy violated / new row violates row-level security policy",
    cause: "An insert or update ran without an authenticated session, or auth.uid() does not match the user_id column.",
    fix: "Confirm the bearer token middleware is attached (see Architecture → Server functions) and that the user_id you insert equals auth.uid().",
  },
  {
    error: "Rate limit exceeded on /signin",
    cause: "More than 5 attempts per minute from the same IP triggered the default rule.",
    fix: "Wait the cooldown window, or tune RedisRateLimit rules. Never raise limits without monitoring; brute force is the most common attack on this route.",
  },
  {
    error: "Session refreshes loop forever in the browser",
    cause: "Refresh token reuse detection fired because two tabs raced. The second tab gets revoked.",
    fix: "Ensure only one Supabase client instance per page, and that auth.onAuthStateChange is registered once. Avoid manually calling refreshSession.",
  },
  {
    error: "Email verification link expired",
    cause: "Verification tokens are single-use and expire after 24h by default.",
    fix: "Resend from the auth page. Increase auth.emailVerification.expiresIn if your users routinely take longer.",
  },
];

function TroubleshootingPage() {
  return (
    <article>
      <div className="chip mb-4">Guides</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Troubleshooting</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The eight errors we see most often, and exactly how to fix each one.
      </p>

      <div className="mt-10 space-y-4">
        {items.map((it) => (
          <div key={it.error} className="rounded-xl border border-border bg-card/60 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-8 w-8 shrink-0 rounded-md flex items-center justify-center bg-destructive/10 ring-1 ring-destructive/30">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-mono text-sm font-semibold break-words">{it.error}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="text-foreground/80 font-medium">Why: </span>
                  {it.cause}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  <span className="text-foreground/80 font-medium">Fix: </span>
                  {it.fix}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
