import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/docs/best-practices")({
  head: () => ({
    meta: [
      { title: "Best Practices — next-auth-toolkit" },
      { name: "description", content: "Production checklist: secret rotation, session hardening, RBAC modeling, audit hygiene." },
      { property: "og:title", content: "Best Practices" },
      { property: "og:description", content: "Production hardening checklist." },
    ],
  }),
  component: BestPracticesPage,
});

const sections = [
  {
    title: "Secrets and rotation",
    rules: [
      { good: true, text: "Store AUTH_SECRET in a secret manager; never commit it." },
      { good: true, text: "Rotate AUTH_SECRET every 90 days using the dual-secret rollover flow." },
      { good: true, text: "Use per-environment secrets — dev, staging, and prod must differ." },
      { good: false, text: "Don't reuse the same OAuth client across environments — callbacks collide." },
    ],
  },
  {
    title: "Sessions and tokens",
    rules: [
      { good: true, text: "Keep access tokens short-lived (≤ 15 min) and rotate refresh tokens on use." },
      { good: true, text: "Set cookies with HttpOnly, Secure, SameSite=Lax, and a parent-domain Domain only when needed." },
      { good: true, text: "Bind sessions to a stable device hint (user-agent + IP /16) and re-prompt on mismatch." },
      { good: false, text: "Don't store JWTs in localStorage — XSS can exfiltrate them. Use HttpOnly cookies." },
    ],
  },
  {
    title: "RBAC modelling",
    rules: [
      { good: true, text: "Store roles in a separate user_roles table — never on the user/profile row." },
      { good: true, text: "Check roles through a SECURITY DEFINER function (has_role) to avoid recursive RLS." },
      { good: true, text: "Treat 'admin' as a privilege escalation surface — log every grant and revoke." },
      { good: false, text: "Don't trust a JWT 'role' claim for authorization on the server — re-check from the database." },
    ],
  },
  {
    title: "Passwords and MFA",
    rules: [
      { good: true, text: "Enforce 12+ character passwords and check against HIBP on sign-up." },
      { good: true, text: "Offer passkeys first, TOTP second, SMS only as a last resort." },
      { good: true, text: "Require step-up auth for billing, key rotation, and account deletion." },
      { good: false, text: "Don't expose whether an email exists in your error messages — keep them generic." },
    ],
  },
  {
    title: "Audit and observability",
    rules: [
      { good: true, text: "Append every auth and role-change event to an immutable audit log." },
      { good: true, text: "Ship logs to a separate sink your app process can't modify or delete." },
      { good: true, text: "Alert on bursts of failed sign-ins, MFA failures, and refresh-token reuse." },
      { good: false, text: "Don't log raw tokens, passwords, or full session cookies — redact aggressively." },
    ],
  },
  {
    title: "API keys",
    rules: [
      { good: true, text: "Store only SHA-256 of the key; show the plaintext to the user exactly once." },
      { good: true, text: "Prefix keys (e.g. nak_live_) so they're searchable in logs and revocable on leak." },
      { good: true, text: "Scope keys to the minimum required permissions and set an expiry by default." },
      { good: false, text: "Don't accept API keys in query strings — they leak into logs, referrers, and bookmarks." },
    ],
  },
];

function BestPracticesPage() {
  return (
    <article>
      <div className="chip mb-4">Security</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Best Practices</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The production checklist we'd run through before shipping auth in front of real users.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-2xl font-semibold mb-3">{s.title}</h2>
            <ul className="space-y-2">
              {s.rules.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/40"
                >
                  <span
                    className={`mt-0.5 h-5 w-5 shrink-0 rounded-md flex items-center justify-center ring-1 ${
                      r.good
                        ? "bg-success/10 ring-success/30 text-success"
                        : "bg-destructive/10 ring-destructive/30 text-destructive"
                    }`}
                  >
                    {r.good ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                  <p className="text-sm leading-relaxed">{r.text}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
