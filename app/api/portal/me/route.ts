import { getSessionFromRequest } from "@/lib/portal/api-auth";
import { getPortalProfileBySession } from "@/lib/portal/sheets";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const profile = await getPortalProfileBySession(session);
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not fetch profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
