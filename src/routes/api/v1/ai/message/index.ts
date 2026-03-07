import { authorizedKey, generateRandomKey } from "@/feature/service/functions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/ai/message/")({
  server: {
    middleware: [authorizedKey],
    handlers: {
      GET: async ({ request }) => {
        const searchParams = new URL(request.url).searchParams;

        const content = searchParams.get("content");
        const promptSystem = searchParams.get("promptSystem");

        if (content || promptSystem) {
          const apiKey = process.env.BYTEZ_API_KEY;
          const responseAi = await fetch(
            "https://api.bytez.com/models/v2/openai/gpt-4o",
            {
              method: "POST",
              headers: {
                Authorization: apiKey as string,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: [
                  {
                    content,
                    ...(promptSystem
                      ? { role: "system" }
                      : { role: "assistant" }),
                  },
                ],
                max_tokens: 200,
              }),
            },
          );
          const result = await responseAi.json();

          if (!responseAi.ok) {
            return Response.json(
              { success: false, message: "AI error", errors: result },
              { status: 500 },
            );
          }

          return Response.json(
            {
              success: true,
              data: { response: result.output.content },
              messageId: `m_${generateRandomKey()}`,
              timestamp: new Date(),
            },
            { status: 200 },
          );
        }

        return Response.json(
          { success: false, message: "empty" },
          { status: 400 },
        );
      },
    },
  },
});
