import React from "react";

export default function RegistrationClosedPage() {
  return (
    <main className="epoch-home" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="epoch-stars" aria-hidden="true" />
      <div className="epoch-glow epoch-glow-one" aria-hidden="true" />
      <div className="epoch-glow epoch-glow-two" aria-hidden="true" />

      <header className="epoch-topbar">
        <a className="epoch-brand" href="/">
          EPOCH 26
        </a>
        <div className="flex items-center gap-2">
          <a className="epoch-btn epoch-btn-compact" href="/">
            Back to Home
          </a>
        </div>
      </header>

      <section className="epoch-hero" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p className="epoch-kicker">Registrations Closed</p>
        <h1 style={{ marginBottom: '1rem' }}>
          THANK <span>YOU</span>
        </h1>
        <p className="epoch-subcopy" style={{ maxWidth: '42rem', marginBottom: '2rem' }}>
          The response has been truly overwhelming. Registrations for EPOCH '26 are now officially closed.
        </p>
        
        <div className="epoch-countdown-wrap" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
          <p className="epoch-status" style={{ fontSize: '1.125rem', lineHeight: '1.6', margin: 0, textTransform: 'none', letterSpacing: 'normal' }}>
            To all the teams who registered, we can't wait to see what you build. To those who missed out, we hope to see you next time!
            <br/><br/>
            Get ready to push boundaries on May 1-2, 2026.
          </p>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <a className="epoch-btn" href="/">
            Return Home
          </a>
        </div>

        <aside className="epoch-coin" aria-hidden="true">
          <div className="epoch-coin-core">
            <span>EPOCH 26</span>
          </div>
        </aside>
      </section>
    </main>
  );
}
