import PortalNav from "@/components/portal/portal-nav";
import UploadPanel from "@/components/portal/upload-panel";
import { PORTAL_PPT_DEADLINE } from "@/lib/portal/constants";
import { requirePortalProfile } from "@/lib/portal/server-auth";

export default async function SubmitPage() {
  const profile = await requirePortalProfile();

  return (
    <div>
      <PortalNav teamId={profile.teamId} teamName={profile.teamName} />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <section className="portal-card p-5 sm:p-6">
          <p className="portal-kicker">Round 1 Submission</p>
          <h2 className="mt-2">Submit Your Final PPT</h2>
          <p className="mt-3 text-sm text-slate-700">
            Deadline: <span className="font-semibold">{PORTAL_PPT_DEADLINE}</span>
          </p>
          <p className="portal-muted mt-2 text-sm">
            You can replace your file before the deadline. The latest upload will be treated as your final submission.
          </p>
        </section>

        <UploadPanel profile={profile} />
      </main>
    </div>
  );
}
