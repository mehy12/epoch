import { NextResponse } from "next/server";
import { findTeamByIdentifier } from "@/lib/portal/sheets";

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const email = normalizeEmail(body?.email);
  const phone = normalizePhone(body?.phone);

  if (!email && !phone) {
    return NextResponse.json({ error: "Email or phone is required." }, { status: 400 });
  }

  try {
    const emailMatch = email ? await findTeamByIdentifier(email) : null;
    const phoneMatch = phone ? await findTeamByIdentifier(phone) : null;

    const matchedRecord = emailMatch?.record || phoneMatch?.record || null;

    return NextResponse.json({
      exists: Boolean(emailMatch || phoneMatch),
      matchesEmail: Boolean(emailMatch),
      matchesPhone: Boolean(phoneMatch),
      teamName: matchedRecord?.teamName || "",
      teamId: matchedRecord?.teamId || "",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not verify duplicate registration.",
      },
      { status: 500 }
    );
  }
}