import { authMiddleware } from '@/feature/auth/functions'
import { db } from '@/lib/db/prisma'
import { env } from '@/lib/utils/env'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/api/ai/message/')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()

        const validated = z
          .object({
            chatId: z.string(),
            content: z.string(),
            isFirst: z.boolean(),
          })
          .safeParse(body)

        if (validated.error)
          return Response.json(
            { success: false, message: 'empty' },
            { status: 400 },
          )

        const { chatId, content, isFirst } = validated.data

        if (!isFirst) {
          await db.message.create({
            data: {
              chatId,
              role: 'user',
              content,
            },
          })
        }

        // const history = await db.message.findMany({
        //   where: {
        //     chatId,
        //   },
        //   orderBy: {
        //     createdAt: "asc",
        //   },
        // });

        // const contents = history.map((m) => ({
        //   role: m.role,
        //   content: m.content,
        // }));

        // const apiKey = env().BYTEZ_API_KEY;
        // const response = await fetch(
        //   "https://api.bytez.com/models/v2/openai/gpt-4o",
        //   {
        //     method: "POST",
        //     headers: {
        //       Authorization: apiKey as string,
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       messages: contents,
        //       max_tokens: 200,
        //     }),
        //   },
        // );
        // const result = await response.json();

        // if (!response.ok) {
        //   return Response.json(
        //     { success: false, message: "AI error", errors: result },
        //     { status: 500 },
        //   );
        // }
        const history = await db.message.findMany({
          where: {
            role: 'assistant',
          },
          take: 10,
        })

        const random = Math.floor(Math.random() * history.length)

        const result = {
          output: {
            content: history[random].content,
          },
        }

        await new Promise((res) => setTimeout(res, 3000))

        const responseFromAI = await db.message.create({
          data: {
            content: result.output.content,
            chatId,
            role: 'assistant',
            createdAt: new Date(),
          },
        })

        const encoder = new TextEncoder()
        const words = responseFromAI.content.split(' ')

        const streamText = new ReadableStream({
          start: async (controller) => {
            for (const word of words) {
              controller.enqueue(encoder.encode(word + ' '))
              await new Promise((r) => setTimeout(r, 40))
            }

            controller.close()
          },
        })

        return new Response(streamText, {
          headers: { 'Content-Type': 'text/plain' },
        })
      },
    },
  },
})
