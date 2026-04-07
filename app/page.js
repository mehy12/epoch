"use client";

import { useEffect, useState } from "react";
import { ROUND1_PPT_TEMPLATE_URL } from "@/lib/event-links";

const launchTime = new Date("2026-05-01T11:00:00+05:30").getTime();
const endTime = new Date("2026-05-02T11:00:00+05:30").getTime();

const navItems = [
  { id: "tracks", label: "Disciplines" },
  { id: "spoils", label: "Prizes" },
  { id: "chronology", label: "Process" },
  { id: "faq", label: "FAQ" },
];

const tracks = [
  {
    code: "TRACK 01",
    ghost: "AI",
    title: "AI for Social Good",
    description: "Build intelligent systems that improve communities and solve practical civic problems.",
  },
  {
    code: "TRACK 02",
    ghost: "SG",
    title: "Sustainability Goals",
    description: "Design resilient products that push measurable progress across environmental outcomes.",
  },
  {
    code: "TRACK 03",
    ghost: "CB",
    title: "Cybersecurity & Blockchain",
    description: "Create secure digital experiences with trusted identity, data integrity, and privacy by design.",
  },
];

const podiumPrizes = [
  {
    rank: "First Prize",
    amount: "3 × ₹50,000",
    note: "Per domain champion reward",
  },
  {
    rank: "Second Prize",
    amount: "3 × ₹30,000",
    note: "Per domain runner-up reward",
  },
  {
    rank: "Third Prize",
    amount: "3 × ₹20,000",
    note: "Per domain second runner-up reward",
  },
];

const chronology = [
  {
    time: "11:00 AM",
    title: "Hackathon Begins",
    description: "Assemble teams and begin building.",
  },
  {
    time: "02:00 PM",
    title: "Lunch",
    description: "Lunch break for all participants.",
  },
  {
    time: "05:00 PM",
    title: "Snacks",
    description: "Evening snacks break.",
  },
  {
    time: "08:00 PM",
    title: "Dinner",
    description: "Dinner break for teams.",
  },
  {
    time: "12:00 AM",
    title: "Jamming Session",
    description: "Midnight creativity and deep work.",
  },
  {
    time: "04:00 AM",
    title: "Tea & Coffee",
    description: "Refreshment break for participants.",
  },
  {
    time: "08:00 AM",
    title: "Breakfast",
    description: "Breakfast served at venue.",
  },
  {
    time: "11:00 AM",
    title: "Judging Begins",
    description: "Project evaluation starts.",
  },
  {
    time: "01:00 PM",
    title: "Valedictory Ceremony",
    description: "Closing ceremony and announcements.",
  },
];

const rounds = [
  {
    phase: "Phase 01",
    title: "Round 1: Online Screening",
    price: "₹500",
    details: [
      "Team base fee",
      "Payment via QR in registration flow",
      "Submit PPT and idea",
      "Screening on April 24-25, 2026",
    ],
  },
  {
    phase: "Phase 02",
    title: "Round 2: Finale",
    price: "₹1000",
    details: [
      "For shortlisted teams",
      "On-campus at Vemana IT",
      "Only shortlisted teams qualify",
      "Mentor and jury evaluations",
    ],
  },
];

const homeFaqItems = [
  {
    q: "Who can participate?",
    a: "Students from any college, any year, and any discipline can participate in teams of 2-4 members.",
  },
  {
    q: "What is the registration fee?",
    a: "₹500 per team for Round 1 and ₹1000 per team for Round 2 (only if shortlisted).",
  },
  {
    q: "Is Round 2 offline?",
    a: "Yes, Round 2 is a fully offline 24-hour finale at Vemana Institute of Technology.",
  },
  {
    q: "Do we need to bring our own laptops?",
    a: "Yes, all participants must bring their own laptops and required accessories.",
  },
];

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTimerState() {
  const now = Date.now();

  if (now < launchTime) {
    return {
      totalMs: launchTime - now,
      phase: "Starts In",
      status: "Registrations are open. Finals begin on May 1 at 11:00 AM.",
    };
  }

  if (now >= launchTime && now <= endTime) {
    return {
      totalMs: endTime - now,
      phase: "Hackathon In Progress",
      status: "EPOCH '26 is now live.",
    };
  }

  return {
    totalMs: 0,
    phase: "Event Complete",
    status: "Thank you for participating in EPOCH '26.",
  };
}

function splitTime(totalMs) {
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
}

export default function HomePage() {
  const [timer, setTimer] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
  const [phase, setPhase] = useState("Starts In");
  const [status, setStatus] = useState("Registrations are open. Finals begin on May 1 at 11:00 AM.");
  const [openFaq, setOpenFaq] = useState("home-0");

  useEffect(() => {
    const tick = () => {
      const next = getTimerState();
      setTimer(splitTime(next.totalMs));
      setPhase(next.phase);
      setStatus(next.status);
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="epoch-home" id="top">
      <div className="epoch-stars" aria-hidden="true" />
      <div className="epoch-glow epoch-glow-one" aria-hidden="true" />
      <div className="epoch-glow epoch-glow-two" aria-hidden="true" />

      <header className="epoch-topbar">
        <a className="epoch-brand" href="#top">
          EPOCH 26
        </a>
        <nav className="epoch-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
          <a href="/rules">Rules</a>
          <a href="/contact">Contact</a>
        </nav>
        <a className="epoch-btn epoch-btn-compact" href="/register">
          Register Now
        </a>
      </header>

      <section className="epoch-hero">
        <p className="epoch-kicker">Time Starts Here</p>
        <h1>
          EPOCH <span>'26</span>
        </h1>

        <div className="epoch-countdown-wrap" role="timer" aria-live="polite">
          <p className="epoch-phase">{phase}</p>
          <div className="epoch-countdown-grid">
            <article className="epoch-timebox">
              <span>{timer.days}</span>
              <small>Days</small>
            </article>
            <article className="epoch-timebox">
              <span>{timer.hours}</span>
              <small>Hours</small>
            </article>
            <article className="epoch-timebox">
              <span>{timer.minutes}</span>
              <small>Minutes</small>
            </article>
            <article className="epoch-timebox">
              <span>{timer.seconds}</span>
              <small>Seconds</small>
            </article>
          </div>
          <p className="epoch-status">{status}</p>
        </div>

        <p className="epoch-meta">
          <span className="epoch-meta-date">May 1-2, 2026</span>
          <span className="epoch-meta-venue">Vemana Institute of Technology, Bengaluru</span>
        </p>

        <a className="epoch-btn" href="/register">
          Register Now
        </a>

        <aside className="epoch-coin" aria-hidden="true">
          <div className="epoch-coin-core">
            <span>EPOCH 26</span>
          </div>
        </aside>
      </section>

      <section className="epoch-section" id="tracks">
        <h2>
          Choose Your <span>Lane.</span>
        </h2>
        <p className="epoch-subcopy">Problem statements for each track will be released soon.</p>
        <div className="epoch-track-grid">
          {tracks.map((track) => (
            <article className="epoch-track-card" key={track.title} data-ghost={track.ghost}>
              <p className="epoch-card-code">{track.code}</p>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <span className="epoch-pill">Problem Statement Soon</span>
            </article>
          ))}
        </div>
      </section>

      <section className="epoch-section" id="spoils">
        <div className="epoch-section-head">
          <h2>
            Win <span>Big.</span>
          </h2>
          <p>The ultimate victory deserves legendary rewards. Compete for glory and big prizes.</p>
        </div>

        <article className="epoch-prize-feature">
          <p className="epoch-prize-watermark" aria-hidden="true">
            AWARD
          </p>
          <p className="epoch-prize-label">
            <span>Prize</span>
            <span>Pool</span>
          </p>
          <p className="epoch-prize-sub">Total valuation in INR | ₹1,00,000 per domain</p>
          <p className="epoch-prize-amount">₹3,00,000</p>
          <ul className="epoch-prize-list">
            <li>Per domain split: ₹50k + ₹30k + ₹20k</li>
            <li>Across 3 domains: ₹3,00,000 total</li>
            <li>Incubation and mentorship access</li>
          </ul>
        </article>

        <div className="epoch-spoil-grid">
          {podiumPrizes.map((item) => (
            <article className="epoch-spoil-card" key={item.rank}>
              <p className="epoch-card-code">{item.rank}</p>
              <h4>{item.amount}</h4>
              <small>{item.note}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="epoch-section" id="chronology">
        <h2>
          Event <span>Chronology</span>
        </h2>
        <div className="epoch-timeline">
          {chronology.map((item) => (
            <article className="epoch-timeline-row" key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <p className="epoch-timeline-time">{item.time}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="epoch-section" id="protocols">
        <h2>
          Access <span>Protocols</span>
        </h2>
        <p className="epoch-subcopy">Registrations are team based. Teams selected based on their proposals, will be notified.</p>

        <div className="epoch-rounds-grid">
          {rounds.map((round) => (
            <article className="epoch-round-card" key={round.title}>
              <p className="epoch-card-code">{round.phase}</p>
              <h3>{round.title}</h3>
              <p className="epoch-round-price">{round.price}</p>
              <ul>
                {round.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="epoch-template-link-row">
          <p className="epoch-subcopy">Round 1 idea submission PPT template</p>
          <a
            className="epoch-btn epoch-btn-compact"
            href={ROUND1_PPT_TEMPLATE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Download PPT Template
          </a>
        </div>

        <a className="epoch-btn" href="/register">
          Register Now
        </a>
      </section>

      <section className="epoch-section epoch-faq-section" id="faq">
        <h2>
          Hackathon <span>FAQ</span>
        </h2>
        <p className="epoch-subcopy">A few quick answers before you register.</p>

        <div className="epoch-faq-board">
          <article className="epoch-faq-group">
            <h3 className="epoch-faq-group-title">Quick Questions</h3>
            <div className="epoch-faq-list">
              {homeFaqItems.map((item, index) => {
                const itemKey = `home-${index}`;
                const isOpen = openFaq === itemKey;

                return (
                  <div className="epoch-faq-item" key={itemKey}>
                    <button
                      type="button"
                      className="epoch-faq-trigger"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${itemKey}`}
                      onClick={() => setOpenFaq(isOpen ? "" : itemKey)}
                    >
                      <span>{item.q}</span>
                      <span className="epoch-faq-icon" aria-hidden="true">
                        {isOpen ? "-" : "+"}
                      </span>
                    </button>
                    <p id={`faq-panel-${itemKey}`} className={isOpen ? "epoch-faq-answer open" : "epoch-faq-answer"}>
                      {item.a}
                    </p>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        <div className="epoch-faq-more">
          <p>Got more questions?</p>
          <a className="epoch-btn epoch-btn-compact" href="/faq">
            Open Full FAQ
          </a>
        </div>
      </section>

      <footer className="epoch-footer">
        <p>EPOCH 26 • Website designed by Meesam Hyder</p>
        <div>
          <a href="#top">Home</a>
          <a href="#tracks">Disciplines</a>
          <a href="#spoils">Spoils</a>
          <a href="/faq">FAQ</a>
          <a href="/rules">Rules</a>
          <a href="/contact">Contact</a>
          <a href="/register">Register</a>
        </div>
      </footer>
    </main>
  );
}
