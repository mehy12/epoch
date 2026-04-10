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
        a: "₹1500 per team for EPOCH '26 (single round).",
      },
      {
        q: "Is the fee refundable?",
        a: "No, the registration fee is non-refundable.",
      },
      {
        q: "Does registering early help?",
        a: "Yes. Registrations are confirmed strictly on a first-come, first-serve basis after successful payment.",
      },
      {
        q: "Is IEEE membership mandatory?",
        a: "No. IEEE membership is optional and not required to register or participate.",
      },
    ],
  },
  {
    key: "format",
    title: "Event Format",
    items: [
      {
        q: "How many rounds are there?",
        a: "Only one round. EPOCH '26 is a single-round 24-hour offline hackathon.",
      },
      {
        q: "Is there any shortlisting round before the event?",
        a: "No. There is no separate screening or shortlisting round.",
      },
      {
        q: "How are slots confirmed?",
        a: "Slots are locked on a first-come, first-serve basis once registration payment is completed.",
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
        q: "Can we change our idea after registration?",
        a: "Minor refinements are allowed, but your core problem statement and track should remain aligned.",
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
