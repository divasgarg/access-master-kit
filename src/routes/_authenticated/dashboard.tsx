import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ApiKeysPanel } from "@/components/api-keys-panel";
import { SecurityScoreCard, type SecurityFactor } from "@/components/security-score";
import { CopyButton } from "@/components/copy-button";
import {
  Shield,
  LogOut,
  Activity,
  User as UserIcon,
  Mail,
  Clock,
  Loader2,
  CheckCircle2,
  Smartphone,
  Fingerprint,
  Link2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import type { Session, User } from "@supabase/supabase-js";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — next-auth-toolkit" },
      { name: "description", content: "Inspect your session, manage API keys, audit logs, and security posture." },
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
  user_agent: string | null;
  created_at: string;
}

type Filter = "all" | "auth" | "security";

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
    });
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
        .select("id, event, detail, user_agent, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as AuditLog[];
    },
  });

  const filteredLogs = useMemo(() => {
    const all = auditQ.data ?? [];
    if (filter === "all") return all;
    if (filter === "auth") return all.filter((l) => /signin|signup|signout|signed/.test(l.event));
    return all.filter((l) => /security|password|mfa|key|revoked/.test(l.event));
  }, [auditQ.data, filter]);

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  if (!user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const initials = (profileQ.data?.display_name || user.email || "?").slice(0, 2).toUpperCase();
  const provider = user.app_metadata.provider ?? "email";
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;
  const identities = user.identities ?? [];

  const factors: SecurityFactor[] = [
    { label: "Email verified", ok: !!user.email_confirmed_at, hint: "Check your inbox for a verification link." },
    { label: "Strong password / OAuth", ok: provider !== "email" || !!user.email_confirmed_at },
    { label: "Recent sign-in (last 30 days)", ok: !!lastSignIn && Date.now() - lastSignIn.getTime() < 30 * 86400_000 },
    { label: "Audit logging enabled", ok: (auditQ.data?.length ?? 0) > 0, hint: "We'll start logging after your first event." },
    { label: "MFA enabled", ok: false, hint: "Coming soon — passkeys and TOTP." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-10 flex-1">
        {/* Header */}
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 mb-8 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            {profileQ.data?.avatar_url ? (
              <img src={profileQ.data.avatar_url} alt="" className="h-14 w-14 shrink-0 rounded-full ring-2 ring-primary/30" />
            ) : (
              <div className="h-14 w-14 shrink-0 rounded-full bg-primary/15 ring-2 ring-primary/30 flex items-center justify-center font-display text-lg font-semibold text-primary">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-semibold tracking-tight">
                Welcome, {profileQ.data?.display_name || user.email?.split("@")[0]}
              </h1>
              <p className="truncate text-sm text-muted-foreground font-mono">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex shrink-0 items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-card text-sm transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </header>

        {/* Top row: session / roles / security score */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-md bg-primary/10 ring-1 ring-primary/25 flex items-center justify-center">
                <UserIcon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="font-semibold text-sm">Active session</div>
            </div>
            <dl className="space-y-1.5 text-xs">
              <Row label="User ID">
                <code className="text-[10px] font-mono">{user.id.slice(0, 8)}…</code>
                <CopyButton value={user.id} label="" className="ml-1" />
              </Row>
              <Row label="Provider">{provider}</Row>
              <Row label="Last sign-in">{lastSignIn ? lastSignIn.toLocaleString() : "—"}</Row>
              <Row label="Email verified">
                {user.email_confirmed_at ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-success inline" />
                ) : (
                  <span className="text-warning">pending</span>
                )}
              </Row>
              <Row label="Token expires">
                <span className="text-success">
                  {session.expires_at
                    ? new Date(session.expires_at * 1000).toLocaleTimeString()
                    : "—"}
                </span>
              </Row>
            </dl>
            <div className="mt-4 pt-3 border-t border-border">
              <Link
                to="/playground"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Inspect this JWT in the playground →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-md bg-primary/10 ring-1 ring-primary/25 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="font-semibold text-sm">Roles & connected accounts</div>
            </div>
            <div className="mb-3">
              <div className="text-[11px] font-mono text-muted-foreground mb-1.5">RBAC</div>
              {rolesQ.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(rolesQ.data ?? []).map((r) => (
                    <span
                      key={r}
                      className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono ring-1 ring-primary/25"
                    >
                      {r}
                    </span>
                  ))}
                  {(rolesQ.data ?? []).length === 0 && (
                    <span className="text-xs text-muted-foreground">No roles assigned</span>
                  )}
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-border">
              <div className="text-[11px] font-mono text-muted-foreground mb-1.5">CONNECTED PROVIDERS</div>
              {identities.length === 0 ? (
                <span className="text-xs text-muted-foreground">None</span>
              ) : (
                <ul className="space-y-1">
                  {identities.map((id) => (
                    <li key={id.id} className="flex items-center gap-2 text-xs">
                      <Link2 className="h-3 w-3 text-muted-foreground" />
                      <span className="capitalize">{id.provider}</span>
                      <span className="text-muted-foreground font-mono truncate">{id.identity_data?.email as string ?? ""}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <SecurityScoreCard factors={factors} />
        </div>

        {/* MFA + devices */}
        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-md bg-primary/10 ring-1 ring-primary/25 flex items-center justify-center">
                <Fingerprint className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="font-semibold text-sm">Multi-factor authentication</div>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                roadmap
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Passkeys (WebAuthn) and TOTP are planned for v1.1. The schema and policies are already in place; the
              enrollment UI lands next. Track progress in{" "}
              <Link to="/docs/changelog" className="text-primary hover:underline">
                the changelog
              </Link>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-md bg-primary/10 ring-1 ring-primary/25 flex items-center justify-center">
                <Smartphone className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="font-semibold text-sm">This device</div>
            </div>
            <div className="text-xs space-y-1.5">
              <Row label="User agent">
                <span className="font-mono truncate max-w-[12rem] inline-block align-bottom">
                  {typeof navigator !== "undefined" ? navigator.userAgent.split(" ").slice(-2).join(" ") : "—"}
                </span>
              </Row>
              <Row label="Issued at">
                {session.expires_at
                  ? new Date(session.expires_at * 1000 - 3600_000).toLocaleString()
                  : "—"}
              </Row>
            </div>
            <p className="mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground">
              Multi-device session management ships in v1.1 alongside revoke-everywhere.
            </p>
          </div>
        </div>

        {/* API Keys */}
        <div className="mt-6">
          <ApiKeysPanel userId={user.id} />
        </div>

        {/* Audit log */}
        <div className="mt-6 rounded-2xl border border-border bg-card/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-border grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <Activity className="h-4 w-4 text-primary shrink-0" />
              <div className="font-semibold truncate">Audit log</div>
              <span className="text-xs text-muted-foreground font-mono">last 50 events</span>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-xs">
              <Filter className="h-3 w-3 text-muted-foreground" />
              {(["all", "auth", "security"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded font-mono transition-colors ${
                    filter === f
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            {auditQ.isLoading && (
              <div className="p-5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {filteredLogs.length === 0 && !auditQ.isLoading && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No events match this filter.
              </div>
            )}
            {filteredLogs.map((log, i) => (
              <div
                key={log.id}
                className={`px-5 py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-success/15 ring-1 ring-success/40 flex items-center justify-center">
                    <Mail className="h-3 w-3 text-success" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium capitalize truncate">{log.event.replace(/_/g, " ")}</div>
                    {Object.keys(log.detail).length > 0 && (
                      <div className="text-xs text-muted-foreground font-mono truncate">
                        {JSON.stringify(log.detail)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono flex shrink-0 items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-muted-foreground font-mono uppercase tracking-wider">{label}</span>
      <span className="font-mono min-w-0 truncate">{children}</span>
    </div>
  );
}
