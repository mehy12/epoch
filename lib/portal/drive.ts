import { getDriveClient, getSubmissionRootFolderId } from "@/lib/portal/google";
import { getDomainFolderName, sanitizeFileName } from "@/lib/portal/utils";
import { Readable } from "stream";

async function findFolderByName(parentFolderId: string, name: string): Promise<string | null> {
  const drive = getDriveClient();
  const query = [
    `mimeType = 'application/vnd.google-apps.folder'`,
    `name = '${name.replace(/'/g, "\\'")}'`,
    `'${parentFolderId}' in parents`,
    "trashed = false",
  ].join(" and ");

  const response = await drive.files.list({
    q: query,
    fields: "files(id,name)",
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const folder = response.data.files?.[0];
  return folder?.id || null;
}

async function getOrCreateFolder(parentFolderId: string, name: string): Promise<string> {
  const existingId = await findFolderByName(parentFolderId, name);
  if (existingId) {
    return existingId;
  }

  const drive = getDriveClient();
  const createResponse = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    },
    fields: "id",
    supportsAllDrives: true,
  });

  const folderId = createResponse.data.id;
  if (!folderId) {
    throw new Error("Failed to create submission folder in Google Drive.");
  }

  return folderId;
}

export async function uploadRound1Submission(payload: {
  teamId: string;
  domain: string;
  originalFileName: string;
  mimeType: string;
  bytes: Buffer;
}) {
  const rootFolderId = getSubmissionRootFolderId();
  const domainFolderName = getDomainFolderName(payload.domain);
  const domainFolderId = await getOrCreateFolder(rootFolderId, domainFolderName);

  const safeOriginalName = sanitizeFileName(payload.originalFileName || "submission");
  const extension = safeOriginalName.includes(".") ? safeOriginalName.split(".").pop() : "pptx";
  const base = safeOriginalName.replace(/\.[^.]+$/, "") || "submission";
  const stampedName = `${payload.teamId}_${Date.now()}_${base}.${extension}`;

  const drive = getDriveClient();

  const createResponse = await drive.files.create({
    requestBody: {
      name: stampedName,
      parents: [domainFolderId],
    },
    media: {
      mimeType: payload.mimeType,
      body: Readable.from(payload.bytes),
    },
    fields: "id,name,webViewLink",
    supportsAllDrives: true,
  });

  const fileId = createResponse.data.id;
  if (!fileId) {
    throw new Error("Google Drive upload failed.");
  }

  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
      supportsAllDrives: true,
    });
  } catch {
    // Some domains block public sharing; keep file URL usable for admins with access.
  }

  const driveUrl = createResponse.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

  return {
    fileId,
    fileName: stampedName,
    driveUrl,
  };
}
