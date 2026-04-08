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
] as const;

export const ACCEPTED_PPT_MIME_TYPES = [
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/pdf",
];

export const ACCEPTED_PPT_EXTENSIONS = ["ppt", "pptx", "pdf"];

export const MAX_PPT_UPLOAD_BYTES = 20 * 1024 * 1024;
