"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const eventDate = new Date("2026-05-01T11:00:00+05:30").getTime();
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/D7uEE3yTIq8DkRp03KOwYp";

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTimeLeft() {
  const diff = Math.max(eventDate - Date.now(), 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    complete: diff === 0,
  };
}

export default function RegisterSuccessPage() {
  const [teamId, setTeamId] = useState("");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTeamId(params.get("teamId") || "");

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="register-success-shell">
      <section className="register-success-card">
        <p className="section-label">EPOCH '26</p>
        <h1>Registration Received</h1>
        <p className="register-success-message">
          EPOCH '26 — Registration received. Slot confirmation follows first-come, first-serve order after payment verification.
        </p>

        {teamId ? (
          <div className="register-success-whatsapp" style={{ marginTop: "1rem" }}>
            <p className="register-success-whatsapp-note">Your Team ID</p>
            <p className="register-note" style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700 }}>
              {teamId}
            </p>
          </div>
        ) : null}

        <div className="register-success-countdown" aria-live="polite">
          <div className="register-success-timebox">
            <span>{timeLeft.days}</span>
            <small>Days</small>
          </div>
          <div className="register-success-timebox">
            <span>{timeLeft.hours}</span>
            <small>Hours</small>
          </div>
          <div className="register-success-timebox">
            <span>{timeLeft.minutes}</span>
            <small>Minutes</small>
          </div>
          <div className="register-success-timebox">
            <span>{timeLeft.seconds}</span>
            <small>Seconds</small>
          </div>
        </div>

        <p className="register-success-status">
          {timeLeft.complete
            ? "Hackathon is live now."
            : "Countdown to hackathon kickoff"}
        </p>

        <div className="register-success-whatsapp">
          <p className="register-success-whatsapp-note">
            Join the official WhatsApp group for announcements and updates.
          </p>
          <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
            Join WhatsApp Group
          </a>
        </div>

        <div className="register-success-actions">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link href="/portal-access" className="register-success-secondary">
            Create Portal Access
          </Link>
          <Link href="/login" className="register-success-secondary">
            Participant Login
          </Link>
          <Link href="/register" className="register-success-secondary">
            Register Another Team
          </Link>
        </div>
      </section>
    </main>
  );
}
