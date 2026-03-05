import { PromptInput } from "@/components/chat/prompt-input";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/(main)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmitPrompt(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_APP_URL}/api/ai/chat`,
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

      navigate({ to: "/c/$chatId", params: { chatId: result.data.chat.id } });
    } catch {
      alert("Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex items-center justify-center flex-col p-4 gap-4">
      <p className="text-2xl font-bold">Where should we begin?</p>
      <form className="w-full max-w-xl" onSubmit={handleSubmitPrompt}>
        <PromptInput
          onChange={(e) => setPrompt(e.target.value)}
          onLoading={loading}
        />
      </form>
    </div>
  );
}
