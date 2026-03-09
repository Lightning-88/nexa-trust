import { checkSessionServer } from "@/feature/auth/functions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(misc)")({
  component: Outlet,
  loader: async () => {
    const session = await checkSessionServer();
    if (!session) throw redirect({ to: "/login" });
  },
});
