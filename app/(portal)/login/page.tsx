import { Suspense } from "react";
import LoginClient from "@/app/(portal)/login/login-client";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-14 sm:px-6">
          <p className="text-sm font-medium text-slate-600">Loading portal login...</p>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
