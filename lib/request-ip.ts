import { headers } from "next/headers";

/**
 * The visitor's IP as reported by the hosting proxy (Vercel sets
 * x-forwarded-for / x-real-ip and overwrites client-supplied values).
 */
export async function getRequestIp(): Promise<string | null> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || requestHeaders.get("x-real-ip")?.trim() || null;
}
