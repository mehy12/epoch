"use client";

import { PortalPublicProfile } from "@/lib/portal/types";
import { FormEvent, useState } from "react";

interface UploadPanelProps {
  profile: PortalPublicProfile;
}

function formatDate(value: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function UploadPanel({ profile }: UploadPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentFileName, setCurrentFileName] = useState(profile.pptFileName || "");
  const [currentFileUrl, setCurrentFileUrl] = useState(profile.pptDriveUrl || "");
  const [currentUploadedAt, setCurrentUploadedAt] = useState(profile.pptUploadedAt || "");
  const [submitted, setSubmitted] = useState(profile.pptSubmitted);

  const onUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError("Please select a PPT, PPTX, or PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);

    try {
      const response = await fetch("/api/portal/upload-ppt", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed.");
      }

      setSubmitted(true);
      setCurrentFileName(result?.upload?.fileName || selectedFile.name);
      setCurrentFileUrl(result?.upload?.driveUrl || "");
      setCurrentUploadedAt(result?.upload?.uploadedAt || new Date().toISOString());
      setSelectedFile(null);
      setSuccess("Submission uploaded successfully.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="portal-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:items-center">
        <div>
          <h3 className="text-2xl text-slate-900 sm:text-3xl">Upload Round 1 PPT</h3>
          <p className="portal-muted text-sm">Accepted: .ppt, .pptx, .pdf (max 20MB)</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            submitted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {submitted ? "Submitted" : "Not Submitted"}
        </span>
      </div>

      <div className="portal-section-grid mt-4">
        <article className="portal-stat">
          <p className="portal-label">Current File</p>
          <p className="portal-value break-all">{currentFileName || "-"}</p>
        </article>
        <article className="portal-stat">
          <p className="portal-label">Uploaded At</p>
          <p className="portal-value">{formatDate(currentUploadedAt)}</p>
        </article>
        <article className="portal-stat md:col-span-2">
          <p className="portal-label">Drive Link</p>
          <p className="portal-value text-base">
            {currentFileUrl ? (
              <a className="portal-link" href={currentFileUrl} target="_blank" rel="noreferrer">
                View Submission
              </a>
            ) : (
              "-"
            )}
          </p>
        </article>
      </div>

      <form className="mt-5 space-y-3" onSubmit={onUpload}>
        <input
          type="file"
          accept=".ppt,.pptx,.pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-amber-900"
        />

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        {success ? <p className="text-sm font-medium text-emerald-600">{success}</p> : null}

        <button
          type="submit"
          disabled={isUploading}
          className="portal-btn-primary inline-flex w-full items-center justify-center sm:w-auto disabled:opacity-70"
        >
          {isUploading ? "Uploading..." : submitted ? "Replace Submission" : "Upload Submission"}
        </button>
      </form>
    </section>
  );
}
