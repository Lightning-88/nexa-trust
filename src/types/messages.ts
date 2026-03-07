export type Message = {
  chatId: string;
  role: "user" | "assistant" | "system";
  id: string;
  createdAt: Date;
  content: string;
};
