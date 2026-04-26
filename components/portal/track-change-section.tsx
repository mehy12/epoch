"use client";

import { useEffect, useState, useCallback } from "react";
import TrackChangeModal from "@/components/portal/track-change-modal";
import StatusPill from "@/components/portal/status-pill";

interface TrackChangeRequest {
  requestId: string;
  currentTrack: string;
  requestedTrack: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface TrackChangeSectionProps {
  currentTrack: string;
  trackChangeCount: number;
  trackLocked: boolean;
  availableTracks: string[];
}

export default function TrackChangeSection({
  currentTrack,
  trackChangeCount: initialCount,
  trackLocked,
  availableTracks,
}: TrackChangeSectionProps) {
  const [requests, setRequests] = useState<TrackChangeRequest[]>([]);
  const [trackChangeCount, setTrackChangeCount] = useState(initialCount);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [domainCounts, setDomainCounts] = useState<Record<string, number>>({});
  const [totalTeams, setTotalTeams] = useState(0);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/portal/track-change/status");
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests || []);
        setTrackChangeCount(data.trackChangeCount ?? initialCount);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [initialCount]);

  const fetchDomainCounts = useCallback(async () => {
    try {
      const response = await fetch("/api/portal/track-change/domain-counts");
      const data = await response.json();
      if (data.success) {
        setDomainCounts(data.counts || {});
        setTotalTeams(data.total || 0);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchDomainCounts();
  }, [fetchStatus, fetchDomainCounts]);

  const hasPending = requests.some((r) => r.status === "pending");
  const maxReached = trackChangeCount >= 2;
  const canRequest = !trackLocked && !hasPending && !maxReached;

  function getStatusMessage(): { text: string; tone: "success" | "warning" | "neutral" } | null {
    const latest = requests.length > 0 ? requests[requests.length - 1] : null;
    if (!latest) return null;

    switch (latest.status) {
      case "pending":
        return { text: "Awaiting approval", tone: "warning" };
      case "approved":
        return { text: "Track updated", tone: "success" };
      case "rejected":
        return { text: "Request declined", tone: "neutral" };
      default:
        return null;
    }
  }

  function getDisabledReason(): string {
    if (trackLocked) return "Track changes have been locked.";
    if (hasPending) return "You have a pending request.";
    if (maxReached) return "Maximum track changes reached (2).";
    return "";
  }

  const statusMsg = getStatusMessage();

  return (
    <section className="portal-card tc-section">
      <p className="portal-kicker">Track Management</p>
      <h2 className="mt-3">Domain / Track</h2>

      <div className="tc-info-grid mt-5">
        <article className="portal-stat">
          <p className="portal-label">Current Track</p>
          <p className="portal-value">{currentTrack}</p>
        </article>

        <article className="portal-stat">
          <p className="portal-label">Track Change Status</p>
          <div className="portal-value">
            {loading ? (
              <span className="tc-loading-text">Loading…</span>
            ) : statusMsg ? (
              <StatusPill tone={statusMsg.tone} label={statusMsg.text} />
            ) : (
              <StatusPill tone="neutral" label="None" />
            )}
          </div>
        </article>

        <article className="portal-stat">
          <p className="portal-label">Changes Used</p>
          <p className="portal-value">
            {trackChangeCount} / 2
          </p>
        </article>
      </div>

      {/* Domain distribution mini-view */}
      {totalTeams > 0 && (
        <div className="tc-domain-counts mt-5">
          <p className="portal-label">Teams per Track</p>
          <div className="tc-domain-counts-grid">
            {availableTracks.map((track) => {
              const count = domainCounts[track] || 0;
              const pct = totalTeams > 0 ? Math.round((count / totalTeams) * 100) : 0;
              const isCurrent = track === currentTrack;

              return (
                <div
                  key={track}
                  className={`tc-domain-count-item${isCurrent ? " tc-domain-count-current" : ""}`}
                >
                  <div className="tc-domain-count-top">
                    <span className="tc-domain-count-name">{track}</span>
                    {isCurrent && <span className="tc-domain-count-badge">You</span>}
                  </div>
                  <div className="tc-domain-count-bar-bg">
                    <div
                      className={`tc-domain-count-bar-fill${isCurrent ? " tc-domain-count-bar-active" : ""}`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                  <span className="tc-domain-count-num">
                    {count} team{count !== 1 ? "s" : ""} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Request history */}
      {requests.length > 0 && (
        <div className="tc-history mt-5">
          <p className="portal-label">Request History</p>
          <div className="tc-history-list">
            {requests.map((req) => (
              <div key={req.requestId} className="tc-history-item">
                <div className="tc-history-tracks">
                  <span>{req.currentTrack}</span>
                  <span className="tc-arrow">→</span>
                  <span>{req.requestedTrack}</span>
                </div>
                <StatusPill
                  tone={
                    req.status === "approved"
                      ? "success"
                      : req.status === "pending"
                        ? "warning"
                        : "neutral"
                  }
                  label={req.status}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tc-action mt-5">
        <button
          className="portal-btn-primary"
          onClick={() => setShowModal(true)}
          disabled={!canRequest}
        >
          Request Track Change
        </button>
        {!canRequest && !loading && (
          <p className="tc-disabled-reason">{getDisabledReason()}</p>
        )}
      </div>

      {showModal && (
        <TrackChangeModal
          currentTrack={currentTrack}
          availableTracks={availableTracks}
          onClose={() => setShowModal(false)}
          onSubmitted={() => {
            setShowModal(false);
            setLoading(true);
            fetchStatus();
            fetchDomainCounts();
          }}
        />
      )}
    </section>
  );
}
