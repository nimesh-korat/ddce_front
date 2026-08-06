import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getPracticeAttendedList,
  getAllBatch,
  getAllPhase,
} from "../../apis/apis";

export default function PracticeAttendedModal({ practice, onClose }) {
  const [batchId, setBatchId] = useState("");
  const [phaseId, setPhaseId] = useState("");

  const { data: batchData } = useQuery({
    queryKey: ["allBatch"],
    queryFn: getAllBatch,
    staleTime: 5 * 60 * 1000,
  });
  const { data: phaseData } = useQuery({
    queryKey: ["allPhase"],
    queryFn: getAllPhase,
    staleTime: 5 * 60 * 1000,
  });
  const batches = batchData || [];
  const phases = phaseData || [];

  const { data, isLoading } = useQuery({
    queryKey: ["practiceAttended", practice?.id, batchId, phaseId],
    queryFn: () =>
      getPracticeAttendedList(practice?.id, {
        batch_id: batchId,
        phase_id: phaseId,
      }),
    enabled: !!practice?.id,
    staleTime: 30 * 1000,
  });

  const rows = data?.data || [];
  const assignments = data?.assignments || [];
  const totalQ = data?.total_questions || 0;

  const pctColor = (p) =>
    p >= 75 ? "#22c55e" : p >= 50 ? "#f59e0b" : "#ef4444";

  // Unique batches from assignments for filter
  const assignedBatches = [
    ...new Map(
      assignments
        .filter((a) => a.tbl_batch)
        .map((a) => [
          a.tbl_batch,
          { id: a.tbl_batch, batch_title: a.batch_title },
        ]),
    ).values(),
  ];
  const assignedPhases = [
    ...new Map(
      assignments
        .filter((a) => a.tbl_phase)
        .map((a) => [a.tbl_phase, { id: a.tbl_phase, title: a.phase_title }]),
    ).values(),
  ];

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex-between p-20 border-bottom border-gray-100"
          style={{ flexShrink: 0 }}
        >
          <div>
            <h5 className="fw-bold mb-2 text-gray-800">{practice?.title}</h5>
            <p className="text-13 text-gray-400 mb-0">
              {rows.length} student{rows.length !== 1 ? "s" : ""} attempted ·{" "}
              {totalQ} total questions
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-secondary rounded-circle"
            style={{ width: "34px", height: "34px" }}
          >
            <i className="ph ph-x" />
          </button>
        </div>

        {/* Filters */}
        <div
          className="px-20 py-12 border-bottom border-gray-100 flex-align flex-wrap gap-10"
          style={{ flexShrink: 0 }}
        >
          <select
            className="form-select form-select-sm rounded-pill"
            style={{ width: "180px" }}
            value={batchId}
            onChange={(e) => {
              setBatchId(e.target.value);
            }}
          >
            <option value="">All Batches</option>
            {(assignedBatches.length > 0 ? assignedBatches : batches).map(
              (b) => (
                <option key={b.id} value={b.id}>
                  {b.batch_title}
                </option>
              ),
            )}
          </select>
          <select
            className="form-select form-select-sm rounded-pill"
            style={{ width: "160px" }}
            value={phaseId}
            onChange={(e) => {
              setPhaseId(e.target.value);
            }}
          >
            <option value="">All Phases</option>
            {(assignedPhases.length > 0 ? assignedPhases : phases).map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          {(batchId || phaseId) && (
            <button
              className="btn btn-sm rounded-pill flex-align gap-4"
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                border: "none",
              }}
              onClick={() => {
                setBatchId("");
                setPhaseId("");
              }}
            >
              <i className="ph ph-x text-11" /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {isLoading && (
            <div className="text-center py-40">
              <span className="spinner-border text-main-600" />
            </div>
          )}

          {!isLoading && rows.length === 0 && (
            <div className="text-center py-40 text-gray-400">
              <i className="ph ph-users text-48 d-block mb-12 text-gray-300" />
              No students have attempted this practice yet
            </div>
          )}

          {!isLoading && rows.length > 0 && (
            <table className="table table-hover mb-0">
              <thead
                className="bg-gray-50"
                style={{ position: "sticky", top: 0, zIndex: 1 }}
              >
                <tr>
                  <th className="text-12 text-gray-500 fw-medium py-10 px-16">
                    #
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10">
                    Student
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10">
                    College
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10">
                    Batch
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10">
                    Phase
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                    Attempted
                  </th>
                  <th
                    className="text-12 text-gray-500 fw-medium py-10 text-center"
                    style={{ color: "#22c55e" }}
                  >
                    ✓ Correct
                  </th>
                  <th
                    className="text-12 text-gray-500 fw-medium py-10 text-center"
                    style={{ color: "#ef4444" }}
                  >
                    ✗ Wrong
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                    Remaining
                  </th>
                  <th
                    className="text-12 text-gray-500 fw-medium py-10 text-center"
                    style={{ minWidth: "100px" }}
                  >
                    Accuracy %
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10">
                    Last Attempt
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.student_id}>
                    <td className="text-13 text-gray-400 fw-medium py-10 px-16">
                      {i + 1}
                    </td>
                    <td className="text-13 fw-semibold text-gray-800 py-10">
                      {row.student_name}
                    </td>
                    <td
                      className="text-12 text-gray-500 py-10"
                      style={{
                        maxWidth: "140px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.college || "—"}
                    </td>
                    <td className="py-10">
                      <span className="text-11 bg-main-50 text-main-700 py-2 px-8 rounded-pill fw-medium">
                        {row.batch_title || "—"}
                      </span>
                    </td>
                    <td className="py-10">
                      <span className="text-11 bg-info-50 text-info-700 py-2 px-8 rounded-pill fw-medium">
                        {row.phase_title || "—"}
                      </span>
                    </td>
                    <td className="text-13 fw-semibold text-gray-700 py-10 text-center">
                      {row.attempted}
                      <span className="text-gray-400 text-11 fw-normal">
                        {" "}
                        /{totalQ}
                      </span>
                    </td>
                    <td
                      className="text-13 fw-semibold py-10 text-center"
                      style={{ color: "#22c55e" }}
                    >
                      {row.correct}
                    </td>
                    <td
                      className="text-13 fw-semibold py-10 text-center"
                      style={{ color: "#ef4444" }}
                    >
                      {row.wrong}
                    </td>
                    <td className="text-13 text-gray-400 py-10 text-center">
                      {totalQ - row.attempted}
                    </td>
                    <td className="py-10 text-center">
                      <span
                        className="text-13 fw-bold"
                        style={{ color: pctColor(row.accuracy_pct) }}
                      >
                        {row.accuracy_pct}%
                      </span>
                      <div className="progress mt-4" style={{ height: "3px" }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${row.accuracy_pct}%`,
                            background: pctColor(row.accuracy_pct),
                          }}
                        />
                      </div>
                    </td>
                    <td
                      className="text-12 text-gray-500 py-10"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {row.last_attempted
                        ? new Date(row.last_attempted).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
