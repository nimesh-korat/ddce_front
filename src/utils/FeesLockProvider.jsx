/**
 * FeesLockProvider
 * Reads lock state from FeesLockContext (single shared query — no own fetch here).
 * Renders a full-screen portal overlay when a student has a locked unpaid fees reminder.
 * Placed inside BrowserRouter + FeesLockContextProvider in App.js.
 */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useFeesLock } from "./FeesLockContext";

// ─── QR Modal ─────────────────────────────────────────────────────────────
function QRModal({ qr, title, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        zIndex: 100001,
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

// ─── Single locked reminder card ──────────────────────────────────────────
function LockedCard({ r }) {
  const [qrOpen, setQrOpen] = useState(false);
  return (
    <>
      <div
        style={{
          background: "#fff8e1",
          border: "1px solid #ffe082",
          borderRadius: 10,
          padding: "14px 16px",
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 4,
            color: "#333",
          }}
        >
          {r.title}
        </div>
        {r.description && (
          <div
            style={{
              fontSize: 13,
              color: "#666",
              marginBottom: 6,
              lineHeight: 1.4,
            }}
          >
            {r.description}
          </div>
        )}
        {r.amount && (
          <div
            style={{
              color: "#2e7d32",
              fontWeight: 700,
              fontSize: 17,
              marginBottom: 10,
            }}
          >
            ₹{parseFloat(r.amount).toLocaleString()}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {r.payment_link && (
            <a
              href={r.payment_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#5b4fcf",
                color: "white",
                textDecoration: "none",
                borderRadius: 7,
                padding: "7px 18px",
                fontSize: 13,
                fontWeight: 600,
                display: "inline-block",
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
                padding: "7px 18px",
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

// ─── Main ─────────────────────────────────────────────────────────────────
export default function FeesLockProvider() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const isStudent = user?.Role === 0;

  const { locked, lockedReminders } = useFeesLock();

  if (!isStudent || !locked) return null;

  const overlay = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647, // max possible z-index
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: "32px 28px",
          maxWidth: 460,
          width: "90%",
          textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          zIndex: 2147483647,
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 10 }}>🔒</div>
        <h4
          style={{
            fontWeight: 800,
            color: "#c0392b",
            marginBottom: 8,
            fontSize: 20,
          }}
        >
          Portal Locked
        </h4>
        <p
          style={{
            color: "#555",
            marginBottom: 20,
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          Your access has been restricted due to a pending fee payment. Please
          complete the payment to regain full access.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            textAlign: "left",
          }}
        >
          {lockedReminders.map((r) => (
            <LockedCard key={r.id} r={r} />
          ))}
        </div>

        <p
          style={{
            marginTop: 20,
            fontSize: 12,
            color: "#aaa",
            lineHeight: 1.5,
          }}
        >
          After payment, contact your coordinator to unlock your account.
        </p>
      </div>
    </div>
  );

  // Render directly into document.body via portal — bypasses any stacking context
  return ReactDOM.createPortal(overlay, document.body);
}
