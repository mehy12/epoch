"use client";

import { useState } from "react";

const committeeContacts = [
  {
    role: "Event Head",
    name: "[ MEESAM HYDER ]",
    phone: "+91 63620 29195",
  },
  {
    role: "Co-ordinator",
    name: "[ AKSHYANSHU SEKHAR NAYAK ]",
    phone: "+91 98765 43210",
  },
  {
    role: "Registrations",
    name: "[ PRASHANTH TIWARI ]",
    phone: "+91 98765 43210",
  },
  {
    role: "Technical Lead",
    name: "[ V PUNITH REDDY ]",
    phone: "+91 XXXXX XXXXX",
  },
];

const socialLinks = [
  { tag: "IG", label: "Instagram", href: "https://instagram.com" },
  { tag: "LI", label: "LinkedIn", href: "https://linkedin.com" },
  { tag: "WA", label: "WhatsApp", href: "https://wa.me/919876543210" },
];

const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=Vemana+Institute+of+Technology+Koramangala+Bangalore";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    queryType: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState("idle");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitState("sent");
    setFormData({
      name: "",
      email: "",
      college: "",
      queryType: "",
      message: "",
    });
  };

  return (
    <>
      <div className="noise-layer" aria-hidden="true" />
      <div className="bg-glow bg-glow-one" aria-hidden="true" />
      <div className="bg-glow bg-glow-two" aria-hidden="true" />

      <main className="contact-page-shell">
        <section className="contact-page-content">
          <a className="register-back" href="/">
            Back to Home
          </a>

          <p className="contact-eyebrow">EPOCH '26 • Contact Us</p>
          <h1 className="contact-title">
            Get In <span>Touch.</span>
          </h1>
          <p className="contact-subtitle">We'll get back to you within 24 hours.</p>

          <div className="contact-grid">
            <div className="contact-left-stack">
              <article className="contact-card">
                <p className="contact-card-label">Organising Committee</p>
                <div className="contact-committee-grid">
                  {committeeContacts.map((entry) => (
                    <div className="contact-mini-card" key={entry.role}>
                      <p className="contact-mini-role">{entry.role}</p>
                      <p className="contact-mini-name">{entry.name}</p>
                      <p className="contact-mini-phone">{entry.phone}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="contact-card">
                <p className="contact-card-label">Reach Us</p>
                <div className="contact-reach-list">
                  <div className="contact-reach-item">
                    <p className="contact-reach-head">Email</p>
                    <a href="mailto:epoch26@vit.edu.in" className="contact-reach-main">
                      epoch26@vit.edu.in
                    </a>
                    <a href="mailto:ieee@vit.edu.in" className="contact-reach-sub">
                      ieee@vit.edu.in
                    </a>
                  </div>

                  <div className="contact-reach-item">
                    <p className="contact-reach-head">Phone</p>
                    <a href="tel:+919876543210" className="contact-reach-main">
                      +91 XXXXX XXXXX
                    </a>
                    <p className="contact-reach-sub">Mon - Fri, 9AM - 6PM IST</p>
                  </div>

                  <div className="contact-reach-item">
                    <p className="contact-reach-head">Venue</p>
                    <p className="contact-reach-main">Vemana Institute of Technology</p>
                    <p className="contact-reach-sub">Koramangala, Bangalore - 560034</p>
                  </div>
                </div>
              </article>

              <article className="contact-card">
                <p className="contact-card-label">Find Us On</p>
                <div className="contact-social-grid">
                  {socialLinks.map((link) => (
                    <a key={link.tag} className="contact-social-chip" href={link.href} target="_blank" rel="noreferrer">
                      <small>{link.tag}</small>
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>

                <a className="contact-map-card" href={mapUrl} target="_blank" rel="noreferrer">
                  <p className="contact-map-kicker">Open in Maps</p>
                  <p className="contact-map-main">Vemana Institute of Technology</p>
                  <p className="contact-map-sub">Koramangala, Bangalore</p>
                </a>
              </article>
            </div>

            <form className="contact-card contact-form-card" onSubmit={handleSubmit} noValidate>
              <p className="contact-card-label">Send Us a Message</p>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contactName">
                  Your Name
                </label>
                <input
                  id="contactName"
                  name="name"
                  className="contact-control"
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contactEmail">
                  Email Address
                </label>
                <input
                  id="contactEmail"
                  name="email"
                  className="contact-control"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contactCollege">
                  College Name
                </label>
                <input
                  id="contactCollege"
                  name="college"
                  className="contact-control"
                  type="text"
                  placeholder="Your institution"
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contactQueryType">
                  Query Type
                </label>
                <select
                  id="contactQueryType"
                  name="queryType"
                  className="contact-control"
                  value={formData.queryType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="registration">Registration</option>
                  <option value="payment">Payment</option>
                  <option value="rounds">Rounds and Selection</option>
                  <option value="logistics">Venue and Logistics</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contactMessage">
                  Your Message
                </label>
                <textarea
                  id="contactMessage"
                  name="message"
                  className="contact-control contact-textarea"
                  placeholder="Describe your query in detail..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="contact-submit" type="submit">
                Send Message
              </button>

              <p className="contact-form-note" role="status" aria-live="polite">
                {submitState === "sent" ? "Message received. We will contact you within 24 hours." : "We respond within 24 hours on working days."}
              </p>
            </form>
          </div>

          <footer className="contact-footer">
            <p>EPOCH '26 - Vemana Institute of Technology</p>
            <p>#EPOCHHACK26</p>
          </footer>
        </section>
      </main>
    </>
  );
}
