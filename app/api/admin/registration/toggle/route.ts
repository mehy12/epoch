import { ADMIN_PASSPHRASE } from "@/lib/portal/constants";
import {
  isRegistrationClosed,
  setRegistrationClosed,
} from "@/lib/portal/settings";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET – Check whether registrations are globally disabled.
 */
export async function GET(request: NextRequest) {
  try {
    const passphrase = request.headers.get("x-admin-passphrase");
    if (!passphrase || passphrase !== ADMIN_PASSPHRASE) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const disabled = await isRegistrationClosed();

    return NextResponse.json({ success: true, disabled });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch registration toggle status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST – Enable or disable registrations for all participants.
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

    await setRegistrationClosed(disabled);

    return NextResponse.json({ success: true, disabled });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not update registration toggle.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
