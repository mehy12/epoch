# EPOCH '26 Participant Portal Setup

This portal extends the existing Google Apps Script registration flow without replacing it.

## What this adds

- First-time portal access setup for team leaders
- Login with registered email or mobile + password
- Secure password hashing (bcrypt)
- Session auth with signed HTTP-only cookie
- Protected participant pages:
  - `/dashboard`
  - `/profile`
  - `/submit`
- Team ID auto-generation by domain prefix
- Round 1 PPT upload to Google Drive from dashboard/submit page
- Participant status updates stored in the same Google Sheet

## 1) Google Sheet requirements

Use the same registration sheet and keep existing columns. Add these columns if missing:

- Payment Status
- Team ID
- Portal Access Enabled
- Password Hash
- PPT Submitted
- PPT File Name
- PPT Drive URL
- PPT Uploaded At

The backend auto-appends missing portal columns in row 1 if needed.

## 2) Team ID format and prefixes

- AI for Social Good -> `AI`
- Sustainability Goals -> `SG`
- Cybersecurity & Blockchain -> `CB`

Format:

- `AI-101`, `AI-102`, ...
- `SG-101`, `SG-102`, ...
- `CB-101`, `CB-102`, ...

Counters are independent per domain.

## 3) Create a Google service account

1. Create a Google Cloud project (or use existing).
2. Enable:
   - Google Sheets API
   - Google Drive API
3. Create a service account and generate a JSON key.
4. Share the registration Google Sheet with this service account email as `Editor`.
5. Create (or choose) Drive folder `EPOCH26_Round1_Submissions` and share it with the same service account as `Editor`.
6. Copy the folder ID from the URL.

## 4) Environment variables

Update `.env.local`:

```bash
APPS_SCRIPT_WEB_APP_URL=...
APPS_SCRIPT_API_KEY=...
NEXT_PUBLIC_ROUND1_PPT_TEMPLATE_URL=...

GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_SHEET_NAME=Registrations
GOOGLE_DRIVE_SUBMISSIONS_FOLDER_ID=your-drive-folder-id
PORTAL_JWT_SECRET=replace-with-a-long-random-secret-min-32-chars
```

## 5) Payment status gating

Portal access setup is allowed only when `Payment Status` is one of:

- `Verified`
- `Paid`
- `Completed`
- `Complete`
- `Success`
- `Confirmed`

Use `Verified` as the operational standard.

## 6) Run locally

```bash
npm install
npm run dev
```

Portal routes:

- `/portal-access` (first-time setup)
- `/login`
- `/dashboard`
- `/profile`
- `/submit`

## 7) Operational flow

1. Team registers via existing form and payment flow (unchanged).
2. Team ID is assigned once registration is written.
3. Admin verifies payment in sheet (`Payment Status = Verified`).
4. Team leader creates portal password at `/portal-access`.
5. Team logs in at `/login`.
6. Team uploads Round 1 PPT from dashboard/submit page.

## 8) Security notes

- Passwords are never stored in plain text.
- Cookies are HTTP-only, signed JWT, and route-protected.
- Dashboard/profile/submit are middleware-protected.
- Portal account creation is single-account per team (email/mobile based).
