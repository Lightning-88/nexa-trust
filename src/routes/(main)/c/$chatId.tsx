import { PromptInput } from "@/components/chat/prompt-input";
import { Markdown } from "@/components/ui/markdown";
import { getMessagesServer } from "@/feature/message/functions";
import type { Message } from "@/types/messages";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LoaderPinwheel } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/(main)/c/$chatId")({
  component: ChatPage,
});

function ChatPage() {
  const { chatId } = Route.useParams();
  const [prompt, setPrompt] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const getMessages = useServerFn(getMessagesServer);
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const runOnce = useRef(false);

  const { data: messages, isPending } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages({ data: { chatId } }),
  });

  useEffect(() => {
    if (isPending) return;

    if (!runOnce.current) {
      runOnce.current = true;
      if (messages?.length === 1) {
        handleSubmitPrompt();
      }
    }
  }, [chatId, messages?.length, isPending]);

  async function handleSubmitPrompt() {
    const userPrompt = prompt || messages?.[0].content;

    setPrompt("");

    queryClient.setQueryData(["messages", chatId], (old: Message[]) => [
      ...old,
      {
        id: String(Math.floor(Math.random() * 10000000)),
        content: userPrompt,
        role: "user",
        createdAt: new Date(),
      },
    ]);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_APP_URL}/api/ai/message`,
        {
          method: "POST",
          body: JSON.stringify({
            chatId,
            content: userPrompt,
            isFirst: messages?.length === 1,
          }),
        },
      );
      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let text = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        text += decoder.decode(value);

        setStreamingMessage(text);
      }

      setIsLoading(false);
      setStreamingMessage("");

      await queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.scrollTop = element.scrollHeight;
  }, [messages?.length, streamingMessage]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4 space-y-4" ref={containerRef}>
        {messages?.map((m) => (
          <div
            key={m.id}
            className={`space-y-4 p-2 max-w-fit ${m.role === "user" && "ml-auto rounded-md bg-accent"}`}
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
          <div className="space-y-4 p-2 max-w-fit">
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

      <form
        className="sticky p-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitPrompt();
        }}
      >
        <PromptInput
          onLoading={isLoading || streamingMessage ? true : false}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />
      </form>
    </div>
  );
}
