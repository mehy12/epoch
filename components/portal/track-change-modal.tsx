"use client";

import { useState, useEffect } from "react";

interface TrackChangeModalProps {
  currentTrack: string;
  availableTracks: string[];
  onClose: () => void;
  onSubmitted: () => void;
}

export default function TrackChangeModal({
  currentTrack,
  availableTracks,
  onClose,
  onSubmitted,
}: TrackChangeModalProps) {
  const [requestedTrack, setRequestedTrack] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [domainCounts, setDomainCounts] = useState<Record<string, number>>({});
  const [totalTeams, setTotalTeams] = useState(0);

  const otherTracks = availableTracks.filter((t) => t !== currentTrack);

  useEffect(() => {
    fetch("/api/portal/track-change/domain-counts")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setDomainCounts(data.counts || {});
          setTotalTeams(data.total || 0);
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!requestedTrack) {
      setError("Please select a new track.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/portal/track-change/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedTrack, reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      onSubmitted();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tc-modal-backdrop" onClick={onClose}>
      <div
        className="tc-modal portal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tc-modal-header">
          <p className="portal-kicker">Track Change</p>
          <h2 className="tc-modal-title">Request Track Change</h2>
          <button
            className="tc-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tc-modal-form">
          <div className="tc-modal-field">
            <label className="portal-field-label" htmlFor="tc-current-track">
              Current Track
            </label>
            <input
              id="tc-current-track"
              className="portal-input"
              value={`${currentTrack} (${domainCounts[currentTrack] ?? "…"} teams)`}
              disabled
            />
          </div>

          <div className="tc-modal-field">
            <label className="portal-field-label" htmlFor="tc-new-track">
              New Track
            </label>

            {/* Track selection cards */}
            <div className="tc-track-options">
              {otherTracks.map((track) => {
                const count = domainCounts[track] ?? 0;
                const pct =
                  totalTeams > 0 ? Math.round((count / totalTeams) * 100) : 0;
                const isSelected = requestedTrack === track;

                return (
                  <button
                    type="button"
                    key={track}
                    className={`tc-track-option${isSelected ? " tc-track-option-selected" : ""}`}
                    onClick={() => setRequestedTrack(track)}
                  >
                    <span className="tc-track-option-name">{track}</span>
                    <span className="tc-track-option-count">
                      {count} team{count !== 1 ? "s" : ""}{" "}
                      <span className="tc-track-option-pct">({pct}%)</span>
                    </span>
                    <div className="tc-track-option-bar">
                      <div
                        className="tc-track-option-bar-fill"
                        style={{ width: `${Math.max(pct, 3)}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="tc-modal-field">
            <label className="portal-field-label" htmlFor="tc-reason">
              Reason (Optional)
            </label>
            <textarea
              id="tc-reason"
              className="portal-input tc-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why do you want to change your track?"
              rows={3}
            />
          </div>

          {error && <p className="portal-alert portal-alert-error">{error}</p>}

          <div className="tc-modal-actions">
            <button
              type="button"
              className="portal-btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="portal-btn-primary"
              disabled={loading || !requestedTrack}
            >
              {loading ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
