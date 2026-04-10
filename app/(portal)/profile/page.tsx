import PortalNav from "@/components/portal/portal-nav";
import { requirePortalProfile } from "@/lib/portal/server-auth";
import { formatDateTimeInIST } from "@/lib/portal/utils";

export default async function ProfilePage() {
  const profile = await requirePortalProfile();

  const details = [
    ["Team Name", profile.teamName],
    ["Team ID", profile.teamId],
    ["Team Leader Name", profile.teamLeaderName],
    ["Registered Email", profile.email],
    ["Registered Mobile", profile.phone],
    ["College", profile.college],
    ["Selected Domain", profile.domain],
    ["Idea Title", profile.ideaTitle || "-"],
    ["Registration Date", formatDateTimeInIST(profile.registrationDate)],
    ["Payment Status", profile.paymentStatus || "Pending"],
  ];

  return (
    <div>
      <PortalNav teamId={profile.teamId} teamName={profile.teamName} />
      <main className="portal-main portal-main-narrow">
        <section className="portal-card">
          <p className="portal-kicker">Profile</p>
          <h2 className="mt-2">Registered Team Details</h2>

          <div className="portal-two-grid" style={{ marginTop: "0.9rem" }}>
            {details.map(([label, value]) => (
              <article key={label} className="portal-stat">
                <p className="portal-label">{label}</p>
                <p className="portal-value">{value}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
