import PortalNav from "@/components/portal/portal-nav";
import StatusPill from "@/components/portal/status-pill";
import { requirePortalProfile } from "@/lib/portal/server-auth";
import { formatDateTimeInIST } from "@/lib/portal/utils";

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
              <p className="portal-value">{formatDateTimeInIST(profile.registrationDate)}</p>
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
            <p className="portal-label">Registration Model</p>
            <div className="mt-3">
              <StatusPill tone="neutral" label="First-Come, First-Serve" />
            </div>
          </article>

          <article className="portal-card p-5">
            <p className="portal-label">Round Format</p>
            <p className="portal-deadline mt-3">Single Round • Offline Finale</p>
          </article>
        </section>

        <section className="portal-callout-block p-5 sm:p-6">
          <h2 className="text-3xl sm:text-4xl">Important Instructions</h2>
          <ul className="portal-list portal-muted mt-3 space-y-2 text-sm">
            <li>EPOCH '26 follows a single-round format.</li>
            <li>Slots are confirmed on a first-come, first-serve basis after payment verification.</li>
            <li>Carry valid college ID and required hardware during the event.</li>
            <li>Follow all code of conduct and venue guidelines throughout the hackathon.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
