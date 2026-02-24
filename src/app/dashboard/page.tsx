"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authentication/auth-client";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) return;

  if (!session) redirect("/login");

  if (error)
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );

  async function handleSignOut() {
    if (confirm("logout?"))
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            redirect("/login");
          },
        },
      });
  }

  return (
    <div>
      <h1>welcome {session.user.name}</h1>
      <p>email: {session.user.email}</p>

      <Button onClick={handleSignOut}>Logout</Button>
    </div>
  );
}
