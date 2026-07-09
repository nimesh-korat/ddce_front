import React, { useState, useCallback } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { getStudentAnswers } from "../../apis/apis";

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

// Debounce hook
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function StudentAnswers() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  // ── Filter state ──────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [type, setType] = useState("all");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("datetime");
  const [dir, setDir] = useState("desc");

  // Debounce text inputs to avoid firing on every keystroke
  const dSearch = useDebounce(search);
  const dCollege = useDebounce(college);
  const dDepartment = useDebounce(department);

  // Reset to page 1 whenever filters change
  const handleFilterChange = useCallback(
    (setter) => (e) => {
      setter(e.target.value);
      setPage(1);
    },
    [],
  );

  // ── Sort handler ──────────────────────────────────────────
  const handleSort = (col) => {
    if (sort === col) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(col);
      setDir("asc");
    }
    setPage(1);
  };

  const sortIcon = (col) => {
    if (sort !== col)
      return <i className="ph ph-arrows-down-up text-gray-300 ms-4 text-12" />;
    return sort && dir === "asc" ? (
      <i className="ph ph-arrow-up text-main-600 ms-4 text-12" />
    ) : (
      <i className="ph ph-arrow-down text-main-600 ms-4 text-12" />
    );
  };

  // ── Fetch ─────────────────────────────────────────────────
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [
      "studentAnswers",
      dSearch,
      dCollege,
      dDepartment,
      type,
      limit,
      page,
      sort,
      dir,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit,
        sort,
        dir,
        type,
        ...(dSearch && { search: dSearch }),
        ...(dCollege && { college: dCollege }),
        ...(dDepartment && { department: dDepartment }),
      });
      return getStudentAnswers({
        page,
        limit,
        sort,
        dir,
        type,
        ...(dSearch && { search: dSearch }),
        ...(dCollege && { college: dCollege }),
        ...(dDepartment && { department: dDepartment }),
      });
    },
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });

  const rows = data?.data || [];
  const pagination = data?.pagination || {};
  const { total = 0, totalPages = 1 } = pagination;

  // ── Pagination helpers ────────────────────────────────────
  const pageNumbers = () => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const resultBadge = (result) => {
    if (result === "Correct") return "bg-success-50 text-success-700";
    if (result === "Incorrect") return "bg-danger-50 text-danger-700";
    return "bg-gray-50 text-gray-500";
  };

  const typeBadge = (t) =>
    t === "test"
      ? "bg-main-50 text-main-700"
      : "bg-warning-50 text-warning-700";

  const clearFilters = () => {
    setSearch("");
    setCollege("");
    setDepartment("");
    setType("all");
    setPage(1);
  };

  const hasFilters = search || college || department || type !== "all";

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          {/* Breadcrumb */}
          <div className="breadcrumb mb-24">
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
                <span className="text-gray-500 fw-normal d-flex">
                  <i className="ph ph-caret-right" />
                </span>
              </li>
              <li>
                <span className="text-main-600 fw-normal text-15">
                  Student Answers
                </span>
              </li>
            </ul>
          </div>

          {/* Filters */}
          <div className="card mb-16">
            <div className="card-body p-16">
              <div className="row g-12 align-items-end">
                {/* Search by name */}
                <div className="col-md-3">
                  <label className="form-label fw-medium text-13 mb-4">
                    Student Name
                  </label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-sm ps-36"
                      placeholder="Search name..."
                      value={search}
                      onChange={handleFilterChange(setSearch)}
                    />
                    <i
                      className="ph ph-magnifying-glass position-absolute text-gray-400"
                      style={{
                        top: "50%",
                        left: "10px",
                        transform: "translateY(-50%)",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>

                {/* College */}
                <div className="col-md-3">
                  <label className="form-label fw-medium text-13 mb-4">
                    College
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Filter by college..."
                    value={college}
                    onChange={handleFilterChange(setCollege)}
                  />
                </div>

                {/* Department */}
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    Department
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Filter by dept..."
                    value={department}
                    onChange={handleFilterChange(setDepartment)}
                  />
                </div>

                {/* Type */}
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    Type
                  </label>
                  <select
                    className="form-control form-control-sm"
                    value={type}
                    onChange={handleFilterChange(setType)}
                  >
                    <option value="all">All</option>
                    <option value="test">Test Only</option>
                    <option value="practice">Practice Only</option>
                  </select>
                </div>

                {/* Rows per page */}
                <div className="col-md-1">
                  <label className="form-label fw-medium text-13 mb-4">
                    Rows
                  </label>
                  <select
                    className="form-control form-control-sm"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                {/* Clear */}
                <div className="col-md-1">
                  {hasFilters && (
                    <button
                      className="btn btn-sm btn-secondary rounded-pill w-100"
                      onClick={clearFilters}
                      title="Clear filters"
                    >
                      <i className="ph ph-x" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex-between flex-wrap gap-8 mb-12">
            <p className="text-14 text-gray-600 mb-0">
              {isFetching && !isLoading ? (
                <span className="text-gray-400">Updating...</span>
              ) : (
                <>
                  <strong>{total.toLocaleString()}</strong> total records
                </>
              )}
            </p>
            <p className="text-13 text-gray-400 mb-0">
              Page {page} of {totalPages}
            </p>
          </div>

          {/* Table */}
          <div className="card border border-gray-100">
            <div className="card-body p-0">
              {isError && (
                <div className="alert alert-danger m-16">
                  Failed to load data. Please try again.
                </div>
              )}

              <div className="table-responsive" style={{ minHeight: "400px" }}>
                <MathJaxContext config={mathConfig}>
                  <table className="table table-hover mb-0">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="text-12 text-gray-500 fw-medium py-12 px-16"
                          style={{ width: "60px", whiteSpace: "nowrap" }}
                        >
                          #
                        </th>
                        <th
                          className="text-12 text-gray-500 fw-medium py-12 cursor-pointer user-select-none"
                          onClick={() => handleSort("name")}
                          style={{ minWidth: "150px" }}
                        >
                          Student Name {sortIcon("name")}
                        </th>
                        <th
                          className="text-12 text-gray-500 fw-medium py-12 cursor-pointer user-select-none"
                          onClick={() => handleSort("college")}
                          style={{ minWidth: "160px" }}
                        >
                          College {sortIcon("college")}
                        </th>
                        <th
                          className="text-12 text-gray-500 fw-medium py-12 cursor-pointer user-select-none"
                          onClick={() => handleSort("department")}
                          style={{ minWidth: "120px" }}
                        >
                          Department {sortIcon("department")}
                        </th>
                        <th
                          className="text-12 text-gray-500 fw-medium py-12"
                          style={{ width: "90px" }}
                        >
                          Question ID
                        </th>
                        <th
                          className="text-12 text-gray-500 fw-medium py-12"
                          style={{ minWidth: "140px" }}
                        >
                          Student Answer
                        </th>
                        <th
                          className="text-12 text-gray-500 fw-medium py-12 text-center"
                          style={{ width: "90px" }}
                        >
                          Type
                        </th>
                        <th
                          className="text-12 text-gray-500 fw-medium py-12 text-center"
                          style={{ width: "90px" }}
                        >
                          Result
                        </th>
                        <th
                          className="text-12 text-gray-500 fw-medium py-12 cursor-pointer user-select-none"
                          onClick={() => handleSort("datetime")}
                          style={{ width: "160px" }}
                        >
                          Answered On {sortIcon("datetime")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading &&
                        /* Skeleton rows */
                        Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i}>
                            {Array.from({ length: 9 }).map((__, j) => (
                              <td key={j} className="py-12 px-16">
                                <div
                                  className="bg-gray-100 rounded"
                                  style={{
                                    height: "14px",
                                    width: j === 0 ? "24px" : "80%",
                                    animationDuration: "1.5s",
                                  }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}

                      {!isLoading && rows.length === 0 && (
                        <tr>
                          <td
                            colSpan={9}
                            className="text-center text-gray-400 py-48"
                          >
                            <i className="ph ph-database text-48 d-block mb-12 text-gray-300" />
                            No records found
                            {hasFilters && (
                              <button
                                className="btn btn-sm btn-link d-block mx-auto mt-8"
                                onClick={clearFilters}
                              >
                                Clear filters
                              </button>
                            )}
                          </td>
                        </tr>
                      )}

                      {!isLoading &&
                        rows.map((row, i) => (
                          <tr
                            key={`${row.question_type}-${row.answer_id}`}
                            className={isFetching ? "opacity-50" : ""}
                          >
                            <td
                              className="text-13 text-gray-400 py-12 px-16 fw-medium"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {total - ((page - 1) * limit + i)}
                            </td>
                            <td className="text-13 fw-medium text-gray-800 py-12">
                              {row.student_name}
                            </td>
                            <td className="text-13 text-gray-600 py-12">
                              {row.college_name}
                            </td>
                            <td className="text-13 text-gray-600 py-12">
                              {row.department}
                            </td>
                            <td className="text-13 text-gray-600 py-12">
                              {row.question_id}
                            </td>
                            <td
                              className="text-13 text-gray-700 py-12"
                              style={{
                                maxWidth: "180px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={row.std_answer}
                            >
                              {row.std_answer ? (
                                <MathJax dynamic inline>
                                  {row.std_answer}
                                </MathJax>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                            <td className="py-12 text-center">
                              <span
                                className={`text-11 py-2 px-10 rounded-pill fw-semibold ${typeBadge(row.question_type)}`}
                              >
                                {row.question_type === "test"
                                  ? "Test"
                                  : "Practice"}
                              </span>
                            </td>
                            <td className="py-12 text-center">
                              <span
                                className={`text-11 py-2 px-10 rounded-pill fw-semibold ${resultBadge(row.result)}`}
                              >
                                {row.result}
                              </span>
                            </td>
                            <td className="text-12 text-gray-500 py-12">
                              {row.answered_on
                                ? new Date(row.answered_on).toLocaleString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
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
                </MathJaxContext>
              </div>

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="flex-between flex-wrap gap-8 p-16 border-top border-gray-100">
                  <p className="text-13 text-gray-500 mb-0">
                    Showing <strong>{(page - 1) * limit + 1}</strong>–
                    <strong>{Math.min(page * limit, total)}</strong> of{" "}
                    <strong>{total.toLocaleString()}</strong>
                  </p>

                  <div className="flex-align gap-4">
                    {/* First */}
                    <button
                      className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                    >
                      <i className="ph ph-caret-double-left text-12" />
                    </button>
                    {/* Prev */}
                    <button
                      className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                    >
                      <i className="ph ph-caret-left text-12" />
                    </button>

                    {/* Page numbers */}
                    {pageNumbers().map((n) => (
                      <button
                        key={n}
                        className={`btn btn-sm rounded-pill px-12 py-4 ${n === page ? "btn-main" : "btn-secondary"}`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    ))}

                    {/* Next */}
                    <button
                      className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === totalPages}
                    >
                      <i className="ph ph-caret-right text-12" />
                    </button>
                    {/* Last */}
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
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default StudentAnswers;
