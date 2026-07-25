import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { getQuizResults, getAllBatch, getAllPhase } from "../../../apis/apis";

export default function QuizResultsModal({ test, onClose }) {
  const [batchId, setBatchId] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [page, setPage] = useState(1);
  const limit = 25;

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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["quizResults", test?.test_id, batchId, phaseId, page],
    queryFn: () =>
      getQuizResults({
        test_id: test?.test_id,
        batch_id: batchId,
        phase_id: phaseId,
        page,
        limit,
      }),
    staleTime: 30 * 1000,
    keepPreviousData: true,
    enabled: !!test?.test_id,
  });

  const rows = data?.data || [];
  const { total = 0, totalPages = 1 } = data?.pagination || {};

  // Only show batches/phases this test is assigned to
  const tests = data?.tests || [];
  const assignedBatches = [
    ...new Map(
      tests
        .filter((t) => String(t.test_id) === String(test?.test_id) && t.tbl_batch)
        .map((t) => [
          t.tbl_batch,
          { id: t.tbl_batch, batch_title: t.batch_title },
        ]),
    ).values(),
  ];
  const assignedPhases = [
    ...new Map(
      tests
        .filter((t) => String(t.test_id) === String(test?.test_id) && t.tbl_phase)
        .map((t) => [t.tbl_phase, { id: t.tbl_phase, title: t.phase_title }]),
    ).values(),
  ];

  const scoreColor = (pct) =>
    pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

  const pageNums = () => {
    const nums = [],
      s = Math.max(1, page - 2),
      e = Math.min(totalPages, page + 2);
    for (let i = s; i <= e; i++) nums.push(i);
    return nums;
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.55)",
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
          maxWidth: "1000px",
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
            <h5 className="fw-bold mb-2 text-gray-800">{test?.test_name}</h5>
            <p className="text-13 text-gray-400 mb-0">
              {total.toLocaleString()} student{total !== 1 ? "s" : ""} attempted
              {isFetching && !isLoading && (
                <span className="ms-8 text-gray-300">Updating...</span>
              )}
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
              setPage(1);
            }}
          >
            <option value="">All Batches</option>
            {(assignedBatches.length > 0 ? assignedBatches : batches).map(
              (b) => (
                <option key={b.test_id} value={b.test_id}>
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
              setPage(1);
            }}
          >
            <option value="">All Phases</option>
            {(assignedPhases.length > 0 ? assignedPhases : phases).map((p) => (
              <option key={p.test_id} value={p.test_id}>
                {p.title}
              </option>
            ))}
          </select>
          {(batchId || phaseId) && (
            <button
              className="btn btn-sm rounded-pill flex-align gap-4"
              style={{
                background: "#ef8f8f",
                color: "#dc2626",
                border: "none",
              }}
              onClick={() => {
                setBatchId("");
                setPhaseId("");
                setPage(1);
              }}
            >
              <i className="ph ph-x text-11" /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowY: "auto", flex: 1 }}>
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
                <th className="text-12 text-gray-500 fw-medium py-10">Batch</th>
                <th className="text-12 text-gray-500 fw-medium py-10">Phase</th>
                <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                  ✓ Correct
                </th>
                <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                  ✗ Wrong
                </th>
                <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                  – Skip
                </th>
                <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                  Marks
                </th>
                <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                  Score%
                </th>
                <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                  Accuracy%
                </th>
                <th className="text-12 text-gray-500 fw-medium py-10">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 12 }).map((__, j) => (
                      <td key={j} className="py-10 px-16">
                        <div
                          className="bg-gray-100 rounded"
                          style={{
                            height: "13px",
                            width: j === 0 ? "20px" : "75%",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center text-gray-400 py-40">
                    <i className="ph ph-users text-48 d-block mb-10 text-gray-300" />
                    No results found
                  </td>
                </tr>
              )}

              {!isLoading &&
                rows.map((row, i) => (
                  <tr key={row.test_id} className={isFetching ? "opacity-50" : ""}>
                    <td className="text-13 text-gray-400 fw-medium py-10 px-16">
                      {total - ((page - 1) * limit + i)}
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
                    <td
                      className="text-13 fw-semibold py-10 text-center"
                      style={{ color: "#22c55e" }}
                    >
                      {row.total_correct}
                    </td>
                    <td
                      className="text-13 fw-semibold py-10 text-center"
                      style={{ color: "#ef4444" }}
                    >
                      {row.total_incorrect}
                    </td>
                    <td className="text-13 text-gray-400 py-10 text-center">
                      {row.total_skipped}
                    </td>
                    <td className="text-13 fw-semibold py-10 text-center">
                      {row.obtained_marks}
                      <span className="text-gray-400 fw-normal text-11">
                        {" "}
                        /{row.total_marks}
                      </span>
                    </td>
                    <td className="py-10 text-center">
                      <span
                        className="text-13 fw-bold"
                        style={{ color: scoreColor(row.score_pct) }}
                      >
                        {row.score_pct}%
                      </span>
                    </td>
                    <td className="py-10 text-center">
                      <span
                        className="text-13 fw-bold"
                        style={{ color: scoreColor(row.accuracy_pct) }}
                      >
                        {row.accuracy_pct}%
                      </span>
                    </td>
                    <td
                      className="text-12 text-gray-500 py-10"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {row.result_gen_datetime
                        ? new Date(row.result_gen_datetime).toLocaleString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )
                        : "—"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex-between flex-wrap gap-8 p-16 border-top border-gray-100"
            style={{ flexShrink: 0 }}
          >
            <p className="text-13 text-gray-500 mb-0">
              Showing <strong>{(page - 1) * limit + 1}</strong>–
              <strong>{Math.min(page * limit, total)}</strong> of{" "}
              <strong>{total}</strong>
            </p>
            <div className="flex-align gap-4">
              <button
                className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                <i className="ph ph-caret-double-left text-12" />
              </button>
              <button
                className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                <i className="ph ph-caret-left text-12" />
              </button>
              {pageNums().map((n) => (
                <button
                  key={n}
                  className={`btn btn-sm rounded-pill px-12 py-4 ${n === page ? "btn-main" : "btn-secondary"}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                <i className="ph ph-caret-right text-12" />
              </button>
              <button
                className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                <i className="ph ph-caret-double-right text-12" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
