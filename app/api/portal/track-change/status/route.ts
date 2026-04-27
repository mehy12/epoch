import { getSessionFromRequest } from "@/lib/portal/api-auth";
import { getPortalRecordBySession } from "@/lib/portal/sheets";
import { isTrackChangeDisabled } from "@/lib/portal/settings";
import { getRequestsForTeam } from "@/lib/portal/track-changes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const record = await getPortalRecordBySession(session);
    if (!record) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const [requests, trackChangeDisabledGlobal] = await Promise.all([
      getRequestsForTeam(record.teamId),
      isTrackChangeDisabled(),
    ]);

    return NextResponse.json({
      success: true,
      requests,
      trackChangeCount: record.trackChangeCount,
      trackLocked: record.trackLocked,
      trackChangeDisabledGlobal,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch track change status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
