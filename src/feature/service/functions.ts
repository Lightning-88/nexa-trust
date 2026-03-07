import { createMiddleware } from "@tanstack/react-start";
import crypto from "crypto";

export const authorizedKey = createMiddleware().server(({ request, next }) => {
  const key = request.headers.get("authorization");
  if (!key)
    return Response.json(
      { success: false, message: "unauthenticated" },
      { status: 403 },
    );

  return next();
});

export function generateRandomKey() {
  return crypto.randomBytes(8).toString("hex");
}
