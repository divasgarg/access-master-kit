import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Shield, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { PasswordField } from "@/components/password-field";
import { scorePassword } from "@/lib/password";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set new password — next-auth-toolkit" },
      { name: "description", content: "Choose a new password to finish account recovery." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  // Supabase places a recovery session in the hash. onAuthStateChange fires
  // PASSWORD_RECOVERY which lets us know it's safe to call updateUser.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (scorePassword(password).score < 2) {
      toast.error("Pick a stronger password");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      toast.success("Password updated");
      setTimeout(() => navigate({ to: "/dashboard", replace: true }), 1200);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setLoading(false);
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
            <h1 className="font-display text-3xl font-semibold tracking-tight">Set a new password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {ready ? "Choose something only you can remember." : "Verifying recovery link…"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-6">
            {done ? (
              <div className="flex flex-col items-center text-center gap-3">
                <CheckCircle2 className="h-10 w-10 text-success" />
                <p className="text-sm text-muted-foreground">Redirecting you to the dashboard…</p>
              </div>
            ) : ready ? (
              <form onSubmit={onSubmit} className="space-y-3">
                <div>
                  <label htmlFor="new-password" className="text-xs font-mono text-muted-foreground">
                    NEW PASSWORD
                  </label>
                  <div className="mt-1">
                    <PasswordField
                      id="new-password"
                      value={password}
                      onChange={setPassword}
                      autoComplete="new-password"
                      showStrength
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="text-xs font-mono text-muted-foreground">
                    CONFIRM PASSWORD
                  </label>
                  <div className="mt-1">
                    <PasswordField
                      id="confirm-password"
                      value={confirm}
                      onChange={setConfirm}
                      autoComplete="new-password"
                      placeholder="Repeat your new password"
                    />
                  </div>
                </div>
                <button
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Update password
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
