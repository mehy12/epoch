import { Suspense } from "react";
import LoginClient from "@/app/(portal)/login/login-client";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="portal-main portal-main-auth" style={{ justifyContent: "center" }}>
          <p className="portal-muted">Loading portal login...</p>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
