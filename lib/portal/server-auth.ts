import { PORTAL_SESSION_COOKIE } from "@/lib/portal/constants";
import { getPortalProfileBySession } from "@/lib/portal/sheets";
import { verifySessionToken } from "@/lib/portal/session";
import { PortalPublicProfile } from "@/lib/portal/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requirePortalProfile(): Promise<PortalPublicProfile> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/login");
  }

  const session = await verifySessionToken(token);
  if (!session) {
    redirect("/login");
  }

  const profile = await getPortalProfileBySession(session);
  if (!profile) {
    redirect("/login");
  }

  return profile;
}
