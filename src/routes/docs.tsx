import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsToc } from "@/components/docs-toc";
import { DocsPageFooter } from "@/components/docs-page-footer";

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

function DocsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="container-page flex-1 flex gap-10 py-10">
        <DocsSidebar />
        <main className="flex-1 min-w-0 max-w-3xl">
          <Outlet />
          <DocsPageFooter pathname={pathname} />
        </main>
        <DocsToc pathname={pathname} />
      </div>
      <SiteFooter />
    </div>
  );
}
