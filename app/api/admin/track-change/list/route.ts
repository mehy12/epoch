import { ADMIN_PASSPHRASE } from "@/lib/portal/constants";
import { getAllRequests } from "@/lib/portal/track-changes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const passphrase = request.headers.get("x-admin-passphrase");
    if (!passphrase || passphrase !== ADMIN_PASSPHRASE) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const requests = await getAllRequests();

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch track change requests.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
