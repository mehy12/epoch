import { PORTAL_SESSION_COOKIE } from "@/lib/portal/constants";
import { verifySessionToken } from "@/lib/portal/session";
import { NextRequest } from "next/server";

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(PORTAL_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}
