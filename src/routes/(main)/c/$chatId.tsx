import { PromptInput } from "@/components/chat/prompt-input";
import { Markdown } from "@/components/ui/markdown";
import type { Message } from "@/types/messages";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/(main)/c/$chatId")({
  component: ChatPage,
});

function ChatPage() {
  const { chatId } = Route.useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isNewChat, setIsNewChat] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    const getChat = async () => {
      const response = await fetch(`/api/ai/message?chatId=${chatId}`);
      const { data } = await response.json();

      setMessages(data.message);

      if (data.message.length === 1 && data.message[0].role === "user") {
        setIsNewChat(true);
      }
    };

    getChat();
  }, [chatId]);

  useEffect(() => {
    if (hasRun.current) return;
    if (!isNewChat) return;

    hasRun.current = true;

    const first = messages[0];
    if (!first.id) return;

    const runAi = async () => {
      setLoading(true);

      const response = await fetch("/api/ai/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          content: first.content,
          provider: "bytez",
          isFirst: hasRun.current,
        }),
      });

      const { data } = await response.json();

      setMessages((prev) => [...prev, data.reply]);
      setLoading(false);

      setIsNewChat(false);
    };

    runAi();
  }, [isNewChat, chatId, messages]);

  async function handleSubmitPrompt(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!prompt.trim() || loading) return;

    const text = prompt;
    setPrompt("");

    setMessages((prev) => [
      ...prev,
      {
        id: String(Math.floor(Math.random() * 10000000)),
        chatId: chatId,
        role: "user",
        content: text,
        createdAt: new Date(),
      },
    ]);

    try {
      setLoading(true);
      const response = await fetch("/api/ai/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          content: text,
          provider: "bytez",
        }),
      });

      const { data } = await response.json();
      setMessages((prev) => [...prev, data.reply]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`space-y-4 p-2 max-w-fit ${m.role === "user" && "ml-auto rounded-md bg-accent"}`}
          >
            <Markdown role={m.role} content={m.content} />
          </div>
        ))}

        {loading && <p className="text-sm text-muted-foreground">typing...</p>}
      </div>

      <form className="sticky p-4" onSubmit={handleSubmitPrompt}>
        <PromptInput
          onLoading={loading}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />
      </form>
    </div>
  );
}
