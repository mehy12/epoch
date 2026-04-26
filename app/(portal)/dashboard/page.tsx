import PortalNav from "@/components/portal/portal-nav";
import StatusPill from "@/components/portal/status-pill";
import TrackChangeSection from "@/components/portal/track-change-section";
import { AVAILABLE_TRACKS } from "@/lib/portal/constants";
import { requirePortalProfile } from "@/lib/portal/server-auth";
import { getTeamCountsByDomain } from "@/lib/portal/sheets";
import { formatDateTimeInIST } from "@/lib/portal/utils";

function paymentTone(status: string): "success" | "warning" {
  return status.toLowerCase() === "verified" ? "success" : "warning";
}

export default async function DashboardPage() {
  const profile = await requirePortalProfile();
  const domainCounts = await getTeamCountsByDomain();

  const totalTeams = Object.values(domainCounts).reduce((s, n) => s + n, 0);

  return (
    <div>
      <PortalNav teamId={profile.teamId} teamName={profile.teamName} />
      <main className="portal-main portal-main-stack">
        <section className="portal-card">
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

        {/* Domain Distribution */}
        <section className="portal-card">
          <p className="portal-kicker">Participation Stats</p>
          <h2 className="mt-3">Teams per Domain</h2>
          <p className="portal-muted mt-2" style={{ fontSize: "0.82rem" }}>
            {totalTeams} team{totalTeams !== 1 ? "s" : ""} registered across all domains.
            Consider switching to a less competitive track for better odds!
          </p>
          <div className="domain-dist-grid mt-5">
            {AVAILABLE_TRACKS.map((track) => {
              const count = domainCounts[track] || 0;
              const pct = totalTeams > 0 ? Math.round((count / totalTeams) * 100) : 0;
              const isCurrentTrack = track === profile.domain;

              return (
                <article
                  key={track}
                  className={`domain-dist-card${isCurrentTrack ? " domain-dist-current" : ""}`}
                >
                  <div className="domain-dist-header">
                    <p className="portal-label">{track}</p>
                    {isCurrentTrack && (
                      <span className="domain-dist-you-badge">Your Track</span>
                    )}
                  </div>
                  <div className="domain-dist-stats">
                    <span className="domain-dist-count">{count}</span>
                    <span className="domain-dist-label">
                      team{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="domain-dist-bar-bg">
                    <div
                      className={`domain-dist-bar-fill${isCurrentTrack ? " domain-dist-bar-active" : ""}`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <p className="domain-dist-pct">{pct}% of all teams</p>
                </article>
              );
            })}
          </div>
        </section>

        <TrackChangeSection
          currentTrack={profile.domain}
          trackChangeCount={profile.trackChangeCount}
          trackLocked={profile.trackLocked}
          availableTracks={[...AVAILABLE_TRACKS]}
        />

        <section className="portal-triple-grid">
          <article className="portal-card">
            <p className="portal-label">Payment Status</p>
            <div className="mt-3">
              <StatusPill tone={paymentTone(profile.paymentStatus)} label={profile.paymentStatus || "Pending"} />
            </div>
          </article>

          <article className="portal-card">
            <p className="portal-label">Registration Model</p>
            <div className="mt-3">
              <StatusPill tone="neutral" label="First-Come, First-Serve" />
            </div>
          </article>

          <article className="portal-card">
            <p className="portal-label">Round Format</p>
            <p className="portal-deadline mt-3">Single Round • Offline Finale</p>
          </article>
        </section>

        <section className="portal-callout-block portal-card">
          <h2>Important Instructions</h2>
          <ul className="portal-list portal-muted portal-list-compact">
            <li>EPOCH '26 follows a single-round format.</li>
            <li>Slots are confirmed on a first-come, first-serve basis after payment verification.</li>
            <li>Carry valid college ID and required hardware during the event.</li>
            <li>Follow all code of conduct and venue guidelines throughout the hackathon.</li>
          </ul>
        </section>

        <section className="portal-card portal-wa-card">
          <div className="portal-wa-inner">
            <div>
              <p className="portal-kicker">Stay Connected</p>
              <h2 className="mt-3">Join Our WhatsApp Group</h2>
              <p className="portal-muted mt-2" style={{ fontSize: "0.82rem" }}>
                Get real-time updates, announcements, and connect with other participants.
              </p>
            </div>
            <a
              href="https://chat.whatsapp.com/D7uEE3yTIq8DkRp03KOwYp"
              target="_blank"
              rel="noreferrer"
              className="portal-btn-primary portal-wa-btn"
            >
              Join WhatsApp Group →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

