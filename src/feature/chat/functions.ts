import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '../auth/functions'
import { db } from '@/lib/db/prisma'
import z from 'zod'

export const getChatsServer = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context: { userId } }) => {
    return await db.chat.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId,
      },
    })
  })

export const addChatsServer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ propmt: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { propmt }, context: { userId } }) => {
    const chat = await db.chat.create({
      data: {
        title: propmt,
        userId,
      },
    })

    await db.message.create({
      data: {
        content: propmt,
        role: 'user',
        chatId: chat.id,
      },
    })

    return chat
  })
