import { PORTAL_SESSION_COOKIE, PORTAL_SESSION_MAX_AGE_SECONDS } from "@/lib/portal/constants";
import { PortalSessionPayload } from "@/lib/portal/types";
import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";

function getJwtSecret(): Uint8Array {
  const secret = process.env.PORTAL_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("PORTAL_JWT_SECRET must be set and at least 32 characters long.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: PortalSessionPayload): Promise<string> {
  return new SignJWT({
    teamId: payload.teamId,
    email: payload.email,
    phone: payload.phone,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${PORTAL_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<PortalSessionPayload | null> {
  try {
    const result = await jwtVerify(token, getJwtSecret());

    const teamId = String(result.payload.teamId || "");
    const email = String(result.payload.email || "");
    const phone = String(result.payload.phone || "");

    if (!teamId || (!email && !phone)) {
      return null;
    }

    return {
      teamId,
      email,
      phone,
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(PORTAL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PORTAL_SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(PORTAL_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
