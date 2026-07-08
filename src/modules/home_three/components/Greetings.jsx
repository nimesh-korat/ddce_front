import React, { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "../../../utils/UserContex";
import { useBatchAccess } from "../../../utils/BatchAccessContext";

function AnimatedCounter({ target, active, duration = 2000 }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return; // only animate when back face is visible

    const from = prevRef.current;
    const to = target || 0;
    prevRef.current = to;

    if (from === to && display === to) return;

    cancelAnimationFrame(rafRef.current);
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(to);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target]); // re-run when flipped or target changes

  return <span>{display.toLocaleString()}</span>;
}

function Greetings({ dashboardData, refetch }) {
  const { user } = useContext(UserContext);
  const { isEnabled } = useBatchAccess();
  const [flipped, setFlipped] = useState(false);

  const d = dashboardData || {};
  const total_answers = d.total_answers || 0;

  // canFlip = student has batch+phase AND admin enabled flip_card for their batch+phase
  const canFlip = !!(user?.Batch && user?.Phase && isEnabled("flip_card"));

  const handleMouseEnter = () => {
    if (!canFlip) return;
    setFlipped(true);
    if (refetch) refetch();
  };

  const handleMouseLeave = () => {
    if (!canFlip) return;
    setFlipped(false);
  };

  return (
    <>
      <style>{`
        .greet-scene {
          width: 100%;
          height: 390px;
          perspective: 1400px;
          cursor: pointer;
        }
        .greet-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1);
          border-radius: 16px;
        }
        .greet-inner.flipped {
          transform: rotateY(-180deg);
        }
        .greet-front,
        .greet-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 16px;
          overflow: hidden;
        }
        .greet-front {
          background: #ffffff;
          box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
        }
        .greet-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1a3a5c 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 32px;
        }
        @keyframes greet_pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(52,211,153,0.2); }
          50%       { box-shadow: 0 0 0 12px rgba(52,211,153,0.04); }
        }
        /* Responsive height */
        @media (max-width: 1399px) {
          .greet-scene { height: 400px; }
        }
        @media (max-width: 991px) {
          .greet-scene { height: 420px; }
        }
        @media (max-width: 575px) {
          .greet-scene { height: 380px; }
          .greet-back { padding: 24px 20px; gap: 16px; }
        }
      `}</style>

      <div
        className="w-100"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: canFlip ? "pointer" : "default" }}
      >
        <div className="greet-scene">
          <div className={`greet-inner${flipped ? " flipped" : ""}`}>
            {/* ── FRONT ── */}
            <div className="greet-front">
              <div className="card-body grettings-box-two position-relative z-1 p-0 h-100">
                <div className="row align-items-center h-100">
                  <div className="col-lg-6">
                    <div className="grettings-box-two__content">
                      <h2 className="fw-medium mb-0 flex-align gap-10">
                        Hi, {user?.Name}
                        <img src="assets/images/icons/wave-hand.png" alt="" />
                      </h2>
                      <h2 className="fw-medium mb-16 unity-animatted-text">
                        What do you want to learn today with your preparation
                        partner?
                      </h2>
                      <p className="text-15 text-gray-400">
                        Discover unique questions, track progress, and achieve
                        your learning goods seamlessly.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 d-md-block d-none mt-auto">
                    <img src="assets/images/thumbs/gretting-thumb.png" alt="" />
                  </div>
                </div>
                <img
                  src="assets/images/bg/star-shape.png"
                  className="position-absolute start-0 top-0 w-100 h-100 z-n1 object-fit-contain"
                  alt=""
                />
              </div>
            </div>

            {/* ── BACK ── */}
            <div className="greet-back">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#34d399",
                    display: "inline-block",
                    animation: "greet_pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Live Platform Stats
                </span>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "clamp(48px, 8vw, 72px)",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-3px",
                    background:
                      "linear-gradient(135deg, #a5b4fc 0%, #34d399 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  <AnimatedCounter
                    target={total_answers}
                    active={flipped}
                    duration={2000}
                  />
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "clamp(13px, 2vw, 16px)",
                    marginTop: "10px",
                    fontWeight: 500,
                  }}
                >
                  Total Answers by All Students
                </div>
              </div>

              <div
                style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}
              >
                Move cursor away to go back
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Greetings;
