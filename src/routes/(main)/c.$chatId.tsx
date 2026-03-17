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
import { LoaderPinwheel } from 'lucide-react'
import { useEffect, useRef } from 'react'

const getMessageQueryOptions = (chatId: string) =>
  queryOptions({
    queryKey: ['messages', chatId],
    queryFn: () => getMessagesServer({ data: { chatId } }),
  })

export const Route = createFileRoute('/(main)/c/$chatId')({
  component: ChatPage,
  pendingComponent: () => <div className="p-4">Loading...</div>,
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
      <div className="flex-1 overflow-auto p-4 space-y-4" ref={containerRef}>
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
            <LoaderPinwheel className="animate-ping" size={16} />
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
              <LoaderPinwheel className="animate-ping" size={16} />
            </div>
          </div>
        )}
      </div>

      <form className="sticky p-4" onSubmit={handleSubmitPrompt}>
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
