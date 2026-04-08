import { hashPortalPassword } from "@/lib/portal/password";
import { createPortalPassword } from "@/lib/portal/sheets";
import { createSessionToken, setSessionCookie } from "@/lib/portal/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z
  .object({
    identifier: z.string().trim().min(3),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { identifier, password } = bodySchema.parse(json);

    const passwordHash = await hashPortalPassword(password);
    const profile = await createPortalPassword(identifier, passwordHash);

    const token = await createSessionToken({
      teamId: profile.teamId,
      email: profile.email,
      phone: profile.phone,
    });

    const response = NextResponse.json({ success: true, profile });
    setSessionCookie(response, token);

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Invalid input." }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Could not create portal password.";
    const status =
      message.includes("already") || message.includes("verified") || message.includes("found")
        ? 400
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
