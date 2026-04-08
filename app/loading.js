export default function RootLoading() {
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 1200,
    display: "grid",
    placeItems: "center",
    padding: "1.2rem",
    background:
      "radial-gradient(circle at 20% 12%, rgba(245, 158, 11, 0.24), rgba(8, 8, 8, 0.78))",
    backdropFilter: "blur(6px)",
  };

  const cardStyle = {
    width: "min(560px, 100%)",
    border: "1px solid rgba(245, 158, 11, 0.45)",
    borderRadius: "1rem",
    background: "linear-gradient(180deg, rgba(18, 18, 18, 0.96), rgba(8, 8, 8, 0.96))",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
    padding: "1.35rem 1.2rem",
    textAlign: "center",
  };

  return (
    <div style={overlayStyle} aria-hidden={false}>
      <div style={cardStyle} role="status" aria-live="polite">
        <svg width="54" height="54" viewBox="0 0 54 54" aria-hidden="true">
          <circle cx="27" cy="27" r="22" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="4" />
          <path d="M27 5a22 22 0 0 1 22 22" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 27 27"
              to="360 27 27"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <p
          style={{
            marginTop: "0.9rem",
            color: "#ffffff",
            fontFamily: "var(--font-heading), sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontSize: "clamp(1.3rem, 4.6vw, 1.95rem)",
            lineHeight: 1.08,
          }}
        >
          Sit back while we prepare your portal experience...
        </p>
        <p
          style={{
            margin: "0.6rem auto 0",
            maxWidth: "42ch",
            color: "#f3c670",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.86rem",
            lineHeight: 1.5,
          }}
        >
          We are compiling and rendering your next view. This will be worth the wait.
        </p>
      </div>
    </div>
  );
}
