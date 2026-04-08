"use client";

import { useState } from "react";

const faqSections = [
  {
    key: "general",
    title: "General",
    items: [
      {
        q: "What is EPOCH '26?",
        a: "A 24-hour national-level hackathon hosted at Vemana Institute of Technology where students build innovative tech solutions.",
      },
      {
        q: "Who can participate?",
        a: "Students from any college, any year, and any discipline can participate.",
      },
      {
        q: "What is the team size?",
        a: "Teams must have 2-4 members.",
      },
    ],
  },
  {
    key: "registration",
    title: "Registration & Fees",
    items: [
      {
        q: "What is the registration fee?",
        a: "₹400 per team for Round 1 and ₹1100 per team for Round 2 (only if shortlisted).",
      },
      {
        q: "Is the fee refundable?",
        a: "No, the registration fee is non-refundable.",
      },
      {
        q: "Does registering early help?",
        a: "Yes. Earlier registrations may be given priority during screening, and exceptional early submissions may be considered for direct Round 2 shortlisting based on quality and evaluation criteria.",
      },
    ],
  },
  {
    key: "round1",
    title: "Round 1 (Screening)",
    items: [
      {
        q: "What is Round 1?",
        a: "An online screening round where teams submit their idea.",
      },
      {
        q: "What do we need to submit?",
        a: "A 5-6 slide PPT covering problem, solution, technical approach, feasibility, and impact.",
      },
      {
        q: "How will teams be shortlisted?",
        a: "Based on problem clarity, solution quality, technical feasibility, innovation, and overall submission quality.",
      },
    ],
  },
  {
    key: "round2",
    title: "Round 2 (Final Hackathon)",
    items: [
      {
        q: "What is Round 2?",
        a: "A 24-hour offline hackathon at Vemana Institute of Technology.",
      },
      {
        q: "Is Round 2 offline?",
        a: "Yes, it is fully offline and requires physical presence.",
      },
      {
        q: "What happens in Round 2?",
        a: "Teams build a working prototype and present it to judges.",
      },
    ],
  },
  {
    key: "rules",
    title: "Rules & Participation",
    items: [
      {
        q: "Can we use pre-built projects?",
        a: "No. Projects must be built during the hackathon. Open-source libraries and APIs are allowed.",
      },
      {
        q: "Can we change our idea after Round 1?",
        a: "Minor changes are allowed, but the core idea should remain the same.",
      },
    ],
  },
  {
    key: "prizes",
    title: "Prizes",
    items: [
      {
        q: "What is the prize pool?",
        a: "₹3,00,000 total across 3 domains, with ₹1,00,000 per domain split as ₹50,000, ₹30,000, and ₹20,000.",
      },
    ],
  },
  {
    key: "logistics",
    title: "Logistics",
    items: [
      {
        q: "Where is the venue?",
        a: "Vemana Institute of Technology, Koramangala, Bangalore.",
      },
      {
        q: "Will food be provided?",
        a: "Yes, food will be provided during the hackathon.",
      },
      {
        q: "Will internet be provided?",
        a: "Yes, internet access will be provided at the venue.",
      },
      {
        q: "Do participants need to bring their own laptops?",
        a: "Yes, all participants must bring their own laptops and required accessories.",
      },
      {
        q: "Do teams need to bring a spike buster / extension board?",
        a: "Yes, each team must carry at least one spike buster / extension board for power access.",
      },
    ],
  },
  {
    key: "contact",
    title: "Contact",
    items: [
      {
        q: "How will we receive updates?",
        a: "Updates will be shared via email (and WhatsApp if applicable).",
      },
      {
        q: "Who can we contact for queries?",
        a: "Email: epoch26@vemanait.ac.in | Phone/WhatsApp: +91 98765 43210.",
      },
    ],
  },
];

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState("general-0");

  return (
    <main className="rules-page-shell faq-page-shell">
      <section className="rules-page-content faq-page-content">
        <a className="register-back" href="/">
          Back to Home
        </a>

        <p className="section-label">EPOCH '26</p>
        <h1 className="rules-main-title">Frequently Asked Questions</h1>
        <p className="rules-subtitle">Everything you need to know before and during the hackathon.</p>

        <div className="epoch-faq-board faq-page-board">
          {faqSections.map((section) => (
            <article className="epoch-faq-group" key={section.key}>
              <h2 className="epoch-faq-group-title">{section.title}</h2>
              <div className="epoch-faq-list">
                {section.items.map((item, index) => {
                  const itemKey = `${section.key}-${index}`;
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
          ))}
        </div>
      </section>
    </main>
  );
}
