import PortalNav from "@/components/portal/portal-nav";
import StatusPill from "@/components/portal/status-pill";
import UploadPanel from "@/components/portal/upload-panel";
import { PORTAL_PPT_DEADLINE } from "@/lib/portal/constants";
import { requirePortalProfile } from "@/lib/portal/server-auth";

function formatDate(value: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function paymentTone(status: string): "success" | "warning" {
  return status.toLowerCase() === "verified" ? "success" : "warning";
}

export default async function DashboardPage() {
  const profile = await requirePortalProfile();

  return (
    <div>
      <PortalNav teamId={profile.teamId} teamName={profile.teamName} />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <section className="portal-card p-5 sm:p-6">
          <p className="portal-kicker">Team Overview</p>
          <h2 className="mt-3">Your Team Snapshot</h2>
          <div className="portal-section-grid mt-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="portal-stat">
              <p className="portal-label">Team Name</p>
              <p className="portal-value">{profile.teamName}</p>
            </article>
            <article className="portal-stat">
              <p className="portal-label">Team ID</p>
              <p className="portal-value">{profile.teamId}</p>
            </article>
            <article className="portal-stat">
              <p className="portal-label">Team Leader</p>
              <p className="portal-value">{profile.teamLeaderName}</p>
            </article>
            <article className="portal-stat">
              <p className="portal-label">Registered Email</p>
              <p className="portal-value break-all">{profile.email}</p>
            </article>
            <article className="portal-stat">
              <p className="portal-label">Registered Mobile</p>
              <p className="portal-value">{profile.phone}</p>
            </article>
            <article className="portal-stat">
              <p className="portal-label">College Name</p>
              <p className="portal-value">{profile.college}</p>
            </article>
            <article className="portal-stat">
              <p className="portal-label">Selected Domain</p>
              <p className="portal-value">{profile.domain}</p>
            </article>
            <article className="portal-stat">
              <p className="portal-label">Idea Title</p>
              <p className="portal-value">{profile.ideaTitle || "-"}</p>
            </article>
            <article className="portal-stat">
              <p className="portal-label">Registration Date</p>
              <p className="portal-value">{formatDate(profile.registrationDate)}</p>
            </article>
          </div>
        </section>

        <section className="grid gap-3 sm:gap-4 md:grid-cols-3">
          <article className="portal-card p-5">
            <p className="portal-label">Payment Status</p>
            <div className="mt-3">
              <StatusPill tone={paymentTone(profile.paymentStatus)} label={profile.paymentStatus || "Pending"} />
            </div>
          </article>

          <article className="portal-card p-5">
            <p className="portal-label">PPT Submission Status</p>
            <div className="mt-3">
              <StatusPill
                tone={profile.pptSubmitted ? "success" : "warning"}
                label={profile.pptSubmitted ? "Submitted" : "Not Submitted"}
              />
            </div>
          </article>

          <article className="portal-card p-5">
            <p className="portal-label">Deadline Reminder</p>
            <p className="portal-deadline mt-3">Round 1 PPT Deadline: {PORTAL_PPT_DEADLINE}</p>
          </article>
        </section>

        <section className="portal-callout-block p-5 sm:p-6">
          <h2 className="text-3xl sm:text-4xl">Important Instructions</h2>
          <ul className="portal-list portal-muted mt-3 space-y-2 text-sm">
            <li>Round 1 requires PPT submission.</li>
            <li>Only one final PPT submission per team will be considered.</li>
            <li>PPT is mandatory for screening.</li>
            <li>Teams without PPT will not be shortlisted.</li>
          </ul>
        </section>

        <UploadPanel profile={profile} />
      </main>
    </div>
  );
}
