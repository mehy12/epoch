"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface VerifyResult {
  exists: boolean;
  eligible: boolean;
  teamName: string;
  teamId: string;
  paymentStatus: string;
  portalEnabled: boolean;
  reason: string;
}

const initialVerify: VerifyResult | null = null;

export default function PortalAccessPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(initialVerify);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setVerifyResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/portal/verify-identifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not verify identifier.");
      }

      setVerifyResult(result);
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Could not verify identifier.");
    } finally {
      setLoading(false);
    }
  };

  const onCreatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/portal/create-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, confirmPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not set password.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (setupError) {
      setError(setupError instanceof Error ? setupError.message : "Could not set password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-start px-4 py-8 sm:px-6 sm:py-10 lg:items-center lg:py-14">
      <section className="portal-panel grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="portal-card p-5 sm:p-8 lg:p-10">
          <p className="portal-kicker">EPOCH '26 Participant Portal</p>
          <h1 className="mt-3">First-Time Access Setup</h1>
          <p className="portal-muted mt-3 max-w-xl text-sm sm:text-base">
            Use your registered team leader email or mobile number to create portal credentials.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onVerify}>
            <label className="block text-sm font-medium text-slate-700" htmlFor="identifier">
              Registered Email or Mobile Number
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="portal-input"
              placeholder="teamlead@example.com or 9876543210"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="portal-btn-primary inline-flex w-full justify-center sm:w-auto disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify Registration"}
            </button>
          </form>

          {verifyResult ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
              <p className="text-base font-semibold text-slate-900">{verifyResult.teamName || "Team"}</p>
              <p className="mt-1">Team ID: {verifyResult.teamId || "Generating..."}</p>
              <p className="mt-1">Payment Status: {verifyResult.paymentStatus || "Pending"}</p>
              <p className="portal-muted mt-2">{verifyResult.reason}</p>
            </div>
          ) : null}

          {verifyResult?.portalEnabled ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Portal access is already enabled for this team. Continue to login.
            </div>
          ) : null}

          {verifyResult?.exists && !verifyResult.portalEnabled ? (
            <form className="mt-6 space-y-4" onSubmit={onCreatePassword}>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                  Create Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  className="portal-input mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  className="portal-input mt-1"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="portal-btn-primary inline-flex w-full justify-center sm:w-auto disabled:opacity-70"
              >
                {loading ? "Saving..." : "Create Portal Access"}
              </button>
            </form>
          ) : null}

          {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
        </article>

        <article className="portal-card p-5 sm:p-8 lg:self-start lg:p-10">
          <h2>Access Rules</h2>
          <ul className="portal-list portal-muted mt-4 space-y-2 text-sm">
            <li>Only the team leader can create portal access.</li>
            <li>Password is securely hashed and never stored in plain text.</li>
            <li>One portal account per registered team email/mobile.</li>
            <li>Once set, use login for future access.</li>
          </ul>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Need access help? Reach out through the contact channels on the main EPOCH '26 website.
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="portal-btn-secondary inline-flex w-full justify-center sm:w-auto">
              Go to Login
            </Link>
            <Link href="/" className="portal-btn-secondary inline-flex w-full justify-center sm:w-auto">
              Back to Home
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
