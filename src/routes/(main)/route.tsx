import { AppHeader } from "@/components/main/app-header";
import { AppSidebar } from "@/components/main/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { checkSessionServer } from "@/feature/auth/functions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)")({
  component: MainLayout,
  loader: async () => {
    const session = await checkSessionServer();
    if (!session) throw redirect({ to: "/login" });

    return session;
  },
});

function MainLayout() {
  const { user } = Route.useLoaderData();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" user={user} className="border-r p-0" />

      <div className="w-full h-dvh flex flex-col">
        <AppHeader className="sticky top-0" />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
