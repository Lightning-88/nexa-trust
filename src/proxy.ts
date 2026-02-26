import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/authentication/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session)
    return NextResponse.json(
      { success: false, message: "unauthenticated" },
      { status: 403 },
    );

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/ai/:path*"],
};
