import { authMiddleware } from "@/feature/auth/functions";
import { db } from "@/lib/db/prisma";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai/chat/")({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async ({ context: { userId } }) => {
        const chat = await db.chat.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return Response.json(
          { success: true, data: { chat } },
          { status: 200 },
        );
      },
    },
  },
});
