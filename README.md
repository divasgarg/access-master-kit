<div align="center">

# next-auth-toolkit

**The end-to-end authentication platform for modern web apps.**
Email & password, OAuth (Google · GitHub · Discord), JWT sessions, RBAC, API keys, audit logs — wired into a polished developer dashboard and live playground.

[![License: MIT](https://img.shields.io/badge/license-MIT-amber.svg)](./LICENSE)
[![Built with TanStack](https://img.shields.io/badge/built%20with-TanStack%20Start-0%2C0%2C0?logo=react)](https://tanstack.com/start)
[![Tailwind v4](https://img.shields.io/badge/tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[Live demo](https://access-master-kit.lovable.app) · [Docs](https://access-master-kit.lovable.app/docs) · [Playground](https://access-master-kit.lovable.app/playground) · [Roadmap](./ROADMAP.md)

</div>

---

## Why

Most auth libraries make you stitch together five packages, write your own dashboard, and pray your RBAC table doesn't have a recursive-policy bug. **next-auth-toolkit** ships the full path:

- **Real auth, not boilerplate** — sign-up, sign-in, password reset, email verification, OAuth, sessions, all wired and tested.
- **A dashboard developers actually want** — JWT inspector, API key management, audit logs, RBAC roles, security score.
- **A live playground** — decode any JWT, simulate roles, try every flow without an account.
- **Production-shaped database** — `profiles`, `user_roles`, `audit_logs`, `api_keys` with proper RLS and security-definer functions.

## Features

### Phase 1 — shipped
- Email & password (with strength meter + leaked password check)
- Forgot / reset password flow
- Email verification
- JWT sessions with auto-refresh
- RBAC (separate `user_roles` table + `has_role()` security definer)
- Audit logs with filters

### Phase 2 — shipped
- Google OAuth (managed)
- GitHub OAuth
- Discord OAuth

### Phase 3 — partial
- API keys (create, hash, prefix, revoke) ✅
- Organizations / multi-tenant 🚧

### Phase 4 — roadmap
- Passkeys (WebAuthn)
- TOTP 2FA
- Device management
- CLI + SDK

See [ROADMAP.md](./ROADMAP.md).

## Quick start

```bash
git clone https://github.com/your-org/next-auth-toolkit
cd next-auth-toolkit
bun install
bun dev
```

Open [http://localhost:8080](http://localhost:8080).

The project ships with **Lovable Cloud** (Supabase under the hood) pre-wired. To run against your own Supabase project, replace the values in `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ…
```

Then apply the migrations in `supabase/migrations/`.

## Project layout

```
src/
  routes/                   TanStack Start file-based routing
    _authenticated/         Auth-gated routes (dashboard, etc.)
    auth.tsx                Sign in / sign up
    forgot-password.tsx     Request reset link
    reset-password.tsx      Set new password
    playground.tsx          JWT inspector · RBAC sim · code snippets
  components/               Reusable UI (api-keys-panel, security-score, …)
  lib/                      jwt, api-keys, password utilities
  integrations/supabase/    Auto-generated Supabase client + types
supabase/migrations/        Database schema (profiles, user_roles, audit_logs, api_keys)
```

## Architecture

```
Browser ──► TanStack Start ──► Supabase Auth (JWT)
                │                    │
                │                    ├── public.profiles  (RLS: own row)
                │                    ├── public.user_roles (RLS: own row + has_role)
                │                    ├── public.audit_logs (RLS: own row + admin read)
                │                    └── public.api_keys   (RLS: own row + admin read)
                │
                └─► server functions (createServerFn + requireSupabaseAuth)
```

- Sessions are JWTs minted by Supabase Auth, refreshed automatically.
- Every privileged read is scoped by Postgres Row Level Security keyed on `auth.uid()`.
- API keys are stored as SHA-256 hashes; the plaintext is shown to the user exactly once.

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and our [Code of Conduct](./CODE_OF_CONDUCT.md) before opening a PR.

For security issues, see [SECURITY.md](./SECURITY.md) — please **do not** open a public issue.

## License

[MIT](./LICENSE) © next-auth-toolkit contributors
