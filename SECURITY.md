# Security Policy

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, email **security@next-auth-toolkit.dev** (or use [GitHub Security Advisories](https://github.com/your-org/next-auth-toolkit/security/advisories/new)) with:

- A description of the issue and its potential impact.
- Steps to reproduce, including any proof-of-concept code.
- The affected version(s) and platform.

We will acknowledge your report within **48 hours** and aim to provide a remediation plan within **5 business days**.

## Disclosure policy

- We follow **coordinated disclosure**.
- Once a fix is available, we will publish a security advisory and credit you (unless you prefer to remain anonymous).
- Embargo periods are negotiated case-by-case; we typically aim for a 30–90 day window from confirmation to public disclosure.

## Supported versions

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅        |
| < 1.0   | ❌        |

## Security posture

- **Database access** is gated by Postgres Row Level Security on every user-data table.
- **RBAC** uses a separate `user_roles` table and a `SECURITY DEFINER` `has_role()` function to avoid recursive policies and privilege escalation.
- **API keys** are stored as SHA-256 hashes; the plaintext is shown to the creator exactly once.
- **Sessions** are short-lived JWTs with auto-rotated refresh tokens.
- **Passwords** are checked against [HaveIBeenPwned](https://haveibeenpwned.com/) when enabled in Supabase Auth.

## Known accepted risks

- The audit log table is append-only for users; admins can read but not modify entries. There is no cryptographic chaining yet — planned for v1.2.

Thank you for helping keep next-auth-toolkit and its users safe.
