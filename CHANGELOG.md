# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- API key management in the dashboard (create, hash, prefix display, revoke).
- Security score card with actionable factors.
- Audit log filters (all / auth / security).
- Live JWT inspector with "use my session token".
- RBAC simulator across mock roles.
- Code-snippet tab with cURL / TypeScript / React / server-side examples.
- Forgot password and reset password routes.
- Password strength meter with leaked-password heuristics.
- Email verification waiting state.

### Changed

- Auth page now shows password visibility toggle and contextual autocomplete hints.
- Dashboard restructured into Session / Roles / Security / MFA / Device cards.

### Security

- API keys stored as SHA-256 hashes; plaintext shown once, never persisted.

## [1.0.0] — 2026-06-25

### Added

- Initial public release.
- Email/password authentication.
- Google, GitHub, Discord OAuth.
- JWT sessions with auto-refresh.
- RBAC via `user_roles` table and `has_role()` security definer function.
- Audit log table with RLS.
- Marketing site, documentation, interactive playground.
- Authenticated dashboard.
