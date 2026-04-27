import { isRegistrationClosed } from "@/lib/portal/settings";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const closed = await isRegistrationClosed();

  if (closed) {
    redirect("/registration-closed");
  }

  return <>{children}</>;
}
