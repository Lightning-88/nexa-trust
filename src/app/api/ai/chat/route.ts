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

  const { prompt }: { prompt: string } = await request.json();
  if (!prompt)
    return NextResponse.json(
      { success: false, message: "empty" },
      { status: 400 },
    );

  const chat = await db.chat.create({
    data: {
      title: prompt.slice(0, 50),
      userId: session.user.id,
    },
  });

  await db.message.create({
    data: {
      chatId: chat.id,
      role: "user",
      content: prompt,
      createdAt: new Date(),
    },
  });

  return NextResponse.json({ success: true, data: { chat } }, { status: 201 });
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

  const chat = await db.chat.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true, data: { chat } }, { status: 200 });
}
