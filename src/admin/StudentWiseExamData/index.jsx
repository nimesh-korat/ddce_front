import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getStudentWiseExamData,
  getAllBatch,
  getAllPhase,
} from "../../apis/apis";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function StudentWiseExamData() {
  const navigate = useNavigate();
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [batchId, setBatchId] = useState("");
  const [type, setType] = useState("all");
  const [phaseId, setPhaseId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  // Comparison filters
  const [attOp, setAttOp] = useState("");
  const [attVal, setAttVal] = useState("");
  const [corOp, setCorOp] = useState("");
  const [corVal, setCorVal] = useState("");
  const [wrgOp, setWrgOp] = useState("");
  const [wrgVal, setWrgVal] = useState("");
  const [accOp, setAccOp] = useState("");
  const [accVal, setAccVal] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("accuracy");
  const [dir, setDir] = useState("desc");

  const dSearch = useDebounce(search);
  const dCollege = useDebounce(college);
  const dDepartment = useDebounce(department);

  const resetPage = () => setPage(1);

  // Batches for filter dropdown
  const { data: batchData } = useQuery({
    queryKey: ["allBatch"],
    queryFn: () => getAllBatch(),
    staleTime: 5 * 60 * 1000,
  });
  const batches = batchData?.data || [];

  const { data: phaseData } = useQuery({
    queryKey: ["allPhase"],
    queryFn: () => getAllPhase(),
    staleTime: 5 * 60 * 1000,
  });
  const phases = phaseData?.data || [];

  // Main data query
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [
      "studentWiseExamData",
      dSearch,
      dCollege,
      dDepartment,
      batchId,
      phaseId,
      type,
      dateFrom,
      dateTo,
      attOp,
      attVal,
      corOp,
      corVal,
      wrgOp,
      wrgVal,
      accOp,
      accVal,
      limit,
      page,
      sort,
      dir,
    ],
    queryFn: () =>
      getStudentWiseExamData({
        page,
        limit,
        sort,
        dir,
        type,
        ...(dSearch && { search: dSearch }),
        ...(dCollege && { college: dCollege }),
        ...(dDepartment && { department: dDepartment }),
        ...(batchId && { batch_id: batchId }),
        ...(phaseId && { phase_id: phaseId }),
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
        ...(attOp && attVal !== "" && { att_op: attOp, att_val: attVal }),
        ...(corOp && corVal !== "" && { cor_op: corOp, cor_val: corVal }),
        ...(wrgOp && wrgVal !== "" && { wrg_op: wrgOp, wrg_val: wrgVal }),
        ...(accOp && accVal !== "" && { acc_op: accOp, acc_val: accVal }),
      }),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });

  const rows = data?.data || [];
  const pagination = data?.pagination || {};
  const { total = 0, totalPages = 1 } = pagination;

  const handleSort = (col) => {
    if (sort === col) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(col);
      setDir("asc");
    }
    setPage(1);
  };

  const sortIcon = (col) => {
    if (sort !== col)
      return <i className="ph ph-arrows-down-up text-gray-300 ms-4 text-12" />;
    return dir === "asc" ? (
      <i className="ph ph-arrow-up text-main-600 ms-4 text-12" />
    ) : (
      <i className="ph ph-arrow-down text-main-600 ms-4 text-12" />
    );
  };

  const pageNumbers = () => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const accuracyColor = (pct) => {
    if (pct >= 75) return "text-success-600";
    if (pct >= 50) return "text-warning-600";
    return "text-danger-600";
  };

  const clearFilters = () => {
    setSearch("");
    setCollege("");
    setDepartment("");
    setBatchId("");
    setPhaseId("");
    setType("all");
    setDateFrom("");
    setDateTo("");
    setAttOp("");
    setAttVal("");
    setCorOp("");
    setCorVal("");
    setWrgOp("");
    setWrgVal("");
    setAccOp("");
    setAccVal("");
    setPage(1);
  };

  const hasFilters =
    search ||
    college ||
    department ||
    batchId ||
    phaseId ||
    type !== "all" ||
    dateFrom ||
    dateTo ||
    attVal ||
    corVal ||
    wrgVal ||
    accVal;

  return (
    <>
      <AdminSidebar
        isActive={isSidebarActive}
        closeSidebar={() => setIsSidebarActive(false)}
      />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={() => setIsSidebarActive((p) => !p)} />
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
                  Student Wise Exam Data
                </span>
              </li>
            </ul>
          </div>

          {/* Filters */}
          <div className="card mb-16">
            <div className="card-body p-16">
              <div className="row g-12 align-items-end">
                {/* Search */}
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
                      onChange={(e) => {
                        setSearch(e.target.value);
                        resetPage();
                      }}
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
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    College
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Filter college..."
                    value={college}
                    onChange={(e) => {
                      setCollege(e.target.value);
                      resetPage();
                    }}
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
                    placeholder="Filter dept..."
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      resetPage();
                    }}
                  />
                </div>
                {/* Batch */}
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    Batch
                  </label>
                  <select
                    className="form-control form-control-sm"
                    value={batchId}
                    onChange={(e) => {
                      setBatchId(e.target.value);
                      resetPage();
                    }}
                  >
                    <option value="">All Batches</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batch_title}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Phase */}
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    Phase
                  </label>
                  <select
                    className="form-control form-control-sm"
                    value={phaseId}
                    onChange={(e) => {
                      setPhaseId(e.target.value);
                      resetPage();
                    }}
                  >
                    <option value="">All Phases</option>
                    {phases.map((p) => (
                      <option key={p.Id} value={p.Id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Type */}
                <div className="col-md-1">
                  <label className="form-label fw-medium text-13 mb-4">
                    Type
                  </label>
                  <select
                    className="form-control form-control-sm"
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      resetPage();
                    }}
                  >
                    <option value="all">All</option>
                    <option value="test">Test</option>
                    <option value="practice">Practice</option>
                  </select>
                </div>
                {/* Rows */}
                <div className="col-md-1">
                  <label className="form-label fw-medium text-13 mb-4">
                    Rows
                  </label>
                  <select
                    className="form-control form-control-sm"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      resetPage();
                    }}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                {/* Clear */}
                {hasFilters && (
                  <div className="col-md-1">
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-pill w-100"
                      onClick={clearFilters}
                      title="Clear filters"
                    >
                      <i className="ph ph-x" />
                    </button>
                  </div>
                )}
              </div>

              {/* Date range + Comparison filters */}
              <div className="row g-12 mt-4 align-items-end">
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    From Date
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      resetPage();
                    }}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      resetPage();
                    }}
                  />
                </div>

                {/* Comparison: Total Attempted */}
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    Total Attempted
                  </label>
                  <div className="d-flex gap-4">
                    <select
                      className="form-control form-control-sm"
                      style={{ width: "60px", flexShrink: 0 }}
                      value={attOp}
                      onChange={(e) => {
                        setAttOp(e.target.value);
                        resetPage();
                      }}
                    >
                      <option value="">—</option>
                      <option value=">">{">"}</option>
                      <option value="<">{"<"}</option>
                      <option value="=">{"="}</option>
                    </select>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="500"
                      value={attVal}
                      onChange={(e) => {
                        setAttVal(e.target.value);
                        resetPage();
                      }}
                    />
                  </div>
                </div>

                {/* Comparison: Total Correct */}
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    Total Correct
                  </label>
                  <div className="d-flex gap-4">
                    <select
                      className="form-control form-control-sm"
                      style={{ width: "60px", flexShrink: 0 }}
                      value={corOp}
                      onChange={(e) => {
                        setCorOp(e.target.value);
                        resetPage();
                      }}
                    >
                      <option value="">—</option>
                      <option value=">">{">"}</option>
                      <option value="<">{"<"}</option>
                      <option value="=">{"="}</option>
                    </select>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="300"
                      value={corVal}
                      onChange={(e) => {
                        setCorVal(e.target.value);
                        resetPage();
                      }}
                    />
                  </div>
                </div>

                {/* Comparison: Total Wrong */}
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    Total Wrong
                  </label>
                  <div className="d-flex gap-4">
                    <select
                      className="form-control form-control-sm"
                      style={{ width: "60px", flexShrink: 0 }}
                      value={wrgOp}
                      onChange={(e) => {
                        setWrgOp(e.target.value);
                        resetPage();
                      }}
                    >
                      <option value="">—</option>
                      <option value=">">{">"}</option>
                      <option value="<">{"<"}</option>
                      <option value="=">{"="}</option>
                    </select>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="100"
                      value={wrgVal}
                      onChange={(e) => {
                        setWrgVal(e.target.value);
                        resetPage();
                      }}
                    />
                  </div>
                </div>

                {/* Comparison: Accuracy */}
                <div className="col-md-2">
                  <label className="form-label fw-medium text-13 mb-4">
                    Accuracy %
                  </label>
                  <div className="d-flex gap-4">
                    <select
                      className="form-control form-control-sm"
                      style={{ width: "60px", flexShrink: 0 }}
                      value={accOp}
                      onChange={(e) => {
                        setAccOp(e.target.value);
                        resetPage();
                      }}
                    >
                      <option value="">—</option>
                      <option value=">">{">"}</option>
                      <option value="<">{"<"}</option>
                      <option value="=">{"="}</option>
                    </select>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="75"
                      value={accVal}
                      onChange={(e) => {
                        setAccVal(e.target.value);
                        resetPage();
                      }}
                    />
                  </div>
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
                  <strong>{total.toLocaleString()}</strong> students
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
                  Failed to load data.
                </div>
              )}

              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="text-12 text-gray-500 fw-medium py-12 px-16"
                        style={{ whiteSpace: "nowrap", width: "50px" }}
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
                        className="text-12 text-gray-500 fw-medium py-12 text-center cursor-pointer user-select-none"
                        onClick={() => handleSort("attempted")}
                      >
                        Total Attempted {sortIcon("attempted")}
                      </th>
                      <th
                        className="text-12 text-gray-500 fw-medium py-12 text-center cursor-pointer user-select-none"
                        onClick={() => handleSort("correct")}
                      >
                        Total Correct {sortIcon("correct")}
                      </th>
                      <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                        Total Wrong
                      </th>

                      <th
                        className="text-12 text-gray-500 fw-medium py-12 text-center cursor-pointer user-select-none"
                        onClick={() => handleSort("accuracy")}
                        style={{ minWidth: "90px" }}
                      >
                        Accuracy {sortIcon("accuracy")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading &&
                      Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 9 }).map((__, j) => (
                            <td key={j} className="py-12 px-16">
                              <div
                                className="bg-gray-100 rounded"
                                style={{
                                  height: "14px",
                                  width: j === 0 ? "24px" : "70%",
                                }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}

                    {!isLoading && rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={12}
                          className="text-center text-gray-400 py-48"
                        >
                          <i className="ph ph-users text-48 d-block mb-12 text-gray-300" />
                          No students found
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
                          key={row.student_id}
                          className={isFetching ? "opacity-50" : ""}
                        >
                          <td
                            className="text-13 text-gray-400 py-12 px-16 fw-medium"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {total - ((page - 1) * limit + i)}
                          </td>
                          <td className="text-13 fw-medium py-12">
                            <button
                              className="btn btn-link p-0 text-main-600 fw-medium text-13 text-start"
                              onClick={() =>
                                navigate(
                                  `/admin/studentProfile/${row.student_id}`,
                                )
                              }
                              style={{ textDecoration: "none" }}
                            >
                              {row.student_name}
                              <i className="ph ph-arrow-square-out ms-4 text-11 text-gray-400" />
                            </button>
                          </td>
                          <td className="text-13 text-gray-600 py-12">
                            {row.college}
                          </td>
                          <td className="text-13 text-gray-600 py-12">
                            {row.department}
                          </td>

                          <td className="text-13 py-12 text-center fw-medium">
                            {row.total_attempted?.toLocaleString() || "0"}
                          </td>
                          <td className="text-13 py-12 text-center text-success-600 fw-medium">
                            {row.total_correct?.toLocaleString() || "0"}
                          </td>
                          <td className="text-13 py-12 text-center text-danger-600 fw-medium">
                            {row.total_incorrect?.toLocaleString() || "0"}
                          </td>

                          <td className="py-12 text-center">
                            <span
                              className={`text-13 fw-bold ${accuracyColor(row.accuracy_pct)}`}
                            >
                              {row.accuracy_pct}%
                            </span>
                            <div
                              className="progress mt-4"
                              style={{ height: "4px", minWidth: "60px" }}
                            >
                              <div
                                className={`progress-bar ${row.accuracy_pct >= 75 ? "bg-success" : row.accuracy_pct >= 50 ? "bg-warning" : "bg-danger"}`}
                                style={{ width: `${row.accuracy_pct}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
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
                    {pageNumbers().map((n) => (
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
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default StudentWiseExamData;
