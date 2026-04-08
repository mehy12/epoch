import {
  ACCEPTED_PPT_EXTENSIONS,
  ACCEPTED_PPT_MIME_TYPES,
  MAX_PPT_UPLOAD_BYTES,
} from "@/lib/portal/constants";
import { uploadRound1Submission } from "@/lib/portal/drive";
import { getSessionFromRequest } from "@/lib/portal/api-auth";
import { getPortalProfileBySession, getPortalRecordBySession, updatePptSubmission } from "@/lib/portal/sheets";
import { isPaymentVerified } from "@/lib/portal/utils";
import { NextRequest, NextResponse } from "next/server";

function getFileExtension(name: string): string {
  const split = String(name || "").split(".");
  return split.length > 1 ? split[split.length - 1].toLowerCase() : "";
}

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

    if (!isPaymentVerified(record.paymentStatus)) {
      return NextResponse.json(
        {
          error: "PPT upload is locked until payment is verified. Please wait for payment verification.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose a file to upload." }, { status: 400 });
    }

    const extension = getFileExtension(file.name);
    if (!ACCEPTED_PPT_EXTENSIONS.includes(extension)) {
      return NextResponse.json({ error: "Only .ppt, .pptx, and .pdf files are accepted." }, { status: 400 });
    }

    if (file.type && !ACCEPTED_PPT_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Upload a valid PPT, PPTX, or PDF file." },
        { status: 400 }
      );
    }

    if (file.size > MAX_PPT_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Max allowed size is 20 MB." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    const driveUpload = await uploadRound1Submission({
      teamId: record.teamId,
      domain: record.domain,
      originalFileName: file.name,
      mimeType: file.type || "application/octet-stream",
      bytes,
    });

    const uploadedAt = new Date().toISOString();

    await updatePptSubmission(record.rowNumber, {
      fileName: driveUpload.fileName,
      driveUrl: driveUpload.driveUrl,
      uploadedAt,
    });

    const profile = await getPortalProfileBySession(session);

    return NextResponse.json({
      success: true,
      profile,
      upload: {
        fileName: driveUpload.fileName,
        driveUrl: driveUpload.driveUrl,
        uploadedAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
