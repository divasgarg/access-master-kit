import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CopyButton } from "@/components/copy-button";
import { useEffect, useState } from "react";
import { Mail, KeyRound, Fingerprint, Loader2, Check, Shield, ArrowLeft, Code2, Users, FileJson } from "lucide-react";
import { decodeJwt, formatExp, type DecodedJwt } from "@/lib/jwt";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground — next-auth-toolkit" },
      { name: "description", content: "Inspect JWTs, simulate RBAC roles, and copy production-ready auth snippets — no signup required." },
      { property: "og:title", content: "Auth Playground" },
      { property: "og:description", content: "Try every auth flow live in your browser." },
    ],
  }),
  component: Playground,
});

type Tab = "flows" | "jwt" | "rbac" | "snippets";

function Playground() {
  const [tab, setTab] = useState<Tab>("flows");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-12 flex-1">
        <div className="max-w-3xl">
          <div className="chip mb-4">Interactive</div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Playground</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Inspect JWTs, simulate RBAC, copy production-ready code snippets, and try every auth flow live in your browser.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-1 border-b border-border">
          {([
            { id: "flows" as const, icon: Shield, label: "Auth flows" },
            { id: "jwt" as const, icon: FileJson, label: "JWT inspector" },
            { id: "rbac" as const, icon: Users, label: "RBAC simulator" },
            { id: "snippets" as const, icon: Code2, label: "Code snippets" },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "flows" && <FlowsTab />}
          {tab === "jwt" && <JwtTab />}
          {tab === "rbac" && <RbacTab />}
          {tab === "snippets" && <SnippetsTab />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ----- Flows tab (existing simulator) ----- */

type Flow = "menu" | "email" | "otp" | "passkey" | "success";

function FlowsTab() {
  const [flow, setFlow] = useState<Flow>("menu");
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [log, setLog] = useState<string[]>([
    "▸ Sandbox ready. Pick a flow to simulate the auth lifecycle.",
  ]);

  const append = (line: string) =>
    setLog((l) => [...l, `${new Date().toLocaleTimeString()} · ${line}`].slice(-14));

  const simulate = async (id: string, ms = 900) => {
    setLoading(id);
    append(`POST /api/auth/${id} — sending request`);
    await new Promise((r) => setTimeout(r, ms));
    append(`200 OK — issued session token (jwt, exp +30d)`);
    setLoading(null);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-6">
      <div className="rounded-2xl border border-border bg-card/60 p-8 min-h-[460px] flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-primary/10 ring-1 ring-primary/30">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-display font-semibold leading-tight">acme.com</div>
            <div className="text-xs text-muted-foreground font-mono">powered by next-auth-toolkit</div>
          </div>
        </div>

        {flow !== "menu" && flow !== "success" && (
          <button
            onClick={() => setFlow("menu")}
            className="self-start mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> back
          </button>
        )}

        {flow === "menu" && (
          <>
            <h2 className="font-display text-2xl font-semibold">Sign in to continue</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose your preferred method.</p>
            <div className="mt-6 space-y-2">
              {["google", "github", "apple"].map((id) => (
                <button
                  key={id}
                  onClick={async () => {
                    await simulate(id);
                    setFlow("success");
                  }}
                  disabled={loading !== null}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border bg-background/60 hover:border-primary/40 hover:bg-card transition-all text-sm font-medium capitalize disabled:opacity-50"
                >
                  {loading === id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Continue with {id}
                </button>
              ))}
            </div>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-mono text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFlow("email")}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-border hover:border-primary/40 text-sm"
              >
                <Mail className="h-4 w-4" /> Email OTP
              </button>
              <button
                onClick={() => setFlow("passkey")}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-border hover:border-primary/40 text-sm"
              >
                <Fingerprint className="h-4 w-4" /> Passkey
              </button>
            </div>
          </>
        )}

        {flow === "email" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email) return;
              await simulate("email-otp");
              append(`Sent 6-digit code to ${email}`);
              setFlow("otp");
            }}
            className="flex-1 flex flex-col"
          >
            <h2 className="font-display text-2xl font-semibold">Sign in with email</h2>
            <p className="mt-1 text-sm text-muted-foreground">We'll send you a 6-digit code.</p>
            <label className="mt-6 text-xs font-mono text-muted-foreground">EMAIL</label>
            <input
              autoFocus
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@acme.com"
              className="mt-1.5 px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary outline-none text-sm"
            />
            <button
              disabled={loading !== null}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send code
            </button>
          </form>
        )}

        {flow === "otp" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (otp.length < 6) return;
              await simulate("verify-otp", 800);
              setFlow("success");
            }}
            className="flex-1 flex flex-col"
          >
            <h2 className="font-display text-2xl font-semibold">Check your email</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the 6-digit code we sent to <span className="text-foreground">{email}</span>.
            </p>
            <label className="mt-6 text-xs font-mono text-muted-foreground">CODE</label>
            <input
              autoFocus
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="mt-1.5 px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary outline-none text-sm font-mono tracking-[0.5em] text-center"
            />
            <button
              disabled={loading !== null || otp.length < 6}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Verify
            </button>
          </form>
        )}

        {flow === "passkey" && (
          <div className="flex-1 flex flex-col">
            <h2 className="font-display text-2xl font-semibold">Sign in with a passkey</h2>
            <p className="mt-1 text-sm text-muted-foreground">Use your fingerprint, face, or hardware key.</p>
            <div className="flex-1 flex items-center justify-center">
              <button
                onClick={async () => {
                  await simulate("passkey", 1400);
                  setFlow("success");
                }}
                disabled={loading !== null}
                className="group h-32 w-32 rounded-full border-2 border-primary/40 hover:border-primary bg-primary/5 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                ) : (
                  <Fingerprint className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground">Tap to authenticate</p>
          </div>
        )}

        {flow === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-success/20 ring-2 ring-success flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h2 className="font-display text-2xl font-semibold">You're signed in</h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              This was a simulation. Want to try the real thing? Sign up below and you'll get a real JWT session, a row
              in the database, and an audit log.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110"
              >
                Try real auth
              </Link>
              <button
                onClick={() => {
                  setFlow("menu");
                  setEmail("");
                  setOtp("");
                  append("Session revoked.");
                }}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-card"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-code-border bg-code-bg p-5 font-mono text-xs flex flex-col min-h-[460px]">
        <div className="flex items-center gap-2 pb-3 border-b border-code-border mb-3">
          <KeyRound className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">auth.log</span>
        </div>
        <div className="flex-1 space-y-1.5 overflow-y-auto">
          {log.map((line, i) => (
            <div key={i} className={i === log.length - 1 ? "text-foreground" : "text-muted-foreground"}>
              {line}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="h-3 w-3 animate-spin" /> processing…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----- JWT inspector ----- */

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMmZBM2lYOHFOMyIsImVtYWlsIjoiamFuZUBhY21lLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxOTQwMDAwMCwiZXhwIjoyNTAwMDAwMDAwfQ.7zTQ-LbA7WzG4xRzGd3wFvFi9TZqJpvjvJh5VCK7s4Q";

function JwtTab() {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [decoded, setDecoded] = useState<DecodedJwt | null>(decodeJwt(SAMPLE_JWT));
  const [loadingMine, setLoadingMine] = useState(false);

  useEffect(() => {
    setDecoded(decodeJwt(token));
  }, [token]);

  const loadMyJwt = async () => {
    setLoadingMine(true);
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      setToken(data.session.access_token);
    }
    setLoadingMine(false);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
      <div className="rounded-2xl border border-border bg-card/60 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Token</div>
          <button
            onClick={loadMyJwt}
            disabled={loadingMine}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            {loadingMine ? "loading…" : "Use my session token"}
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 rounded-md bg-code-bg border border-code-border focus:border-primary outline-none text-xs font-mono break-all resize-none"
        />
        {decoded ? (
          <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono">
            <Span color="text-destructive">header</Span>
            <Span color="text-primary">payload</Span>
            <Span color="text-success">signature</Span>
          </div>
        ) : (
          <p className="mt-3 text-xs text-destructive">Invalid JWT — must be three base64url segments separated by dots.</p>
        )}
      </div>

      <div className="space-y-4">
        <Block title="Header" color="text-destructive" json={decoded?.header} />
        <Block title="Payload" color="text-primary" json={decoded?.payload} extra={formatExp(decoded?.payload?.exp)} />
        <div className="rounded-2xl border border-border bg-card/60 p-5">
          <div className="text-sm font-semibold text-success mb-2">Signature</div>
          <p className="text-xs text-muted-foreground">
            Verified server-side with your <code className="text-foreground">JWT_SECRET</code>. The browser cannot trust
            an unverified signature — never make authorization decisions from decoded claims alone.
          </p>
        </div>
      </div>
    </div>
  );
}

function Span({ children, color }: { children: React.ReactNode; color: string }) {
  return <div className={`text-center ${color}`}>{children}</div>;
}

function Block({
  title,
  color,
  json,
  extra,
}: {
  title: string;
  color: string;
  json: unknown;
  extra?: string;
}) {
  const text = json ? JSON.stringify(json, null, 2) : "—";
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="flex items-center justify-between mb-2">
        <div className={`text-sm font-semibold ${color}`}>{title}</div>
        {json !== undefined && json !== null && <CopyButton value={text} />}
      </div>
      <pre className="text-xs font-mono bg-code-bg border border-code-border rounded-md p-3 overflow-x-auto max-h-48">
        {text}
      </pre>
      {extra && <p className="mt-2 text-[11px] font-mono text-muted-foreground">{extra}</p>}
    </div>
  );
}

/* ----- RBAC simulator ----- */

const RESOURCES = [
  { id: "view_billing", label: "View billing", roles: ["admin", "owner"] },
  { id: "edit_team", label: "Edit team members", roles: ["admin", "owner"] },
  { id: "create_post", label: "Create posts", roles: ["admin", "editor", "owner"] },
  { id: "comment", label: "Comment", roles: ["admin", "editor", "user", "owner"] },
  { id: "delete_account", label: "Delete account", roles: ["owner"] },
];

function RbacTab() {
  const [role, setRole] = useState<string>("user");
  const allRoles = ["user", "editor", "admin", "owner"];

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      <div className="rounded-2xl border border-border bg-card/60 p-5 h-fit">
        <div className="text-sm font-semibold mb-3">Simulate role</div>
        <div className="space-y-1.5">
          {allRoles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-mono transition-colors ${
                role === r
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">
          Roles are stored in a separate <code className="text-primary">user_roles</code> table and checked via the{" "}
          <code className="text-primary">has_role()</code> security-definer function.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
        <div className="px-5 py-3 border-b border-border text-xs font-mono text-muted-foreground grid grid-cols-[1fr_auto] gap-3">
          <span>RESOURCE</span>
          <span>ACCESS</span>
        </div>
        {RESOURCES.map((r, i) => {
          const allowed = r.roles.includes(role);
          return (
            <div
              key={r.id}
              className={`px-5 py-3 grid grid-cols-[1fr_auto] items-center gap-3 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div>
                <div className="text-sm font-medium">{r.label}</div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  has_role(auth.uid(), '{r.roles[0]}'…)
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-[11px] font-mono ${
                  allowed
                    ? "bg-success/15 text-success ring-1 ring-success/30"
                    : "bg-destructive/10 text-destructive ring-1 ring-destructive/30"
                }`}
              >
                {allowed ? "allowed" : "denied"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----- Snippets ----- */

const SNIPPETS = {
  curl: `curl -X POST https://api.acme.com/auth/signin \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "jane@acme.com",
    "password": "••••••••"
  }'`,
  js: `import { createAuth } from "next-auth-toolkit";

const auth = createAuth({
  providers: ["google", "github", "email"],
  secret: process.env.AUTH_SECRET,
});

const session = await auth.signIn({
  provider: "email",
  email: "jane@acme.com",
  password: "••••••••",
});`,
  react: `import { useSession, useSignIn } from "next-auth-toolkit/react";

export function LoginButton() {
  const { session, loading } = useSession();
  const signIn = useSignIn();

  if (loading) return <Spinner />;
  if (session) return <p>Hi, {session.user.email}</p>;

  return (
    <button onClick={() => signIn("google")}>
      Sign in with Google
    </button>
  );
}`,
  server: `import { getSession } from "next-auth-toolkit/server";

export async function loader({ request }) {
  const session = await getSession(request);
  if (!session) throw redirect("/login");
  return { user: session.user };
}`,
};

function SnippetsTab() {
  const [lang, setLang] = useState<keyof typeof SNIPPETS>("js");
  const tabs: { id: keyof typeof SNIPPETS; label: string }[] = [
    { id: "curl", label: "cURL" },
    { id: "js", label: "TypeScript" },
    { id: "react", label: "React" },
    { id: "server", label: "Server" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex flex-wrap gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setLang(t.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              lang === t.id
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <pre className="text-xs font-mono bg-code-bg p-5 overflow-x-auto leading-relaxed">{SNIPPETS[lang]}</pre>
        <div className="absolute top-3 right-3">
          <CopyButton value={SNIPPETS[lang]} />
        </div>
      </div>
    </div>
  );
}
