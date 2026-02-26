"use client";

import { PromptInput } from "@/components/main/prompt-input";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Message = {
  chatId: string;
  role: "user" | "assistant" | "system";
  id: string;
  createdAt: Date;
  content: string;
};

export default function ChatPage() {
  const { chatId } = useParams();
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
    if (!first) return;

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
        chatId: chatId as string,
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
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <p className="inline-block rounded-lg px-3 py-2 bg-muted whitespace-pre-wrap">
              {m.content}
            </p>
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
