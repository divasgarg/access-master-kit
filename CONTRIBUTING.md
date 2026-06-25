# Contributing to next-auth-toolkit

Thanks for taking the time to contribute! This project is built in the open and every PR — from typo fixes to new providers — is welcome.

## Code of Conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Getting set up

```bash
bun install
bun dev
```

The app runs on `http://localhost:8080`.

Tests, typecheck, and lint:

```bash
bun run lint        # ESLint
bun run typecheck   # tsgo --noEmit
bun run test        # vitest (when present)
```

The CI workflow runs these on every PR — please make sure they pass locally first.

## Branching & commits

- Base branches off `main`.
- One change per PR. Small PRs get reviewed faster than big ones.
- Use [Conventional Commits](https://www.conventionalcommits.org/) where possible:
  - `feat: add passkey enrollment flow`
  - `fix: reset password loops when recovery hash is stale`
  - `docs: expand RBAC section in /docs/security`

## Architectural conventions

- **Routes** live under `src/routes/` (TanStack file-based routing). Place auth-protected pages under `src/routes/_authenticated/`.
- **Components** are small, focused, and prop-driven. Avoid prop drilling — lift state or use a tiny context.
- **Design tokens** live in `src/styles.css`. Never hardcode hex colors in components; use `text-foreground`, `bg-primary`, etc.
- **Database access** goes through `@/integrations/supabase/client` (browser) or `requireSupabaseAuth` (server). Never import the admin client at module scope.
- **Migrations** are append-only. Add a new file under `supabase/migrations/`; never edit a shipped one.
- **Input validation** uses Zod, on both client and server.

## Adding a provider

1. Add the provider button to `src/routes/auth.tsx`.
2. If it's an OAuth provider, wire `supabase.auth.signInWithOAuth({ provider })` or — for Google — `lovable.auth.signInWithOAuth("google", …)`.
3. Add a row to the docs page (`src/routes/docs.oauth.tsx`).
4. Add a screenshot to your PR description showing the flow working.

## Tests

We aim for high coverage on:

- Pure utilities in `src/lib/` (jwt decoder, password scorer, api-key hashing).
- Critical route guards (`_authenticated`).
- RBAC policies (Postgres-side `has_role()` regression tests).

When adding a feature, write the test first when you can.

## Releasing

Maintainers tag releases with `v<major>.<minor>.<patch>`. The changelog is updated as part of the release PR.

## Questions?

Open a [Discussion](https://github.com/your-org/next-auth-toolkit/discussions) or drop into our community channel. We're friendly.
