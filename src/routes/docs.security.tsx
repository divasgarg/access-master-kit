import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";
import { ShieldCheck, KeyRound, Fingerprint, Activity, Lock, Eye } from "lucide-react";

export const Route = createFileRoute("/docs/security")({
  head: () => ({
    meta: [
      { title: "Security — next-auth-toolkit" },
      { name: "description", content: "Sessions, JWT, 2FA, passkeys, CSRF, rate limiting, and audit logging — secure by default." },
      { property: "og:title", content: "Security in next-auth-toolkit" },
      { property: "og:description", content: "Secure by default — 2FA, passkeys, CSRF, rate limiting, audit logs." },
    ],
  }),
  component: SecurityPage,
});

const items = [
  { icon: Lock, title: "Session strategies", desc: "JWT or database sessions, sliding expiry, refresh tokens, multi-device revocation." },
  { icon: KeyRound, title: "Two-Factor (TOTP)", desc: "Authenticator-app 2FA with backup codes and step-up auth for sensitive routes." },
  { icon: Fingerprint, title: "Passkeys / WebAuthn", desc: "Passwordless biometric login. Works with Apple, Google, and 1Password keychains." },
  { icon: ShieldCheck, title: "CSRF & headers", desc: "Double-submit CSRF tokens, secure cookies, CSP, HSTS, X-Frame-Options out of the box." },
  { icon: Activity, title: "Rate limiting", desc: "Per-route, per-IP, per-user limits backed by Redis or in-memory adapters." },
  { icon: Eye, title: "Audit logs", desc: "Every login, signup, role change, and failed attempt is recorded. Pluggable sinks." },
];

function SecurityPage() {
  return (
    <article>
      <div className="chip mb-4">Security</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Security primitives</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Production-grade security defaults. Hardened against the OWASP Top 10, ready for SOC2 and GDPR.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-3">
        {items.map((i) => (
          <div key={i.title} className="p-4 rounded-lg border border-border bg-card/60">
            <div className="h-8 w-8 rounded-md flex items-center justify-center bg-primary/10 ring-1 ring-primary/25 mb-3">
              <i.icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">{i.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{i.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">Enabling 2FA</h2>
      <CodeBlock filename="lib/auth.ts" code={`createAuth({
  // ...
  features: {
    twoFactor: {
      enabled: true,
      issuer: "Acme Inc",
      backupCodes: 10,
    },
  },
});`} />

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Step-up authentication</h2>
      <p className="text-muted-foreground">
        Require fresh authentication or 2FA for sensitive actions like changing billing info:
      </p>
      <CodeBlock filename="app/billing/page.tsx" code={`import { requireStepUp } from "next-auth-toolkit/server";

export default async function BillingPage() {
  await requireStepUp({ maxAge: 60 * 5, factor: "2fa" });
  return <BillingForm />;
}`} />

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Rate limiting</h2>
      <CodeBlock filename="lib/auth.ts" code={`import { RedisRateLimit } from "next-auth-toolkit/security";

createAuth({
  security: {
    rateLimit: RedisRateLimit({
      redis,
      rules: {
        "signin": { window: "1m", max: 5 },
        "signup": { window: "1h", max: 3 },
      },
    }),
  },
});`} />
    </article>
  );
}
