import React from "react";
import { format } from "date-fns";

function PracticeSetCard({ set, onAttempt, onViewWrong }) {
  const {
    title,
    assigned_by_name,
    total_questions,
    attempted,
    correct,
    wrong,
    remaining,
    progress_pct,
    status,
    start_date,
    end_date,
  } = set;

  const isUpcoming = status === "upcoming";
  const isEnded = status === "ended";
  const isActive = status === "active";

  const statusConfig = {
    active: {
      label: "Active",
      cls: "bg-success-50 text-success-700",
      dot: "bg-success-600",
    },
    upcoming: {
      label: "Upcoming",
      cls: "bg-info-50 text-info-700",
      dot: "bg-info-600",
    },
    ended: {
      label: "Ended",
      cls: "bg-gray-100 text-gray-500",
      dot: "bg-gray-400",
    },
  };
  const sc = statusConfig[status] || statusConfig.ended;

  const progressColor =
    progress_pct === 100
      ? "bg-success-600"
      : progress_pct >= 50
        ? "bg-main-600"
        : "bg-warning-500";

  const fmtDate = (d) => (d ? format(new Date(d), "dd MMM yyyy") : null);

  return (
    <div
      className={`card h-100 border ${
        isActive ? "border-gray-100" : "border-gray-100"
      } position-relative overflow-hidden`}
      style={{ transition: "box-shadow 0.2s", cursor: "default" }}
      onMouseEnter={(e) => {
        if (isActive)
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top accent bar */}
      <div
        className={`position-absolute top-0 start-0 end-0 ${
          isActive ? "bg-main-600" : isUpcoming ? "bg-info-400" : "bg-gray-200"
        }`}
        style={{ height: "4px" }}
      />

      <div className="card-body p-20 d-flex flex-column gap-14 pt-24">
        {/* Header row */}
        <div className="flex-between align-items-start gap-8">
          <div className="flex-grow-1 min-w-0">
            <h6
              className="fw-semibold text-gray-800 mb-4 lh-sm"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {title}
            </h6>
            {/* {assigned_by_name && (
              <p className="text-12 text-gray-400 mb-0 flex-align gap-4">
                <i className="ph ph-user-circle text-14" />
                {assigned_by_name}
              </p>
            )} */}
          </div>
          {/* Status badge */}
          <span
            className={`text-11 py-4 px-10 rounded-pill fw-semibold flex-align gap-4 flex-shrink-0 ${sc.cls}`}
          >
            <span
              className={`d-inline-block rounded-circle ${sc.dot}`}
              style={{ width: "6px", height: "6px" }}
            />
            {sc.label}
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex-between mb-6">
            <span className="text-12 text-gray-500 fw-medium">Progress</span>
            <span className="text-12 fw-semibold text-gray-700">
              {attempted}/{total_questions}
              <span className="text-gray-400 fw-normal ms-4">
                ({progress_pct}%)
              </span>
            </span>
          </div>
          <div
            className="bg-gray-100 rounded-pill overflow-hidden"
            style={{ height: "8px" }}
          >
            <div
              className={`rounded-pill ${progressColor} transition-2`}
              style={{ width: `${progress_pct}%`, height: "8px" }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="row g-8">
          {[
            {
              label: "Total",
              value: total_questions,
              icon: "ph-list-numbers",
              color: "text-gray-600",
              bg: "bg-gray-50",
            },
            {
              label: "Correct",
              value: correct,
              icon: "ph-check-circle",
              color: "text-success-600",
              bg: "bg-success-50",
            },
            {
              label: "Wrong",
              value: wrong,
              icon: "ph-x-circle",
              color: "text-danger-600",
              bg: "bg-danger-50",
            },
            {
              label: "Remaining",
              value: remaining,
              icon: "ph-hourglass",
              color: "text-warning-600",
              bg: "bg-warning-50",
            },
          ].map((s) => (
            <div className="col-6 col-sm-3" key={s.label}>
              <div className={`p-10 rounded-10 ${s.bg} text-center`}>
                <i className={`ph ${s.icon} text-18 ${s.color} d-block mb-4`} />
                <p className="text-16 fw-bold mb-0 text-gray-800">{s.value}</p>
                <p className="text-11 text-gray-500 mb-0">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Date info */}
        {(start_date || end_date) && (
          <div className="flex-align gap-12 flex-wrap">
            {start_date && (
              <span className="text-12 text-gray-400 flex-align gap-4">
                <i className="ph ph-calendar-check text-success-500" />
                Starts {fmtDate(start_date)}
              </span>
            )}
            {end_date && (
              <span className="text-12 text-gray-400 flex-align gap-4">
                <i className="ph ph-calendar-x text-danger-400" />
                Ends {fmtDate(end_date)}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="d-flex gap-10 mt-auto pt-4">
          {/* Attempt button */}
          {isActive && remaining > 0 ? (
            <button
              className="btn btn-main rounded-pill py-8 flex-grow-1 flex-align justify-content-center gap-8 text-14"
              onClick={() => onAttempt(set)}
            >
              <i className="ph ph-barbell" />
              Attempt ({remaining})
            </button>
          ) : isActive && remaining === 0 ? (
            <div className="flex-align gap-6 flex-grow-1 justify-content-center bg-success-50 rounded-pill py-8 px-12">
              <i className="ph-fill ph-check-circle text-success-600 text-16" />
              <span className="text-13 text-success-700 fw-semibold">
                All Done!
              </span>
            </div>
          ) : isUpcoming ? (
            <div className="flex-align gap-6 flex-grow-1 justify-content-center bg-info-50 rounded-pill py-8 px-12">
              <i className="ph ph-clock text-info-600 text-16" />
              <span className="text-13 text-info-700 fw-medium">
                Starts {fmtDate(start_date)}
              </span>
            </div>
          ) : (
            <div className="flex-align gap-6 flex-grow-1 justify-content-center bg-gray-50 rounded-pill py-8 px-12">
              <i className="ph ph-lock text-gray-400 text-16" />
              <span className="text-13 text-gray-500 fw-medium">Ended</span>
            </div>
          )}

          {/* Wrong answers button */}
          {wrong > 0 && (
            <button
              className="btn btn-danger rounded-pill  flex-grow-1  justify-content-center py-8 px-14 flex-align gap-6 text-13 flex-shrink-0"
              onClick={() => onViewWrong(set)}
              title="View wrong answers"
            >
              <i className="ph ph-x-circle text-14" />
              {wrong} Wrong
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PracticeSetCard;
