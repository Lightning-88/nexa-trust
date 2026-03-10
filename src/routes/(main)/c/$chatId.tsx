import { PromptInput } from "@/components/chat/prompt-input";
import { Markdown } from "@/components/ui/markdown";
import {
  addMessagesServer,
  getMessagesServer,
} from "@/feature/message/functions";
import type { Message } from "@/types/messages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/(main)/c/$chatId")({
  component: ChatPage,
});

function ChatPage() {
  const { chatId } = Route.useParams();
  const [prompt, setPrompt] = useState("");
  const getMessages = useServerFn(getMessagesServer);
  const addMessages = useServerFn(addMessagesServer);
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages({ data: { chatId } }),
  });

  const { mutate: addMessagesFn, isPending } = useMutation({
    mutationFn: ({ content, isFirst }: { content: string; isFirst: boolean }) =>
      addMessages({ data: { chatId, content, isFirst } }),
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: ["messages", chatId] });

      const previousMessages = queryClient.getQueryData([
        "messages",
        chatId,
      ]) as Message[];

      queryClient.setQueryData(["messages", chatId], (old: Message[]) => [
        ...old,
        {
          id: String(Math.floor(Math.random() * 10000000)),
          content: newMessage.content,
          role: "user",
          createdAt: new Date(),
        },
      ]);

      setPrompt("");

      return { previousMessages };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });

  async function handleSubmitPrompt(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    addMessagesFn({
      content: prompt,
      isFirst: messages?.length === 1 ? true : false,
    });
  }

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.scrollTop = element.scrollHeight;
  }, [messages?.length]);

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

        {isPending && (
          <p className="text-sm text-muted-foreground">typing...</p>
        )}
      </div>

      <form className="sticky p-4" onSubmit={handleSubmitPrompt}>
        <PromptInput
          onLoading={isPending}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />
      </form>
    </div>
  );
}
