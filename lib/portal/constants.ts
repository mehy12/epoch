export const PORTAL_SESSION_COOKIE = "epoch26_portal_session";

export const PORTAL_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const PORTAL_PPT_DEADLINE = "April 25, 2026";

export const DOMAIN_PREFIX_MAP: Record<string, string> = {
  "AI for Social Good": "AI",
  "Sustainability Goals": "SG",
  "Cybersecurity & Blockchain": "CB",
};

export const SHEET_REQUIRED_COLUMNS = [
  "Payment Status",
  "Team ID",
  "Portal Access Enabled",
  "Password Hash",
  "PPT Submitted",
  "PPT File Name",
  "PPT Drive URL",
  "PPT Uploaded At",
  "Track Change Count",
  "Track Locked",
] as const;

export const TRACK_CHANGES_SHEET_NAME = "Track Change Requests";

export const TRACK_CHANGES_SHEET_HEADERS = [
  "Request ID",
  "Team ID",
  "Team Name",
  "Current Track",
  "Requested Track",
  "Reason",
  "Status",
  "Created At",
  "Reviewed By",
  "Reviewed At",
] as const;

export const AVAILABLE_TRACKS = [
  "AI for Social Good",
  "Sustainability Goals",
  "Cybersecurity & Blockchain",
] as const;

export const MAX_TRACK_CHANGES = 2;

export const ADMIN_PASSPHRASE = process.env.ADMIN_PASSPHRASE || "epoch26-admin";

export const ACCEPTED_PPT_MIME_TYPES = [
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/pdf",
];

export const ACCEPTED_PPT_EXTENSIONS = ["ppt", "pptx", "pdf"];

export const MAX_PPT_UPLOAD_BYTES = 20 * 1024 * 1024;
