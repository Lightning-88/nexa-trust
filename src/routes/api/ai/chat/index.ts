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
      POST: async ({ context: { userId }, request }) => {
        const { prompt }: { prompt: string } = await request.json();

        if (!prompt)
          return Response.json(
            { success: false, message: "empty" },
            { status: 400 },
          );

        const chat = await db.chat.create({
          data: {
            title: prompt.slice(0, 50),
            userId,
          },
        });

        await db.message.create({
          data: {
            chatId: chat.id,
            role: "user",
            content: prompt,
            createdAt: new Date(),
          },
        });

        return Response.json({ success: true, data: chat }, { status: 201 });
      },
    },
  },
});
