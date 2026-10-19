import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getQuizResults, getAllBatch, getAllPhase } from "../../apis/apis";

function QuizResultsTab() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [testId, setTestId] = useState("");
  const [testSearch, setTestSearch] = useState("");
  const [testDropdownOpen, setTestDropdownOpen] = useState(false);
  const [batchId, setBatchId] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [notAttempted, setNotAttempted] = useState(false);
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

  // Always fetch tests list for dropdown
  const { data: testsData } = useQuery({
    queryKey: ["quizResultsTests"],
    queryFn: () => getQuizResults({}),
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["quizResults", testId, batchId, phaseId, notAttempted, page],
    queryFn: () =>
      getQuizResults({
        test_id: testId,
        batch_id: batchId,
        phase_id: phaseId,
        not_attempted: notAttempted ? "1" : undefined,
        page,
        limit,
      }),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
    enabled: !!testId,
  });

  const tests = testsData?.tests || [];
  const rows = data?.data || [];
  const isNotAttemptedMode = data?.not_attempted === true;
  const { total = 0, totalPages = 1 } = data?.pagination || {};

  // Batches/phases specifically assigned this test
  const assignedBatches = testId
    ? [
        ...new Map(
          tests
            .filter((t) => String(t.id) === testId && t.tbl_batch)
            .map((t) => [
              t.tbl_batch,
              { id: t.tbl_batch, batch_title: t.batch_title },
            ]),
        ).values(),
      ]
    : [];
  const assignedPhases = testId
    ? [
        ...new Map(
          tests
            .filter((t) => String(t.id) === testId && t.tbl_phase)
            .map((t) => [
              t.tbl_phase,
              { id: t.tbl_phase, title: t.phase_title },
            ]),
        ).values(),
      ]
    : [];

  const scoreColor = (pct) =>
    pct >= 75
      ? "text-success-600"
      : pct >= 50
        ? "text-warning-600"
        : "text-danger-600";

  const pageNums = () => {
    const nums = [],
      s = Math.max(1, page - 2),
      e = Math.min(totalPages, page + 2);
    for (let i = s; i <= e; i++) nums.push(i);
    return nums;
  };

  const handleTestChange = (val) => {
    setTestId(val);
    setTestSearch("");
    setBatchId("");
    setPhaseId("");
    setNotAttempted(false);
    setPage(1);
  };

  const uniqueTests = [...new Map(tests.map((t) => [t.id, t])).values()];
  const filteredTests = testSearch
    ? uniqueTests.filter((t) =>
        t.test_name.toLowerCase().includes(testSearch.toLowerCase()),
      )
    : uniqueTests;

  return (
    <>
      <AdminSidebar
        isActive={isSidebarActive}
        closeSidebar={() => setIsSidebarActive(false)}
      />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={() => setIsSidebarActive((p) => !p)} />
        <div className="dashboard-body">
          {/* Breadcrumb + tab links */}
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
                    to="/admin/showTests"
                    className="text-gray-400 fw-normal text-15 hover-text-main-600"
                  >
                    Show Quiz
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500 d-flex">
                    <i className="ph ph-caret-right" />
                  </span>
                </li>
                <li>
                  <span className="text-main-600 fw-normal text-15">
                    Quiz Results
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex-align gap-8">
              <Link
                to="/admin/showTests"
                className="btn btn-outline-secondary rounded-pill py-8 px-16 text-13"
              >
                <i className="ph ph-clipboard-text me-6" /> Show Quiz
              </Link>
              <Link
                to="/admin/quizResults"
                className="btn btn-main rounded-pill py-8 px-16 text-13"
              >
                <i className="ph ph-chart-bar me-6" /> Quiz Results
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="card border border-gray-100 mb-20 shadow-sm">
            <div className="card-body p-16">
              <div className="row g-12 align-items-end">
                <div className="col-lg-4 col-md-12">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Quiz / Test
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: "8px",
                        background: "#f8fafc",
                        height: "40px",
                        padding: "0 10px",
                        gap: "6px",
                      }}
                    >
                      <i className="ph ph-magnifying-glass text-gray-400 text-14" />
                      <input
                        type="text"
                        placeholder={
                          testId
                            ? uniqueTests.find((t) => String(t.id) === testId)
                                ?.test_name || "Search quiz..."
                            : "Search quiz..."
                        }
                        value={testSearch}
                        onChange={(e) => {
                          setTestSearch(e.target.value);
                          setTestDropdownOpen(true);
                        }}
                        onFocus={() => {
                          if (testId) {
                            setTestId("");
                            setTestSearch("");
                          }
                          setTestDropdownOpen(true);
                        }}
                        onBlur={() =>
                          setTimeout(() => setTestDropdownOpen(false), 150)
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          outline: "none",
                          flex: 1,
                          fontSize: "14px",
                          color: "#374151",
                        }}
                      />
                      {(testSearch || testId) && (
                        <button
                          onClick={() => {
                            setTestId("");
                            setTestSearch("");
                            setBatchId("");
                            setPhaseId("");
                            setPage(1);
                          }}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            padding: 0,
                            color: "#9ca3af",
                          }}
                        >
                          <i className="ph ph-x text-12" />
                        </button>
                      )}
                    </div>
                    {testDropdownOpen && !testId && (
                      <div
                        style={{
                          position: "absolute",
                          top: "44px",
                          left: 0,
                          right: 0,
                          background: "#fff",
                          border: "1.5px solid #e2e8f0",
                          borderRadius: "8px",
                          zIndex: 100,
                          maxHeight: "220px",
                          overflowY: "auto",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      >
                        {filteredTests.length === 0 ? (
                          <div className="text-13 text-gray-400 px-12 py-10">
                            No quizzes found
                          </div>
                        ) : (
                          filteredTests.map((t) => (
                            <div
                              key={t.id}
                              onMouseDown={() => handleTestChange(String(t.id))}
                              style={{
                                padding: "9px 12px",
                                fontSize: "13px",
                                cursor: "pointer",
                                borderBottom: "1px solid #f1f5f9",
                                color: "#374151",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#f8fafc")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  "transparent")
                              }
                            >
                              {t.test_name}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Batch
                  </label>
                  <select
                    className="form-select rounded-8"
                    style={{
                      height: "40px",
                      fontSize: "14px",
                      border: "1.5px solid #e2e8f0",
                      background: "#f8fafc",
                    }}
                    value={batchId}
                    onChange={(e) => {
                      setBatchId(e.target.value);
                      setPage(1);
                    }}
                    disabled={!testId}
                  >
                    <option value="">All Batches</option>
                    {(assignedBatches.length > 0
                      ? assignedBatches
                      : batches
                    ).map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batch_title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-3 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Phase
                  </label>
                  <select
                    className="form-select rounded-8"
                    style={{
                      height: "40px",
                      fontSize: "14px",
                      border: "1.5px solid #e2e8f0",
                      background: "#f8fafc",
                    }}
                    value={phaseId}
                    onChange={(e) => {
                      setPhaseId(e.target.value);
                      setPage(1);
                    }}
                    disabled={!testId}
                  >
                    <option value="">All Phases</option>
                    {(assignedPhases.length > 0 ? assignedPhases : phases).map(
                      (p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div className="col-auto d-flex align-items-end gap-8">
                  {/* Not Attempted toggle */}
                  {testId && (
                    <button
                      className="btn rounded-8 fw-medium"
                      style={{
                        height: "40px",
                        background: notAttempted ? "#fef3c7" : "#f1f5f9",
                        color: notAttempted ? "#b45309" : "#64748b",
                        border: notAttempted
                          ? "1.5px solid #fbbf24"
                          : "1.5px solid #e2e8f0",
                        fontSize: "13px",
                        padding: "0 16px",
                        whiteSpace: "nowrap",
                      }}
                      onClick={() => {
                        setNotAttempted((p) => !p);
                        setPage(1);
                      }}
                    >
                      <i
                        className={`ph ${notAttempted ? "ph-eye-slash" : "ph-user-minus"} me-6`}
                      />
                      Not Attempted
                    </button>
                  )}
                  {(batchId || phaseId) && (
                    <button
                      className="btn rounded-8 fw-medium"
                      style={{
                        height: "40px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        fontSize: "13px",
                        padding: "0 16px",
                      }}
                      onClick={() => {
                        setBatchId("");
                        setPhaseId("");
                        setPage(1);
                      }}
                    >
                      <i className="ph ph-x me-4 text-12" /> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* No test selected */}
          {!testId && !isLoading && (
            <div className="card">
              <div className="card-body text-center py-56">
                <i className="ph ph-exam text-64 text-gray-300 d-block mb-16" />
                <p className="text-gray-500 mb-0">
                  Select a quiz above to view student results
                </p>
              </div>
            </div>
          )}

          {/* Results table */}
          {(testId || isLoading) && (
            <div className="card border border-gray-100 shadow-sm">
              <div className="flex-between flex-wrap gap-8 px-20 py-12 border-bottom border-gray-100">
                <p className="text-14 text-gray-600 mb-0">
                  {isFetching && !isLoading ? (
                    <span className="text-gray-400">Updating...</span>
                  ) : notAttempted ? (
                    <>
                      <strong>{total.toLocaleString()}</strong> student
                      {total !== 1 ? "s" : ""}{" "}
                      <span className="text-warning-600 fw-semibold">
                        not attempted
                      </span>
                    </>
                  ) : (
                    <>
                      <strong>{total.toLocaleString()}</strong> student
                      {total !== 1 ? "s" : ""} attempted
                    </>
                  )}
                </p>
                <p className="text-13 text-gray-400 mb-0">
                  Page {page} of {totalPages}
                </p>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="table table-hover mb-0">
                  <thead className="bg-gray-50">
                    {notAttempted ? (
                      <tr>
                        <th className="text-12 text-gray-500 fw-medium py-12 px-16">
                          #
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Student
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          College
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Batch
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Phase
                        </th>
                      </tr>
                    ) : (
                      <tr>
                        <th className="text-12 text-gray-500 fw-medium py-12 px-16">
                          #
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Student
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          College
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Batch
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Phase
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Correct
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Wrong
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Skipped
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Marks
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Score %
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Accuracy
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Submitted
                        </th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {isLoading &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: notAttempted ? 5 : 12 }).map(
                            (__, j) => (
                              <td key={j} className="py-12 px-16">
                                <div
                                  className="bg-gray-100 rounded"
                                  style={{
                                    height: "14px",
                                    width: j === 0 ? "24px" : "80%",
                                  }}
                                />
                              </td>
                            ),
                          )}
                        </tr>
                      ))}

                    {!isLoading && rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={notAttempted ? 5 : 12}
                          className="text-center text-gray-400 py-48"
                        >
                          <i className="ph ph-users text-48 d-block mb-12 text-gray-300" />
                          {notAttempted
                            ? "All assigned students have attempted this quiz"
                            : "No results found for selected filters"}
                        </td>
                      </tr>
                    )}

                    {!isLoading &&
                      notAttempted &&
                      rows.map((row, i) => (
                        <tr
                          key={row.std_id}
                          className={isFetching ? "opacity-50" : ""}
                        >
                          <td className="text-13 text-gray-400 fw-medium py-12 px-16">
                            {(page - 1) * limit + i + 1}
                          </td>
                          <td className="py-12">
                            <div className="text-13 fw-semibold text-gray-800">
                              {row.student_name}
                            </div>
                            {row.mobile_no && (
                              <div className="text-12 text-gray-400 mt-2">
                                {row.mobile_no}
                              </div>
                            )}
                          </td>
                          <td
                            className="text-13 text-gray-500 py-12"
                            style={{
                              maxWidth: "160px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.college || "—"}
                          </td>
                          <td className="py-12">
                            <span className="text-12 bg-main-50 text-main-700 py-2 px-8 rounded-pill fw-medium">
                              {row.batch_title || "—"}
                            </span>
                          </td>
                          <td className="py-12">
                            <span className="text-12 bg-info-50 text-info-700 py-2 px-8 rounded-pill fw-medium">
                              {row.phase_title || "—"}
                            </span>
                          </td>
                        </tr>
                      ))}

                    {!isLoading &&
                      !notAttempted &&
                      rows.map((row, i) => (
                        <tr
                          key={row.id}
                          className={isFetching ? "opacity-50" : ""}
                        >
                          <td className="text-13 text-gray-400 fw-medium py-12 px-16">
                            {total - ((page - 1) * limit + i)}
                          </td>
                          <td className="py-12">
                            <div className="text-13 fw-semibold text-gray-800">
                              {row.student_name}
                            </div>
                            {row.mobile_no && (
                              <div className="text-12 text-gray-400 mt-2">
                                {row.mobile_no}
                              </div>
                            )}
                          </td>
                          <td
                            className="text-13 text-gray-500 py-12"
                            style={{
                              maxWidth: "160px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.college || "—"}
                          </td>
                          <td className="py-12">
                            <span className="text-12 bg-main-50 text-main-700 py-2 px-8 rounded-pill fw-medium">
                              {row.batch_title || "—"}
                            </span>
                          </td>
                          <td className="py-12">
                            <span className="text-12 bg-info-50 text-info-700 py-2 px-8 rounded-pill fw-medium">
                              {row.phase_title || "—"}
                            </span>
                          </td>
                          <td className="text-13 text-success-600 fw-semibold py-12 text-center">
                            {row.total_correct}
                          </td>
                          <td className="text-13 text-danger-600 fw-semibold py-12 text-center">
                            {row.total_incorrect}
                          </td>
                          <td className="text-13 text-gray-400 py-12 text-center">
                            {row.total_skipped}
                          </td>
                          <td className="text-13 fw-semibold py-12 text-center">
                            {row.obtained_marks}{" "}
                            <span className="text-gray-400 fw-normal text-12">
                              / {row.total_marks}
                            </span>
                          </td>
                          <td className="py-12 text-center">
                            <span
                              className={`text-13 fw-bold ${scoreColor(row.score_pct)}`}
                            >
                              {row.score_pct}%
                            </span>
                          </td>
                          <td className="py-12 text-center">
                            <span
                              className={`text-13 fw-bold ${scoreColor(row.accuracy_pct)}`}
                            >
                              {row.accuracy_pct}%
                            </span>
                          </td>
                          <td
                            className="text-12 text-gray-500 py-12"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {row.result_gen_datetime
                              ? new Date(
                                  row.result_gen_datetime,
                                ).toLocaleString("en-IN", {
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
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex-between flex-wrap gap-8 p-16 border-top border-gray-100">
                  <p className="text-13 text-gray-500 mb-0">
                    Showing <strong>{(page - 1) * limit + 1}</strong>–
                    <strong>{Math.min(page * limit, total)}</strong> of{" "}
                    <strong>{total.toLocaleString()}</strong>
                  </p>
                  <div className="flex-align gap-4">
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-pill px-10 py-4"
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                    >
                      <i className="ph ph-caret-double-left text-12" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-pill px-10 py-4"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                    >
                      <i className="ph ph-caret-left text-12" />
                    </button>
                    {pageNums().map((n) => (
                      <button
                        key={n}
                        className={`btn btn-sm rounded-pill px-12 py-4 ${n === page ? "btn-main" : "btn-outline-secondary"}`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-pill px-10 py-4"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === totalPages}
                    >
                      <i className="ph ph-caret-right text-12" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-pill px-10 py-4"
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                    >
                      <i className="ph ph-caret-double-right text-12" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default QuizResultsTab;
