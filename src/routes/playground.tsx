import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useState } from "react";
import { Mail, KeyRound, Fingerprint, Loader2, Check, Shield, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground — next-auth-toolkit" },
      { name: "description", content: "Try every authentication flow in next-auth-toolkit interactively — no signup required." },
      { property: "og:title", content: "Auth Playground" },
      { property: "og:description", content: "Try every auth flow live in your browser." },
    ],
  }),
  component: Playground,
});

type Flow = "menu" | "email" | "otp" | "passkey" | "success";

const providerButtons = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
  { id: "apple", label: "Continue with Apple" },
];

function Playground() {
  const [flow, setFlow] = useState<Flow>("menu");
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [log, setLog] = useState<string[]>([
    "▸ Playground ready. Pick a flow to simulate the auth lifecycle.",
  ]);

  const append = (line: string) =>
    setLog((l) => [...l, `${new Date().toLocaleTimeString()} · ${line}`].slice(-12));

  const simulate = async (id: string, ms = 1100) => {
    setLoading(id);
    append(`POST /api/auth/${id} — sending request`);
    await new Promise((r) => setTimeout(r, ms));
    append(`200 OK — issued session token (jwt, exp +30d)`);
    setLoading(null);
  };

  const onProvider = async (id: string) => {
    await simulate(id);
    setFlow("success");
  };

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await simulate("email-otp");
    append(`Sent 6-digit code to ${email}`);
    setFlow("otp");
  };

  const onOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    await simulate("verify-otp", 800);
    setFlow("success");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-12">
        <div className="max-w-3xl">
          <div className="chip mb-4">Interactive</div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Playground</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Try every authentication flow live. This is a sandbox — no data is sent to a server.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-[1fr_420px] gap-6">
          {/* Auth card */}
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
                className="self-start mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> back
              </button>
            )}

            {flow === "menu" && (
              <>
                <h2 className="font-display text-2xl font-semibold">Sign in to continue</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose your preferred method.</p>

                <div className="mt-6 space-y-2">
                  {providerButtons.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onProvider(p.id)}
                      disabled={loading !== null}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border bg-background/60 hover:border-primary/40 hover:bg-card transition-all text-sm font-medium disabled:opacity-50"
                    >
                      {loading === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {p.label}
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
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-border bg-background/60 hover:border-primary/40 transition-all text-sm"
                  >
                    <Mail className="h-4 w-4" /> Email OTP
                  </button>
                  <button
                    onClick={() => setFlow("passkey")}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-border bg-background/60 hover:border-primary/40 transition-all text-sm"
                  >
                    <Fingerprint className="h-4 w-4" /> Passkey
                  </button>
                </div>
              </>
            )}

            {flow === "email" && (
              <form onSubmit={onEmail} className="flex-1 flex flex-col">
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
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Send code
                </button>
              </form>
            )}

            {flow === "otp" && (
              <form onSubmit={onOtp} className="flex-1 flex flex-col">
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
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Verify
                </button>
              </form>
            )}

            {flow === "passkey" && (
              <div className="flex-1 flex flex-col">
                <h2 className="font-display text-2xl font-semibold">Sign in with a passkey</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use your fingerprint, face, or hardware key.
                </p>
                <div className="flex-1 flex items-center justify-center">
                  <button
                    onClick={async () => { await simulate("passkey", 1400); setFlow("success"); }}
                    disabled={loading !== null}
                    className="group h-32 w-32 rounded-full border-2 border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all flex items-center justify-center disabled:opacity-50"
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
                  This was a simulation. Want to try the real thing? Sign up below and you'll get a real JWT session,
                  a row in the database, and an audit log.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all"
                  >
                    Try real auth
                  </Link>
                  <button
                    onClick={() => { setFlow("menu"); setEmail(""); setOtp(""); append("Session revoked."); }}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-card transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Console */}
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
      </main>
      <SiteFooter />
    </div>
  );
}
