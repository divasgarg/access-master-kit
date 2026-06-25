import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowUpRight, LayoutDashboard, MessageSquare, ShoppingBag, Building2, Newspaper, Users, GraduationCap, Stethoscope, Briefcase, Network } from "lucide-react";

export const Route = createFileRoute("/examples")({
  head: () => ({
    meta: [
      { title: "Examples — next-auth-toolkit" },
      { name: "description", content: "Production-ready example apps showing how to use next-auth-toolkit in real-world scenarios." },
      { property: "og:title", content: "Examples" },
      { property: "og:description", content: "Real-world auth, end to end." },
    ],
  }),
  component: Examples,
});

const examples = [
  { icon: LayoutDashboard, title: "Admin Dashboard", desc: "RBAC, audit logs, user management.", tags: ["Prisma", "Postgres", "RBAC"] },
  { icon: Building2, title: "Multi-tenant SaaS", desc: "Organizations, teams, workspace switching.", tags: ["Orgs", "Invites", "Stripe"] },
  { icon: ShoppingBag, title: "Marketplace", desc: "Buyer / seller roles, passkey checkout.", tags: ["Passkeys", "2FA"] },
  { icon: MessageSquare, title: "Chat App", desc: "Realtime sessions, presence, device tracking.", tags: ["Edge", "Redis"] },
  { icon: Newspaper, title: "Blog with magic links", desc: "Passwordless email login for subscribers.", tags: ["Magic Link", "Resend"] },
  { icon: Network, title: "Social Network", desc: "OAuth account linking across 8 providers.", tags: ["OAuth", "Linking"] },
  { icon: Briefcase, title: "CRM", desc: "Per-tenant data isolation with row-level security.", tags: ["RLS", "Postgres"] },
  { icon: GraduationCap, title: "School Portal", desc: "Parent / student / teacher role hierarchies.", tags: ["RBAC", "MFA"] },
  { icon: Stethoscope, title: "Hospital", desc: "HIPAA-aware audit logging and step-up auth.", tags: ["Audit", "Step-up"] },
  { icon: Users, title: "Community Forum", desc: "Social logins + Discord OAuth + bans.", tags: ["Discord", "Moderation"] },
];

function Examples() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-12">
        <div className="max-w-2xl">
          <div className="chip mb-4">Examples</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Real-world apps, real-world auth.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Production-ready example apps you can clone and ship. Every example is open source, fully
            typed, and deploys in one click.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {examples.map((e) => (
            <a
              key={e.title}
              href="https://github.com"
              className="group relative p-5 rounded-xl border border-border bg-card/60 hover:border-primary/40 hover:bg-card transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-primary/10 ring-1 ring-primary/25">
                  <e.icon className="h-4 w-4 text-primary" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="mt-4 font-semibold">{e.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-muted/60 text-[10px] font-mono text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card/60 to-accent/5 p-10 text-center">
          <h2 className="font-display text-2xl font-semibold">Have an example to share?</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm">
            We feature community examples on the docs site. Open a PR with your repo to be listed here.
          </p>
          <Link
            to="/docs"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all"
          >
            Read the contributing guide
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
