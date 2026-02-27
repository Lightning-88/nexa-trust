import { auth } from "@/lib/authentication/auth";
import { db } from "@/lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session)
    return NextResponse.json(
      { success: false, message: "unauthenticated" },
      { status: 403 },
    );

  const { chatId, content, provider, isFirst } = await request.json();
  if (!chatId || !content || !provider)
    return NextResponse.json(
      { success: false, message: "empty" },
      { status: 400 },
    );

  if (!isFirst) {
    await db.message.create({
      data: {
        chatId,
        role: "user",
        content,
      },
    });
  }

  const history = await db.message.findMany({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (provider === "aistudio") {
    const contents = history.map((m) => {
      let role: "user" | "model" | "system";

      if (m.role === "assistant") role = "model";
      else if (m.role === "system") role = "system";
      else role = "user";

      return {
        role,
        parts: [{ text: m.content }],
      };
    });

    const apiKey = process.env.GEMINI_API_KEY;
    const responseAi = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
        }),
      },
    );
    const result = await responseAi.json();
    if (!responseAi.ok) {
      return NextResponse.json(
        { success: false, message: "AI error", errors: result },
        { status: 500 },
      );
    }

    const messageAi = await db.message.create({
      data: {
        content: result.candidates[0].content.parts[0].text,
        chatId,
        role: "assistant",
      },
    });

    return NextResponse.json(
      { success: true, data: { reply: messageAi } },
      { status: 201 },
    );
  } else {
    const contents = history.map((m) => {
      return {
        role: m.role,
        content: m.content,
      };
    });

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
          messages: contents,
          max_tokens: 200,
        }),
      },
    );
    const result = await responseAi.json();
    if (!responseAi.ok) {
      return NextResponse.json(
        { success: false, message: "AI error", errors: result },
        { status: 500 },
      );
    }

    const messageAi = await db.message.create({
      data: {
        content: result.output.content,
        chatId,
        role: "assistant",
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, data: { reply: messageAi } },
      { status: 201 },
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session)
    return NextResponse.json(
      { success: false, message: "unauthenticated" },
      { status: 403 },
    );

  const searchParams = request.nextUrl.searchParams;
  const chatId = searchParams.get("chatId");
  if (!chatId)
    return NextResponse.json(
      { success: false, message: "empty" },
      { status: 400 },
    );

  const message = await db.message.findMany({
    where: {
      chatId,
    },
  });

  return NextResponse.json(
    { success: true, data: { message } },
    { status: 200 },
  );
}
