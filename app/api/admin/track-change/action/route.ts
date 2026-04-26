import { ADMIN_PASSPHRASE } from "@/lib/portal/constants";
import { updateTeamDomain } from "@/lib/portal/sheets";
import {
  getAllRequests,
  updateRequestStatus,
  writeDomainStatsToSheet,
} from "@/lib/portal/track-changes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const passphrase = request.headers.get("x-admin-passphrase");
    if (!passphrase || passphrase !== ADMIN_PASSPHRASE) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const requestId = String(body.requestId || "").trim();
    const action = String(body.action || "").trim().toLowerCase();
    const reviewedBy = String(body.reviewedBy || "Admin").trim();

    if (!requestId) {
      return NextResponse.json(
        { error: "Missing requestId." },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    // Find the request to verify it is still pending
    const allRequests = await getAllRequests();
    const targetRequest = allRequests.find((r) => r.requestId === requestId);

    if (!targetRequest) {
      return NextResponse.json(
        { error: "Track change request not found." },
        { status: 404 }
      );
    }

    if (targetRequest.status !== "pending") {
      return NextResponse.json(
        { error: `Request has already been ${targetRequest.status}.` },
        { status: 409 }
      );
    }

    const status = action === "approve" ? "approved" : "rejected";

    // Update the request status in the sheet
    const updatedRequest = await updateRequestStatus(
      requestId,
      status,
      reviewedBy
    );

    // If approved, update the team's domain and increment track_change_count
    if (status === "approved" && targetRequest) {
      // Count how many approved requests this team has (including the current one)
      const teamRequests = allRequests.filter(
        (r) => r.teamId === targetRequest.teamId
      );
      const approvedCount =
        teamRequests.filter((r) => r.status === "approved").length + 1;

      await updateTeamDomain(
        targetRequest.teamId,
        targetRequest.requestedTrack,
        approvedCount
      );

      // Update Domain Stats sheet (fire-and-forget)
      writeDomainStatsToSheet().catch(() => {});
    }

    return NextResponse.json({ success: true, request: updatedRequest });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not process track change action.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
