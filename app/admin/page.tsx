"use client";

import { useState } from "react";
import AdminTrackChangeTable from "@/components/admin/track-change-table";
import TrackChangeToggle from "@/components/admin/track-change-toggle";

export default function AdminPage() {
  const [passphrase, setPassphrase] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    if (!passphrase.trim()) {
      setAuthError("Please enter the admin passphrase.");
      return;
    }

    setAuthenticated(true);
  }

  if (!authenticated) {
    return (
      <main className="portal-main portal-main-auth">
        <div className="portal-panel" style={{ width: "min(420px, 92vw)", margin: "0 auto" }}>
          <div className="portal-card portal-card-roomy">
            <p className="portal-kicker">Admin Access</p>
            <h2 className="mt-3">EPOCH '26 Admin</h2>
            <form onSubmit={handleLogin} className="mt-5">
              <div>
                <label className="portal-field-label" htmlFor="admin-pass">
                  Passphrase
                </label>
                <input
                  id="admin-pass"
                  type="password"
                  className="portal-input mt-2"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter admin passphrase"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="portal-alert portal-alert-error mt-3">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="portal-btn-primary mt-4"
                style={{ width: "100%" }}
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div>
      <header className="portal-nav-header">
        <div className="portal-nav-inner">
          <div className="portal-team-badge">
            <p className="portal-kicker">Admin Panel</p>
            <h1 className="portal-team-name">Track Changes</h1>
          </div>
          <nav className="portal-nav-scroll portal-nav-links">
            <button
              className="portal-nav-link portal-logout-btn"
              onClick={() => {
                setAuthenticated(false);
                setPassphrase("");
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="portal-main portal-main-stack">
        <TrackChangeToggle passphrase={passphrase} />
        <AdminTrackChangeTable passphrase={passphrase} />
      </main>
    </div>
  );
}
