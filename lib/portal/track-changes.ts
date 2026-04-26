import {
  AVAILABLE_TRACKS,
  TRACK_CHANGES_SHEET_HEADERS,
  TRACK_CHANGES_SHEET_NAME,
} from "@/lib/portal/constants";
import { getSheetsClient, getSheetConfig } from "@/lib/portal/google";
import { getTeamCountsByDomain } from "@/lib/portal/sheets";
import { TrackChangeRequest, TrackChangeStatus } from "@/lib/portal/types";

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                   */
/* ------------------------------------------------------------------ */

function getTrackChangesRange(): string {
  return `'${TRACK_CHANGES_SHEET_NAME}'!A1:ZZ`;
}

function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `TCR-${timestamp}-${random}`.toUpperCase();
}

/**
 * Ensures the "Track Change Requests" sheet tab exists.
 * If it doesn't exist, creates it with the correct headers.
 */
async function ensureTrackChangesSheet(): Promise<void> {
  const sheets = getSheetsClient();
  const { spreadsheetId } = getSheetConfig();

  // Check if the sheet tab already exists
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetExists = spreadsheet.data.sheets?.some(
    (s) => s.properties?.title === TRACK_CHANGES_SHEET_NAME
  );

  if (sheetExists) {
    return;
  }

  // Create the sheet tab
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: TRACK_CHANGES_SHEET_NAME,
            },
          },
        },
      ],
    },
  });

  // Write headers
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${TRACK_CHANGES_SHEET_NAME}'!A1:${String.fromCharCode(
      64 + TRACK_CHANGES_SHEET_HEADERS.length
    )}1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[...TRACK_CHANGES_SHEET_HEADERS]],
    },
  });
}

/**
 * Reads all rows from the Track Change Requests sheet.
 */
async function readTrackChangesRows(): Promise<string[][]> {
  await ensureTrackChangesSheet();

  const sheets = getSheetsClient();
  const { spreadsheetId } = getSheetConfig();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: getTrackChangesRange(),
  });

  const values = (response.data.values || []) as string[][];
  if (values.length <= 1) {
    return [];
  }

  return values.slice(1); // skip headers
}

function mapRowToRequest(row: string[]): TrackChangeRequest {
  return {
    requestId: String(row[0] || "").trim(),
    teamId: String(row[1] || "").trim(),
    teamName: String(row[2] || "").trim(),
    currentTrack: String(row[3] || "").trim(),
    requestedTrack: String(row[4] || "").trim(),
    reason: String(row[5] || "").trim(),
    status: (String(row[6] || "").trim().toLowerCase() as TrackChangeStatus) || "pending",
    createdAt: String(row[7] || "").trim(),
    reviewedBy: String(row[8] || "").trim(),
    reviewedAt: String(row[9] || "").trim(),
  };
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export async function getRequestsForTeam(teamId: string): Promise<TrackChangeRequest[]> {
  const rows = await readTrackChangesRows();
  return rows
    .map(mapRowToRequest)
    .filter((request) => request.teamId === teamId);
}

export async function getAllRequests(): Promise<TrackChangeRequest[]> {
  const rows = await readTrackChangesRows();
  return rows.map(mapRowToRequest);
}

export async function createTrackChangeRequest(payload: {
  teamId: string;
  teamName: string;
  currentTrack: string;
  requestedTrack: string;
  reason: string;
}): Promise<TrackChangeRequest> {
  await ensureTrackChangesSheet();

  const sheets = getSheetsClient();
  const { spreadsheetId } = getSheetConfig();

  const requestId = generateRequestId();
  const createdAt = new Date().toISOString();

  const newRow = [
    requestId,
    payload.teamId,
    payload.teamName,
    payload.currentTrack,
    payload.requestedTrack,
    payload.reason,
    "pending",
    createdAt,
    "", // reviewed_by
    "", // reviewed_at
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${TRACK_CHANGES_SHEET_NAME}'!A:J`,
    valueInputOption: "RAW",
    requestBody: {
      values: [newRow],
    },
  });

  return {
    requestId,
    teamId: payload.teamId,
    teamName: payload.teamName,
    currentTrack: payload.currentTrack,
    requestedTrack: payload.requestedTrack,
    reason: payload.reason,
    status: "pending",
    createdAt,
    reviewedBy: "",
    reviewedAt: "",
  };
}

export async function updateRequestStatus(
  requestId: string,
  status: "approved" | "rejected",
  reviewedBy: string
): Promise<TrackChangeRequest | null> {
  await ensureTrackChangesSheet();

  const sheets = getSheetsClient();
  const { spreadsheetId } = getSheetConfig();

  // Re-read to find the row index
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: getTrackChangesRange(),
  });

  const values = (response.data.values || []) as string[][];
  if (values.length <= 1) {
    return null;
  }

  // Find the row (skip header at index 0)
  let targetRowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0] || "").trim() === requestId) {
      targetRowIndex = i;
      break;
    }
  }

  if (targetRowIndex < 0) {
    return null;
  }

  const reviewedAt = new Date().toISOString();

  // Update status (col G = index 6), reviewed_by (col I = index 8), reviewed_at (col J = index 9)
  const sheetRow = targetRowIndex + 1; // 1-indexed

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: [
        {
          range: `'${TRACK_CHANGES_SHEET_NAME}'!G${sheetRow}`,
          values: [[status]],
        },
        {
          range: `'${TRACK_CHANGES_SHEET_NAME}'!I${sheetRow}`,
          values: [[reviewedBy]],
        },
        {
          range: `'${TRACK_CHANGES_SHEET_NAME}'!J${sheetRow}`,
          values: [[reviewedAt]],
        },
      ],
    },
  });

  return mapRowToRequest([
    ...values[targetRowIndex].slice(0, 6),
    status,
    values[targetRowIndex][7] || "",
    reviewedBy,
    reviewedAt,
  ]);
}

const DOMAIN_STATS_SHEET_NAME = "Domain Stats";

/**
 * Creates or updates a "Domain Stats" sheet tab in the spreadsheet
 * with the current team counts per domain. This makes the data
 * visible in Excel / Google Sheets for organizers.
 */
export async function writeDomainStatsToSheet(): Promise<void> {
  const sheets = getSheetsClient();
  const { spreadsheetId } = getSheetConfig();

  // Ensure the sheet tab exists
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = spreadsheet.data.sheets?.some(
    (s) => s.properties?.title === DOMAIN_STATS_SHEET_NAME
  );

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: DOMAIN_STATS_SHEET_NAME,
              },
            },
          },
        ],
      },
    });
  }

  // Fetch live counts
  const counts = await getTeamCountsByDomain();
  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  // Build rows
  const rows: string[][] = [
    ["Domain", "Teams", "Percentage", "Last Updated"],
  ];

  for (const track of AVAILABLE_TRACKS) {
    const count = counts[track] || 0;
    const pct = total > 0 ? `${Math.round((count / total) * 100)}%` : "0%";
    rows.push([track, String(count), pct, ""]);
  }

  rows.push([]);
  rows.push(["Total", String(total), "100%", new Date().toISOString()]);

  // Write (overwrite entire sheet contents)
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${DOMAIN_STATS_SHEET_NAME}'!A1:D${rows.length}`,
    valueInputOption: "RAW",
    requestBody: {
      values: rows,
    },
  });
}

