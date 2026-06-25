import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SiteHeader } from "@/components/site-header";
import { Shield, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — next-auth-toolkit" },
      { name: "description", content: "Sign in or create an account to try the live auth playground." },
      { property: "og:title", content: "Sign in" },
      { property: "og:description", content: "Live authentication playground." },
    ],
  }),
  component: AuthPage,
});

const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  // Redirect to dashboard if already signed in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const logAuditEvent = async (event: string, detail: Record<string, string> = {}) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("audit_logs").insert({
      user_id: data.user.id,
      event,
      detail: detail as never,
      user_agent: navigator.userAgent,
    });
  };

  const onCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading("credentials");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        toast.success("Account created — signing you in…");
        await logAuditEvent("signup", { method: "password" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        await logAuditEvent("signin", { method: "password" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(null);
    }
  };

  const onOAuth = async (provider: "google" | "github" | "discord") => {
    setLoading(provider);
    try {
      // GitHub/Discord go through supabase directly; Google goes through Lovable broker.
      if (provider === "google") {
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
        });
        if (result.error) throw result.error;
        if (!result.redirected) {
          await logAuditEvent("signin", { method: "google" });
        }
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "OAuth failed");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30 mb-4">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to access the live auth playground."
                : "Join thousands of developers shipping with next-auth-toolkit."}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="space-y-2">
              <button
                onClick={() => onOAuth("google")}
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border bg-background/60 hover:border-primary/40 hover:bg-card transition-all text-sm font-medium disabled:opacity-50"
              >
                {loading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </button>
              <button
                onClick={() => onOAuth("github")}
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border bg-background/60 hover:border-primary/40 hover:bg-card transition-all text-sm font-medium disabled:opacity-50"
              >
                {loading === "github" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GithubIcon />}
                Continue with GitHub
              </button>
              <button
                onClick={() => onOAuth("discord")}
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border bg-background/60 hover:border-primary/40 hover:bg-card transition-all text-sm font-medium disabled:opacity-50"
              >
                {loading === "discord" ? <Loader2 className="h-4 w-4 animate-spin" /> : <DiscordIcon />}
                Continue with Discord
              </button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-mono text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={onCredentials} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-muted-foreground">EMAIL</label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@acme.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md bg-background border border-border focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground">PASSWORD</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md bg-background border border-border focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>
              <button
                disabled={loading !== null}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading === "credentials" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {mode === "signin" ? "Sign in" : "Create account"}
                {loading !== "credentials" && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary hover:underline"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            By continuing, you agree this is a demo of{" "}
            <Link to="/" className="hover:text-foreground">next-auth-toolkit</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 5c1.6 0 3.1.6 4.2 1.6l3.1-3.1C17.5 1.7 14.9.5 12 .5 7.4.5 3.5 3.1 1.6 7l3.7 2.8C6.2 7 8.9 5 12 5z" />
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.2 2.7-2.6 3.5l3.6 2.8c2.1-1.9 3.3-4.8 3.3-8.5z" />
      <path fill="#FBBC05" d="M5.3 14.2c-.3-.8-.4-1.6-.4-2.5s.1-1.7.4-2.5L1.6 6.4C.6 8.1 0 10 0 12s.6 3.9 1.6 5.6l3.7-3.4z" />
      <path fill="#34A853" d="M12 23.5c3.1 0 5.8-1 7.6-2.8l-3.6-2.8c-1 .7-2.3 1.1-4 1.1-3.1 0-5.8-2.1-6.7-4.9l-3.7 2.8C3.5 20.9 7.4 23.5 12 23.5z" />
    </svg>
  );
}
function GithubIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" /></svg>;
}
function DiscordIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M20.3 4.4A19.6 19.6 0 0 0 15.4 3l-.3.5c1.8.4 2.8 1 3.9 1.8a13.3 13.3 0 0 0-11.7-.4l-.5-.2c-.7.2-1.5.6-2.3 1A19.6 19.6 0 0 0 3.7 4.4a20.6 20.6 0 0 0-3.5 14a14 14 0 0 0 4.2 2.1c.3-.4.6-1 .9-1.5-.5-.2-1-.5-1.4-.8.1-.1.2-.2.4-.2a13.6 13.6 0 0 0 12.5 0l.4.2c-.4.3-.9.5-1.4.8.3.5.6 1 .9 1.5a14 14 0 0 0 4.2-2.1 20.6 20.6 0 0 0-3.6-14zM8.5 15c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9zm7 0c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9c.9 0 1.7.9 1.7 1.9s-.7 1.9-1.7 1.9z" /></svg>;
}
