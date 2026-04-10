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
    ["PPT Submission", profile.pptSubmitted ? "Submitted" : "Not Submitted"],
    ["PPT File Name", profile.pptFileName || "-"],
    ["PPT Uploaded At", formatDateTimeInIST(profile.pptUploadedAt)],
  ];

  return (
    <div>
      <PortalNav teamId={profile.teamId} teamName={profile.teamName} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <section className="portal-card p-5 sm:p-6">
          <p className="portal-kicker">Profile</p>
          <h2 className="mt-2">Registered Team Details</h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {details.map(([label, value]) => (
              <article key={label} className="portal-stat">
                <p className="portal-label">{label}</p>
                <p className="portal-value text-base">{value}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
