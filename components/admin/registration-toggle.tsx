"use client";

import { useEffect, useState, useCallback } from "react";

interface RegistrationToggleProps {
  passphrase: string;
}

export default function RegistrationToggle({
  passphrase,
}: RegistrationToggleProps) {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/registration/toggle", {
        headers: { "x-admin-passphrase": passphrase },
      });
      const data = await response.json();
      if (data.success) {
        setDisabled(data.disabled);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [passphrase]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function handleToggle() {
    const newValue = !disabled;
    const confirmMsg = newValue
      ? "Are you sure you want to CLOSE registrations? No one will be able to register."
      : "Are you sure you want to OPEN registrations?";

    if (!confirm(confirmMsg)) {
      return;
    }

    setToggling(true);
    try {
      const response = await fetch("/api/admin/registration/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": passphrase,
        },
        body: JSON.stringify({ disabled: newValue }),
      });

      const data = await response.json();

      if (data.success) {
        setDisabled(data.disabled);
      } else {
        alert(data.error || "Failed to update toggle.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setToggling(false);
    }
  }

  return (
    <section className="portal-card tc-toggle-card">
      <div className="tc-toggle-inner">
        <div className="tc-toggle-info">
          <p className="portal-kicker">Feature Control</p>
          <h2 className="mt-2">Registration Status</h2>
          <p className="portal-muted mt-2" style={{ fontSize: "0.82rem" }}>
            {loading
              ? "Loading status…"
              : disabled
                ? "Registrations are currently CLOSED. Users attempting to register will be redirected to the closed page."
                : "Registrations are OPEN. Participants can access the registration form."}
          </p>
        </div>

        <div className="tc-toggle-control">
          <span
            className={`tc-toggle-status ${disabled ? "tc-toggle-status-off" : "tc-toggle-status-on"}`}
          >
            {loading ? "…" : disabled ? "Closed" : "Open"}
          </span>

          <button
            className={`tc-toggle-switch ${disabled ? "" : "tc-toggle-switch-on"}`}
            onClick={handleToggle}
            disabled={loading || toggling}
            aria-label={disabled ? "Open registrations" : "Close registrations"}
          >
            <span className="tc-toggle-knob" />
          </button>
        </div>
      </div>
    </section>
  );
}
