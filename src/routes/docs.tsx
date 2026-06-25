import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DocsSidebar } from "@/components/docs-sidebar";

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

function DocsLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="container-page flex-1 flex gap-10 py-10">
        <DocsSidebar />
        <main className="flex-1 min-w-0 max-w-3xl">
          <Outlet />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
