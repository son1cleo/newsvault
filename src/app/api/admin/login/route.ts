import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, sessionCookieName, sessionMaxAge } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for") ?? "local";
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`login:${clientKey(request)}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHashEncoded = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminHashEncoded) {
    return NextResponse.json({ error: "Admin account is not configured." }, { status: 500 });
  }

  const adminHash = Buffer.from(adminHashEncoded, "base64").toString("utf8");

  // Constant-shape check: always verify against a hash to avoid timing
  // differences between "unknown email" and "wrong password".
  const emailMatches = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatches = await verifyPassword(adminHash, password).catch(() => false);

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await createSessionToken(adminEmail);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge,
  });
  return response;
}
