import { PromptInput } from '@/components/chat/prompt-input'
import { Markdown } from '@/components/ui/markdown'
import { getMessagesServer } from '@/feature/message/functions'
import {
  useMessageCache,
  useSendMessageToAI,
  useSubmitContent,
} from '@/feature/message/hooks'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

const getMessageQueryOptions = (chatId: string) =>
  queryOptions({
    queryKey: ['messages', chatId],
    queryFn: () => getMessagesServer({ data: { chatId } }),
  })

export const Route = createFileRoute('/(main)/c/$chatId')({
  component: ChatPage,
  pendingComponent: () => <div className="p-4">Loading...</div>,
  notFoundComponent: () => <div className="p-4">Chat Not Found</div>,
  loader: ({ context, params: { chatId } }) => {
    context.queryClient.ensureQueryData(getMessageQueryOptions(chatId))
  },
})

function ChatPage() {
  const { chatId } = Route.useParams()
  const { queryClient } = Route.useRouteContext()
  const containerRef = useRef<HTMLDivElement>(null)

  const runOnce = useRef(true)

  const { isLoading, startAIMessage, streamingMessage } = useSendMessageToAI()
  const { append } = useMessageCache(chatId)

  const { data: messages } = useSuspenseQuery(getMessageQueryOptions(chatId))

  const { handleSubmitPrompt, promptRef } = useSubmitContent({
    chatId,
    messages,
    handler: startAIMessage,
  })

  useEffect(() => {
    if (runOnce.current) {
      runOnce.current = false
      async function generateFirstAIResponse() {
        if (messages.length === 1 && messages[0].role === 'user') {
          await startAIMessage({
            chatId,
            isFirst: true,
            userPrompt: messages[0].content,
            onSuccess: async (content) => {
              append({
                id: genRandomID(),
                content: content,
                role: 'assistant',
                createdAt: new Date(),
                chatId,
              })

              await queryClient.invalidateQueries({
                queryKey: ['messages', chatId],
              })
            },
          })
        }
      }

      generateFirstAIResponse()
    }
  }, [messages])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    requestAnimationFrame(() => {
      element.scrollTop = element.scrollHeight
    })
  }, [messages.length, streamingMessage])

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex-1 overflow-auto px-4 py-4 sm:px-12 md:px-24 space-y-4"
        ref={containerRef}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`space-y-4 p-2 max-w-fit text-sm ${m.role === 'user' && 'ml-auto rounded-md bg-accent'}`}
          >
            <Markdown role={m.role} content={m.content} />
          </div>
        ))}

        {isLoading && !streamingMessage && (
          <div>
            <Loader />
          </div>
        )}

        {streamingMessage && isLoading && (
          <div className="space-y-4 p-2 max-w-fit text-sm">
            <Markdown
              role="assistant"
              content={streamingMessage}
              onLoading={isLoading}
            />

            <div>
              <Loader />
            </div>
          </div>
        )}
      </div>

      <form
        className="sticky px-4 py-4 sm:px-12 md:px-24"
        onSubmit={handleSubmitPrompt}
      >
        <PromptInput
          onLoading={isLoading || streamingMessage ? true : false}
          ref={promptRef}
        />
      </form>
    </div>
  )
}

export function genRandomID() {
  return String(Math.floor(Math.random() * 1_000_000_000_000))
}

function Loader() {
  return (
    <div className="relative h-6 w-6 flex items-center justify-center animate-pulse">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-400 via-pink-500 to-rose-600 opacity-70 blur-md animate-[spin_4s_linear_infinite]" />

      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-tr from-orange-300 to-rose-500 bg-clip-border animate-[spin_2.5s_linear_infinite]" />

      <div className="absolute inset-1 rounded-xl border border-white/20 animate-[spin_3s_linear_infinite_reverse]" />

      <div className="absolute h-4 w-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)] animate-pulse" />

      <div className="absolute inset-2 rounded-xl bg-white/10 animate-[ping_2s_ease-in-out_infinite]" />
    </div>
  )
}
