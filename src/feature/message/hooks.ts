import { genRandomID } from '@/routes/(main)/c.$chatId'
import type { Message } from '@/types/messages'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'

export function useMessageCache(chatId: string) {
  const queryClient = useQueryClient()

  const append = useCallback(
    (message: Message) => {
      queryClient.setQueryData(['messages', chatId], (old: Message[] = []) => [
        ...old,
        message,
      ])
    },
    [chatId, queryClient],
  )

  return { append }
}

export function useSendMessageToAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null)

  const startAIMessage = useCallback(
    async ({
      chatId,
      userPrompt,
      isFirst,
      onSuccess,
      onError,
    }: {
      chatId: string
      userPrompt: string
      isFirst: boolean
      onSuccess?: (content: string) => void
      onError?: () => void
    }) => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `${import.meta.env.VITE_APP_URL}/api/ai/message`,
          {
            method: 'POST',
            body: JSON.stringify({
              chatId,
              content: userPrompt,
              isFirst,
            }),
          },
        )
        if (!response.body || !response.ok) throw new Error()
        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        let buffer = ''
        let lastUpdate = Date.now()

        while (lastUpdate) {
          const { done, value } = await reader.read()

          if (done) break

          buffer += decoder.decode(value)

          if (Date.now() - lastUpdate > 40) {
            setStreamingMessage(buffer)
            lastUpdate = Date.now()
          }
        }

        setStreamingMessage(buffer)

        onSuccess?.(buffer)

        setStreamingMessage(null)
      } catch {
        onError?.()
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return { isLoading, streamingMessage, startAIMessage }
}

export function useSubmitContent({
  chatId,
  messages,
  handler,
}: {
  chatId: string
  messages: Message[]
  handler: ({
    chatId,
    userPrompt,
    isFirst,
    onSuccess,
    onError,
  }: {
    chatId: string
    userPrompt: string
    isFirst: boolean
    onSuccess?: ((content: string) => void) | undefined
    onError?: (() => void) | undefined
  }) => Promise<void>
}) {
  const promptRef = useRef<HTMLTextAreaElement>(null)

  const { append } = useMessageCache(chatId)
  const queryClient = useQueryClient()

  const handleSubmitPrompt = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!promptRef.current) return

      const userPrompt = promptRef.current.value

      promptRef.current.value = ''

      append({
        id: genRandomID(),
        content: userPrompt,
        role: 'user',
        createdAt: new Date(),
        chatId,
      })

      await handler({
        chatId,
        userPrompt,
        isFirst: messages.length === 1,
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
    },
    [messages],
  )

  return { promptRef, handleSubmitPrompt }
}
