import { verifyPortalPassword } from "@/lib/portal/password";
import { getRecordForLogin } from "@/lib/portal/sheets";
import { createSessionToken, setSessionCookie } from "@/lib/portal/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  identifier: z.string().trim().min(3),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { identifier, password } = bodySchema.parse(json);

    const record = await getRecordForLogin(identifier);

    if (!record || !record.passwordHash || !record.portalAccessEnabled) {
      return NextResponse.json(
        { error: "Portal access is not set up for this team. Use first-time access." },
        { status: 401 }
      );
    }

    const isValid = await verifyPortalPassword(password, record.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await createSessionToken({
      teamId: record.teamId,
      email: record.email,
      phone: record.phone,
    });

    const response = NextResponse.json({
      success: true,
      profile: {
        teamName: record.teamName,
        teamId: record.teamId,
      },
    });

    setSessionCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid login input." }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Login failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
