import type { ChatData } from "@/types/chats";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth/functions";
import { db } from "@/lib/db/prisma";
import z from "zod";

export async function getChats() {
  const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/ai/chat`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { data } = await response.json();

  return data.chat as ChatData[];
}

export async function addChats(prompt: string) {
  const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const { data } = await response.json();

  return data as ChatData;
}

export const getChatsServer = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context: { userId } }) => {
    return await db.chat.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId,
      },
    });
  });

export const addChatsServer = createServerFn({ method: "POST" })
  .inputValidator(z.object({ propmt: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { propmt }, context: { userId } }) => {
    const chat = await db.chat.create({
      data: {
        title: propmt,
        userId,
      },
    });

    await db.message.create({
      data: {
        content: propmt,
        role: "user",
        chatId: chat.id,
      },
    });

    return chat;
  });
