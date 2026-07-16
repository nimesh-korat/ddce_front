import React, { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "../../../utils/UserContex";
import { useBatchAccess } from "../../../utils/BatchAccessContext";
import { useQuery } from "@tanstack/react-query";
import { getStudentAnswers } from "../../../apis/apis";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const mathConfig = {
  tex2jax: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
  messageStyle: "none",
};

function AnimatedCounter({ target, active, duration = 2000 }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
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
  }, [active, target]);

  return <span>{display.toLocaleString()}</span>;
}

// ── Main Greetings Component ─────────────────────────────────
function Greetings({ dashboardData, refetch, onViewAnswers }) {
  const { user } = useContext(UserContext);
  const { isEnabled } = useBatchAccess();
  const [flipped, setFlipped] = useState(false);
  const d = dashboardData || {};
  const total_answers = d.total_answers || 0;

  const canFlip = !!(user?.Batch && user?.Phase && isEnabled("flip_card"));
  const canViewAnswers = !!(
    user?.Batch &&
    user?.Phase &&
    isEnabled("view_answers")
  );

  // Refetch every 3 seconds only while card is flipped
  useEffect(() => {
    if (!flipped || !refetch || !canFlip) return;
    refetch();
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [flipped]); // eslint-disable-line

  const handleMouseEnter = () => {
    if (!canFlip) return;
    setFlipped(true);
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
          height: 360px;
          perspective: 1400px;
          cursor: pointer;
          overflow: visible;
        }
        .greet-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1);
          border-radius: 16px;
          overflow: visible;
        }
        .greet-inner.flipped { transform: rotateY(-180deg); }
        .greet-front, .greet-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 16px;
        }
        .greet-front {
          background: #ffffff;
          box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
          overflow: hidden;
        }
        @media (max-width: 767px) {
          .greet-front {
            background-image: linear-gradient(135deg, rgba(250, 250, 250, 0.08) 0%, rgba(255, 255, 255, 0.12) 100%), url("assets/images/bg/rathyatra_vidhyal.png");
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;
          }
          .greet-scene {
            height: auto !important;
            min-height: unset !important;
            aspect-ratio: 4 / 3;
          }
          .greet-inner {
            height: 100% !important;
            min-height: unset !important;
          }
          .greet-front .grettings-box-two__content {
            display: none !important;
          }
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
          overflow: visible;
        }
        @keyframes greet_pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(52,211,153,0.2); }
          50%       { box-shadow: 0 0 0 12px rgba(52,211,153,0.04); }
        }
        @media (max-width: 1399px) { .greet-scene { height: 400px; } }
        @media (max-width: 991px)  { .greet-scene { height: 420px; } }
        @media (max-width: 575px)  { .greet-scene { height: 380px; } .greet-back { padding: 24px 20px; gap: 16px; } }
      `}</style>

      <div
        className="w-100"
        style={{
          position: "relative",
          cursor: canFlip ? "pointer" : "default",
          position: "relative",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
              {/* Live dot */}
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

              {/* Counter */}
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
                    fontSize: "clamp(13px,2vw,16px)",
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

        {/* View Answers button — outside 3D context, rendered as overlay */}
        {flipped && (canViewAnswers || true) && (
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewAnswers) onViewAnswers();
              }}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: "50px",
                color: "#fff",
                padding: "10px 24px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backdropFilter: "blur(8px)",
                whiteSpace: "nowrap",
              }}
            >
              <i className="ph ph-list-checks" style={{ fontSize: "16px" }} />
              View Answers
            </button>
          </div>
        )}
      </div>

      {/* Answers Modal */}
    </>
  );
}

export default Greetings;
