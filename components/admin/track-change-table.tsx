"use client";

import { useEffect, useState, useCallback } from "react";

interface TrackChangeRequest {
  requestId: string;
  teamId: string;
  teamName: string;
  currentTrack: string;
  requestedTrack: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedBy: string;
  reviewedAt: string;
}

interface AdminTrackChangeTableProps {
  passphrase: string;
}

export default function AdminTrackChangeTable({
  passphrase,
}: AdminTrackChangeTableProps) {
  const [requests, setRequests] = useState<TrackChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [domainCounts, setDomainCounts] = useState<Record<string, number>>({});
  const [totalTeams, setTotalTeams] = useState(0);

  const fetchRequests = useCallback(async () => {
    try {
      setError("");
      const response = await fetch("/api/admin/track-change/list", {
        headers: { "x-admin-passphrase": passphrase },
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load requests.");
        return;
      }

      setRequests(data.requests || []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [passphrase]);

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
    fetchRequests();
    fetchDomainCounts();
  }, [fetchRequests, fetchDomainCounts]);

  async function handleAction(requestId: string, action: "approve" | "reject") {
    setActionLoading(requestId);
    try {
      const response = await fetch("/api/admin/track-change/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": passphrase,
        },
        body: JSON.stringify({ requestId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Action failed.");
        return;
      }

      // Refresh the list and domain counts
      await fetchRequests();
      fetchDomainCounts();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  const filtered =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  if (loading) {
    return (
      <section className="portal-card">
        <p className="portal-muted">Loading track change requests…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="portal-card">
        <p className="portal-alert portal-alert-error">{error}</p>
        <button
          className="portal-btn-primary mt-3"
          onClick={() => {
            setLoading(true);
            fetchRequests();
          }}
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <>
      {/* Summary bar */}
      <section className="portal-triple-grid">
        <article className="portal-card">
          <p className="portal-label">Total Requests</p>
          <p className="portal-value mt-2">{requests.length}</p>
        </article>
        <article className="portal-card">
          <p className="portal-label">Pending</p>
          <p className="portal-value mt-2" style={{ color: pendingCount > 0 ? "#b45309" : undefined }}>
            {pendingCount}
          </p>
        </article>
        <article className="portal-card">
          <p className="portal-label">Processed</p>
          <p className="portal-value mt-2">
            {requests.filter((r) => r.status !== "pending").length}
          </p>
        </article>
      </section>

      {/* Domain Distribution */}
      {totalTeams > 0 && (
        <section className="portal-card">
          <p className="portal-kicker">Domain Distribution</p>
          <p className="portal-muted mt-2" style={{ fontSize: "0.78rem" }}>
            {totalTeams} total teams across all domains
          </p>
          <div className="portal-triple-grid mt-3">
            {Object.entries(domainCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([domain, count]) => {
                const pct = totalTeams > 0 ? Math.round((count / totalTeams) * 100) : 0;
                return (
                  <article key={domain} className="portal-stat">
                    <p className="portal-label">{domain}</p>
                    <div className="domain-dist-stats" style={{ marginTop: "0.35rem" }}>
                      <span className="domain-dist-count" style={{ fontSize: "1.6rem" }}>{count}</span>
                      <span className="domain-dist-label">teams</span>
                    </div>
                    <div className="domain-dist-bar-bg" style={{ marginTop: "0.4rem" }}>
                      <div
                        className="domain-dist-bar-fill"
                        style={{ width: `${Math.max(pct, 3)}%` }}
                      />
                    </div>
                    <p className="domain-dist-pct">{pct}% of all teams</p>
                  </article>
                );
              })}
          </div>
        </section>
      )}

      {/* Filter */}
      <section className="portal-card">
        <div className="tc-admin-toolbar">
          <p className="portal-kicker">Track Change Requests</p>
          <div className="tc-admin-filters">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                className={`portal-nav-link${filter === f ? " is-active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === "pending" && pendingCount > 0 && (
                  <span className="tc-badge">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="portal-muted mt-4">
            No {filter === "all" ? "" : filter + " "}requests found.
          </p>
        ) : (
          <div className="tc-admin-table-wrap mt-4">
            <table className="tc-admin-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Current Track</th>
                  <th>Requested Track</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr key={req.requestId}>
                    <td>
                      <div className="tc-team-cell">
                        <strong>{req.teamName}</strong>
                        <span className="tc-team-id">{req.teamId}</span>
                      </div>
                    </td>
                    <td>{req.currentTrack}</td>
                    <td>
                      <strong>{req.requestedTrack}</strong>
                    </td>
                    <td>
                      <span className="tc-reason-cell">
                        {req.reason || "—"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`portal-pill portal-pill-${
                          req.status === "approved"
                            ? "success"
                            : req.status === "pending"
                              ? "warning"
                              : "neutral"
                        }`}
                      >
                        <span className="portal-pill-dot" aria-hidden="true" />
                        {req.status}
                      </span>
                    </td>
                    <td className="tc-date-cell">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td>
                      {req.status === "pending" ? (
                        <div className="tc-action-btns">
                          <button
                            className="portal-btn-primary tc-action-btn"
                            onClick={() =>
                              handleAction(req.requestId, "approve")
                            }
                            disabled={actionLoading === req.requestId}
                          >
                            {actionLoading === req.requestId
                              ? "…"
                              : "Approve"}
                          </button>
                          <button
                            className="portal-btn-secondary tc-action-btn"
                            onClick={() =>
                              handleAction(req.requestId, "reject")
                            }
                            disabled={actionLoading === req.requestId}
                          >
                            {actionLoading === req.requestId
                              ? "…"
                              : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="portal-muted" style={{ fontSize: "0.72rem" }}>
                          {req.reviewedBy
                            ? `by ${req.reviewedBy}`
                            : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
