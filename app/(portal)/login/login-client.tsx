"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nextPath = useMemo(() => searchParams.get("next") || "/dashboard", [searchParams]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/portal/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Login failed.");
      }

      router.push(nextPath);
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="portal-main portal-main-auth portal-main-wide">
      <section className="portal-panel portal-auth-grid">
        <article className="portal-card portal-card-roomy">
          <p className="portal-kicker">EPOCH '26 Participant Portal</p>
          <h1 className="mt-3">Participant Login</h1>
          <p className="portal-muted mt-3 max-w-lg text-sm">
            Login with your registered email or mobile number and the password set during first-time access.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="portal-field-label" htmlFor="identifier">
                Registered Email or Mobile
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="portal-input mt-1"
                required
              />
            </div>

            <div>
              <label className="portal-field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="portal-input mt-1"
                required
              />
            </div>

            {error ? <p className="portal-alert portal-alert-error">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="portal-btn-primary inline-flex w-full items-center justify-center sm:w-auto disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>
          </form>

          <p className="portal-muted mt-5 text-sm">
            First time here?{" "}
            <Link href="/portal-access" className="portal-link">
              Create portal access
            </Link>
          </p>
        </article>

        <article className="portal-card portal-card-roomy">
          <h2>Inside Your Portal</h2>
          <ul className="portal-list portal-muted mt-5 space-y-2 text-sm">
            <li>View full team registration details.</li>
            <li>Track payment verification and slot confirmation status.</li>
            <li>Keep your Team ID ready for all communications.</li>
          </ul>

          <div className="portal-callout mt-8">Single round format. No separate PPT upload required.</div>

          <Link href="/" className="portal-btn-secondary mt-6 inline-flex w-full justify-center sm:w-auto">
            Back to Home
          </Link>
        </article>
      </section>
    </main>
  );
}
