import { NextResponse } from "next/server";
import { assignTeamIdAfterRegistration, findTeamByIdentifier } from "@/lib/portal/sheets";

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

async function findDuplicateRegistration(payload) {
  const email = normalizeEmail(payload?.leader?.email);
  const phone = normalizePhone(payload?.leader?.mobile);

  if (email) {
    const byEmail = await findTeamByIdentifier(email);
    if (byEmail) {
      return byEmail.record;
    }
  }

  if (phone) {
    const byPhone = await findTeamByIdentifier(phone);
    if (byPhone) {
      return byPhone.record;
    }
  }

  return null;
}

function normalizePayload(payload) {
  const teamInfo = payload?.teamInfo ?? {};
  const leader = payload?.leader ?? {};
  const membersMap = payload?.members ?? {};
  const idea = payload?.idea ?? {};
  const declaration = payload?.declaration ?? {};
  const payment = payload?.payment ?? {};
  const teamSize = Number(teamInfo.teamSize || 0);

  const members = [];
  for (let memberNumber = 2; memberNumber <= teamSize; memberNumber += 1) {
    const member = membersMap[memberNumber] ?? membersMap[String(memberNumber)] ?? {};
    members.push({
      memberNumber,
      fullName: member.fullName ?? "",
      email: member.email ?? "",
      usn: member.usn ?? "",
      ieeeId: member.ieeeId ?? "",
      department: member.department ?? "",
      yearOfStudy: member.yearOfStudy ?? "",
    });
  }

  return {
    submittedAt: new Date().toISOString(),
    teamInfo: {
      teamName: teamInfo.teamName ?? "",
      track: teamInfo.track ?? "",
      teamSize: teamInfo.teamSize ?? "",
    },
    leader: {
      fullName: leader.fullName ?? "",
      email: leader.email ?? "",
      mobile: leader.mobile ?? "",
      collegeName: leader.collegeName ?? "",
      department: leader.department ?? "",
      yearOfStudy: leader.yearOfStudy ?? "",
      usn: leader.usn ?? "",
      ieeeId: leader.ieeeId ?? "",
    },
    members,
    idea: {
      description: idea.description ?? "",
      pptLink: idea.pptLink ?? "",
    },
    declaration: {
      allMembersIEEE: Boolean(declaration.allMembersIEEE),
      infoAccurate: Boolean(declaration.infoAccurate),
      agreeTerms: Boolean(declaration.agreeTerms),
    },
    payment: {
      amount: Number(payment.amount || 0),
      utrNumber: payment.utrNumber ?? "",
      screenshotFileName: payment.screenshotFileName ?? "",
      screenshotMimeType: payment.screenshotMimeType ?? "",
      screenshotDataUrl: payment.screenshotDataUrl ?? "",
    },
  };
}

export async function POST(request) {
  const appsScriptUrl = process.env.APPS_SCRIPT_WEB_APP_URL;
  const appsScriptApiKey = process.env.APPS_SCRIPT_API_KEY;

  if (!appsScriptUrl) {
    return NextResponse.json(
      {
        error: "Server not configured. Missing APPS_SCRIPT_WEB_APP_URL.",
      },
      { status: 500 }
    );
  }

  let incomingPayload;
  try {
    incomingPayload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const payload = normalizePayload(incomingPayload);

  try {
    const duplicate = await findDuplicateRegistration(payload);
    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "A team is already registered with this email or phone number. Please use the existing registration.",
          duplicate: {
            teamName: duplicate.teamName || "",
            teamId: duplicate.teamId || "",
            email: duplicate.email || "",
            phone: duplicate.phone || "",
          },
        },
        { status: 409 }
      );
    }
  } catch (duplicateCheckError) {
    return NextResponse.json(
      {
        error:
          "Could not verify duplicate registration at the moment. Please try again in a few seconds.",
        details: duplicateCheckError instanceof Error ? duplicateCheckError.message : "unknown",
      },
      { status: 503 }
    );
  }

  const upstreamPayload = {
    ...payload,
    ...(appsScriptApiKey ? { _apiKey: appsScriptApiKey } : {}),
  };

  try {
    const upstreamResponse = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upstreamPayload),
      cache: "no-store",
    });

    const text = await upstreamResponse.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text || null;
    }

    const normalizedText = typeof text === "string" ? text.toLowerCase() : "";
    const looksLikeGoogleDriveNotFound =
      normalizedText.includes("unable to open the file") ||
      normalizedText.includes("page not found") ||
      normalizedText.includes("google drive");
    const missingDoPost =
      normalizedText.includes("script function not found") && normalizedText.includes("dopost");

    if (upstreamResponse.ok && data && typeof data === "object" && data.success === false) {
      return NextResponse.json(
        {
          error: data.error || "Apps Script responded with a failure.",
          details: data,
        },
        { status: 502 }
      );
    }

    if (upstreamResponse.ok && missingDoPost) {
      return NextResponse.json(
        {
          error:
            "Apps Script deployment is missing doPost(e). Update Code.gs with doPost and redeploy a new web app version.",
          details: {
            upstreamStatus: upstreamResponse.status,
            upstreamStatusText: upstreamResponse.statusText,
          },
        },
        { status: 502 }
      );
    }

    if (!upstreamResponse.ok) {
      if (upstreamResponse.status === 401 || upstreamResponse.status === 403) {
        return NextResponse.json(
          {
            error:
              "Apps Script rejected access. In deployment settings, set Web app access to 'Anyone' and redeploy (server-to-server calls are not signed into Google).",
            details: {
              upstreamStatus: upstreamResponse.status,
              upstreamStatusText: upstreamResponse.statusText,
            },
          },
          { status: 502 }
        );
      }

      if (looksLikeGoogleDriveNotFound) {
        return NextResponse.json(
          {
            error:
              "Apps Script web app URL looks invalid or not deployed for web access. Re-deploy as Web app and use the /exec URL.",
            details: {
              upstreamStatus: upstreamResponse.status,
              upstreamStatusText: upstreamResponse.statusText,
            },
          },
          { status: 502 }
        );
      }

      return NextResponse.json(
        {
          error: "Registration could not be forwarded to Apps Script.",
          details: {
            upstreamStatus: upstreamResponse.status,
            upstreamStatusText: upstreamResponse.statusText,
            body: data,
          },
        },
        { status: 502 }
      );
    }

    if (upstreamResponse.ok && typeof data === "object" && data && data.success === true) {
      let teamId = "";

      try {
        const generated = await assignTeamIdAfterRegistration({
          email: payload?.leader?.email,
          phone: payload?.leader?.mobile,
        });
        teamId = generated || "";
      } catch {
        teamId = "";
      }

      return NextResponse.json({
        success: true,
        data: {
          ...data,
          teamId: data?.teamId || teamId,
        },
      });
    }

    return NextResponse.json(
      {
        error:
          "Apps Script returned an unexpected response. Ensure it returns JSON like { success: true } from doPost.",
        details: {
          upstreamStatus: upstreamResponse.status,
          upstreamStatusText: upstreamResponse.statusText,
          body: data,
        },
      },
      { status: 502 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Network error while contacting Apps Script.",
      },
      { status: 502 }
    );
  }
}
