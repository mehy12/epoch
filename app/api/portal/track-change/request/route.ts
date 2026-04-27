import { getSessionFromRequest } from "@/lib/portal/api-auth";
import { AVAILABLE_TRACKS, MAX_TRACK_CHANGES } from "@/lib/portal/constants";
import { getPortalRecordBySession } from "@/lib/portal/sheets";
import { isTrackChangeDisabled } from "@/lib/portal/settings";
import {
  createTrackChangeRequest,
  getRequestsForTeam,
} from "@/lib/portal/track-changes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const record = await getPortalRecordBySession(session);
    if (!record) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Check global toggle
    const globallyDisabled = await isTrackChangeDisabled();
    if (globallyDisabled) {
      return NextResponse.json(
        { error: "Track changes are currently disabled by the organizers." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const requestedTrack = String(body.requestedTrack || "").trim();
    const reason = String(body.reason || "").trim();

    // Validate requested track
    if (!requestedTrack || !AVAILABLE_TRACKS.includes(requestedTrack as typeof AVAILABLE_TRACKS[number])) {
      return NextResponse.json(
        { error: "Invalid track selection." },
        { status: 400 }
      );
    }

    // Cannot select same track
    if (requestedTrack === record.domain) {
      return NextResponse.json(
        { error: "You are already registered under this track." },
        { status: 400 }
      );
    }

    // Check track locked
    if (record.trackLocked) {
      return NextResponse.json(
        { error: "Track changes have been locked for your team." },
        { status: 403 }
      );
    }

    // Check max changes
    if (record.trackChangeCount >= MAX_TRACK_CHANGES) {
      return NextResponse.json(
        {
          error: `You have reached the maximum limit of ${MAX_TRACK_CHANGES} track change requests.`,
        },
        { status: 403 }
      );
    }

    // Check for existing pending request
    const existingRequests = await getRequestsForTeam(record.teamId);
    const hasPending = existingRequests.some((r) => r.status === "pending");
    if (hasPending) {
      return NextResponse.json(
        { error: "You already have a pending track change request." },
        { status: 409 }
      );
    }

    // Create the request
    const trackChangeRequest = await createTrackChangeRequest({
      teamId: record.teamId,
      teamName: record.teamName,
      currentTrack: record.domain,
      requestedTrack,
      reason,
    });

    return NextResponse.json({ success: true, request: trackChangeRequest });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not create track change request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
