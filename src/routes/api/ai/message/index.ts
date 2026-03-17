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
            chatId,
            role: 'assistant',
          },
        })

        const random = Math.floor(Math.random() * history.length)

        const result = {
          output: {
            content: `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit et officia omnis in similique rem ab unde optio. A voluptate omnis temporibus nobis necessitatibus! Expedita necessitatibus omnis assumenda quasi illum?
        Temporibus iste deserunt nostrum consequatur facere consectetur tempore non consequuntur laudantium esse porro voluptate distinctio repudiandae ex necessitatibus eos impedit voluptatum est exercitationem, atque culpa omnis voluptatem. Molestiae, officiis beatae?
        Reprehenderit odit nulla totam alias fuga voluptatibus, suscipit qui autem mollitia ut. Repellat nihil ipsum nulla suscipit fuga, vero inventore velit facilis assumenda quis minima necessitatibus eaque commodi consequatur non.
        Sunt maxime, debitis nostrum facere officiis repellendus beatae voluptatibus velit dolor dolorum nemo quisquam voluptatum, asperiores eaque sint voluptates possimus dolorem ullam iste? Non incidunt magnam nulla nemo ut blanditiis.
        Illo voluptatum eveniet a at dolore perspiciatis quasi sunt quos, labore quisquam maiores minima officia excepturi aut repudiandae officiis, consectetur vel? Aliquid soluta ipsum magnam est magni reprehenderit error illum.
        Debitis, sed? Quis dolorum laudantium porro ex neque ipsum pariatur maiores assumenda, nostrum ipsam eveniet ducimus exercitationem blanditiis dignissimos esse provident commodi fugit. Repellat tempore quaerat rerum itaque velit enim!
        Rerum aspernatur dolor, cupiditate sequi soluta nulla incidunt iste similique modi qui eum ipsam fugiat est dignissimos nemo vero consequatur, quas sed! Eligendi ut dolore ratione laudantium dolores incidunt suscipit!
        Soluta harum, quam tempore alias corrupti fuga aperiam labore, laboriosam quod, quaerat eveniet enim at doloribus dolorem numquam aspernatur. Minima quia fuga voluptas quisquam. Assumenda deleniti fugit aperiam necessitatibus sit!
        Fugiat accusamus ipsam soluta, dicta sed libero commodi quam, maxime, ad fuga labore atque consequuntur corporis corrupti laboriosam porro totam facilis! Amet sed tempora dignissimos facilis! Vitae molestias ducimus cum?
        Officia, sit quasi. Voluptatibus error, vero consequuntur beatae ipsam qui distinctio, debitis voluptas dolor eaque alias corrupti impedit iste voluptatem provident iusto inventore deserunt, suscipit eveniet dolore fugiat explicabo quibusdam!
        Omnis consequuntur error, nulla ut dicta fugiat eos, provident quaerat sit beatae velit voluptatibus nobis optio consequatur architecto asperiores, quibusdam dolores! Natus iusto autem accusantium praesentium temporibus aliquam nisi quibusdam!
        Et, labore corrupti omnis provident esse, inventore eligendi libero ullam illo distinctio quod ab necessitatibus sequi asperiores. Consectetur doloremque ipsa, expedita molestias mollitia facere optio exercitationem ut saepe, aut culpa.
        Eum ipsa, ipsum expedita consequuntur repudiandae voluptatum impedit rerum quia repellendus eos dolore a placeat eligendi veritatis quod! Consequuntur minus nulla numquam laboriosam rem, sit officiis fuga quibusdam hic aut!
        Voluptatibus, reprehenderit ipsam error aliquid accusamus quaerat amet. Excepturi mollitia eveniet nostrum? Aut, nulla inventore? Accusantium laborum sit voluptates, quaerat deserunt placeat id incidunt laboriosam quos, possimus, vero quis est.
        Officia aspernatur exercitationem commodi. Animi sunt laborum provident harum atque cupiditate nemo, dicta doloremque modi dolorem ducimus non optio dolore, hic error placeat facere magnam ipsum ea incidunt earum numquam!
        Fuga libero non inventore earum, quis nemo officiis soluta illum tempore sit quaerat exercitationem perspiciatis aliquid cupiditate quod facilis cumque alias vitae dicta? Dicta molestias obcaecati quos nam tempora provident!
        Ad perferendis nemo sapiente vel doloribus, nostrum incidunt laborum aliquam at maxime dolorum culpa quia animi eum, dignissimos quam iste qui ea dicta? Animi atque soluta itaque dicta cum sit.
        Enim cum repellat eius? Optio soluta ex, cupiditate eos consectetur velit aliquam delectus minus in perspiciatis molestiae repudiandae! Sint officia laudantium itaque soluta laboriosam delectus maxime aliquam, illo quas nesciunt.
        Quam vel delectus nulla adipisci voluptas magni ullam pariatur veritatis esse obcaecati ea aperiam omnis voluptatum eos, blanditiis veniam est, quae placeat nostrum alias animi tempore reprehenderit doloribus odit! Suscipit.
        Corporis ex tempore nulla, sed voluptatibus praesentium sequi voluptas culpa nam, facilis laboriosam soluta. Consequatur quod corrupti, sunt voluptatem atque, maiores saepe laboriosam explicabo quia illo, eum similique repellat temporibus?</p>
        \n`,
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
