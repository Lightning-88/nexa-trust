"use client";

import { PromptInput } from "@/components/main/prompt-input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const [prompt, setPrompt] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmitPrompt(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      },
    );
    const result = await response.json();

    if (!result.success) return alert("gagal");

    router.refresh();
    router.push(`/c/${result.data.chat.id}`);
  }

  return (
    <div className="h-full flex items-center justify-center flex-col p-4 gap-4">
      <p className="text-2xl font-bold">Where should we begin?</p>
      <form className="w-full max-w-xl" onSubmit={handleSubmitPrompt}>
        <PromptInput onChange={(e) => setPrompt(e.target.value)} />
      </form>
    </div>
  );
}
