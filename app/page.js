"use client";

import { useEffect, useState } from "react";

const launchTime = new Date("2026-05-01T11:00:00+05:30").getTime();
const endTime = new Date("2026-05-02T11:00:00+05:30").getTime();

const navItems = [
  { id: "tracks", label: "Disciplines" },
  { id: "spoils", label: "Prizes" },
  { id: "chronology", label: "Process" },
  { id: "protocols", label: "FAQ" },
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
    amount: "₹50,000",
    note: "Champion team reward",
  },
  {
    rank: "Second Prize",
    amount: "₹30,000",
    note: "Runner-up reward",
  },
  {
    rank: "Third Prize",
    amount: "₹20,000",
    note: "Second runner-up reward",
  },
];

const chronology = [
  {
    time: "11:00 AM",
    title: "Hackathon Begins",
    description: "Assemble teams and ignite the timeline. Build starts now.",
  },
  {
    time: "04:00 PM",
    title: "Intel Checkpoint I",
    description: "Mandatory review of progress and problem validation.",
  },
  {
    time: "12:00 AM",
    title: "Midnight Jamming",
    description: "Caffeine, music, and pure deep-work mode.",
  },
  {
    time: "02:00 AM",
    title: "Intel Checkpoint II",
    description: "Architecture and risk pass with the mentors.",
  },
  {
    time: "09:30 AM",
    title: "Final Submission",
    description: "Repositories lock. The jury pipeline opens.",
  },
];

const rounds = [
  {
    phase: "Phase 01",
    title: "Round 1: Online Screening",
    price: "₹500",
    details: [
      "Team base fee",
      "IEEE members get ₹200 discount",
      "Submit PPT and idea",
      "Screening on April 24-25, 2026",
    ],
  },
  {
    phase: "Phase 02",
    title: "Round 2: Finale",
    price: "₹800",
    details: [
      "For shortlisted teams",
      "On-campus at Vemana IT",
      "Only shortlisted teams qualify",
      "Mentor and jury evaluations",
    ],
  },
];

const logs = [
  {
    id: "01",
    q: "Who can participate?",
    a: "Teams of 2 to 4 students currently enrolled in a college can participate.",
  },
  {
    id: "02",
    q: "What is the team size?",
    a: "Minimum 2 and maximum 4 members. Lone coders are encouraged to join or form teams.",
  },
  {
    id: "03",
    q: "Is it purely offline?",
    a: "Screening is online for Round 1. Teams shortlisted to Round 2 participate on campus in Bengaluru.",
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
      phase: "Time Starts In",
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
  const [phase, setPhase] = useState("Time Starts In");
  const [status, setStatus] = useState("Registrations are open. Finals begin on May 1 at 11:00 AM.");
  const [activeLog, setActiveLog] = useState(0);

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

        <p className="epoch-meta">May 1-2, 2026 at Vemana Institute of Technology, Bengaluru</p>

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
        <a className="epoch-btn" href="/register">
          Register Now
        </a>
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
          <p className="epoch-prize-sub">Total valuation in INR</p>
          <p className="epoch-prize-amount">₹3,00,000</p>
          <ul className="epoch-prize-list">
            <li>Cash prize for winners</li>
            <li>Incubation opportunities</li>
            <li>Mentorship access</li>
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

        <a className="epoch-btn" href="/register">
          Register Now
        </a>
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
        <p className="epoch-subcopy">Registrations are team based. IEEE is optional and gives Round 1 discount.</p>

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

        <a className="epoch-btn" href="/register">
          Register Now
        </a>
      </section>

      <section className="epoch-section" id="intel-logs">
        <h2>
          Intel <span>Logs</span>
        </h2>
        <div className="epoch-logs">
          {logs.map((item, index) => {
            const isOpen = index === activeLog;
            return (
              <article className="epoch-log" key={item.id}>
                <button
                  type="button"
                  className="epoch-log-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setActiveLog(isOpen ? -1 : index)}
                >
                  <span>{item.id}.</span>
                  <strong>{item.q}</strong>
                </button>
                <p className={isOpen ? "epoch-log-answer open" : "epoch-log-answer"}>{item.a}</p>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="epoch-footer">
        <p>EPOCH 26</p>
        <div>
          <a href="#top">Home</a>
          <a href="#tracks">Disciplines</a>
          <a href="#spoils">Spoils</a>
          <a href="/register">Register</a>
        </div>
      </footer>
    </main>
  );
}
