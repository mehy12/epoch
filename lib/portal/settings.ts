import { getSheetsClient, getSheetConfig } from "@/lib/portal/google";

const SETTINGS_SHEET_NAME = "Settings";

/**
 * Ensures the "Settings" sheet tab exists in the spreadsheet.
 * Creates it with headers if it doesn't exist.
 */
async function ensureSettingsSheet(): Promise<void> {
  const sheets = getSheetsClient();
  const { spreadsheetId } = getSheetConfig();

  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = spreadsheet.data.sheets?.some(
    (s) => s.properties?.title === SETTINGS_SHEET_NAME
  );

  if (exists) {
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: SETTINGS_SHEET_NAME,
            },
          },
        },
      ],
    },
  });

  // Write headers
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${SETTINGS_SHEET_NAME}'!A1:C1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [["Key", "Value", "Updated At"]],
    },
  });
}

/**
 * Reads a setting value by key. Returns null if the key doesn't exist.
 */
export async function getSetting(key: string): Promise<string | null> {
  await ensureSettingsSheet();

  const sheets = getSheetsClient();
  const { spreadsheetId } = getSheetConfig();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${SETTINGS_SHEET_NAME}'!A1:C100`,
  });

  const values = (response.data.values || []) as string[][];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (String(row[0] || "").trim() === key) {
      return String(row[1] || "").trim();
    }
  }

  return null;
}

/**
 * Sets a setting value by key. Creates the row if it doesn't exist,
 * or updates it if it does.
 */
export async function setSetting(key: string, value: string): Promise<void> {
  await ensureSettingsSheet();

  const sheets = getSheetsClient();
  const { spreadsheetId } = getSheetConfig();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${SETTINGS_SHEET_NAME}'!A1:C100`,
  });

  const values = (response.data.values || []) as string[][];
  const updatedAt = new Date().toISOString();

  // Search for existing key (skip header row)
  let targetRowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0] || "").trim() === key) {
      targetRowIndex = i;
      break;
    }
  }

  if (targetRowIndex >= 0) {
    // Update existing row
    const sheetRow = targetRowIndex + 1; // 1-indexed
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "RAW",
        data: [
          {
            range: `'${SETTINGS_SHEET_NAME}'!B${sheetRow}`,
            values: [[value]],
          },
          {
            range: `'${SETTINGS_SHEET_NAME}'!C${sheetRow}`,
            values: [[updatedAt]],
          },
        ],
      },
    });
  } else {
    // Append new row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${SETTINGS_SHEET_NAME}'!A:C`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[key, value, updatedAt]],
      },
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Convenience: Track-change feature toggle                           */
/* ------------------------------------------------------------------ */

const TRACK_CHANGE_DISABLED_KEY = "track_change_disabled";

export async function isTrackChangeDisabled(): Promise<boolean> {
  const value = await getSetting(TRACK_CHANGE_DISABLED_KEY);
  return value === "true";
}

export async function setTrackChangeDisabled(disabled: boolean): Promise<void> {
  await setSetting(TRACK_CHANGE_DISABLED_KEY, disabled ? "true" : "false");
}
