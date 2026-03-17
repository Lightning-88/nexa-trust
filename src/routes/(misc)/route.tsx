import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(misc)')({
  component: Outlet,
  beforeLoad: async ({ context: { session } }) => {
    if (!session) throw redirect({ to: '/login' })
  },
})
