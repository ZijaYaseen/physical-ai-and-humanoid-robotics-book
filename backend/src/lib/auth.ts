import { betterAuth } from "better-auth";
import { db } from "./db";

// Initialize Better Auth
export const auth = betterAuth({
  database: {
    provider: "postgresql", // Using postgresql since Neon is PostgreSQL-compatible
    url: process.env.NEON_DATABASE_URL || "",
  },
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: parseInt(process.env.SESSION_EXPIRES_IN_DAYS || "30") * 24 * 60 * 60, // Convert days to seconds
  },
});

// Export auth for use in API routes
export default auth;