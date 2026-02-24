import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../database/prisma";
import bcrypt from "bcrypt";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    password: {
      hash: async (password) =>
        await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS)),
      verify: async ({ hash, password }) =>
        await bcrypt.compare(password, hash),
    },
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip", "x-client-ip"],
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET_ID,
    },
    github: {
      prompt: "select_account",
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_SECRET_ID,
    },
  },
  plugins: [nextCookies()],
});
