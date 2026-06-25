import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Github, Shield, LogOut } from "lucide-react";

export function SiteHeader() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [initial, setInitial] = useState<string>("?");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      setSignedIn(!!u);
      if (u?.email) setInitial(u.email[0].toUpperCase());
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      setSignedIn(!!u);
      if (u?.email) setInitial(u.email[0].toUpperCase());
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/30 transition-all group-hover:ring-primary/60">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold tracking-tight">next-auth-toolkit</span>
            <span className="font-mono text-[10px] text-muted-foreground">v1.0.0 · MIT</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {[
            { to: "/docs", label: "Docs" },
            { to: "/playground", label: "Playground" },
            { to: "/examples", label: "Examples" },
            { to: "/api", label: "API" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-1.5 rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
              activeProps={{ className: "px-3 py-1.5 rounded-md text-foreground bg-muted/60" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="font-mono text-xs">12.4k</span>
          </a>

          {signedIn ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-2.5 py-1 rounded-md hover:bg-muted/50 transition-colors"
                aria-label="Dashboard"
              >
                <div className="h-7 w-7 rounded-full bg-primary/15 ring-1 ring-primary/40 flex items-center justify-center text-xs font-semibold text-primary">
                  {initial}
                </div>
              </Link>
              <button
                onClick={handleSignOut}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-card transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 glow-ring"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
