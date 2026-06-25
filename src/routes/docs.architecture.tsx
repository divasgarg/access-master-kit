import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";

export const Route = createFileRoute("/docs/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture — next-auth-toolkit" },
      { name: "description", content: "System architecture, auth flow, session lifecycle, JWT lifecycle, RBAC model, and database schema." },
      { property: "og:title", content: "Architecture" },
      { property: "og:description", content: "How the system fits together." },
    ],
  }),
  component: ArchitecturePage,
});

function Diagram({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="my-6 rounded-xl border border-border bg-card/40 p-5">
      <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-foreground/90">
{children}
      </pre>
      <figcaption className="mt-3 text-xs text-muted-foreground">{title}</figcaption>
    </figure>
  );
}

function ArchitecturePage() {
  return (
    <article>
      <div className="chip mb-4">Concepts</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Architecture</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        A bird's-eye view of how next-auth-toolkit fits together — request flow, session lifecycle,
        JWT lifecycle, RBAC, and the underlying database schema.
      </p>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">System overview</h2>
      <p className="text-muted-foreground">
        The toolkit is split into three layers: a framework-agnostic core, framework adapters
        (Next.js, Remix, TanStack Start), and pluggable database adapters.
      </p>
      <Diagram title="High-level component layout">
{`            ┌──────────────────────────────────────────────┐
            │                Your application              │
            │  React hooks · server helpers · middleware   │
            └───────────────────────┬──────────────────────┘
                                    │
            ┌───────────────────────▼──────────────────────┐
            │             Framework adapter                │
            │   Next.js │ Remix │ TanStack Start │ Nuxt    │
            └───────────────────────┬──────────────────────┘
                                    │
            ┌───────────────────────▼──────────────────────┐
            │                    Core                      │
            │  providers · sessions · JWT · RBAC · audit   │
            └─────┬───────────────┬──────────────────┬─────┘
                  │               │                  │
            ┌─────▼─────┐   ┌─────▼─────┐     ┌──────▼─────┐
            │ Adapter   │   │ Rate-limit│     │ Audit sink │
            │ (Postgres)│   │ (Redis)   │     │ (Postgres) │
            └───────────┘   └───────────┘     └────────────┘`}
      </Diagram>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">Authentication flow</h2>
      <p className="text-muted-foreground">
        An email/password sign-in walks through validation, password verification, session creation,
        and cookie issuance.
      </p>
      <Diagram title="Email/password sign-in (happy path)">
{`  Browser            App / Adapter         Core              Database
    │                    │                    │                    │
    │ POST /signin       │                    │                    │
    ├───────────────────▶│                    │                    │
    │                    │ validate(input)    │                    │
    │                    ├───────────────────▶│                    │
    │                    │                    │ fetch user         │
    │                    │                    ├───────────────────▶│
    │                    │                    │◀───────────────────┤
    │                    │                    │ verify password    │
    │                    │                    │ rate-limit check   │
    │                    │                    │ create session     │
    │                    │                    ├───────────────────▶│
    │                    │                    │ sign JWT           │
    │                    │◀───────────────────┤                    │
    │ Set-Cookie: jwt    │                    │                    │
    │◀───────────────────┤                    │                    │
    │                    │                    │ audit log          │
    │                    │                    ├───────────────────▶│`}
      </Diagram>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">Session lifecycle</h2>
      <p className="text-muted-foreground">
        Sessions are issued at sign-in, validated on every request, refreshed automatically before
        expiry, and revoked on sign-out or admin action.
      </p>
      <Diagram title="Session state machine">
{`     ┌─────────┐  sign-in ok   ┌─────────┐  near expiry  ┌──────────┐
     │  none   ├──────────────▶│ active  ├──────────────▶│ refresh  │
     └─────────┘               └────┬────┘               └─────┬────┘
          ▲                         │                          │
          │       sign-out          │      refresh ok          │
          └─────────────────────────┴──────────────────────────┘
                                    │
                                    │ inactivity / revoke
                                    ▼
                              ┌──────────┐
                              │ revoked  │
                              └──────────┘`}
      </Diagram>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">JWT lifecycle</h2>
      <p className="text-muted-foreground">
        Access tokens are short-lived (15 minutes by default). Refresh tokens rotate on every use
        and are revoked on reuse, mitigating token theft.
      </p>
      <CodeBlock filename="claims.json" lang="json" code={`{
  "sub": "usr_01HXYZ...",
  "email": "ada@example.com",
  "roles": ["admin", "billing"],
  "sid": "ses_01HXYZ...",
  "iat": 1735128000,
  "exp": 1735128900
}`} />

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">RBAC model</h2>
      <p className="text-muted-foreground">
        Roles are stored in a dedicated <code className="font-mono text-primary">user_roles</code>{" "}
        table — never on the user record — to prevent privilege-escalation via a profile update.
      </p>
      <Diagram title="Roles, permissions, and resources">
{`    user ──hasMany──▶ user_role ──belongsTo──▶ role
                                                 │
                                                 ▼
                                            permissions
                                                 │
                                                 ▼
                                              resource`}
      </Diagram>
      <CodeBlock filename="rbac.sql" lang="sql" code={`-- Security-definer function used by RLS policies on every protected table
create or replace function public.has_role(_user uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user and role = _role
  );
$$;`} />

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">API key flow</h2>
      <p className="text-muted-foreground">
        API keys are generated with a public prefix and a 192-bit random body. Only a SHA-256 hash
        of the full key is stored; the plaintext is shown to the user exactly once.
      </p>
      <Diagram title="Issue → verify → revoke">
{`  create()  ─▶  nak_live_<prefix>_<body>           shown once
                       │
                       ▼
                  sha256(key)  ─▶  api_keys.hash    stored
                                          │
  verify(key) ─▶ sha256 ─▶ lookup ◀───────┘
                              │
                              ▼
                       check revoked_at`}
      </Diagram>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">Database schema</h2>
      <p className="text-muted-foreground">
        The minimum schema used by the toolkit. Every table is RLS-protected and follows the same
        pattern: an owner column, a security-definer helper, and explicit policies.
      </p>
      <CodeBlock filename="schema.sql" lang="sql" code={`-- Roles
create type app_role as enum ('admin', 'moderator', 'user');

-- Role assignments (separate table — never on users)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);

-- API keys (hash only, plaintext is never persisted)
create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  prefix text not null,
  key_hash text not null unique,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- Audit log (append-only)
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);`} />

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Row-Level Security model</h2>
      <p className="text-muted-foreground">
        Every public table is RLS-enabled. Reads are restricted to the row owner or an admin (via{" "}
        <code className="font-mono text-primary">has_role()</code>); writes additionally require the
        owner to match <code className="font-mono text-primary">auth.uid()</code>.
      </p>
      <CodeBlock filename="policies.sql" lang="sql" code={`alter table public.api_keys enable row level security;

create policy "owner_or_admin_select"
  on public.api_keys for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "owner_insert"
  on public.api_keys for insert to authenticated
  with check (user_id = auth.uid());

create policy "owner_update_revoke"
  on public.api_keys for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());`} />
    </article>
  );
}
