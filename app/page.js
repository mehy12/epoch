"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const launchTime = new Date("2026-05-01T11:00:00+05:30").getTime();
const endTime = new Date("2026-05-02T11:00:00+05:30").getTime();

const smoothEase = [0.22, 1, 0.36, 1];

function pad(value) {
  return String(value).padStart(2, "0");
}

function getCountdownState() {
  const now = Date.now();

  if (now < launchTime) {
    const totalMs = launchTime - now;
    return {
      totalMs,
      status: "Registration wave is active. Finals begin on May 1, 11:00 AM.",
      phaseLabel: "Countdown to Launch",
    };
  }

  if (now >= launchTime && now <= endTime) {
    const totalMs = endTime - now;
    return {
      totalMs,
      status: "GENESIS '26 is live now.",
      phaseLabel: "Countdown to Finish",
    };
  }

  return {
    totalMs: 0,
    status: "GENESIS '26 has concluded. Thank you for participating.",
    phaseLabel: "Event Complete",
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

const schedule = [
  { time: "11:00 AM", title: "Hackathon Begins" },
  { time: "2:00 PM", title: "Lunch" },
  { time: "5:00 PM", title: "Snacks" },
  { time: "8:00 PM", title: "Dinner" },
  { time: "12:00 AM", title: "Jamming Session" },
  { time: "4:00 AM", title: "Tea & Coffee" },
  { time: "8:00 AM", title: "Breakfast" },
  { time: "11:00 AM", title: "Judging Begins" },
  { time: "1:00 PM", title: "Valedictory Ceremony" },
];

const navItems = [
  { id: "hero", label: "Live Feed" },
  { id: "about", label: "About" },
  { id: "tracks", label: "Tracks" },
  { id: "schedule", label: "Timeline" },
  { id: "registration", label: "Register" },
  { id: "faq", label: "FAQ" },
];

const stats = [
  { label: "Hackathon Length", value: "24H" },
  { label: "Prize Pool", value: "₹3L+" },
  { label: "Team Size", value: "2-4" },
  { label: "Tracks", value: "03" },
];

const faqItems = [
  {
    question: "Who can participate in GENESIS '26?",
    answer:
      "Teams of 2 to 4 can participate. IEEE membership is optional, but members get a ₹200 discount in Round 1.",
  },
  {
    question: "What should teams submit in Round 1?",
    answer:
      "Teams must submit a PPT and idea brief during online screening on April 24-25, 2026.",
  },
  {
    question: "How does fee progression work?",
    answer:
      "Round 1 base fee is ₹500 per team. IEEE members get ₹200 off, so Round 1 becomes ₹300. Shortlisted teams then pay ₹800 for Round 2, making the effective total ₹1,100 to ₹1,300 per team.",
  },
  {
    question: "When will problem statements be released?",
    answer:
      "Problem statements for all tracks will be published shortly before the event on official channels.",
  },
];

const tracks = [
  {
    icon: "AI",
    bgIcon: "AI",
    title: "AI for Social Good",
    description:
      "Build intelligent solutions that improve communities and lives.",
  },
  {
    icon: "SG",
    bgIcon: "SG",
    title: "Sustainability Goals",
    description:
      "Design systems that move us toward scalable sustainable outcomes.",
  },
  {
    icon: "CB",
    bgIcon: "CB",
    title: "Cybersecurity & Blockchain",
    description:
      "Create secure, trusted digital experiences with modern architectures.",
  },
];

function RegisterCTA() {
  return (
    <div className="cta-row">
      <a className="btn btn-primary" href="#registration">
        Register Now
      </a>
    </div>
  );
}

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const initial = getCountdownState();
  const [countdown, setCountdown] = useState(splitTime(initial.totalMs));
  const [status, setStatus] = useState(initial.status);
  const [phaseLabel, setPhaseLabel] = useState(initial.phaseLabel);
  const [year, setYear] = useState(2026);
  const [activeSection, setActiveSection] = useState("hero");
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sectionMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.75, ease: smoothEase },
      };

  const itemMotion = (index = 0, amount = 0.2) => {
    if (reduceMotion) {
      return {};
    }

    return {
      initial: { opacity: 0, y: 24, scale: 0.99 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      viewport: { once: true, amount },
      transition: {
        duration: 0.6,
        delay: index * 0.08,
        ease: smoothEase,
      },
    };
  };

  useEffect(() => {
    setYear(new Date().getFullYear());

    const tick = () => {
      const next = getCountdownState();
      setCountdown(splitTime(next.totalMs));
      setStatus(next.status);
      setPhaseLabel(next.phaseLabel);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-30% 0px -45% 0px",
        threshold: 0.2,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 840) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnDesktop);
    return () => window.removeEventListener("resize", closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateScrollEffects = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

      document.documentElement.style.setProperty("--scroll-y", scrollY.toFixed(2));
      document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    };

    updateScrollEffects();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="noise-layer" aria-hidden="true" />
      <div className="bg-glow bg-glow-one" aria-hidden="true" />
      <div className="bg-glow bg-glow-two" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#hero">
          GENESIS '26
        </a>
        <nav className="main-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? "active" : ""}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <a className="btn btn-primary" href="#registration">
          Register Now
        </a>
      </header>

      <nav
        id="mobile-nav"
        className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}
        aria-label="Mobile section navigation"
      >
        <div className="mobile-nav-list">
          {navItems.map((item) => (
            <a
              key={`mobile-${item.id}`}
              href={`#${item.id}`}
              className={activeSection === item.id ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="page-shell">
        <motion.section id="hero" className="section hero" {...sectionMotion}>
          <p className="hero-kicker">Grand National Hackathon • Vemana IT Bengaluru</p>
          <motion.h1 {...itemMotion(0, 0.4)}>
            GENESIS <span>'26</span>
          </motion.h1>
          <p className="tagline">Time starts here.</p>

          <motion.div className="hero-subpanel" {...itemMotion(1, 0.35)}>
            <p className="numeric">May 1-2, 2026 • 11:00 AM to 11:00 AM</p>
            <p className="venue-highlight">VEMANA INSTITUTE OF TECHNOLOGY, BENGALURU</p>
          </motion.div>

          <motion.div className="countdown-wrap" role="timer" aria-live="polite" {...itemMotion(2, 0.3)}>
            <p className="countdown-label">{phaseLabel}</p>
            <div className="countdown" id="countdown">
              <div className="time-box">
                <span className="numeric">{countdown.days}</span>
                <small>Days</small>
              </div>
              <div className="time-box">
                <span className="numeric">{countdown.hours}</span>
                <small>Hours</small>
              </div>
              <div className="time-box">
                <span className="numeric">{countdown.minutes}</span>
                <small>Minutes</small>
              </div>
              <div className="time-box">
                <span className="numeric">{countdown.seconds}</span>
                <small>Seconds</small>
              </div>
            </div>
            <p className="countdown-status">{status}</p>
          </motion.div>

          <RegisterCTA />
        </motion.section>

        <motion.section id="about" className="section" {...sectionMotion}>
          <p className="section-label">THE MISSION</p>
          <div className="about-layout">
            <motion.div {...itemMotion(0)}>
              <h2>
                Engineering <span>Impact.</span>
              </h2>
              <p>
                GENESIS '26 is where focused builders design meaningful products in
                a high-intensity 24-hour sprint. From midnight breakthroughs to
                sunrise demos, every team works under pressure to ship practical,
                scalable innovation.
              </p>
              <p>
                Team size is 2-4 members. IEEE membership is optional, and IEEE
                members get ₹200 off in Round 1.
              </p>
            </motion.div>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.article className="stat-card card-hover" key={stat.label} {...itemMotion(index + 1)}>
                  <p>{stat.label}</p>
                  <h3 className="stat-value numeric">{stat.value}</h3>
                </motion.article>
              ))}
            </div>
          </div>
          <RegisterCTA />
        </motion.section>

        <motion.section id="tracks" className="section" {...sectionMotion}>
          <p className="section-label">TRACKS</p>
          <h2>
            Choose Your <span>Lane.</span>
          </h2>
          <p className="section-copy">Problem statements for each track will be released soon.</p>
          <div className="tracks-grid">
            {tracks.map((track, index) => (
              <motion.article
                className="track-card card-hover"
                key={track.title}
                data-bgicon={track.bgIcon}
                {...itemMotion(index, 0.22)}
              >
                <div className="track-head">
                  <p className="track-index">Track {String(index + 1).padStart(2, "0")}</p>
                  <p className="track-icon">{track.icon}</p>
                </div>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <span className="badge">Problem Statements Coming Soon</span>
              </motion.article>
            ))}
          </div>
          <RegisterCTA />
        </motion.section>

        <motion.section id="schedule" className="section" {...sectionMotion}>
          <p className="section-label">CHRONOLOGY</p>
          <h2>Event Timeline</h2>
          <div className="timeline" aria-label="Event timeline">
            {schedule.map((item, index) => (
              <motion.article
                className="timeline-item card-hover"
                key={`${item.time}-${item.title}`}
                {...itemMotion(index, 0.2)}
              >
                <p className="timeline-time numeric">{item.time}</p>
                <div className="timeline-content">
                  <p className="timeline-index numeric">{String(index + 1).padStart(2, "0")}</p>
                  <h3>{item.title}</h3>
                </div>
              </motion.article>
            ))}
          </div>
          <RegisterCTA />
        </motion.section>

        <motion.section id="registration" className="section" {...sectionMotion}>
          <p className="section-label">ACCESS PROTOCOLS</p>
          <h2>Registration</h2>
          <p className="section-copy">
            Team size: 2-4 members. IEEE is optional. IEEE members receive ₹200
            off in Round 1.
          </p>

          <div className="registration-flow">
            <motion.article className="reg-card round-one card-hover" {...itemMotion(0)}>
              <p className="reg-stage">Round 1</p>
              <h3>Online Screening</h3>
              <p className="fee-row">
                Fee <span className="fee-amount numeric">₹500</span>
                <span className="fee-unit">base per team</span>
              </p>
              <p className="effective-cost numeric">IEEE members get ₹200 off (₹300).</p>
              <ul>
                <li>Submit PPT + Idea</li>
                <li>Screening: April 24-25, 2026</li>
                <li>Shortlist announcement: April 28, 2026</li>
              </ul>
            </motion.article>

            <motion.div className="flow-indicator" aria-hidden="true" {...itemMotion(1)}>
              <span className="flow-label">Round 1 -&gt; Round 2</span>
            </motion.div>

            <motion.article className="reg-card round-two card-hover" {...itemMotion(2)}>
              <p className="reg-stage">Round 2</p>
              <h3>Finale</h3>
              <p className="fee-row">
                Fee <span className="fee-amount numeric">₹800</span>
                <span className="fee-unit">for shortlisted teams</span>
              </p>
              <p className="effective-cost numeric">
                Effective participation: ₹1,100-₹1,300 / team
              </p>
              <ul>
                <li>Only shortlisted teams qualify</li>
                <li>On-campus finale at Vemana IT Bengaluru</li>
              </ul>
            </motion.article>
          </div>

          <RegisterCTA />
        </motion.section>

        <motion.section id="prizes" className="section" {...sectionMotion}>
          <p className="section-label">PRIZE POOL</p>
          <h2>
            Win <span>Big.</span>
          </h2>
          <motion.div
            className="prize-showcase"
            aria-label="Prize pool highlight"
            initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.985 }}
            whileInView={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2, margin: "-8% 0px -8% 0px" }}
            transition={{ duration: 0.75, ease: smoothEase }}
          >
            <p className="prize-kicker">Prize Pool</p>
            <p className="prize-mini numeric">Total Valuation in INR</p>
            <p className="prize-watermark" aria-hidden="true">
              AWARD
            </p>
            <h3 className="numeric prize-amount">₹3,00,000</h3>
            <ul className="prize-notes">
              <li>Cash Prize for Winners</li>
              <li>Incubation Opportunities</li>
              <li>Mentorship Access</li>
            </ul>
          </motion.div>
          <div className="prize-grid">
            <motion.article className="prize-card card-hover" {...itemMotion(0)}>
              <h4>AI for Social Good</h4>
              <p className="numeric">₹1,00,000</p>
            </motion.article>
            <motion.article className="prize-card card-hover" {...itemMotion(1)}>
              <h4>Sustainability Goals</h4>
              <p className="numeric">₹1,00,000</p>
            </motion.article>
            <motion.article className="prize-card card-hover" {...itemMotion(2)}>
              <h4>Cybersecurity &amp; Blockchain</h4>
              <p className="numeric">₹1,00,000</p>
            </motion.article>
            <motion.article className="prize-card card-hover" {...itemMotion(3)}>
              <h4>Goodies</h4>
              <p className="numeric">Worth ₹10,000</p>
            </motion.article>
          </div>
          <RegisterCTA />
        </motion.section>

        <motion.section id="faq" className="section" {...sectionMotion}>
          <p className="section-label">SYSTEM DEBRIEF</p>
          <h2>FAQ</h2>
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.article className="faq-item" key={item.question} {...itemMotion(index, 0.18)}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className="faq-plus">{isOpen ? "-" : "+"}</span>
                  </button>
                  <div
                    className={`faq-answer ${isOpen ? "is-open" : ""}`}
                    style={{ maxHeight: isOpen ? "200px" : "0px" }}
                  >
                    <p>{item.answer}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
          <RegisterCTA />
        </motion.section>
      </main>

      <footer className="site-footer">
        <motion.div className="footer-col brand-col" {...itemMotion(0, 0.15)}>
          <div className="logo-row" aria-label="Institution logos">
            <div className="logo-chip">IEEE</div>
            <div className="logo-chip">Vemana IT</div>
          </div>
          <h3>GENESIS '26</h3>
          <p className="venue-highlight footer-venue">Vemana Institute of Technology, Bengaluru</p>
        </motion.div>
        <motion.div className="footer-col" {...itemMotion(1, 0.15)}>
          <h4>Quick Links</h4>
          <a href="#about">About</a>
          <a href="#tracks">Tracks</a>
          <a href="#schedule">Schedule</a>
          <a href="#registration">Registration</a>
        </motion.div>
        <motion.div className="footer-col" {...itemMotion(2, 0.15)}>
          <h4>Contact</h4>
          <p>Email: GENESIS26@vemanait.ac.in</p>
          <p>Phone: +91 98765 43210</p>
          <p>IEEE Student Branch, Vemana Institute of Technology, Bengaluru</p>
        </motion.div>
        <motion.div className="footer-col" {...itemMotion(3, 0.15)}>
          <h4>Social</h4>
          <div className="social-links">
            <a href="#" aria-label="Instagram" className="social-link">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <circle cx="12" cy="12" r="3.2" />
                <circle cx="17.4" cy="6.6" r="1" />
              </svg>
              <span>Instagram</span>
            </a>
            <a href="#" aria-label="LinkedIn" className="social-link">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <rect x="7" y="10" width="2.5" height="7" />
                <circle cx="8.25" cy="7.5" r="1.25" />
                <path d="M12 10h2.4v1.2h.1c.4-.8 1.4-1.5 2.9-1.5 2.2 0 3.1 1.4 3.1 3.8V17H18v-3.1c0-1.2-.4-2-1.5-2-1 0-1.7.7-1.9 1.4-.1.2-.1.5-.1.8V17H12z" />
              </svg>
              <span>LinkedIn</span>
            </a>
            <a href="#" aria-label="X" className="social-link">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4h4.2l3.6 5.1L16.4 4H20l-6.4 7.3L20 20h-4.2l-4-5.7L7 20H4l6.2-7.2z" />
              </svg>
              <span>X</span>
            </a>
          </div>
        </motion.div>
        <p className="copyright">© {year} GENESIS '26 | IEEE Vemana Institute of Technology, Bengaluru</p>
      </footer>
    </>
  );
}
