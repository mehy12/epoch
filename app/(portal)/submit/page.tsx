import PortalNav from "@/components/portal/portal-nav";
import { requirePortalProfile } from "@/lib/portal/server-auth";

export default async function SubmitPage() {
  const profile = await requirePortalProfile();

  return (
    <div>
      <PortalNav teamId={profile.teamId} teamName={profile.teamName} />
      <main className="portal-main portal-main-narrow portal-main-stack">
        <section className="portal-card">
          <p className="portal-kicker">Submission Update</p>
          <h2 className="mt-2">No Separate PPT Submission Required</h2>
          <p className="portal-muted mt-2 text-sm">
            EPOCH '26 now follows a single-round model and does not require a separate portal PPT upload.
          </p>
          <p className="portal-muted mt-2 text-sm">
            Complete registration payment to confirm your slot on a first-come, first-serve basis.
          </p>
        </section>
      </main>
    </div>
  );
}
