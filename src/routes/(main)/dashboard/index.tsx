import { PromptInput } from "@/components/chat/prompt-input";
import { addChats } from "@/feature/chat/functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/(main)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: addChatsFn, isPending } = useMutation({
    mutationFn: (promptContent: string) => addChats(promptContent),
    onSuccess: async ({ id }) => {
      await queryClient.invalidateQueries({
        queryKey: ["chats"],
      });

      navigate({ to: "/c/$chatId", params: { chatId: id } });
    },
  });

  async function handleSubmitPrompt(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt) return;

    addChatsFn(prompt);
  }

  return (
    <div className="h-full flex items-center justify-center flex-col p-4 gap-4">
      <p className="text-2xl font-bold">Where should we begin?</p>
      <form className="w-full max-w-xl" onSubmit={handleSubmitPrompt}>
        <PromptInput
          onChange={(e) => setPrompt(e.target.value)}
          onLoading={isPending}
        />
      </form>
    </div>
  );
}
