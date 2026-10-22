import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudentProfile } from "../../apis/apis";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
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

// ── Sub-components ───────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = "main" }) {
  const colorMap = {
    main: { bg: "bg-main-50", text: "text-main-600" },
    success: { bg: "bg-success-50", text: "text-success-600" },
    danger: { bg: "bg-danger-50", text: "text-danger-600" },
    warning: { bg: "bg-warning-50", text: "text-warning-600" },
  };
  const c = colorMap[color] || colorMap.main;
  return (
    <div className="card h-100">
      <div className="card-body p-20">
        <div
          className={`w-48 h-48 rounded-12 ${c.bg} d-flex align-items-center justify-content-center mb-16`}
        >
          <i className={`ph ${icon} text-24 ${c.text}`} />
        </div>
        <h4 className={`fw-bold mb-4 ${c.text}`}>{value}</h4>
        <p className="text-13 text-gray-500 mb-0">{label}</p>
        {sub && <p className="text-11 text-gray-400 mt-4 mb-0">{sub}</p>}
      </div>
    </div>
  );
}

function AccuracyBar({ subject, accuracy, attempted, correct }) {
  const color =
    accuracy >= 75 ? "#22c55e" : accuracy >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="mb-14">
      <div className="flex-between mb-6">
        <span className="text-13 fw-medium text-gray-700">{subject}</span>
        <div className="flex-align gap-10">
          <span className="text-11 text-gray-400">
            {correct}/{attempted}
          </span>
          <span
            className="text-13 fw-bold"
            style={{ color, minWidth: "42px", textAlign: "right" }}
          >
            {accuracy}%
          </span>
        </div>
      </div>
      <div
        className="rounded-pill overflow-hidden"
        style={{ height: "8px", background: "#f1f5f9" }}
      >
        <div
          className="rounded-pill"
          style={{
            width: `${accuracy}%`,
            height: "100%",
            background: `linear-gradient(90deg,${color}88,${color})`,
            transition: "width 1.2s ease",
          }}
        />
      </div>
    </div>
  );
}

function RingChart({
  pct,
  size = 120,
  strokeWidth = 10,
  color = "#6366f1",
  label = "Accuracy",
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (pct / 100) * circ;
  return (
    <div className="position-relative d-inline-flex align-items-center justify-content-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={isNaN(off) ? circ : off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div className="position-absolute text-center">
        <div
          style={{
            color,
            fontWeight: 800,
            fontSize: size > 100 ? "22px" : "16px",
            lineHeight: 1,
          }}
        >
          {pct}%
        </div>
        <div style={{ color: "#94a3b8", fontSize: "10px", marginTop: "2px" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ── Analysis helpers ─────────────────────────────────────────

function accColor(pct) {
  return pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
}

// A single horizontal bar row used inside the drill-down chart
function DrillBar({ label, accuracy, attempted, correct, incorrect }) {
  const color = accColor(accuracy);
  const barW = Math.max(2, accuracy);
  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "14px 18px",
        marginBottom: "10px",
        background: "#fff",
        border: "1.5px solid #f1f5f9",
      }}
    >
      {/* Top row: label + stats + accuracy badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#334155",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            <span style={{ color: "#22c55e", fontWeight: 600 }}>{correct}</span>
            <span style={{ margin: "0 3px" }}>/</span>
            <span style={{ color: "#ef4444" }}>{incorrect}</span>
            <span style={{ margin: "0 3px", color: "#cbd5e1" }}>|</span>
            {attempted} Q
          </span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              background: `${color}18`,
              color,
              borderRadius: "20px",
              padding: "3px 12px",
            }}
          >
            {accuracy}%
          </span>
        </div>
      </div>
      {/* Bar */}
      <div
        style={{
          height: "8px",
          background: "#f1f5f9",
          borderRadius: "99px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${barW}%`,
            height: "100%",
            borderRadius: "99px",
            background: `linear-gradient(90deg,${color}88,${color})`,
            transition: "width 0.9s ease",
          }}
        />
      </div>
    </div>
  );
}

function AnalysisTab({ subjects, topics, subtopics }) {
  const [selSubjectId, setSelSubjectId] = useState("all");
  const [selTopicId, setSelTopicId] = useState("all");

  // topics available for selected subject
  const topicsForSubject =
    selSubjectId === "all"
      ? []
      : topics.filter((t) => String(t.subject_id) === String(selSubjectId));

  // bars to show
  const showSubjectBars = selSubjectId === "all";
  const showTopicBars = selSubjectId !== "all" && selTopicId === "all";
  const showSubtopicBars = selSubjectId !== "all" && selTopicId !== "all";

  const barsToRender = showSubjectBars
    ? subjects
    : showTopicBars
      ? topicsForSubject
      : subtopics.filter((s) => String(s.topic_id) === String(selTopicId));

  const noData = subjects.length === 0;

  const handleSubjectChange = (e) => {
    setSelSubjectId(e.target.value);
    setSelTopicId("all");
  };

  // label for bar
  const barLabel = (row) =>
    showSubjectBars
      ? row.subject_name
      : showTopicBars
        ? row.topic_name
        : row.subtopic_name;

  // heading text
  const heading = showSubjectBars
    ? "Subject-wise Analysis"
    : showTopicBars
      ? `Topics — ${subjects.find((s) => String(s.subject_id) === String(selSubjectId))?.subject_name || ""}`
      : `Subtopics — ${topics.find((t) => String(t.topic_id) === String(selTopicId))?.topic_name || ""}`;

  return (
    <div className="card">
      <div className="card-body p-24">
        {/* ── Dropdowns row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Subject dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Subject
            </label>
            <select
              value={selSubjectId}
              onChange={handleSubjectChange}
              style={{
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#334155",
                background: "#fff",
                cursor: "pointer",
                minWidth: "180px",
                outline: "none",
              }}
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic dropdown — only when a subject is selected */}
          {selSubjectId !== "all" && (
            <>
              <i
                className="ph ph-caret-right"
                style={{
                  color: "#cbd5e1",
                  fontSize: "16px",
                  marginTop: "18px",
                }}
              />
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Topic
                </label>
                <select
                  value={selTopicId}
                  onChange={(e) => setSelTopicId(e.target.value)}
                  style={{
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#334155",
                    background: "#fff",
                    cursor: "pointer",
                    minWidth: "180px",
                    outline: "none",
                  }}
                >
                  <option value="all">All Topics</option>
                  {topicsForSubject.map((t) => (
                    <option key={t.topic_id} value={t.topic_id}>
                      {t.topic_name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Heading / breadcrumb */}
          <div style={{ marginLeft: "auto", marginTop: "16px" }}>
            <span
              style={{ fontSize: "13px", fontWeight: 600, color: "#6366f1" }}
            >
              {heading}
            </span>
          </div>
        </div>

        {/* ── No data ── */}
        {noData && (
          <div
            style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}
          >
            <i
              className="ph ph-chart-bar"
              style={{
                fontSize: "48px",
                display: "block",
                marginBottom: "12px",
              }}
            />
            No analysis data available yet
          </div>
        )}

        {/* ── Bars ── */}
        {!noData && barsToRender.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}
          >
            No data for this selection
          </div>
        )}

        {!noData &&
          barsToRender.map((row, i) => (
            <DrillBar
              key={i}
              label={barLabel(row)}
              accuracy={row.accuracy}
              attempted={row.attempted}
              correct={row.correct}
              incorrect={row.incorrect}
              clickable={false}
              onClick={() => {}}
            />
          ))}
      </div>
    </div>
  );
}

// ── DDCET rank lookup tables (marks → rank) ──────────────────
// Source: Official ACPC PDFs — DDCET 2024 & 2025 Rank-Wise data
// 2025 Engineering total: 17,246 | 2024 Engineering total: 16,988
const DDCET_TOTAL_CANDIDATES = { 2025: 17246, 2024: 16988 };

// Averaged marks → percentile rank derived from 2024 official PDF
// [marks, rank] — descending marks order
const DDCET_2024_TABLE = [
  [190.5, 1],
  [186, 2],
  [183.5, 3],
  [183.5, 4],
  [182.5, 5],
  [180.5, 6],
  [178.5, 9],
  [177.5, 12],
  [174.5, 14],
  [174, 15],
  [173.5, 16],
  [172, 22],
  [172, 24],
  [171.5, 27],
  [171, 31],
  [169, 37],
  [168.5, 38],
  [168.5, 40],
  [167.5, 41],
  [167.5, 42],
  [167, 45],
  [165.5, 52],
  [165, 54],
  [165, 55],
  [164, 61],
  [163.5, 64],
  [163, 71],
  [163, 73],
  [162.5, 76],
  [162.5, 78],
  [162, 83],
  [161.5, 87],
  [161.5, 90],
  [161.5, 91],
  [161, 93],
  [160.5, 100],
  [160.5, 102],
  [160.5, 103],
  [160, 105],
  [159.5, 106],
  [159, 114],
  [158.5, 118],
  [158.5, 120],
  [158, 125],
  [157.5, 129],
  [157.5, 132],
  [157, 140],
  [157, 142],
  [156.5, 152],
  [156, 154],
  [155.5, 157],
  [155.5, 160],
  [154.5, 166],
  [154, 170],
  [153.5, 177],
  [153.5, 178],
  [153, 183],
  [153, 186],
  [152.5, 188],
  [152.5, 191],
  [152, 198],
  [151.5, 203],
  [151, 208],
  [151, 211],
  [150.5, 219],
  [150, 220],
  [150, 226],
  [149.5, 235],
  [149.5, 238],
  [149, 246],
  [148.5, 253],
  [148, 262],
  [148, 264],
  [147.5, 274],
  [147, 277],
  [147, 280],
  [146.5, 283],
  [146.5, 285],
  [146, 288],
  [145, 308],
  [145, 312],
  [144.5, 315],
  [144, 323],
  [143.5, 338],
  [143, 340],
  [143, 343],
  [142.5, 354],
  [142, 365],
  [141.5, 371],
  [141, 387],
  [140.5, 394],
  [140, 408],
  [139.5, 418],
  [139, 431],
  [138.5, 433],
  [138, 447],
  [137.5, 457],
  [137, 474],
  [136.5, 492],
  [136, 501],
  [135.5, 516],
  [135, 534],
  [134.5, 548],
  [134, 555],
  [133.5, 569],
  [133, 571],
  [132.5, 571],
  [132, 608],
  [131, 623],
  [130.5, 636],
  [130, 654],
  [129.5, 674],
  [129, 691],
  [128.5, 706],
  [128, 716],
  [127.5, 759],
  [127, 779],
  [126.5, 779],
  [126, 779],
  [125.5, 886],
  [125, 868],
  [124.5, 868],
  [124, 946],
  [123.5, 1032],
  [123, 1032],
  [122.5, 1032],
  [122, 1157],
  [121.5, 1194],
  [121, 1194],
  [120.5, 1194],
  [120, 1304],
  [119.5, 1304],
  [119, 1304],
  [118.5, 1440],
  [118, 1440],
  [117.5, 1501],
  [117, 1501],
  [116.5, 1501],
  [116, 1707],
  [115.5, 1707],
  [115, 1707],
  [114.5, 1880],
  [114, 1880],
  [113.5, 1880],
  [113, 1967],
  [112.5, 1998],
  [112, 2108],
  [111.5, 2108],
  [111, 2195],
  [110.5, 2195],
  [110, 2195],
  [109.5, 2195],
  [109, 2631],
  [108.5, 2631],
  [108, 3079],
  [107.5, 3079],
  [107, 3115],
  [106.5, 3115],
  [106, 3115],
  [105.5, 3115],
  [105, 3115],
  [104.5, 3115],
  [104, 3115],
  [103.5, 3115],
  [103, 3622],
  [102.5, 3622],
  [102, 3622],
  [101.5, 3622],
  [101, 3622],
  [100.5, 4021],
  [100, 4021],
  [99.5, 4021],
  [99, 4021],
  [98.5, 4021],
  [98, 5000],
  [97.5, 5000],
  [97, 5000],
  [96.5, 5000],
  [96, 5000],
  [95.5, 5000],
  [95, 5000],
  [94, 5500],
  [93, 5500],
  [92, 6000],
  [91, 6000],
  [90, 6000],
  [89, 6500],
  [88, 6500],
  [87, 7000],
  [86, 7000],
  [85, 7000],
  [84, 7500],
  [83, 7500],
  [82, 8000],
  [81, 8000],
  [80, 8500],
  [78, 9000],
  [76, 9000],
  [74, 9500],
  [72, 9500],
  [70, 9500],
  [68, 9768],
  [66, 6809],
  [64, 7001],
  [62, 7892],
  [60, 8280],
  [58, 8758],
  [56, 9441],
  [54, 10050],
  [52, 10640],
  [50, 11141],
  [48, 11657],
  [46, 12266],
  [44, 12652],
  [42, 13451],
  [40, 14021],
  [38, 14512],
  [36, 14978],
  [34, 15098],
  [32, 15553],
  [30, 16060],
  [27.5, 16327],
  [27, 16411],
  [26.5, 16456],
  [22.5, 16761],
  [21.5, 16840],
  [21, 16879],
  [20, 16925],
  [19, 16988],
];

// [marks, rank] from 2025 official PDF — descending marks order
const DDCET_2025_TABLE = [
  [195, 1],
  [191, 4],
  [189, 6],
  [188.5, 9],
  [188, 10],
  [185, 17],
  [184, 21],
  [183.5, 23],
  [183, 24],
  [181.5, 32],
  [180, 38],
  [179.5, 42],
  [179, 46],
  [178.5, 53],
  [178, 53],
  [177.5, 60],
  [177, 67],
  [176.5, 70],
  [176, 73],
  [175.5, 88],
  [175, 91],
  [174.5, 94],
  [174, 103],
  [173.5, 106],
  [173, 111],
  [172.5, 119],
  [172, 126],
  [171.5, 129],
  [171, 134],
  [170.5, 139],
  [170, 150],
  [169.5, 150],
  [169, 154],
  [168.5, 162],
  [168, 169],
  [167.5, 183],
  [167, 193],
  [166.5, 203],
  [166, 208],
  [165.5, 222],
  [165, 226],
  [164.5, 234],
  [164, 235],
  [163.5, 242],
  [163, 248],
  [162.5, 258],
  [162, 275],
  [161, 275],
  [160.5, 286],
  [160, 302],
  [159.5, 312],
  [159, 320],
  [158.5, 332],
  [158, 339],
  [157.5, 354],
  [157, 362],
  [156.5, 372],
  [156, 375],
  [155.5, 387],
  [155, 396],
  [154.5, 411],
  [154, 417],
  [153.5, 424],
  [153, 434],
  [152.5, 450],
  [152, 450],
  [151.5, 481],
  [151, 466],
  [150.5, 484],
  [150, 488],
  [149.5, 493],
  [149, 532],
  [148.5, 538],
  [148, 538],
  [147.5, 559],
  [147, 563],
  [146.5, 582],
  [146, 582],
  [145.5, 607],
  [145, 613],
  [144.5, 614],
  [144, 658],
  [143.5, 651],
  [143, 661],
  [142.5, 674],
  [142, 675],
  [141.5, 686],
  [141, 815],
  [140, 855],
  [139.5, 759],
  [139, 805],
  [138.5, 815],
  [138, 805],
  [137.5, 815],
  [137, 929],
  [136.5, 929],
  [136, 929],
  [135.5, 946],
  [135, 983],
  [134.5, 1014],
  [134, 1014],
  [133.5, 1089],
  [133, 1014],
  [132.5, 1014],
  [132, 1014],
  [131.5, 1122],
  [131, 1014],
  [130.5, 1014],
  [130, 1014],
  [129.5, 1014],
  [129, 1089],
  [128.5, 1089],
  [128, 1089],
  [127.5, 1089],
  [127, 1089],
  [126.5, 1089],
  [126, 1122],
  [125.5, 1122],
  [125, 1122],
  [124.5, 1194],
  [124, 1194],
  [123.5, 1194],
  [123, 1194],
  [122.5, 1436],
  [122, 1436],
  [121.5, 1461],
  [121, 1461],
  [120.5, 1461],
  [120, 1461],
  [119.5, 1461],
  [119, 1461],
  [118.5, 1461],
  [118, 1825],
  [117.5, 1825],
  [117, 1825],
  [116.5, 2136],
  [116, 2136],
  [115.5, 2136],
  [115, 2136],
  [114.5, 2136],
  [114, 2136],
  [113.5, 2420],
  [113, 2468],
  [112.5, 2468],
  [112, 2468],
  [111.5, 2468],
  [111, 2631],
  [110.5, 2631],
  [110, 2631],
  [109.5, 2677],
  [109, 2677],
  [108.5, 2677],
  [108, 2677],
  [107.5, 3079],
  [107, 3079],
  [106.5, 3115],
  [106, 3115],
  [105.5, 3115],
  [105, 3115],
  [104.5, 3115],
  [104, 3115],
  [103.5, 3470],
  [103, 3470],
  [102.5, 3622],
  [102, 3622],
  [101.5, 3622],
  [101, 4205],
  [100.5, 4205],
  [100, 4205],
  [99.5, 4205],
  [99, 4205],
  [98.5, 4205],
  [98, 4205],
  [97.5, 4205],
  [97, 4205],
  [96.5, 5700],
  [96, 5700],
  [95.5, 5700],
  [95, 5700],
  [94.5, 6000],
  [94, 6000],
  [93.5, 6000],
  [93, 6000],
  [92.5, 6000],
  [92, 6000],
  [91.5, 6000],
  [91, 6200],
  [90.5, 6200],
  [90, 6200],
  [89.5, 7065],
  [89, 7065],
  [88.5, 7065],
  [88, 7065],
  [87.5, 7065],
  [87, 7065],
  [86.5, 7065],
  [86, 8470],
  [85.5, 8470],
  [85, 8470],
  [84.5, 8470],
  [84, 8470],
  [83.5, 8470],
  [83, 8470],
  [82.5, 8470],
  [82, 8470],
  [81.5, 8470],
  [81, 8470],
  [80.5, 8470],
  [80, 8470],
  [78, 9295],
  [76, 9295],
  [74, 9295],
  [72, 9295],
  [70, 9295],
  [68, 9295],
  [66, 9295],
  [64, 9295],
  [62, 9295],
  [60, 9295],
  [58, 9295],
  [56, 9295],
  [54, 9295],
  [52, 9295],
  [50, 9295],
  [48, 11000],
  [46, 11000],
  [44, 11000],
  [42, 11000],
  [40, 12000],
  [38, 12207],
  [36, 13110],
  [34, 13500],
  [32, 14262],
  [30, 14670],
  [28, 15136],
  [26, 15696],
  [24, 16000],
  [22, 16411],
  [20, 17049],
  [18, 17049],
  [16, 17049],
  [14, 17091],
  [12.5, 17283],
  [10, 17360],
  [8.5, 17902],
  [7.5, 17979],
  [5, 18230],
  [2.5, 18379],
  [0, 19308],
  [-2.5, 19351],
];

/**
 * Interpolate rank from a marks→rank table (sorted descending by marks).
 */
function interpolateRank(score, table, totalCandidates) {
  const sorted = table.slice().sort((a, b) => b[0] - a[0]);
  if (score >= sorted[0][0]) return 1;
  if (score <= sorted[sorted.length - 1][0]) return totalCandidates;
  for (let i = 0; i < sorted.length - 1; i++) {
    const [m1, r1] = sorted[i];
    const [m2, r2] = sorted[i + 1];
    if (score <= m1 && score >= m2) {
      if (m1 === m2) return Math.min(r1, r2);
      const t = (m1 - score) / (m1 - m2);
      return Math.round(r1 + t * (r2 - r1));
    }
  }
  return totalCandidates;
}

/**
 * Average rank prediction across 2024 and 2025 data for a given DDCET score.
 */
function predictDDCETRank(score) {
  const r2025 = interpolateRank(
    score,
    DDCET_2025_TABLE,
    DDCET_TOTAL_CANDIDATES[2025],
  );
  const r2024 = interpolateRank(
    score,
    DDCET_2024_TABLE,
    DDCET_TOTAL_CANDIDATES[2024],
  );
  // Average the two years — normalize 2024 to 2025 scale first
  const r2024norm = Math.round(
    (r2024 / DDCET_TOTAL_CANDIDATES[2024]) * DDCET_TOTAL_CANDIDATES[2025],
  );
  return Math.round((r2025 + r2024norm) / 2);
}

/**
 * Convert a predicted rank into a human-readable range "X-Y".
 * Bands: 1-100, 101-200, ..., 901-1000, 1001-1500, 1501-2000, 2001-3000, ...
 */
function getRankRange(rank) {
  if (rank <= 0) return "1-100";
  // First 1000: bands of 100
  if (rank <= 1000) {
    const lo = Math.floor((rank - 1) / 100) * 100 + 1;
    const hi = lo + 99;
    return `${lo}-${hi}`;
  }
  // 1001-5000: bands of 500
  if (rank <= 5000) {
    const lo = Math.floor((rank - 1001) / 500) * 500 + 1001;
    const hi = lo + 499;
    return `${lo.toLocaleString()}-${hi.toLocaleString()}`;
  }
  // 5001-10000: bands of 1000
  if (rank <= 10000) {
    const lo = Math.floor((rank - 5001) / 1000) * 1000 + 5001;
    const hi = lo + 999;
    return `${lo.toLocaleString()}-${hi.toLocaleString()}`;
  }
  // 10001+: bands of 2000
  if (rank <= 17246) {
    const lo = Math.floor((rank - 10001) / 2000) * 2000 + 10001;
    const hi = Math.min(lo + 1999, 17246);
    return `${lo.toLocaleString()}-${hi.toLocaleString()}`;
  }
  return "15,001+";
}

// ── AI Analysis Tab ──────────────────────────────────────────

function AIAnalysisTab({
  subtopics,
  subjects,
  stats,
  ddcetSubjectIds,
  ddcetTotalQuestions,
  topicWeightages,
}) {
  const [improveWeak, setImproveWeak] = useState(false);

  const ddcetSet = new Set((ddcetSubjectIds || []).map(String));
  const total2025 = DDCET_TOTAL_CANDIDATES[2025];

  // Build a map of topic_id → weightage (percentage of exam questions from that topic)
  // The DDCET has 100 questions total (50 per section). Weightages sum to 100 per section.
  // We use them proportionally to distribute 100 exam questions across topics.
  const weightageMap = {};
  let totalWeightage = 0;
  (topicWeightages || []).forEach((tw) => {
    weightageMap[String(tw.topic_id)] = tw.weightage;
    totalWeightage += tw.weightage;
  });
  // Questions per topic = (weightage / totalWeightage) * 100
  const questionsPerTopic = (topicId) => {
    const w = weightageMap[String(topicId)] || 0;
    return totalWeightage > 0 ? (w / totalWeightage) * 100 : 0;
  };

  // ── DDCET subjects aggregate ──────────────────────────────
  const ddcetSubjects = subjects.filter((s) =>
    ddcetSet.has(String(s.subject_id)),
  );
  const ddcetAttempted = ddcetSubjects.reduce((acc, s) => acc + s.attempted, 0);
  const ddcetCorrect = ddcetSubjects.reduce((acc, s) => acc + s.correct, 0);
  const ddcetIncorrect = ddcetSubjects.reduce((acc, s) => acc + s.incorrect, 0);

  // ── Scale to 100-question DDCET ────────────────────────────────
  // DDCET toppers (rank ~500) attempt ~82% of questions.
  // We model exam attempt rate based on accuracy:
  //   - Higher accuracy → student is more careful, attempts fewer but gets more right
  //   - Scale: accuracy 50% → 60% attempt, accuracy 100% → 85% attempt
  // This gives: 93% accuracy → ~82% attempt rate → score ~150 → rank ~490-510 ✓
  const ddcetAccuracy = ddcetAttempted > 0 ? ddcetCorrect / ddcetAttempted : 0;
  const ddcetWrongRate =
    ddcetAttempted > 0 ? ddcetIncorrect / ddcetAttempted : 0;

  // Attempt fraction: linear scale from 60% (at 50% acc) to 85% (at 100% acc)
  // For accuracy below 50%, cap at 60%. For above 100% (impossible), cap at 85%.
  const clampedAcc = Math.max(0.5, Math.min(1.0, ddcetAccuracy));
  const attemptFraction =
    0.6 + ((clampedAcc - 0.5) * (0.85 - 0.6)) / (1.0 - 0.5);
  // examAttempted: how many of 100 DDCET questions the student would attempt
  const examAttempted = Math.round(attemptFraction * 100);

  const estimatedCorrect = Math.round(ddcetAccuracy * examAttempted);
  const estimatedWrong = Math.round(ddcetWrongRate * examAttempted);
  const estimatedSkipped = Math.max(0, 100 - estimatedCorrect - estimatedWrong);
  const estimatedScore =
    Math.round((estimatedCorrect * 2 - estimatedWrong * 0.5) * 10) / 10;
  const predictedRank =
    ddcetAttempted >= 10 ? predictDDCETRank(Math.max(0, estimatedScore)) : null;
  const rankRange = predictedRank ? getRankRange(predictedRank) : null;
  const rankPercentile = predictedRank
    ? Math.round(((total2025 - predictedRank) / total2025) * 100)
    : null;

  // ── Weak subtopics ────────────────────────────────────────
  const weakSubtopics = subtopics
    .filter(
      (s) =>
        ddcetSet.has(String(s.subject_id)) &&
        s.attempted >= 2 &&
        s.accuracy < 50,
    )
    .sort((a, b) => a.accuracy - b.accuracy);

  // Group by subject for display
  const bySubject = {};
  weakSubtopics.forEach((s) => {
    const key = s.subject_name;
    if (!bySubject[key]) bySubject[key] = [];
    bySubject[key].push(s);
  });

  // ── "If student covers weak subtopics" scenario ───────────
  // Uses topic weightages to distribute 100 exam questions proportionally.
  // For each topic: compute weighted contribution from its subtopics,
  // with weak subtopics boosted to 100% accuracy.
  let improvedRank = null;
  let improvedRankRange = null;
  let improvedScore = null;
  if (improveWeak && weakSubtopics.length > 0 && ddcetAttempted >= 10) {
    const allDDCETSubtopics = subtopics.filter((s) =>
      ddcetSet.has(String(s.subject_id)),
    );
    const weakSet = new Set(weakSubtopics.map((s) => String(s.subtopic_id)));

    // Compute improved accuracy rates (with weak subtopics at 100%)
    let impTotalAttempted = 0,
      impTotalCorrect = 0,
      impTotalIncorrect = 0;
    for (const st of allDDCETSubtopics) {
      impTotalAttempted += st.attempted;
      if (weakSet.has(String(st.subtopic_id))) {
        impTotalCorrect += st.attempted;
        impTotalIncorrect += 0;
      } else {
        impTotalCorrect += st.correct;
        impTotalIncorrect += st.incorrect;
      }
    }
    const impAccuracy =
      impTotalAttempted > 0 ? impTotalCorrect / impTotalAttempted : 0;
    const impWrongRate =
      impTotalAttempted > 0 ? impTotalIncorrect / impTotalAttempted : 0;

    if (totalWeightage > 0) {
      // Weightage-based: group subtopics by topic, compute accuracy per topic (with improvement)
      // then weight each topic's contribution by its exam question share × attempt fraction
      const topicGroups = {};
      for (const st of allDDCETSubtopics) {
        const tid = String(st.topic_id);
        if (!topicGroups[tid]) topicGroups[tid] = { subtopics: [] };
        topicGroups[tid].subtopics.push(st);
      }

      let impCorrectQ = 0;
      let impWrongQ = 0;

      for (const [tid, group] of Object.entries(topicGroups)) {
        // Scale each topic's exam Qs by attempt fraction (same as baseline)
        const examQs = questionsPerTopic(tid) * attemptFraction;
        if (examQs === 0) continue;

        let topicAttempted = 0,
          topicCorrect = 0,
          topicIncorrect = 0;
        for (const st of group.subtopics) {
          topicAttempted += st.attempted;
          if (weakSet.has(String(st.subtopic_id))) {
            topicCorrect += st.attempted;
            topicIncorrect += 0;
          } else {
            topicCorrect += st.correct;
            topicIncorrect += st.incorrect;
          }
        }

        const topicAcc = topicAttempted > 0 ? topicCorrect / topicAttempted : 0;
        const topicWrongRate =
          topicAttempted > 0 ? topicIncorrect / topicAttempted : 0;
        impCorrectQ += topicAcc * examQs;
        impWrongQ += topicWrongRate * examQs;
      }

      // Uncovered topics: use improved overall accuracy × attempt fraction
      const coveredTopicQs = Object.keys(topicGroups).reduce(
        (s, tid) => s + questionsPerTopic(tid) * attemptFraction,
        0,
      );
      const uncoveredQs = Math.max(0, examAttempted - coveredTopicQs);
      impCorrectQ += impAccuracy * uncoveredQs;
      impWrongQ += impWrongRate * uncoveredQs;

      const impCorrect = Math.round(impCorrectQ);
      const impWrong = Math.round(impWrongQ);
      improvedScore = Math.round((impCorrect * 2 - impWrong * 0.5) * 10) / 10;
    } else {
      // Fallback: no weightage data — scale improved accuracy by attempt fraction
      const impCorrect = Math.round(impAccuracy * examAttempted);
      const impWrong = Math.round(impWrongRate * examAttempted);
      improvedScore = Math.round((impCorrect * 2 - impWrong * 0.5) * 10) / 10;
    }

    improvedRank = predictDDCETRank(Math.max(0, improvedScore));
    improvedRankRange = getRankRange(improvedRank);
  }

  const rankColor = (rank) =>
    rank
      ? rank <= 1000
        ? "#22c55e"
        : rank <= 5000
          ? "#f59e0b"
          : "#ef4444"
      : "#94a3b8";

  return (
    <div>
      {/* ── Rank Prediction Card ── */}
      <div className="card mb-20">
        <div className="card-body p-24">
          <div className="flex-align gap-10 mb-16">
            <div
              className="w-40 h-40 rounded-10 d-flex align-items-center justify-content-center"
              style={{ background: "#ede9fe" }}
            >
              <i
                className="ph ph-trophy text-20"
                style={{ color: "#7c3aed" }}
              />
            </div>
            <div>
              <h6 className="fw-bold text-gray-800 mb-0">
                Predicted DDCET Rank
              </h6>
              <p className="text-12 text-gray-400 mb-0">
                Based on ACPC DDCET 2024 &amp; 2025 official rank data ·{" "}
                {total2025.toLocaleString()} Engineering candidates
              </p>
            </div>
          </div>

          {/* Checkbox — "if student covers weak subtopics" */}
          {ddcetAttempted >= 10 && weakSubtopics.length > 0 && (
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "8px 14px",
                marginBottom: "16px",
                background: improveWeak ? "#f0fdf4" : "#f8fafc",
                border: `1.5px solid ${improveWeak ? "#86efac" : "#e2e8f0"}`,
                borderRadius: "10px",
                userSelect: "none",
                transition: "all 0.2s",
              }}
            >
              <input
                type="checkbox"
                checked={improveWeak}
                onChange={(e) => setImproveWeak(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "#22c55e",
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: improveWeak ? "#15803d" : "#475569",
                }}
              >
                If student covers all weak subtopics
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: improveWeak ? "#22c55e" : "#94a3b8",
                }}
              >
                (simulate 100% accuracy on weak areas)
              </span>
            </label>
          )}

          {ddcetAttempted < 10 ? (
            <div
              className="text-center py-24"
              style={{ background: "#f8fafc", borderRadius: "12px" }}
            >
              <i
                className="ph ph-info text-32 d-block mb-8"
                style={{ color: "#94a3b8" }}
              />
              <p className="text-14 fw-medium text-gray-600 mb-4">
                Not enough data to predict rank
              </p>
              <p className="text-12 text-gray-400 mb-0">
                Student needs to attempt at least 10 DDCET-subject questions
                (currently {ddcetAttempted})
              </p>
            </div>
          ) : (
            <div className="row g-16 align-items-center">
              {/* Rank range card(s) */}
              <div
                className={
                  improveWeak && improvedRankRange ? "col-md-3" : "col-md-4"
                }
              >
                <div
                  style={{
                    padding: "20px",
                    background: `${rankColor(predictedRank)}0f`,
                    border: `2px solid ${rankColor(predictedRank)}33`,
                    borderRadius: "16px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: rankColor(predictedRank),
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "6px",
                    }}
                  >
                    Current Rank Range
                  </div>
                  <div
                    style={{
                      fontSize: "26px",
                      fontWeight: 900,
                      color: rankColor(predictedRank),
                      lineHeight: 1.2,
                    }}
                  >
                    {rankRange}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      marginTop: "6px",
                    }}
                  >
                    out of {total2025.toLocaleString()}
                  </div>
                  {rankPercentile !== null && (
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: rankColor(predictedRank),
                      }}
                    >
                      Top {100 - rankPercentile}% in Gujarat
                    </div>
                  )}
                </div>
              </div>

              {/* Improved rank card — shown only when checkbox is on */}
              {improveWeak && improvedRankRange && (
                <div className="col-md-3">
                  <div
                    style={{
                      padding: "20px",
                      background: "#f0fdf4",
                      border: "2px solid #86efac",
                      borderRadius: "16px",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#22c55e",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 10px",
                        borderRadius: "20px",
                        letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      AFTER IMPROVEMENT
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#15803d",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "6px",
                      }}
                    >
                      Potential Rank Range
                    </div>
                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: 900,
                        color: "#22c55e",
                        lineHeight: 1.2,
                      }}
                    >
                      {improvedRankRange}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        marginTop: "6px",
                      }}
                    >
                      if weak subtopics covered
                    </div>
                    {improvedScore !== null && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#22c55e",
                        }}
                      >
                        Score: {Math.max(0, improvedScore)} / 200
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Score breakdown */}
              <div
                className={
                  improveWeak && improvedRankRange ? "col-md-3" : "col-md-4"
                }
              >
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <p
                    className="text-12 fw-semibold text-gray-500 mb-12"
                    style={{
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {improveWeak && improvedScore !== null
                      ? "Score Comparison"
                      : "Estimated Score Breakdown"}
                  </p>
                  {improveWeak && improvedScore !== null ? (
                    /* Two-column comparison: current vs improved */
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "4px",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#64748b",
                            textAlign: "center",
                            paddingBottom: "4px",
                            borderBottom: "2px solid #e2e8f0",
                          }}
                        >
                          Current
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#22c55e",
                            textAlign: "center",
                            paddingBottom: "4px",
                            borderBottom: "2px solid #86efac",
                          }}
                        >
                          After Fix
                        </div>
                      </div>
                      {[
                        {
                          label: "Score / 200",
                          cur: `${Math.max(0, estimatedScore)}`,
                          imp: `${Math.max(0, improvedScore)}`,
                        },
                        {
                          label: "Correct (×2)",
                          cur: `${estimatedCorrect}Q`,
                          imp: null,
                        },
                        {
                          label: "Wrong (−0.5)",
                          cur: `${estimatedWrong}Q`,
                          imp: null,
                        },
                        {
                          label: "Skipped",
                          cur: `${estimatedSkipped}Q`,
                          imp: null,
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr 1fr",
                            gap: "4px",
                            alignItems: "center",
                            marginBottom: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#94a3b8",
                              paddingRight: "6px",
                            }}
                          >
                            {row.label}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#475569",
                              textAlign: "center",
                            }}
                          >
                            {row.cur}
                          </span>
                          {row.imp !== null ? (
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#22c55e",
                                textAlign: "center",
                              }}
                            >
                              {row.imp}
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#94a3b8",
                                textAlign: "center",
                              }}
                            >
                              —
                            </span>
                          )}
                        </div>
                      ))}
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "6px 8px",
                          background: "#f0fdf4",
                          borderRadius: "6px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#15803d",
                            fontWeight: 700,
                          }}
                        >
                          +
                          {Math.max(
                            0,
                            Math.max(0, improvedScore) -
                              Math.max(0, estimatedScore),
                          )}{" "}
                          score improvement
                        </span>
                      </div>
                    </>
                  ) : (
                    [
                      {
                        label: "Estimated Score",
                        value: `${Math.max(0, estimatedScore)} / 200`,
                        color: rankColor(predictedRank),
                      },
                      {
                        label: "Est. Correct (×2)",
                        value: `${estimatedCorrect} Q`,
                        color: "#22c55e",
                      },
                      {
                        label: "Est. Wrong (−0.5)",
                        value: `${estimatedWrong} Q`,
                        color: "#ef4444",
                      },
                      {
                        label: "Est. Skipped",
                        value: `${estimatedSkipped} Q`,
                        color: "#94a3b8",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          {item.label}
                        </span>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: item.color,
                          }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* DDCET accuracy ring */}
              <div
                className={
                  improveWeak && improvedRankRange ? "col-md-3" : "col-md-4"
                }
                style={{ textAlign: "center" }}
              >
                <RingChart
                  pct={Math.round(ddcetAccuracy * 100)}
                  color={
                    ddcetAccuracy >= 0.75
                      ? "#22c55e"
                      : ddcetAccuracy >= 0.5
                        ? "#f59e0b"
                        : "#ef4444"
                  }
                  size={120}
                  label="DDCET Acc."
                />
                <p className="text-12 text-gray-400 mt-8 mb-0">
                  {ddcetAttempted} DDCET questions attempted
                </p>
                <p className="text-11 text-gray-300 mb-0">
                  Est. {examAttempted}/100 in exam · {ddcetSubjects.length}{" "}
                  subjects
                </p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div
            style={{
              marginTop: "16px",
              padding: "10px 14px",
              background: "#fef3c7",
              borderRadius: "8px",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <i
              className="ph ph-warning"
              style={{ color: "#f59e0b", flexShrink: 0, marginTop: "2px" }}
            />
            <p
              style={{
                fontSize: "11px",
                color: "#92400e",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              This is an <strong>estimated prediction</strong> based on ACPC
              DDCET 2024 &amp; 2025 official rank data averaged together
              {totalWeightage > 0
                ? ", weighted by official DDCET topic weightages"
                : ""}
              . Actual rank depends on exam difficulty, number of candidates,
              and relative performance.
            </p>
          </div>
        </div>
      </div>

      {/* ── Weak Subtopics ── */}
      <div className="card">
        <div className="card-body p-24">
          <div className="flex-align gap-10 mb-20">
            <div
              className="w-40 h-40 rounded-10 d-flex align-items-center justify-content-center"
              style={{ background: "#fef2f2" }}
            >
              <i className="ph ph-target text-20 text-danger-600" />
            </div>
            <div>
              <h6 className="fw-bold text-gray-800 mb-0">
                Weak Subtopics (DDCET Subjects)
              </h6>
              <p className="text-12 text-gray-400 mb-0">
                Subtopics with &lt;50% accuracy and ≥2 attempts — needs
                immediate focus
              </p>
            </div>
          </div>

          {weakSubtopics.length === 0 ? (
            <div
              className="text-center py-32"
              style={{ background: "#f0fdf4", borderRadius: "12px" }}
            >
              <i
                className="ph ph-check-circle text-48 d-block mb-8"
                style={{ color: "#22c55e" }}
              />
              <p className="text-14 fw-semibold text-success-700 mb-4">
                No weak subtopics found!
              </p>
              <p className="text-12 text-gray-400 mb-0">
                {ddcetAttempted === 0
                  ? "Student hasn't attempted any DDCET questions yet."
                  : "Student is performing well (≥50%) in all attempted DDCET subtopics."}
              </p>
            </div>
          ) : (
            Object.entries(bySubject).map(([subjectName, items]) => (
              <div key={subjectName} style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "18px",
                      background: "#ef4444",
                      borderRadius: "2px",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#334155",
                    }}
                  >
                    {subjectName}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#ef4444",
                      background: "#fef2f2",
                      borderRadius: "20px",
                      padding: "2px 10px",
                      fontWeight: 600,
                    }}
                  >
                    {items.length} weak subtopic{items.length > 1 ? "s" : ""}
                  </span>
                </div>
                {items.map((st, i) => {
                  const color = "#ef4444";
                  return (
                    <div
                      key={i}
                      style={{
                        borderRadius: "10px",
                        padding: "12px 16px",
                        marginBottom: "8px",
                        background: "#fff",
                        border: "1.5px solid #fee2e2",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                          gap: "12px",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#334155",
                            }}
                          >
                            {st.subtopic_name}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#94a3b8",
                              marginLeft: "8px",
                            }}
                          >
                            {st.topic_name}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                            <span style={{ color: "#22c55e", fontWeight: 600 }}>
                              {st.correct}
                            </span>
                            <span style={{ margin: "0 3px" }}>/</span>
                            <span style={{ color: "#ef4444" }}>
                              {st.incorrect}
                            </span>
                            <span style={{ margin: "0 3px", color: "#cbd5e1" }}>
                              |
                            </span>
                            {st.attempted} Q
                          </span>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              background: `${color}18`,
                              color,
                              borderRadius: "20px",
                              padding: "3px 12px",
                            }}
                          >
                            {st.accuracy}%
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          height: "6px",
                          background: "#fef2f2",
                          borderRadius: "99px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${st.accuracy}%`,
                            height: "100%",
                            borderRadius: "99px",
                            background: `linear-gradient(90deg,${color}88,${color})`,
                            transition: "width 0.9s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const TABS = [
  "Overview",
  "Quiz Results",
  "Practice Results",
  "Activity",
  "Analysis",
  "AI Analysis",
];

export default function StudentProfile() {
  const { student_id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Overview");
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentProfile", student_id],
    queryFn: async () => {
      const res = await getStudentProfile(student_id);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });

  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };
  const fmtDateTime = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "—";
    }
  };

  return (
    <>
      <AdminSidebar
        isActive={isSidebarActive}
        closeSidebar={() => setIsSidebarActive(false)}
      />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={() => setIsSidebarActive((p) => !p)} />
        <div className="dashboard-body">
          {isLoading && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "60vh" }}
            >
              <div className="text-center">
                <span
                  className="spinner-border text-main-600 mb-16"
                  style={{ width: "3rem", height: "3rem" }}
                />
                <p className="text-gray-400 mt-16">
                  Loading student profile...
                </p>
              </div>
            </div>
          )}

          {isError && !isLoading && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "60vh" }}
            >
              <div className="text-center">
                <i className="ph ph-warning text-64 text-warning-400 d-block mb-16" />
                <p className="text-gray-500 mb-16">
                  Failed to load student profile.
                </p>
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-main rounded-pill px-24"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

          {!isLoading &&
            !isError &&
            data &&
            (() => {
              const {
                profile,
                stats,
                subjects,
                topics = [],
                subtopics = [],
                strongest,
                weakest,
                quiz_results,
                practice_results,
                activity,
                rank,
                engagement,
                ddcetSubjectIds = [],
                ddcetTotalQuestions = 0,
                topicWeightages = [],
              } = data;
              const initials =
                profile.Name?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?";
              const engPct = Math.min(
                Math.round((engagement.active_days_30 / 30) * 100),
                100,
              );
              const rankPct =
                rank.batch_rank && rank.batch_total
                  ? Math.round(
                      ((rank.batch_total - rank.batch_rank + 1) /
                        rank.batch_total) *
                        100,
                    )
                  : 0;

              return (
                <>
                  {/* Breadcrumb */}
                  <div className="flex-between flex-wrap gap-8 mb-24">
                    <div className="breadcrumb mb-0">
                      <ul className="flex-align gap-4">
                        <li>
                          <Link
                            to="/admin/dashboard"
                            className="text-gray-200 fw-normal text-15 hover-text-main-600"
                          >
                            Home
                          </Link>
                        </li>
                        <li>
                          <span className="text-gray-500 d-flex">
                            <i className="ph ph-caret-right" />
                          </span>
                        </li>
                        <li>
                          <Link
                            to="/admin/viewStudentWiseGivenExamData"
                            className="text-gray-200 fw-normal text-15 hover-text-main-600"
                          >
                            Student Data
                          </Link>
                        </li>
                        <li>
                          <span className="text-gray-500 d-flex">
                            <i className="ph ph-caret-right" />
                          </span>
                        </li>
                        <li>
                          <span className="text-main-600 fw-normal text-15">
                            {profile.Name}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => navigate(-1)}
                      className="btn btn-secondary rounded-pill py-8 px-20 flex-align gap-6"
                    >
                      <i className="ph ph-arrow-left text-14" /> Back
                    </button>
                  </div>

                  {/* ── HERO ── */}
                  <div className="card mb-20 overflow-hidden">
                    <div
                      style={{
                        background: "linear-gradient(135deg,#312e81,#1e3a5f)",
                        height: "90px",
                      }}
                    />
                    <div className="card-body pt-0 pb-20 px-24">
                      <div className="row align-items-end g-16">
                        <div
                          className="col-auto"
                          style={{ marginTop: "-48px" }}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
                            style={{
                              width: "90px",
                              height: "90px",
                              background:
                                "linear-gradient(135deg,#6366f1,#8b5cf6)",
                              fontSize: "28px",
                              border: "4px solid #fff",
                              boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                            }}
                          >
                            {initials}
                          </div>
                        </div>
                        <div className="col">
                          <h4 className="fw-bold mb-4 text-gray-800 mt-16">
                            {profile.Name}
                          </h4>
                          <div className="flex-align gap-12 flex-wrap">
                            {profile.Email && (
                              <span className="text-13 text-gray-500 flex-align gap-4">
                                <i className="ph ph-envelope text-main-600" />
                                {profile.Email}
                              </span>
                            )}
                            {profile.Phone && (
                              <span className="text-13 text-gray-500 flex-align gap-4">
                                <i className="ph ph-phone text-main-600" />
                                {String(profile.Phone)}
                              </span>
                            )}
                            {profile.batch_title && (
                              <span className="text-12 bg-main-50 text-main-700 py-2 px-10 rounded-pill fw-medium">
                                {profile.batch_title}
                              </span>
                            )}
                            {profile.phase_title && (
                              <span className="text-12 bg-info-50 text-info-700 py-2 px-10 rounded-pill fw-medium">
                                {profile.phase_title}
                              </span>
                            )}
                          </div>
                        </div>
                        {rank.batch_rank && (
                          <div className="col-auto">
                            <div
                              className="text-center p-14 rounded-12"
                              style={{
                                background: "rgba(245,158,11,0.1)",
                                border: "1px solid rgba(245,158,11,0.3)",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "26px",
                                  fontWeight: 900,
                                  color: "#f59e0b",
                                  lineHeight: 1,
                                }}
                              >
                                #{rank.batch_rank}
                              </div>
                              <div className="text-11 text-gray-500 mt-4">
                                of {rank.batch_total} in batch
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── TABS ── */}
                  <div
                    className="flex-align gap-4 mb-20 p-4 bg-gray-50 rounded-12"
                    style={{ width: "fit-content" }}
                  >
                    {TABS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`btn rounded-10 py-8 px-20 text-14 fw-medium ${tab === t ? "btn-main text-white" : "bg-transparent text-gray-500"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* ══ OVERVIEW ══ */}
                  {tab === "Overview" && (
                    <>
                      {/* Strongest / Weakest */}
                      {(strongest || weakest) && (
                        <div className="row g-16 mb-20">
                          {strongest && (
                            <div className="col-md-6">
                              <div
                                className="card border-0"
                                style={{
                                  background:
                                    "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                                }}
                              >
                                <div className="card-body p-16 flex-align gap-12">
                                  <div className="w-44 h-44 rounded-circle bg-success-600 d-flex align-items-center justify-content-center flex-shrink-0">
                                    <i className="ph ph-trophy text-white text-20" />
                                  </div>
                                  <div>
                                    <p className="text-11 text-success-700 fw-semibold mb-2">
                                      STRONGEST SUBJECT
                                    </p>
                                    <h6 className="fw-bold text-success-800 mb-0">
                                      {strongest.subject_name}
                                    </h6>
                                    <p className="text-12 text-success-600 mb-0">
                                      {strongest.accuracy}% accuracy ·{" "}
                                      {strongest.attempted} attempted
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {weakest &&
                            weakest.subject_name !==
                              strongest?.subject_name && (
                              <div className="col-md-6">
                                <div
                                  className="card border-0"
                                  style={{
                                    background:
                                      "linear-gradient(135deg,#fee2e2,#fecaca)",
                                  }}
                                >
                                  <div className="card-body p-16 flex-align gap-12">
                                    <div className="w-44 h-44 rounded-circle bg-danger-600 d-flex align-items-center justify-content-center flex-shrink-0">
                                      <i className="ph ph-trend-down text-white text-20" />
                                    </div>
                                    <div>
                                      <p className="text-11 text-danger-700 fw-semibold mb-2">
                                        NEEDS IMPROVEMENT
                                      </p>
                                      <h6 className="fw-bold text-danger-800 mb-0">
                                        {weakest.subject_name}
                                      </h6>
                                      <p className="text-12 text-danger-600 mb-0">
                                        {weakest.accuracy}% accuracy ·{" "}
                                        {weakest.attempted} attempted
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      )}

                      {/* Stat cards */}
                      <div className="row g-16 mb-20">
                        <div className="col-xl-3 col-md-6">
                          <StatCard
                            icon="ph-list-checks"
                            label="Total Attempted"
                            value={stats.total_attempted?.toLocaleString()}
                            sub={`Test: ${stats.test_attempted} · Practice: ${stats.prac_attempted}`}
                            color="main"
                          />
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <StatCard
                            icon="ph-check-circle"
                            label="Total Correct"
                            value={stats.total_correct?.toLocaleString()}
                            sub={`Test: ${stats.test_correct} · Practice: ${stats.prac_correct}`}
                            color="success"
                          />
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <StatCard
                            icon="ph-x-circle"
                            label="Total Incorrect"
                            value={stats.total_incorrect?.toLocaleString()}
                            color="danger"
                          />
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <StatCard
                            icon="ph-clipboard-text"
                            label="Quizzes Taken"
                            value={stats.quiz_count}
                            sub={`${stats.practice_count} practices`}
                            color="warning"
                          />
                        </div>
                      </div>

                      <div className="row g-16">
                        {/* Ring + bars */}
                        <div className="col-xl-4">
                          <div className="card h-100">
                            <div className="card-body p-24">
                              <h6 className="fw-semibold text-gray-700 mb-20">
                                Overall Performance
                              </h6>
                              <div className="text-center mb-24">
                                <RingChart
                                  pct={stats.accuracy_pct}
                                  color={
                                    stats.accuracy_pct >= 75
                                      ? "#22c55e"
                                      : stats.accuracy_pct >= 50
                                        ? "#f59e0b"
                                        : "#ef4444"
                                  }
                                />
                              </div>
                              <div className="d-flex flex-column gap-14">
                                {[
                                  {
                                    label: "Engagement (30d)",
                                    value: `${engagement.active_days_30} active days`,
                                    pct: engPct,
                                    color: "#6366f1",
                                  },
                                  {
                                    label: "Batch Rank Percentile",
                                    value: rank.batch_rank
                                      ? `Top ${Math.max(1, 100 - rankPct)}%`
                                      : "—",
                                    pct: rankPct,
                                    color: "#f59e0b",
                                  },
                                ].map((item) => (
                                  <div key={item.label}>
                                    <div className="flex-between mb-6">
                                      <span className="text-12 text-gray-500">
                                        {item.label}
                                      </span>
                                      <span
                                        className="text-12 fw-semibold"
                                        style={{ color: item.color }}
                                      >
                                        {item.value}
                                      </span>
                                    </div>
                                    <div
                                      className="rounded-pill overflow-hidden"
                                      style={{
                                        height: "6px",
                                        background: "#f1f5f9",
                                      }}
                                    >
                                      <div
                                        className="rounded-pill"
                                        style={{
                                          width: `${item.pct}%`,
                                          height: "100%",
                                          background: item.color,
                                          transition: "width 1s ease",
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Personal info */}
                        <div className="col-xl-4">
                          <div className="card h-100">
                            <div className="card-body p-24">
                              <h6 className="fw-semibold text-gray-700 mb-20">
                                Personal Details
                              </h6>
                              <div className="d-flex flex-column gap-14">
                                {[
                                  {
                                    icon: "ph-user",
                                    label: "Full Name",
                                    value: profile.Name,
                                  },
                                  {
                                    icon: "ph-envelope",
                                    label: "Email",
                                    value: profile.Email || "—",
                                  },
                                  {
                                    icon: "ph-phone",
                                    label: "Mobile",
                                    value: profile.Phone
                                      ? String(profile.Phone)
                                      : "—",
                                  },
                                  {
                                    icon: "ph-identification-card",
                                    label: "Enrollment",
                                    value: profile.Enrollment_No || "—",
                                  },
                                  {
                                    icon: "ph-buildings",
                                    label: "College",
                                    value: profile.College_Name,
                                  },
                                  {
                                    icon: "ph-graduation-cap",
                                    label: "Branch",
                                    value: profile.Branch_Name,
                                  },
                                  {
                                    icon: "ph-stack-simple",
                                    label: "Semester",
                                    value: profile.Semester
                                      ? `Sem ${profile.Semester}`
                                      : "—",
                                  },
                                  {
                                    icon: "ph-users-three",
                                    label: "Batch",
                                    value: profile.batch_title || "—",
                                  },
                                  {
                                    icon: "ph-stack",
                                    label: "Phase",
                                    value: profile.phase_title || "—",
                                  },
                                  {
                                    icon: "ph-calendar-plus",
                                    label: "Joined",
                                    value: fmtDate(profile.registration_time),
                                  },
                                ].map((item) => (
                                  <div
                                    key={item.label}
                                    className="flex-align gap-12"
                                  >
                                    <div className="w-32 h-32 rounded-8 bg-main-50 d-flex align-items-center justify-content-center flex-shrink-0">
                                      <i
                                        className={`ph ${item.icon} text-main-600 text-16`}
                                      />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                      <p className="text-11 text-gray-400 mb-0">
                                        {item.label}
                                      </p>
                                      <p
                                        className="text-13 fw-medium text-gray-700 mb-0"
                                        style={{
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                        title={item.value}
                                      >
                                        {item.value}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Subject accuracy */}
                        <div className="col-xl-4">
                          <div className="card h-100">
                            <div className="card-body p-24">
                              <h6 className="fw-semibold text-gray-700 mb-20">
                                Subject-wise Accuracy
                              </h6>
                              {subjects.length === 0 ? (
                                <div className="text-center py-24 text-gray-400">
                                  <i className="ph ph-chart-bar text-48 d-block mb-8" />
                                  No data
                                </div>
                              ) : (
                                <div
                                  style={{
                                    overflowY: "auto",
                                    maxHeight: "300px",
                                  }}
                                >
                                  {subjects.map((s) => (
                                    <AccuracyBar
                                      key={s.subject_name}
                                      subject={s.subject_name}
                                      accuracy={s.accuracy}
                                      attempted={s.attempted}
                                      correct={s.correct}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ══ QUIZ RESULTS ══ */}
                  {tab === "Quiz Results" && (
                    <div className="card">
                      <div className="card-body p-0">
                        {quiz_results.length === 0 ? (
                          <div className="text-center py-48">
                            <i className="ph ph-clipboard-text text-64 text-gray-300 d-block mb-16" />
                            <p className="text-gray-400">No quiz results yet</p>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-12 text-gray-500 fw-medium py-12 px-16">
                                    #
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12">
                                    Quiz Name
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12">
                                    Date
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Attempted
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Correct
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Wrong
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Marks
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Accuracy
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {quiz_results.map((q, i) => {
                                  const acc = parseFloat(q.accuracy) || 0;
                                  const c =
                                    acc >= 75
                                      ? "text-success-600"
                                      : acc >= 50
                                        ? "text-warning-600"
                                        : "text-danger-600";
                                  return (
                                    <tr key={q.id || i}>
                                      <td className="text-13 text-gray-400 py-12 px-16">
                                        {i + 1}
                                      </td>
                                      <td className="text-13 fw-medium text-gray-800 py-12">
                                        {q.test_title}
                                      </td>
                                      <td className="text-12 text-gray-500 py-12">
                                        {fmtDate(q.exam_date)}
                                      </td>
                                      <td className="text-13 py-12 text-center">
                                        {q.total_attempted}
                                      </td>
                                      <td className="text-13 py-12 text-center text-success-600 fw-medium">
                                        {q.total_correct}
                                      </td>
                                      <td className="text-13 py-12 text-center text-danger-600">
                                        {q.total_incorrect}
                                      </td>
                                      <td className="text-13 py-12 text-center fw-semibold">
                                        {q.obtained_marks}/{q.total_marks}
                                      </td>
                                      <td className="py-12 text-center">
                                        <span
                                          className={`text-13 fw-bold ${c}`}
                                        >
                                          {acc}%
                                        </span>
                                        <div
                                          className="progress mt-4"
                                          style={{ height: "3px" }}
                                        >
                                          <div
                                            className={`progress-bar ${acc >= 75 ? "bg-success" : acc >= 50 ? "bg-warning" : "bg-danger"}`}
                                            style={{ width: `${acc}%` }}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ══ PRACTICE RESULTS ══ */}
                  {tab === "Practice Results" && (
                    <div className="card">
                      <div className="card-body p-0">
                        {practice_results.length === 0 ? (
                          <div className="text-center py-48">
                            <i className="ph ph-barbell text-64 text-gray-300 d-block mb-16" />
                            <p className="text-gray-400">
                              No practice results yet
                            </p>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-12 text-gray-500 fw-medium py-12 px-16">
                                    #
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12">
                                    Practice Title
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Attempted
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Correct
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Wrong
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                                    Accuracy
                                  </th>
                                  <th className="text-12 text-gray-500 fw-medium py-12">
                                    Last Active
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {practice_results.map((p, i) => {
                                  const acc = parseFloat(p.accuracy) || 0;
                                  const c =
                                    acc >= 75
                                      ? "text-success-600"
                                      : acc >= 50
                                        ? "text-warning-600"
                                        : "text-danger-600";
                                  return (
                                    <tr key={p.id || i}>
                                      <td className="text-13 text-gray-400 py-12 px-16">
                                        {i + 1}
                                      </td>
                                      <td className="text-13 fw-medium text-gray-800 py-12">
                                        {p.practice_title}
                                      </td>
                                      <td className="text-13 py-12 text-center">
                                        {p.attempted}
                                      </td>
                                      <td className="text-13 py-12 text-center text-success-600 fw-medium">
                                        {p.correct}
                                      </td>
                                      <td className="text-13 py-12 text-center text-danger-600">
                                        {p.incorrect}
                                      </td>
                                      <td className="py-12 text-center">
                                        <span
                                          className={`text-13 fw-bold ${c}`}
                                        >
                                          {acc}%
                                        </span>
                                        <div
                                          className="progress mt-4"
                                          style={{ height: "3px" }}
                                        >
                                          <div
                                            className={`progress-bar ${acc >= 75 ? "bg-success" : acc >= 50 ? "bg-warning" : "bg-danger"}`}
                                            style={{ width: `${acc}%` }}
                                          />
                                        </div>
                                      </td>
                                      <td className="text-12 text-gray-500 py-12">
                                        {fmtDate(p.last_attempted)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ══ ANALYSIS ══ */}
                  {tab === "Analysis" && (
                    <AnalysisTab
                      subjects={subjects}
                      topics={topics}
                      subtopics={subtopics}
                    />
                  )}

                  {/* ══ AI ANALYSIS ══ */}
                  {tab === "AI Analysis" && (
                    <AIAnalysisTab
                      subtopics={subtopics}
                      subjects={subjects}
                      stats={stats}
                      ddcetSubjectIds={ddcetSubjectIds}
                      ddcetTotalQuestions={ddcetTotalQuestions}
                      topicWeightages={topicWeightages}
                    />
                  )}

                  {/* ══ ACTIVITY ══ */}
                  {tab === "Activity" && (
                    <div className="row g-16">
                      {/* Engagement card */}
                      <div className="col-md-4">
                        <div className="card h-100">
                          <div className="card-body p-24">
                            <h6 className="fw-semibold text-gray-700 mb-20">
                              Engagement Score
                            </h6>
                            <div className="text-center mb-20">
                              <RingChart
                                pct={engPct}
                                color="#6366f1"
                                size={110}
                                label="Active"
                              />
                            </div>
                            <div className="text-center mb-16">
                              <p className="text-24 fw-bold text-main-600 mb-4">
                                {engagement.active_days_30}
                              </p>
                              <p className="text-13 text-gray-500">
                                active days in last 30
                              </p>
                            </div>
                            <div
                              className={`p-12 rounded-10 text-center ${engPct >= 70 ? "bg-success-50" : engPct >= 40 ? "bg-warning-50" : "bg-danger-50"}`}
                            >
                              <p
                                className={`text-12 mb-0 fw-medium ${engPct >= 70 ? "text-success-700" : engPct >= 40 ? "text-warning-700" : "text-danger-700"}`}
                              >
                                {engPct >= 70
                                  ? "🔥 Highly engaged!"
                                  : engPct >= 40
                                    ? "📈 Moderate engagement"
                                    : "⚠️ Low engagement"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="col-md-8">
                        <div className="card h-100">
                          <div className="card-body p-24">
                            <h6 className="fw-semibold text-gray-700 mb-20">
                              Recent Activity
                            </h6>
                            {activity.length === 0 ? (
                              <div className="text-center py-24 text-gray-400">
                                <i className="ph ph-clock text-48 d-block mb-8" />
                                No recent activity
                              </div>
                            ) : (
                              <MathJaxContext config={mathConfig}>
                                <div className="d-flex flex-column gap-0">
                                  {activity.map((a, i) => {
                                    const isCorrect = a.result === "Correct";
                                    const isSkipped = a.result === "Skipped";
                                    const dotColor = isCorrect
                                      ? "#22c55e"
                                      : isSkipped
                                        ? "#94a3b8"
                                        : "#ef4444";
                                    const badgeCls = isCorrect
                                      ? "bg-success-50 text-success-700"
                                      : isSkipped
                                        ? "bg-gray-50 text-gray-500"
                                        : "bg-danger-50 text-danger-700";
                                    return (
                                      <div
                                        key={i}
                                        className="d-flex gap-14 position-relative"
                                      >
                                        {i < activity.length - 1 && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              left: "15px",
                                              top: "32px",
                                              bottom: 0,
                                              width: "2px",
                                              background: "#f1f5f9",
                                              zIndex: 0,
                                            }}
                                          />
                                        )}
                                        <div
                                          className="flex-shrink-0 position-relative"
                                          style={{ zIndex: 1 }}
                                        >
                                          <div
                                            className="w-32 h-32 rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                              background: `${dotColor}22`,
                                              border: `2px solid ${dotColor}`,
                                            }}
                                          >
                                            <i
                                              className={`ph ${a.type === "test" ? "ph-clipboard-text" : "ph-barbell"} text-13`}
                                              style={{ color: dotColor }}
                                            />
                                          </div>
                                        </div>
                                        <div
                                          className="flex-grow-1 pb-16"
                                          style={{ minWidth: 0 }}
                                        >
                                          <div className="flex-between gap-8 mb-4">
                                            <p
                                              className="text-13 fw-medium text-gray-700 mb-0"
                                              style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              <MathJax dynamic inline>
                                                {a.question_text}
                                              </MathJax>
                                            </p>
                                            <span
                                              className={`text-11 py-2 px-8 rounded-pill fw-medium flex-shrink-0 ${badgeCls}`}
                                            >
                                              {a.result}
                                            </span>
                                          </div>
                                          <div className="flex-align gap-8 flex-wrap">
                                            <span className="text-11 text-gray-400">
                                              {fmtDateTime(a.activity_time)}
                                            </span>
                                            <span className="text-11 bg-gray-50 text-gray-500 py-1 px-8 rounded-pill">
                                              {a.subject_name}
                                            </span>
                                            <span className="text-11 bg-main-50 text-main-600 py-1 px-8 rounded-pill">
                                              {a.type}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </MathJaxContext>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
        </div>
        <Footer />
      </div>
    </>
  );
}
