"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MESSAGES = [
  "Sit back while we prepare your portal experience...",
  "Hang tight, good things are loading...",
  "Almost there, we are setting everything up...",
  "One moment, your next screen is on the way...",
  "Loading in progress. Your team dashboard is warming up...",
];

const SHOW_DELAY_MS = 120;
const MIN_VISIBLE_MS = 1400;
const ACTION_AUTO_HIDE_MS = 1800;
const NAV_FAILSAFE_MS = 12000;

function isOverlayDisabledPath(pathname) {
  return pathname === "/" || pathname.startsWith("/faq");
}

export default function GlobalLoadingOverlay() {
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const pendingFetchRef = useRef(0);
  const navigatingRef = useRef(false);
  const visibleRef = useRef(false);
  const shownAtRef = useRef(0);
  const overlayDisabledRef = useRef(isOverlayDisabledPath(pathname));

  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const navFailsafeRef = useRef(null);

  const activeMessage = useMemo(() => MESSAGES[messageIndex % MESSAGES.length], [messageIndex]);

  const clearTimer = (timerRef) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const completeIfIdle = () => {
    if (pendingFetchRef.current > 0 || navigatingRef.current) {
      return;
    }

    clearTimer(hideTimerRef);

    const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : 0;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      shownAtRef.current = 0;
    }, wait);
  };

  const scheduleIdleHide = () => {
    clearTimer(idleTimerRef);
    idleTimerRef.current = window.setTimeout(() => {
      completeIfIdle();
    }, ACTION_AUTO_HIDE_MS);
  };

  const beginLoading = (reason) => {
    if (overlayDisabledRef.current) {
      return;
    }

    if (reason === "navigation") {
      navigatingRef.current = true;
      clearTimer(navFailsafeRef);
      navFailsafeRef.current = window.setTimeout(() => {
        navigatingRef.current = false;
        completeIfIdle();
      }, NAV_FAILSAFE_MS);
    }

    clearTimer(hideTimerRef);

    if (!visibleRef.current && !showTimerRef.current) {
      showTimerRef.current = window.setTimeout(() => {
        shownAtRef.current = Date.now();
        setVisible(true);
        showTimerRef.current = null;
      }, SHOW_DELAY_MS);
    }

    scheduleIdleHide();
  };

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    overlayDisabledRef.current = isOverlayDisabledPath(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleClickCapture = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest("[data-no-global-loading='true']")) {
        return;
      }

      const disabledControl = target.closest("button[disabled], input[disabled]");
      if (disabledControl) {
        return;
      }

      const link = target.closest("a[href]");
      if (link) {
        const href = link.getAttribute("href") || "";
        const targetValue = link.getAttribute("target") || "";

        const isExternal = /^https?:/i.test(href) && !href.includes(window.location.host);
        const isHashOnly = href.startsWith("#");

        if (!isExternal && !isHashOnly && targetValue !== "_blank" && !link.hasAttribute("download")) {
          beginLoading("navigation");
          return;
        }
      }

      const actionControl = target.closest("button, input[type='submit']");
      if (actionControl) {
        beginLoading("action");
      }
    };

    const handleSubmitCapture = () => {
      beginLoading("navigation");
    };

    document.addEventListener("click", handleClickCapture, true);
    document.addEventListener("submit", handleSubmitCapture, true);

    return () => {
      document.removeEventListener("click", handleClickCapture, true);
      document.removeEventListener("submit", handleSubmitCapture, true);
    };
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      pendingFetchRef.current += 1;

      if (!overlayDisabledRef.current) {
        beginLoading("fetch");
      }

      try {
        return await originalFetch(...args);
      } finally {
        pendingFetchRef.current = Math.max(0, pendingFetchRef.current - 1);
        completeIfIdle();
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    if (isOverlayDisabledPath(pathname)) {
      navigatingRef.current = false;
      shownAtRef.current = 0;
      clearTimer(showTimerRef);
      clearTimer(hideTimerRef);
      clearTimer(idleTimerRef);
      clearTimer(navFailsafeRef);
      setVisible(false);
      return;
    }

    navigatingRef.current = false;
    clearTimer(navFailsafeRef);
    completeIfIdle();
  }, [pathname]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const rotateId = window.setInterval(() => {
      setMessageIndex((value) => (value + 1) % MESSAGES.length);
    }, 2200);

    return () => {
      window.clearInterval(rotateId);
    };
  }, [visible]);

  useEffect(() => {
    return () => {
      clearTimer(showTimerRef);
      clearTimer(hideTimerRef);
      clearTimer(idleTimerRef);
      clearTimer(navFailsafeRef);
    };
  }, []);

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 1200,
    display: "grid",
    placeItems: "center",
    padding: "1.2rem",
    opacity: visible ? 1 : 0,
    visibility: visible ? "visible" : "hidden",
    pointerEvents: visible ? "auto" : "none",
    transition: "opacity 220ms ease, visibility 220ms ease",
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

  const spinnerStyle = {
    width: "54px",
    height: "54px",
    border: "4px solid rgba(245, 158, 11, 0.2)",
    borderTopColor: "#f59e0b",
    borderRadius: "999px",
    display: "inline-block",
    animation: "global-loader-spin 1s linear infinite",
  };

  return (
    <>
      <style jsx global>{`
        @keyframes global-loader-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div style={overlayStyle} aria-hidden={!visible}>
        <div style={cardStyle} role="status" aria-live="polite">
          <span style={spinnerStyle} aria-hidden="true" />
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
            {activeMessage}
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
          Thank you for your patience. We are making things awesome for you.
          </p>
        </div>
      </div>
    </>
  );
}
