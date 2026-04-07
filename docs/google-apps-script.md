# Google Sheets + Apps Script Registration Backend

Use this with the Next.js `/api/register` endpoint to store every registration in Google Sheets.

## 1) Create the Sheet

1. Create a Google Sheet.
2. Rename the first tab to `Registrations`.
3. In row 1, add headers (this script will also auto-create headers if empty):

- Timestamp
- Team Name
- Track
- Team Size
- Leader Name
- Leader Email
- Leader Mobile
- College Name
- Leader Department
- Leader Year
- Leader USN
- Leader IEEE ID
- Member Details JSON
- Idea Description
- PPT Link
- Declaration JSON
- Payment Amount
- Payment UTR
- Payment Screenshot URL
- Payment Screenshot Name

## 2) Create Apps Script project

1. Open the sheet.
2. Go to `Extensions -> Apps Script`.
3. Replace `Code.gs` with the script below.
4. Set script properties:

- `SHEET_NAME` = `Registrations`
- `API_KEY` = same value as `APPS_SCRIPT_API_KEY` from `.env.local` (Next API forwards it as `_apiKey` in JSON body). For quick testing, you can leave this blank to disable key validation.

## 3) Apps Script code (`Code.gs`)

```javascript
function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var apiKey = props.getProperty('API_KEY') || '';
    var sheetName = props.getProperty('SHEET_NAME') || 'Registrations';

    if (!(e && e.postData && e.postData.contents)) {
      return jsonResponse({ success: false, error: 'Invalid payload' });
    }

    var payload = JSON.parse(e.postData.contents);
    var providedKey = (payload && payload._apiKey) ? String(payload._apiKey) : '';

    if (payload && payload._apiKey) {
      delete payload._apiKey;
    }

    // If API_KEY property is set, enforce it. If empty, skip key validation for quick testing.
    if (apiKey && apiKey !== providedKey) {
      return jsonResponse({ success: false, error: 'Unauthorized key' });
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

    ensureHeaders(sheet);

    var membersJson = JSON.stringify(payload.members || []);
    var declarationJson = JSON.stringify(payload.declaration || {});
    var payment = payload.payment || {};
    var screenshotUrl = savePaymentScreenshot(payment);

    sheet.appendRow([
      payload.submittedAt || new Date().toISOString(),
      payload.teamInfo && payload.teamInfo.teamName || '',
      payload.teamInfo && payload.teamInfo.track || '',
      payload.teamInfo && payload.teamInfo.teamSize || '',
      payload.leader && payload.leader.fullName || '',
      payload.leader && payload.leader.email || '',
      payload.leader && payload.leader.mobile || '',
      payload.leader && payload.leader.collegeName || '',
      payload.leader && payload.leader.department || '',
      payload.leader && payload.leader.yearOfStudy || '',
      payload.leader && payload.leader.usn || '',
      payload.leader && payload.leader.ieeeId || '',
      membersJson,
      payload.idea && payload.idea.description || '',
      payload.idea && payload.idea.pptLink || '',
      declarationJson,
      payment.amount || 0,
      payment.utrNumber || '',
      screenshotUrl,
      payment.screenshotFileName || '',
    ]);

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || 'Unknown error' });
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow([
    'Timestamp',
    'Team Name',
    'Track',
    'Team Size',
    'Leader Name',
    'Leader Email',
    'Leader Mobile',
    'College Name',
    'Leader Department',
    'Leader Year',
    'Leader USN',
    'Leader IEEE ID',
    'Member Details JSON',
    'Idea Description',
    'PPT Link',
    'Declaration JSON',
    'Payment Amount',
    'Payment UTR',
    'Payment Screenshot URL',
    'Payment Screenshot Name'
  ]);
}

function savePaymentScreenshot(payment) {
  var dataUrl = payment && payment.screenshotDataUrl;
  if (!dataUrl) {
    return '';
  }

  var matches = String(dataUrl).match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    return '';
  }

  var mimeType = matches[1];
  var base64Data = matches[2];
  var extension = (mimeType.split('/')[1] || 'png').replace(/[^a-zA-Z0-9]/g, '');
  var fileName =
    (payment.screenshotFileName || 'payment-proof').replace(/[^a-zA-Z0-9._-]/g, '_') +
    '-' +
    new Date().getTime() +
    '.' +
    extension;

  var bytes = Utilities.base64Decode(base64Data);
  var blob = Utilities.newBlob(bytes, mimeType, fileName);
  var file = DriveApp.createFile(blob);
  return file.getUrl();
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 4) Deploy Apps Script Web App

1. Click `Deploy -> New deployment`.
2. Type: `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Deploy and copy the web app URL.

## 5) Configure Next.js

1. Create `.env.local` in project root.
2. Add:

```bash
APPS_SCRIPT_WEB_APP_URL=YOUR_WEB_APP_URL
APPS_SCRIPT_API_KEY=YOUR_SECRET_KEY
```

3. Restart the Next dev server.

## 6) Optional hardening

- Add throttling/rate limits in Next API route.
- Add CAPTCHA before submission.
- Re-enable email sending in Apps Script after sheet-write is working.
