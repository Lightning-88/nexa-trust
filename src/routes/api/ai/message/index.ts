import { authMiddleware } from "@/feature/auth/functions";
import { db } from "@/lib/db/prisma";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai/message/")({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async ({ request }) => {
        const searchParams = new URL(request.url).searchParams;

        const chatId = searchParams.get("chatId");
        if (chatId) {
          const message = await db.message.findMany({
            where: {
              chatId,
            },
            orderBy: {
              createdAt: "asc",
            },
          });

          return Response.json(
            { success: true, data: { message } },
            { status: 200 },
          );
        }

        return Response.json(
          { success: false, message: "empty" },
          { status: 400 },
        );
      },
      POST: async ({ request }) => {
        const { chatId, content, provider, isFirst } = await request.json();

        if (!chatId || !content || !provider)
          return Response.json(
            { success: false, message: "empty" },
            { status: 400 },
          );

        if (!isFirst) {
          await db.message.create({
            data: {
              chatId,
              role: "user",
              content,
            },
          });
        }

        const history = await db.message.findMany({
          where: {
            chatId,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        const contents = history.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const apiKey = process.env.BYTEZ_API_KEY;
        const responseAi = await fetch(
          "https://api.bytez.com/models/v2/openai/gpt-4o",
          {
            method: "POST",
            headers: {
              Authorization: apiKey as string,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: contents,
              max_tokens: 200,
            }),
          },
        );
        const result = await responseAi.json();

        if (!responseAi.ok) {
          return Response.json(
            { success: false, message: "AI error", errors: result },
            { status: 500 },
          );
        }

        const messageAi = await db.message.create({
          data: {
            content: result.output.content,
            chatId,
            role: "assistant",
            createdAt: new Date(),
          },
        });

        return Response.json(
          { success: true, data: { reply: messageAi } },
          { status: 201 },
        );
      },
    },
  },
});
