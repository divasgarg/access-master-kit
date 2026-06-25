// Single source of truth for documentation pages.
// Drives the sidebar, search index, and prev/next navigation.

export interface DocPage {
  to: string;
  title: string;
  description: string;
  section: string;
  /** Keywords for the search index (free text). */
  keywords?: string;
}

export const DOC_SECTIONS = [
  "Getting Started",
  "Concepts",
  "Security",
  "Reference",
  "Guides",
  "Community",
] as const;

export const DOC_PAGES: DocPage[] = [
  {
    to: "/docs",
    title: "Introduction",
    description: "What next-auth-toolkit is and why we built it.",
    section: "Getting Started",
    keywords: "intro overview welcome",
  },
  {
    to: "/docs/getting-started",
    title: "Quickstart",
    description: "Install, configure, and ship auth in 5 minutes.",
    section: "Getting Started",
    keywords: "install setup quickstart cli init",
  },
  {
    to: "/docs/architecture",
    title: "Architecture",
    description: "System design, auth flow, session and JWT lifecycle.",
    section: "Concepts",
    keywords: "architecture diagram flow lifecycle design",
  },
  {
    to: "/docs/oauth",
    title: "OAuth Providers",
    description: "Google, GitHub, Apple, Microsoft, Discord and custom providers.",
    section: "Concepts",
    keywords: "oauth google github apple microsoft discord providers social",
  },
  {
    to: "/docs/security",
    title: "Security primitives",
    description: "Sessions, JWT, 2FA, passkeys, CSRF, rate limiting, audit logs.",
    section: "Security",
    keywords: "security session jwt 2fa totp passkey webauthn csrf rate limit audit",
  },
  {
    to: "/docs/best-practices",
    title: "Best Practices",
    description: "Production checklist, secret rotation, session hardening, RBAC modeling.",
    section: "Security",
    keywords: "best practices production checklist hardening rotation",
  },
  {
    to: "/docs/troubleshooting",
    title: "Troubleshooting",
    description: "Fixes for the most common errors and edge cases.",
    section: "Guides",
    keywords: "troubleshoot errors debug fix common issues",
  },
  {
    to: "/docs/migration",
    title: "Migration Guide",
    description: "Move from Auth.js, Clerk, or a rolled-your-own auth.",
    section: "Guides",
    keywords: "migration migrate authjs clerk move switch",
  },
  {
    to: "/api",
    title: "API Reference",
    description: "Every function, hook, and component, fully typed.",
    section: "Reference",
    keywords: "api reference hooks functions components types",
  },
  {
    to: "/docs/faq",
    title: "FAQ",
    description: "Answers to the most common questions.",
    section: "Community",
    keywords: "faq questions answers",
  },
  {
    to: "/docs/changelog",
    title: "Changelog",
    description: "Release notes and breaking changes.",
    section: "Community",
    keywords: "changelog releases versions notes",
  },
  {
    to: "/docs/contributing",
    title: "Contributing",
    description: "How to file issues, open PRs, and add providers.",
    section: "Community",
    keywords: "contributing pr github issues community",
  },
];

export function findPageIndex(pathname: string): number {
  return DOC_PAGES.findIndex((p) => p.to === pathname);
}

export function getPrevNext(pathname: string): { prev?: DocPage; next?: DocPage } {
  const i = findPageIndex(pathname);
  if (i === -1) return {};
  return { prev: DOC_PAGES[i - 1], next: DOC_PAGES[i + 1] };
}

export function groupedPages(): { section: string; items: DocPage[] }[] {
  return DOC_SECTIONS.map((section) => ({
    section,
    items: DOC_PAGES.filter((p) => p.section === section),
  })).filter((g) => g.items.length > 0);
}
