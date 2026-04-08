import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];

let cachedAuth: GoogleAuth | null = null;

function sanitizePrivateKey(rawValue: string | undefined): string {
  const raw = String(rawValue || "").trim();
  if (!raw) {
    return "";
  }

  const withoutTrailingComma = raw.endsWith(",") ? raw.slice(0, -1) : raw;
  const unwrapped =
    (withoutTrailingComma.startsWith('"') && withoutTrailingComma.endsWith('"')) ||
    (withoutTrailingComma.startsWith("'") && withoutTrailingComma.endsWith("'"))
      ? withoutTrailingComma.slice(1, -1)
      : withoutTrailingComma;

  return unwrapped.replace(/\\n/g, "\n");
}

function readGoogleCredentials() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = sanitizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Missing Google service account credentials. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY."
    );
  }

  return {
    client_email: clientEmail,
    private_key: privateKey,
  };
}

export function getGoogleAuth() {
  if (cachedAuth) {
    return cachedAuth;
  }

  const credentials = readGoogleCredentials();
  cachedAuth = new GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: GOOGLE_SCOPES,
  });

  return cachedAuth;
}

export function getSheetsClient() {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
}

export function getDriveClient() {
  return google.drive({ version: "v3", auth: getGoogleAuth() });
}

export function getSheetConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || "Registrations";

  if (!spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEET_ID environment variable.");
  }

  return { spreadsheetId, sheetName };
}

export function getSubmissionRootFolderId(): string {
  const folderId = process.env.GOOGLE_DRIVE_SUBMISSIONS_FOLDER_ID;
  if (!folderId) {
    throw new Error(
      "Missing GOOGLE_DRIVE_SUBMISSIONS_FOLDER_ID. Create and share EPOCH26_Round1_Submissions with service account editor access."
    );
  }

  return folderId;
}
