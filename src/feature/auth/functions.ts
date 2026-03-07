import { auth } from "@/lib/auth/config";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const checkSessionServer = createServerFn({ method: "GET" }).handler(
  async () => {
    return await auth.api.getSession({
      headers: getRequestHeaders(),
    });
  },
);

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await checkSessionServer();
  if (!session)
    return Response.json(
      { success: false, message: "unauthenticated" },
      { status: 403 },
    );

  return next({ context: { userId: session.user.id } });
});
