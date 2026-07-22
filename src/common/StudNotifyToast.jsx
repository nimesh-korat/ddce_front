import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActiveStudNotify } from "../apis/apis";
import { useLocation } from "react-router-dom";

function timeAgo(dateStr) {
  // DB stores IST time as plain string "2026-07-22 10:30:00"
  // Manually parse parts to avoid browser timezone interpretation differences
  // Then add IST offset (+5:30) to get UTC ms for comparison with Date.now()
  if (!dateStr) return "";
  const s = dateStr.replace("T", " ").split(/[- :]/);
  // s = [year, month, day, hour, min, sec]
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // +05:30 in ms
  const utcMs =
    Date.UTC(+s[0], +s[1] - 1, +s[2], +s[3] || 0, +s[4] || 0, +s[5] || 0) -
    IST_OFFSET_MS; // convert IST→UTC
  const diff = Math.floor((Date.now() - utcMs) / 1000);
  if (diff < 0) return "just now";
  if (diff < 60) return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

// Per-user localStorage key — persists forever, user-specific
const getSeenKey = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return `stud_notify_seen_${u?.Id || "guest"}`;
  } catch {
    return "stud_notify_seen_guest";
  }
};
const getSeenIds = () => {
  try {
    return JSON.parse(localStorage.getItem(getSeenKey()) || "[]");
  } catch {
    return [];
  }
};
const markSeen = (id) => {
  try {
    const s = getSeenIds();
    if (!s.includes(id)) {
      s.push(id);
      localStorage.setItem(getSeenKey(), JSON.stringify(s));
    }
  } catch {}
};

export default function StudNotifyToast() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const [timeStr, setTimeStr] = useState("");
  const timerRef = useRef(null);
  const queueRef = useRef([]); // unseen notifications queue
  const runningRef = useRef(false);

  const isQuizPage = location.pathname === "/test";

  const { data } = useQuery({
    queryKey: ["activeStudNotify"],
    queryFn: getActiveStudNotify,
    refetchInterval: 30 * 1000,
    staleTime: 25 * 1000,
    enabled: !isQuizPage && !!localStorage.getItem("token"),
    retry: false,
  });

  const notifs = data?.data || [];

  // Build queue of unseen notifications on data change
  useEffect(() => {
    if (isQuizPage || notifs.length === 0) return;
    const seen = getSeenIds();
    const unseen = notifs.filter((n) => !seen.includes(n.id));
    if (unseen.length === 0) return;
    // Add only new ones not already in queue
    const queueIds = queueRef.current.map((n) => n.id);
    const toAdd = unseen.filter((n) => !queueIds.includes(n.id));
    queueRef.current = [...queueRef.current, ...toAdd];
    // Start processing if not already running
    if (!runningRef.current) processQueue();
  }, [notifs, isQuizPage]); // eslint-disable-line

  const processQueue = () => {
    if (queueRef.current.length === 0) {
      runningRef.current = false;
      return;
    }
    runningRef.current = true;
    const n = queueRef.current.shift();
    markSeen(n.id); // mark before showing so refetch doesn't re-add
    setCurrent(n);
    setTimeStr(timeAgo(n.join_datetime));
    setVisible(true);

    // Show for 2s, then 2s gap, then next
    timerRef.current = setTimeout(() => {
      setVisible(false);
      // Random gap between 5-50 seconds before next notification
      const gap = (5 + Math.random() * 45) * 1000;
      timerRef.current = setTimeout(processQueue, gap);
    }, 6000);
  };

  // Hide immediately when entering quiz page
  useEffect(() => {
    if (isQuizPage) {
      setVisible(false);
      clearTimeout(timerRef.current);
      runningRef.current = false;
    }
  }, [isQuizPage]);

  // Live timeAgo update
  useEffect(() => {
    if (!current) return;
    const t = setInterval(
      () => setTimeStr(timeAgo(current.join_datetime)),
      30000,
    );
    return () => clearInterval(t);
  }, [current]);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (!visible || !current) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 99999,
        maxWidth: "320px",
        animation: "notif_in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      <style>{`
        @keyframes notif_in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            flexShrink: 0,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className="ph ph-student"
            style={{ color: "#fff", fontSize: "18px" }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 600,
              color: "#1e293b",
              lineHeight: "1.4",
            }}
          >
            <span style={{ color: "#6366f1" }}>{current.name}</span> from{" "}
            <span style={{ color: "#374151" }}>{current.college_name}</span>{" "}
            joined{" "}
            <span style={{ color: "#6366f1", fontWeight: 700 }}>
              DDCET {current.mode?.toUpperCase()}{" "}
            </span>{" "}
            paid coaching.
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#94a3b8" }}>
            {timeStr}
          </p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            clearTimeout(timerRef.current);
            runningRef.current = false;
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94a3b8",
            padding: 0,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          <i className="ph ph-x" style={{ fontSize: "14px" }} />
        </button>
      </div>
    </div>
  );
}
