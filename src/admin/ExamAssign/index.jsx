import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminGetExamTypes,
  getStudentsForAssign,
  bulkAssignExamType,
  getAllBatch,
  getAllPhase,
} from "../../apis/apis";
import { toast } from "react-toastify";

export default function ExamAssign() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    exam_type_id: "",
    batch_id: "",
    phase_id: "",
    search: "",
  });
  const [applied, setApplied] = useState({ _loaded: true });
  const [selected, setSelected] = useState(new Set());
  const [assignTo, setAssignTo] = useState("");

  const { data: examData } = useQuery({
    queryKey: ["adminExamTypes"],
    queryFn: adminGetExamTypes,
    staleTime: 60000,
  });
  const { data: batchData } = useQuery({
    queryKey: ["allBatch"],
    queryFn: getAllBatch,
    staleTime: 60000,
  });
  const { data: phaseData } = useQuery({
    queryKey: ["allPhase"],
    queryFn: getAllPhase,
    staleTime: 60000,
  });
  const examTypes = examData?.data || [];
  const batches = batchData || [];
  const phases = phaseData || [];

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["studentsForAssign", applied],
    queryFn: () => {
      const { _loaded, ...params } = applied;
      return getStudentsForAssign(params);
    },
    staleTime: 15000,
  });
  const students = studentsData?.data || [];

  const assignMutation = useMutation({
    mutationFn: bulkAssignExamType,
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(["studentsForAssign"]);
      setSelected(new Set());
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });

  const handleApply = () => {
    setApplied({ ...filters });
    setSelected(new Set());
  };

  const toggleSelect = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleAll = () => {
    if (selected.size === students.length) setSelected(new Set());
    else setSelected(new Set(students.map((s) => s.Id)));
  };

  const handleAssign = () => {
    if (!selected.size) return toast.error("Select at least one student");
    if (!assignTo && assignTo !== 0)
      return toast.error("Select exam type to assign");
    assignMutation.mutate({
      student_ids: [...selected],
      exam_type_id: assignTo || null,
    });
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
                <span className="text-gray-500 d-flex">
                  <i className="ph ph-caret-right" />
                </span>
              </li>
              <li>
                <span className="text-main-600 fw-normal text-15">
                  Assign Exam Type
                </span>
              </li>
            </ul>
          </div>

          {/* Filter panel */}
          <div className="card border border-gray-100 shadow-sm mb-20">
            <div className="card-body p-20">
              <h6 className="fw-bold text-gray-800 mb-16 flex-align gap-8">
                <i className="ph ph-funnel text-main-600" /> Filter Students
              </h6>
              <div className="row g-12 align-items-end">
                <div className="col-lg-3 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Current Exam Type
                  </label>
                  <select
                    className="form-select rounded-8"
                    value={filters.exam_type_id}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        exam_type_id: e.target.value,
                      }))
                    }
                  >
                    <option value="">All</option>
                    <option value="null">Not Assigned</option>
                    {examTypes.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-2 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Batch
                  </label>
                  <select
                    className="form-select rounded-8"
                    value={filters.batch_id}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, batch_id: e.target.value }))
                    }
                  >
                    <option value="">All Batches</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batch_title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-2 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Phase
                  </label>
                  <select
                    className="form-select rounded-8"
                    value={filters.phase_id}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, phase_id: e.target.value }))
                    }
                  >
                    <option value="">All Phases</option>
                    {phases.map((p) => (
                      <option key={p.Id} value={p.Id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-3 col-md-6">
                  <label
                    className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Search
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-8"
                    placeholder="Name / Email / Phone"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, search: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  />
                </div>
                <div className="col-lg-2 col-md-6">
                  <button
                    className="btn btn-main rounded-8 w-100 flex-align gap-6 justify-content-center"
                    onClick={handleApply}
                  >
                    <i className="ph ph-magnifying-glass" /> Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Assign bar */}
          {students.length > 0 && (
            <div className="card border border-main-100 bg-main-50 shadow-sm mb-16">
              <div className="card-body p-14 flex-align flex-wrap gap-12">
                <span className="text-13 fw-semibold text-main-700">
                  {selected.size} student{selected.size !== 1 ? "s" : ""}{" "}
                  selected
                </span>
                <div className="flex-align gap-8 ms-auto">
                  <select
                    className="form-select form-select-sm rounded-8"
                    style={{ width: "180px" }}
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                  >
                    <option value="">Select Exam Type</option>
                    <option value="">Remove Assignment</option>
                    {examTypes.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-main btn-sm rounded-8 flex-align gap-6"
                    onClick={handleAssign}
                    disabled={assignMutation.isPending || !selected.size}
                  >
                    {assignMutation.isPending ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <i className="ph ph-check-circle" />
                    )}
                    Assign
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Students table */}
          <div className="card border border-gray-100 shadow-sm">
            <div className="flex-between px-20 py-14 border-bottom border-gray-100">
              <h6 className="fw-bold text-gray-800 mb-0">Students</h6>
              {students.length > 0 && (
                <span className="text-13 text-gray-400">
                  {students.length} found
                </span>
              )}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="table table-hover mb-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-12 px-16">
                      {students.length > 0 && (
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            selected.size === students.length &&
                            students.length > 0
                          }
                          onChange={toggleAll}
                        />
                      )}
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-12">#</th>
                    <th className="text-12 text-gray-500 fw-medium py-12">
                      Student
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-12">
                      Batch
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-12">
                      Phase
                    </th>
                    <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                      Current Exam Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((__, j) => (
                          <td key={j} className="py-12 px-16">
                            <div
                              className="bg-gray-100 rounded"
                              style={{ height: "13px", width: "80%" }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  {!isLoading && students.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-gray-400 py-40"
                      >
                        No students found
                      </td>
                    </tr>
                  )}
                  {students.map((s, i) => (
                    <tr
                      key={s.Id}
                      className={selected.has(s.Id) ? "bg-main-50" : ""}
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleSelect(s.Id)}
                    >
                      <td
                        className="py-12 px-16"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selected.has(s.Id)}
                          onChange={() => toggleSelect(s.Id)}
                        />
                      </td>
                      <td className="text-13 text-gray-400 py-12">{i + 1}</td>
                      <td className="py-12">
                        <p className="text-13 fw-semibold text-gray-800 mb-0">
                          {s.Name}
                        </p>
                        <p className="text-12 text-gray-400 mb-0">
                          {s.Email_Id}
                        </p>
                      </td>
                      <td className="text-13 text-gray-600 py-12">
                        {s.batch_title || "—"}
                      </td>
                      <td className="text-13 text-gray-600 py-12">
                        {s.phase_title || "—"}
                      </td>
                      <td className="py-12 text-center">
                        {s.exam_type_name ? (
                          <span className="text-12 fw-bold bg-main-50 text-main-700 py-3 px-12 rounded-pill">
                            {s.exam_type_name}
                          </span>
                        ) : (
                          <span className="text-12 text-gray-400">
                            Not Assigned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
