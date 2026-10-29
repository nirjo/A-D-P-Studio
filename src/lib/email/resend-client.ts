/**
 * Resend SDK client — server-only.
 * Uses the `resend` npm package for type-safe email sending.
 */
import { Resend } from "resend";

let cachedClient: Resend | null = null;

export function getResendClient(): Resend {
  if (cachedClient) return cachedClient;

  const apiKey = process.env["RESEND_API_KEY"] || "";

  if (!apiKey) {
    throw new Error(
      "[resend-client] Missing RESEND_API_KEY environment variable. " +
        "Set it in your Vercel/server environment."
    );
  }

  cachedClient = new Resend(apiKey);
  return cachedClient;
}

export function getFromAddress(): string {
  return (
    process.env["RESEND_FROM_EMAIL"] ||
    "Aiel Studio <orders@aieldesignstudio.com>"
  );
}
