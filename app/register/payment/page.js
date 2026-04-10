"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PAYMENT_AMOUNT = 1500;
const DRAFT_KEY = "epoch-registration-draft";
const UPI_ID = "meesamhyder2005-1@oksbi";
const UPI_PAYEE_NAME = "Meesam Hyder";
const UPI_PAYLOAD = `upi://pay?pa=${UPI_ID}&pn=${UPI_PAYEE_NAME}&am=${PAYMENT_AMOUNT}&cu=INR`;
const QR_IMAGE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(UPI_PAYLOAD)}`;

function isValidUtr(value) {
  return /^[A-Za-z0-9]{8,30}$/.test(value.trim());
}

export default function RegisterPaymentPage() {
  const router = useRouter();

  const [draftData, setDraftData] = useState(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [proofDataUrl, setProofDataUrl] = useState("");
  const [proofFileName, setProofFileName] = useState("");
  const [proofMimeType, setProofMimeType] = useState("");
  const [copyState, setCopyState] = useState("idle");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (!raw) {
        setError("Registration details not found. Please fill the form again.");
        return;
      }

      const parsed = JSON.parse(raw);
      if (!parsed?.teamInfo?.teamName) {
        setError("Registration details are incomplete. Please fill the form again.");
        return;
      }

      setDraftData(parsed);
    } catch {
      setError("Unable to load registration details. Please fill the form again.");
    }
  }, []);

  const handleProofChange = (event) => {
    setError("");
    const file = event.target.files?.[0];

    if (!file) {
      setProofDataUrl("");
      setProofFileName("");
      setProofMimeType("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file for payment screenshot.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Screenshot size must be 2MB or less.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setProofDataUrl(result);
      setProofFileName(file.name);
      setProofMimeType(file.type);
    };
    reader.onerror = () => setError("Could not read screenshot. Please try again.");
    reader.readAsDataURL(file);
  };

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!draftData) {
      setError("Registration details are missing. Please fill the form again.");
      return;
    }

    if (!proofDataUrl) {
      setError("Please upload payment screenshot.");
      return;
    }

    if (!isValidUtr(utrNumber)) {
      setError("Enter a valid UTR number (8 to 30 letters/numbers).");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...draftData,
        payment: {
          amount: PAYMENT_AMOUNT,
          utrNumber: utrNumber.trim(),
          screenshotFileName: proofFileName,
          screenshotMimeType: proofMimeType,
          screenshotDataUrl: proofDataUrl,
        },
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responsePayload.error || "Could not complete registration after payment.");
      }

      const teamId = responsePayload?.data?.teamId || "";
      window.sessionStorage.removeItem(DRAFT_KEY);
      router.push(teamId ? `/register/success?teamId=${encodeURIComponent(teamId)}` : "/register/success");
    } catch (submitError) {
      setError(submitError.message || "Payment verification submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="noise-layer" aria-hidden="true" />
      <div className="bg-glow bg-glow-one" aria-hidden="true" />
      <div className="bg-glow bg-glow-two" aria-hidden="true" />

      <main className="register-page-shell">
        <section className="register-page-content">
          <div className="register-intro">
            <a className="register-back" href="/register">
              Back to Form
            </a>
            <p className="section-label">EPOCH '26</p>
            <h1>Payment Verification</h1>
            <p className="register-intro-copy">
              Pay ₹1500, upload screenshot proof, and enter UTR number to complete registration.
            </p>
          </div>

          <div className="register-payment-grid">
            <article className="register-section register-payment-card">
              <p className="register-label">Step 1</p>
              <h2 className="register-section-title">Scan QR and Pay ₹1500</h2>
              <div className="register-qr-shell">
                <img src={QR_IMAGE_URL} alt="Payment QR code" className="register-qr-image" />
              </div>
              <p className="register-note">Payee: {UPI_PAYEE_NAME}</p>
              <div className="register-upi-row">
                <p className="register-payment-upi">UPI ID: {UPI_ID}</p>
                <button type="button" className="register-copy-upi" onClick={handleCopyUpi}>
                  {copyState === "copied" ? "Copied" : "Tap to copy"}
                </button>
              </div>
              {copyState === "failed" ? (
                <p className="register-note">Could not copy. Please copy manually.</p>
              ) : null}
              <p className="register-note">Amount must be exactly ₹1500 per team.</p>
            </article>

            <form className="register-section register-payment-card" onSubmit={handleSubmit} noValidate>
              <p className="register-label">Step 2</p>
              <h2 className="register-section-title">Upload Proof</h2>

              <div className="register-field">
                <label className="register-label" htmlFor="paymentScreenshot">
                  Payment Screenshot <span className="register-required">*</span>
                </label>
                <input
                  id="paymentScreenshot"
                  className="register-control"
                  type="file"
                  accept="image/*"
                  onChange={handleProofChange}
                  required
                />
              </div>

              {proofDataUrl ? (
                <div className="register-proof-preview-wrap">
                  <img src={proofDataUrl} alt="Payment proof preview" className="register-proof-preview" />
                  <p className="register-proof-caption">{proofFileName}</p>
                </div>
              ) : null}

              <div className="register-field">
                <label className="register-label" htmlFor="utrNumber">
                  UTR Number <span className="register-required">*</span>
                </label>
                <input
                  id="utrNumber"
                  className="register-control"
                  type="text"
                  value={utrNumber}
                  onChange={(event) => setUtrNumber(event.target.value.toUpperCase())}
                  placeholder="Enter payment UTR"
                  required
                />
              </div>

              {error ? (
                <p className="register-error" role="alert" aria-live="polite">
                  {error}
                </p>
              ) : null}

              <button className="register-submit" type="submit" disabled={isSubmitting || !draftData}>
                {isSubmitting ? "SUBMITTING..." : "COMPLETE REGISTRATION"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
