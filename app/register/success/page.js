"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const resultDate = new Date("2026-04-28T00:00:00+05:30").getTime();

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTimeLeft() {
  const diff = Math.max(resultDate - Date.now(), 0);

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
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
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
          EPOCH '26 — Registration Received. Screening results will be announced April 28.
        </p>

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
            ? "Screening results are being announced now."
            : "Countdown to screening results"}
        </p>

        <div className="register-success-actions">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link href="/register" className="register-success-secondary">
            Register Another Team
          </Link>
        </div>
      </section>
    </main>
  );
}
