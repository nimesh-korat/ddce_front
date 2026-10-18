/**
 * FeesBanner
 * - Sticky banners for unpaid fee reminders on student dashboard
 * - Progress bar: green → yellow → orange → red as deadline approaches
 * - QR code modal via Scan QR button
 * - Portal lock overlay when lock_portal=1 and deadline+grace has passed
 */
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFeesRemindersForStudent } from "../apis/apis";

// ─── Helpers ──────────────────────────────────────────────────────────────

function parseDate(str) {
  if (!str) return null;
  return new Date(str.replace(" ", "T"));
}

function getProgressPct(assignedAt, deadline) {
  const now = Date.now();
  const start = parseDate(assignedAt)?.getTime() || now;
  const end = parseDate(deadline)?.getTime() || now;
  if (end <= start) return 0;
  const pct = ((end - now) / (end - start)) * 100;
  return Math.max(0, Math.min(100, pct));
}

function barColor(pct) {
  if (pct > 60) return "#28a745";
  if (pct > 30) return "#ffc107";
  if (pct > 10) return "#fd7e14";
  return "#dc3545";
}

function timeLeft(deadline) {
  const diff = parseDate(deadline)?.getTime() - Date.now();
  if (!diff || diff <= 0) return "Deadline passed";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

// ─── QR Modal ─────────────────────────────────────────────────────────────
function QRModal({ qr, title, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        zIndex: 99998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: 24,
          maxWidth: 340,
          width: "90%",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h6 style={{ fontWeight: 700, marginBottom: 16 }}>{title}</h6>
        <img
          src={qr}
          alt="QR Code"
          style={{ width: "100%", maxWidth: 240, borderRadius: 8 }}
        />
        <p style={{ marginTop: 12, fontSize: 13, color: "#777" }}>
          Scan this QR code to pay
        </p>
        <button
          style={{
            marginTop: 4,
            background: "#eee",
            border: "none",
            borderRadius: 7,
            padding: "7px 20px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Single Banner ────────────────────────────────────────────────────────
function Banner({ r, onDismiss }) {
  const [qrOpen, setQrOpen] = useState(false);
  const pct = getProgressPct(r.assigned_at, r.deadline);
  const color = barColor(pct);
  const left = timeLeft(r.deadline);
  const past = parseDate(r.deadline)?.getTime() < Date.now();

  return (
    <>
      <div
        style={{
          position: "relative",
          background: "#fff8e1",
          border: "1.5px solid #ffe082",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          title="Dismiss"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#aaa",
            fontSize: 16,
            lineHeight: 1,
            padding: "2px 5px",
            borderRadius: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
        >
          ✕
        </button>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            paddingRight: 20,
          }}
        >
          <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>💰</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div>
                <span
                  style={{ fontWeight: 700, fontSize: 15, color: "#5b4fcf" }}
                >
                  {r.title}
                </span>
                {r.amount && (
                  <span
                    style={{
                      marginLeft: 8,
                      background: "#e8f5e9",
                      color: "#2e7d32",
                      borderRadius: 6,
                      padding: "2px 8px",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    ₹{parseFloat(r.amount).toLocaleString()}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: past ? "#fde8e8" : "#fff3cd",
                  color: past ? "#c0392b" : "#856404",
                }}
              >
                ⏰ {left}
              </span>
            </div>

            {/* Description */}
            {r.description && (
              <p
                style={{
                  margin: "4px 0 6px",
                  fontSize: 13,
                  color: "#555",
                  lineHeight: 1.4,
                }}
              >
                {r.description}
              </p>
            )}

            {/* Progress bar */}
            <div
              style={{
                background: "#e9ecef",
                borderRadius: 6,
                height: 6,
                margin: "8px 0",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  background: color,
                  height: "100%",
                  borderRadius: 6,
                  transition: "width 0.5s",
                }}
              />
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 6,
              }}
            >
              {r.payment_link && (
                <a
                  href={r.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#5b4fcf",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: 7,
                    padding: "5px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Pay Now →
                </a>
              )}
              {r.qr_code && (
                <button
                  onClick={() => setQrOpen(true)}
                  style={{
                    background: "white",
                    border: "1.5px solid #5b4fcf",
                    color: "#5b4fcf",
                    borderRadius: 7,
                    padding: "5px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  📷 Scan QR
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {qrOpen && (
        <QRModal
          qr={r.qr_code}
          title={r.title}
          onClose={() => setQrOpen(false)}
        />
      )}
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────
// Note: Portal lock overlay is handled globally by FeesLockProvider in App.js
// so it persists across all route navigations.
export default function FeesBanner() {
  // Re-check lock state every minute without refetch
  const [, setTick] = useState(0);
  // IDs dismissed this login session — keyed by user ID so logging out and
  // back in clears them. Stored in localStorage so navigation doesn't re-show them.
  const storageKey = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?.Id ? `feesBannerDismissed_${u.Id}` : null;
    } catch {
      return null;
    }
  })();
  const [dismissed, setDismissed] = useState(() => {
    if (!storageKey) return [];
    try {
      // Only restore dismissals from the current login token so re-login resets them
      const token = localStorage.getItem("token") || "";
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (!saved || saved.token !== token) return [];
      return saved.ids || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const { data, error, isError } = useQuery({
    queryKey: ["feesRemindersStudent"],
    queryFn: getFeesRemindersForStudent,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  if (isError) {
    console.error("[FeesBanner] failed to fetch reminders:", error);
    return null;
  }

  const reminders = data?.data || [];
  const unpaid = reminders.filter(
    (r) => !r.is_paid && !dismissed.includes(r.id),
  );

  if (!unpaid.length) return null;

  return (
    <div style={{ padding: "0 0 4px" }}>
      {unpaid.map((r) => (
        <Banner
          key={r.id}
          r={r}
          onDismiss={() =>
            setDismissed((prev) => {
              const next = [...prev, r.id];
              try {
                if (storageKey) {
                  const token = localStorage.getItem("token") || "";
                  localStorage.setItem(
                    storageKey,
                    JSON.stringify({ token, ids: next }),
                  );
                }
              } catch {}
              return next;
            })
          }
        />
      ))}
    </div>
  );
}
