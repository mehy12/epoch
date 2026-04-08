import { DOMAIN_PREFIX_MAP, SHEET_REQUIRED_COLUMNS } from "@/lib/portal/constants";
import { getSheetConfig, getSheetsClient } from "@/lib/portal/google";
import {
  PortalPublicProfile,
  PortalRecord,
  PortalSessionPayload,
  TeamLookupResult,
} from "@/lib/portal/types";
import {
  getPhoneVariants,
  isPaymentVerified,
  normalizeEmail,
  normalizeIdentifier,
  normalizePhone,
  toBooleanCell,
} from "@/lib/portal/utils";

type RecordKey =
  | "timestamp"
  | "teamName"
  | "teamLeaderName"
  | "email"
  | "phone"
  | "college"
  | "domain"
  | "ideaTitle"
  | "paymentStatus"
  | "teamId"
  | "portalAccessEnabled"
  | "passwordHash"
  | "pptSubmitted"
  | "pptFileName"
  | "pptDriveUrl"
  | "pptUploadedAt";

const COLUMN_ALIASES: Record<RecordKey, string[]> = {
  timestamp: ["Timestamp"],
  teamName: ["Team Name"],
  teamLeaderName: ["Team Leader Name", "Leader Name"],
  email: ["Email", "Leader Email"],
  phone: ["Phone", "Leader Mobile"],
  college: ["College", "College Name"],
  domain: ["Domain", "Track"],
  ideaTitle: ["Idea Title", "Idea Description"],
  paymentStatus: ["Payment Status"],
  teamId: ["Team ID"],
  portalAccessEnabled: ["Portal Access Enabled"],
  passwordHash: ["Password Hash"],
  pptSubmitted: ["PPT Submitted"],
  pptFileName: ["PPT File Name"],
  pptDriveUrl: ["PPT Drive URL", "PPT Link"],
  pptUploadedAt: ["PPT Uploaded At"],
};

interface SheetContext {
  headers: string[];
  rows: string[][];
}

function toColumnLetter(indexZeroBased: number): string {
  let value = indexZeroBased + 1;
  let result = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - remainder) / 26);
  }

  return result;
}

function getCell(row: string[], index: number): string {
  if (index < 0) {
    return "";
  }

  return String(row[index] ?? "").trim();
}

function getColumnIndex(headers: string[], key: RecordKey): number {
  const aliases = COLUMN_ALIASES[key];

  for (const alias of aliases) {
    const match = headers.findIndex((header) => header.trim() === alias);
    if (match >= 0) {
      return match;
    }
  }

  return -1;
}

async function readSheetContext(): Promise<SheetContext> {
  const sheets = getSheetsClient();
  const { spreadsheetId, sheetName } = getSheetConfig();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:ZZ`,
  });

  const values = (response.data.values || []) as string[][];

  if (values.length === 0) {
    throw new Error("Registration sheet is empty. Add a header row first.");
  }

  return {
    headers: values[0].map((value) => String(value || "").trim()),
    rows: values.slice(1).map((row) => row.map((cell) => String(cell || ""))),
  };
}

async function ensureRequiredColumns(headers: string[]): Promise<boolean> {
  const nextHeaders = [...headers];
  let changed = false;

  for (const requiredColumn of SHEET_REQUIRED_COLUMNS) {
    if (!nextHeaders.includes(requiredColumn)) {
      nextHeaders.push(requiredColumn);
      changed = true;
    }
  }

  if (!changed) {
    return false;
  }

  const sheets = getSheetsClient();
  const { spreadsheetId, sheetName } = getSheetConfig();

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A1:${toColumnLetter(nextHeaders.length - 1)}1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [nextHeaders],
    },
  });

  return true;
}

async function getSheetContextWithRequiredColumns(): Promise<SheetContext> {
  const initial = await readSheetContext();
  const changed = await ensureRequiredColumns(initial.headers);
  if (!changed) {
    return initial;
  }

  return readSheetContext();
}

function mapRowToRecord(headers: string[], row: string[], rowNumber: number): PortalRecord {
  const timestamp = getCell(row, getColumnIndex(headers, "timestamp"));
  const teamName = getCell(row, getColumnIndex(headers, "teamName"));
  const teamLeaderName = getCell(row, getColumnIndex(headers, "teamLeaderName"));
  const email = getCell(row, getColumnIndex(headers, "email"));
  const phone = getCell(row, getColumnIndex(headers, "phone"));
  const college = getCell(row, getColumnIndex(headers, "college"));
  const domain = getCell(row, getColumnIndex(headers, "domain"));
  const ideaTitle = getCell(row, getColumnIndex(headers, "ideaTitle"));
  const paymentStatus = getCell(row, getColumnIndex(headers, "paymentStatus"));
  const teamId = getCell(row, getColumnIndex(headers, "teamId"));
  const portalAccessEnabled = toBooleanCell(getCell(row, getColumnIndex(headers, "portalAccessEnabled")));
  const passwordHash = getCell(row, getColumnIndex(headers, "passwordHash"));
  const pptSubmitted = toBooleanCell(getCell(row, getColumnIndex(headers, "pptSubmitted")));
  const pptFileName = getCell(row, getColumnIndex(headers, "pptFileName"));
  const pptDriveUrl = getCell(row, getColumnIndex(headers, "pptDriveUrl"));
  const pptUploadedAt = getCell(row, getColumnIndex(headers, "pptUploadedAt"));

  return {
    rowNumber,
    timestamp,
    teamName,
    teamLeaderName,
    email,
    phone,
    college,
    domain,
    ideaTitle,
    paymentStatus,
    teamId,
    portalAccessEnabled,
    passwordHash,
    pptSubmitted,
    pptFileName,
    pptDriveUrl,
    pptUploadedAt,
  };
}

function formatProfile(record: PortalRecord): PortalPublicProfile {
  return {
    teamName: record.teamName,
    teamId: record.teamId,
    teamLeaderName: record.teamLeaderName,
    email: record.email,
    phone: record.phone,
    college: record.college,
    domain: record.domain,
    ideaTitle: record.ideaTitle,
    registrationDate: record.timestamp,
    paymentStatus: record.paymentStatus || "Pending",
    pptSubmitted: record.pptSubmitted,
    pptFileName: record.pptFileName,
    pptDriveUrl: record.pptDriveUrl,
    pptUploadedAt: record.pptUploadedAt,
  };
}

function findByIdentifierInRows(
  headers: string[],
  rows: string[][],
  identifier: string
): TeamLookupResult | null {
  const parsed = normalizeIdentifier(identifier);

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const record = mapRowToRecord(headers, row, i + 2);

    if (!record.teamName && !record.email && !record.phone) {
      continue;
    }

    if (parsed.kind === "email") {
      if (normalizeEmail(record.email) === parsed.value) {
        return { record, matchedOn: "email" };
      }
      continue;
    }

    const variants = getPhoneVariants(record.phone);
    if (variants.includes(parsed.value)) {
      return { record, matchedOn: "phone" };
    }
  }

  return null;
}

async function updateRowCells(rowNumber: number, updates: Record<string, string>): Promise<void> {
  const context = await getSheetContextWithRequiredColumns();
  const sheets = getSheetsClient();
  const { spreadsheetId, sheetName } = getSheetConfig();

  const data = Object.entries(updates)
    .map(([header, value]) => {
      const columnIndex = context.headers.findIndex((item) => item.trim() === header);
      if (columnIndex < 0) {
        return null;
      }

      return {
        range: `${sheetName}!${toColumnLetter(columnIndex)}${rowNumber}`,
        values: [[value]],
      };
    })
    .filter(Boolean) as Array<{ range: string; values: string[][] }>;

  if (data.length === 0) {
    return;
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "RAW",
      data,
    },
  });
}

function getDomainPrefix(domain: string): string {
  return DOMAIN_PREFIX_MAP[domain] || "TM";
}

function createNextTeamId(prefix: string, existingIds: string[]): string {
  let max = 100;

  for (const teamId of existingIds) {
    const match = String(teamId).trim().match(new RegExp(`^${prefix}-(\\d+)$`));
    if (!match) {
      continue;
    }

    const value = Number(match[1]);
    if (Number.isFinite(value) && value > max) {
      max = value;
    }
  }

  return `${prefix}-${max + 1}`;
}

export async function findTeamByIdentifier(identifier: string): Promise<TeamLookupResult | null> {
  const context = await getSheetContextWithRequiredColumns();
  return findByIdentifierInRows(context.headers, context.rows, identifier);
}

export async function ensureTeamIdForRecord(record: PortalRecord): Promise<string> {
  if (record.teamId) {
    return record.teamId;
  }

  const context = await getSheetContextWithRequiredColumns();
  const teamIdColumn = getColumnIndex(context.headers, "teamId");
  const existingIds =
    teamIdColumn >= 0 ? context.rows.map((row) => String(row[teamIdColumn] || "").trim()) : [];

  const prefix = getDomainPrefix(record.domain);
  const nextTeamId = createNextTeamId(prefix, existingIds);

  await updateRowCells(record.rowNumber, {
    "Team ID": nextTeamId,
  });

  return nextTeamId;
}

export async function ensureTeamIdByIdentifier(identifier: string): Promise<string | null> {
  const found = await findTeamByIdentifier(identifier);
  if (!found) {
    return null;
  }

  return ensureTeamIdForRecord(found.record);
}

export async function verifyPortalIdentifier(identifier: string) {
  const found = await findTeamByIdentifier(identifier);

  if (!found) {
    return {
      exists: false,
      eligible: false,
      teamName: "",
      teamId: "",
      paymentStatus: "Pending",
      portalEnabled: false,
      reason: "No registration found for this email/mobile.",
    };
  }

  const teamId = await ensureTeamIdForRecord(found.record);

  const portalEnabled = found.record.portalAccessEnabled || Boolean(found.record.passwordHash);
  const paymentVerified = isPaymentVerified(found.record.paymentStatus);

  return {
    exists: true,
    eligible: paymentVerified,
    teamName: found.record.teamName,
    teamId,
    paymentStatus: found.record.paymentStatus || "Pending",
    portalEnabled,
    reason: paymentVerified
      ? "Registration and payment verified. Portal access setup is enabled."
      : "Registration found. You can create portal access now, but PPT upload is locked until payment is verified.",
  };
}

export async function createPortalPassword(
  identifier: string,
  passwordHash: string
): Promise<PortalPublicProfile> {
  const found = await findTeamByIdentifier(identifier);

  if (!found) {
    throw new Error("No registration found for this identifier.");
  }

  const { record } = found;

  if (record.portalAccessEnabled || record.passwordHash) {
    throw new Error("Portal password is already set for this team. Use login instead.");
  }

  const teamId = await ensureTeamIdForRecord(record);

  await updateRowCells(record.rowNumber, {
    "Team ID": teamId,
    "Portal Access Enabled": "Yes",
    "Password Hash": passwordHash,
  });

  return formatProfile({
    ...record,
    teamId,
    portalAccessEnabled: true,
    passwordHash,
  });
}

export async function getRecordForLogin(identifier: string): Promise<PortalRecord | null> {
  const found = await findTeamByIdentifier(identifier);
  if (!found) {
    return null;
  }

  const teamId = await ensureTeamIdForRecord(found.record);
  return {
    ...found.record,
    teamId,
  };
}

export async function getPortalProfileBySession(
  session: PortalSessionPayload
): Promise<PortalPublicProfile | null> {
  const email = normalizeEmail(session.email);
  const phone = normalizePhone(session.phone);

  let found: TeamLookupResult | null = null;

  if (email) {
    found = await findTeamByIdentifier(email);
  }

  if (!found && phone) {
    found = await findTeamByIdentifier(phone);
  }

  if (!found) {
    return null;
  }

  const teamId = await ensureTeamIdForRecord(found.record);

  if (session.teamId && teamId && session.teamId !== teamId) {
    return null;
  }

  return formatProfile({
    ...found.record,
    teamId,
  });
}

export async function getPortalRecordBySession(
  session: PortalSessionPayload
): Promise<PortalRecord | null> {
  const email = normalizeEmail(session.email);
  const phone = normalizePhone(session.phone);

  let found: TeamLookupResult | null = null;

  if (email) {
    found = await findTeamByIdentifier(email);
  }

  if (!found && phone) {
    found = await findTeamByIdentifier(phone);
  }

  if (!found) {
    return null;
  }

  const teamId = await ensureTeamIdForRecord(found.record);

  if (session.teamId && teamId && session.teamId !== teamId) {
    return null;
  }

  return {
    ...found.record,
    teamId,
  };
}

export async function updatePptSubmission(
  rowNumber: number,
  payload: {
    fileName: string;
    driveUrl: string;
    uploadedAt: string;
  }
): Promise<void> {
  await updateRowCells(rowNumber, {
    "PPT Submitted": "Yes",
    "PPT File Name": payload.fileName,
    "PPT Drive URL": payload.driveUrl,
    "PPT Uploaded At": payload.uploadedAt,
  });
}

export async function assignTeamIdAfterRegistration(payload: {
  email?: string;
  phone?: string;
}): Promise<string | null> {
  const email = normalizeEmail(payload.email || "");
  const phone = normalizePhone(payload.phone || "");

  if (email) {
    const result = await ensureTeamIdByIdentifier(email);
    if (result) {
      return result;
    }
  }

  if (phone) {
    const result = await ensureTeamIdByIdentifier(phone);
    if (result) {
      return result;
    }
  }

  return null;
}
