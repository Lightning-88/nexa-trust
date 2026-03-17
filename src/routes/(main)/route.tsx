import { AppHeader } from '@/components/main/app-header'
import { AppSidebar } from '@/components/main/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)')({
  component: MainLayout,
  beforeLoad: ({ context: { session } }) => {
    if (!session) throw redirect({ to: '/login' })

    return session
  },
  loader: ({ context: { user } }) => user,
})

function MainLayout() {
  const user = Route.useLoaderData()

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 16)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" user={user} className="border-r p-0" />

      <div className="w-full h-dvh flex flex-col overflow-hidden">
        <AppHeader className="sticky top-0" />
        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}
