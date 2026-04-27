import React from "react";

export default function RegistrationClosedPage() {
  return (
    <>
      <div className="noise-layer" aria-hidden="true" />
      <div className="bg-glow bg-glow-one" aria-hidden="true" />
      <div className="bg-glow bg-glow-two" aria-hidden="true" />

      <main className="register-page-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <section className="register-page-content" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="register-intro" style={{ alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <a className="register-back" href="/">
              Back to Home
            </a>
            <p className="section-label" style={{ marginTop: '2rem' }}>EPOCH '26</p>
            <h1 style={{ marginBottom: '1.5rem' }}>Registration Closed</h1>
            <p className="register-intro-copy" style={{ fontSize: '1.125rem', lineHeight: '1.6', opacity: 0.8 }}>
              Thank you for the overwhelming response! The registrations for EPOCH '26 are now officially closed.
              We look forward to seeing the registered teams at the hackathon.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
