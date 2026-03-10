import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth/functions";
import { db } from "@/lib/db/prisma";
import z from "zod";
import { env } from "@/lib/utils/env";

export const getMessagesServer = createServerFn({ method: "GET" })
  .inputValidator(z.object({ chatId: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { chatId } }) => {
    return await db.message.findMany({
      orderBy: {
        createdAt: "asc",
      },
      where: {
        chatId,
      },
    });
  });

export const addMessagesServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      chatId: z.string(),
      content: z.string(),
      isFirst: z.boolean(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { chatId, content, isFirst } }) => {
    if (!isFirst)
      await db.message.create({
        data: {
          chatId,
          role: "user",
          content,
          createdAt: new Date(),
        },
      });

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

    const apiKey = env().BYTEZ_API_KEY;
    const response = await fetch(
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
    const result = await response.json();

    if (!response.ok) return null;

    const responseFromAI = await db.message.create({
      data: {
        content: result.output.content,
        chatId,
        role: "assistant",
        createdAt: new Date(),
      },
    });

    return responseFromAI;
  });
