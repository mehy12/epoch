import { getTeamCountsByDomain } from "@/lib/portal/sheets";
import { writeDomainStatsToSheet } from "@/lib/portal/track-changes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const counts = await getTeamCountsByDomain();
    const total = Object.values(counts).reduce((s, n) => s + n, 0);

    // Keep the Google Sheet "Domain Stats" tab in sync (fire-and-forget)
    writeDomainStatsToSheet().catch(() => {});

    return NextResponse.json({ success: true, counts, total });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch domain counts.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
