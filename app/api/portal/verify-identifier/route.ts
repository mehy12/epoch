import { verifyPortalIdentifier } from "@/lib/portal/sheets";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  identifier: z.string().trim().min(3),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { identifier } = bodySchema.parse(json);

    const result = await verifyPortalIdentifier(identifier);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid identifier." }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unable to verify identifier.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
