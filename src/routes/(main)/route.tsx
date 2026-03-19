import { AppHeader } from '@/components/main/app-header'
import { AppSidebar } from '@/components/main/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getRequestUrl } from '@tanstack/react-start/server'

export const Route = createFileRoute('/(main)')({
  component: MainLayout,
  beforeLoad: ({ context: { session } }) => {
    const url = getRequestUrl()

    if (!session)
      throw redirect({ to: '/login', search: { continue: url.pathname } })

    return session
  },
})

function MainLayout() {
  const { user } = Route.useRouteContext()

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 16)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" user={user} />

      <div className="w-full h-dvh flex flex-col overflow-hidden">
        <AppHeader className="sticky top-0" />
        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}
