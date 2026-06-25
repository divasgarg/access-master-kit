# Roadmap

This roadmap is a living document. Priorities shift based on community feedback — open a Discussion if you want to weigh in.

## v1.0 — Foundation (shipped)

- [x] Email/password auth with strength meter and HIBP check
- [x] Forgot password + reset password flows
- [x] Email verification flow
- [x] Google OAuth (managed)
- [x] GitHub OAuth
- [x] Discord OAuth
- [x] JWT sessions with auto-refresh
- [x] RBAC (separate `user_roles` table + `has_role()`)
- [x] Audit logs with filters
- [x] API keys (create / hash / prefix / revoke)
- [x] Security score in dashboard
- [x] Live JWT inspector + RBAC simulator + code snippets
- [x] Polished marketing site and documentation
- [x] Open-source readiness (LICENSE, CONTRIBUTING, SECURITY, CoC, CI)

## v1.1 — MFA & device management

- [ ] WebAuthn passkey enrollment
- [ ] TOTP enrollment and verification
- [ ] Backup codes
- [ ] Multi-device session list with revoke-everywhere
- [ ] Recovery email flow

## v1.2 — Organizations & teams

- [ ] Organizations and team membership tables
- [ ] Org-scoped RBAC
- [ ] Invites with email tokens
- [ ] Audit log chaining (hash links between rows)

## v1.3 — CLI & SDK

- [ ] `npx next-auth-toolkit init` scaffolder
- [ ] Standalone `@next-auth-toolkit/sdk` package
- [ ] Framework adapters (Next.js, Remix, SvelteKit)

## v2.0 — Self-hosted

- [ ] Drop-in self-hosted server (Node, Workers)
- [ ] Adapter interface for Postgres, MySQL, SQLite
- [ ] Migration guide from Auth.js / Clerk / Better Auth

## Out of scope (for now)

- SAML SSO and SCIM — possible later if there is demand.
- A hosted SaaS — this project is and will remain self-hostable open source.
