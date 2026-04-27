import { ADMIN_PASSPHRASE } from "@/lib/portal/constants";
import {
  isTrackChangeDisabled,
  setTrackChangeDisabled,
} from "@/lib/portal/settings";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET – Check whether track change is globally disabled.
 */
export async function GET(request: NextRequest) {
  try {
    const passphrase = request.headers.get("x-admin-passphrase");
    if (!passphrase || passphrase !== ADMIN_PASSPHRASE) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const disabled = await isTrackChangeDisabled();

    return NextResponse.json({ success: true, disabled });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch track change toggle status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST – Enable or disable track change for all participants.
 * Body: { "disabled": true | false }
 */
export async function POST(request: NextRequest) {
  try {
    const passphrase = request.headers.get("x-admin-passphrase");
    if (!passphrase || passphrase !== ADMIN_PASSPHRASE) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const disabled = Boolean(body.disabled);

    await setTrackChangeDisabled(disabled);

    return NextResponse.json({ success: true, disabled });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not update track change toggle.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
