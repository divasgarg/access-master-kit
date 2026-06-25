import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Shield, LogOut, Activity, KeyRound, User as UserIcon, Mail, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — next-auth-toolkit" },
      { name: "description", content: "Your authenticated session, role, and audit log." },
    ],
  }),
  component: Dashboard,
});

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
}
interface AuditLog {
  id: string;
  event: string;
  detail: Record<string, unknown>;
  created_at: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const profileQ = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });

  const rolesQ = useQuery({
    queryKey: ["roles", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as string);
    },
  });

  const auditQ = useQuery({
    queryKey: ["audit", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, event, detail, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as AuditLog[];
    },
  });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const initials = (profileQ.data?.display_name || user.email || "?").slice(0, 2).toUpperCase();
  const sessionExpires = user.app_metadata.provider === "email" ? "30 days (JWT)" : "1 hour, auto-refresh";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-10 flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {profileQ.data?.avatar_url ? (
              <img src={profileQ.data.avatar_url} alt="" className="h-14 w-14 rounded-full ring-2 ring-primary/30" />
            ) : (
              <div className="h-14 w-14 rounded-full bg-primary/15 ring-2 ring-primary/30 flex items-center justify-center font-display text-lg font-semibold text-primary">
                {initials}
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                Welcome, {profileQ.data?.display_name || user.email?.split("@")[0]}
              </h1>
              <p className="text-sm text-muted-foreground font-mono">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-card text-sm transition-colors self-start"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card icon={UserIcon} title="Session">
            <Row label="User ID"><code className="text-[10px] font-mono">{user.id}</code></Row>
            <Row label="Provider">{user.app_metadata.provider ?? "email"}</Row>
            <Row label="Expires"><span className="text-success">{sessionExpires}</span></Row>
            <Row label="Email verified">{user.email_confirmed_at ? <CheckCircle2 className="h-3.5 w-3.5 text-success inline" /> : "no"}</Row>
          </Card>

          <Card icon={KeyRound} title="Roles (RBAC)">
            {rolesQ.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {(rolesQ.data ?? []).map((r) => (
                  <span key={r} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono ring-1 ring-primary/25">
                    {r}
                  </span>
                ))}
                {(rolesQ.data ?? []).length === 0 && <span className="text-xs text-muted-foreground">No roles</span>}
              </div>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Roles live in a separate <code className="text-primary">user_roles</code> table and are checked via the
              security-definer <code className="text-primary">has_role()</code> function to prevent privilege escalation.
            </p>
          </Card>

          <Card icon={Shield} title="Security">
            <Row label="JWT"><span className="text-success">Active</span></Row>
            <Row label="RLS"><CheckCircle2 className="h-3.5 w-3.5 text-success inline" /> enforced</Row>
            <Row label="2FA"><span className="text-muted-foreground">Available</span></Row>
            <Row label="Passkey"><span className="text-muted-foreground">Available</span></Row>
          </Card>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <div className="font-semibold">Audit log</div>
            <span className="text-xs text-muted-foreground font-mono ml-auto">last 20 events</span>
          </div>
          <div>
            {auditQ.isLoading && <div className="p-5"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>}
            {auditQ.data?.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No events yet. Sign out and back in to record one.
              </div>
            )}
            {(auditQ.data ?? []).map((log, i) => (
              <div key={log.id} className={`px-5 py-3 grid grid-cols-[1fr_auto] items-center gap-3 ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-success/15 ring-1 ring-success/40 flex items-center justify-center">
                    <Mail className="h-3 w-3 text-success" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium capitalize">{log.event.replace(/_/g, " ")}</div>
                    {Object.keys(log.detail).length > 0 && (
                      <div className="text-xs text-muted-foreground font-mono truncate">
                        {JSON.stringify(log.detail)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 shrink-0">
                  <Clock className="h-3 w-3" />
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="font-semibold mb-1">You're using a real auth flow.</div>
          <p className="text-sm text-muted-foreground">
            This dashboard is gated by a TanStack route guard, your session is a real JWT, and every query is filtered
            by RLS using <code className="text-primary">auth.uid()</code>. Head back to{" "}
            <Link to="/docs" className="text-primary hover:underline">the docs</Link> to see how to wire the same flow
            into your own app.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Card({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-md bg-primary/10 ring-1 ring-primary/25 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="font-semibold text-sm">{title}</div>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-muted-foreground font-mono uppercase tracking-wider">{label}</span>
      <span className="font-mono">{children}</span>
    </div>
  );
}
