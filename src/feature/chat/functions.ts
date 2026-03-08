import type { ChatData } from "@/types/chats";

export async function getChats() {
  const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/ai/chat`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { data } = await response.json();

  return data.chat as ChatData[];
}

export async function addChats(prompt: string) {
  const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const { data } = await response.json();

  return data as ChatData;
}
