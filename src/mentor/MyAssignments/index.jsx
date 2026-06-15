import React, { useState } from "react";
import MentorSidebar from "../../common/MentorSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPractices,
  deletePractice,
  deletePracticeBatchAssignment,
  togglePracticeVisibility,
  togglePracticeFeatured,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Preloader from "../../utils/preloader/Preloader";
import { format } from "date-fns";

function MyAssignments() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const queryClient = useQueryClient();

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data, isLoading } = useQuery({
    queryKey: ["practices"],
    queryFn: getPractices,
    staleTime: 2 * 60 * 1000,
  });

  const deletePracticeMutation = useMutation({
    mutationFn: (id) => deletePractice(id),
    onSuccess: () => {
      toast.success("Practice deleted!");
      queryClient.invalidateQueries(["practices"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete"),
  });

  const deleteBatchMutation = useMutation({
    mutationFn: (id) => deletePracticeBatchAssignment(id),
    onSuccess: () => {
      toast.success("Batch assignment removed!");
      queryClient.invalidateQueries(["practices"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to remove"),
  });

  const toggleVisMutation = useMutation({
    mutationFn: (id) => togglePracticeVisibility(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(["practices"]);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const toggleFeatMutation = useMutation({
    mutationFn: (id) => togglePracticeFeatured(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(["practices"]);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const handleDeletePractice = (p) => {
    Swal.fire({
      title: "Delete Practice?",
      text: `"${p.title}" and all its batch assignments will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    }).then((r) => {
      if (r.isConfirmed) deletePracticeMutation.mutate(p.id);
    });
  };

  const handleDeleteBatch = (ba, practiceTitle) => {
    Swal.fire({
      title: "Remove Batch Assignment?",
      text: `Remove batch "${ba.batch_title}" from "${practiceTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Remove",
    }).then((r) => {
      if (r.isConfirmed) deleteBatchMutation.mutate(ba.batch_assignment_id);
    });
  };

  const practices = data?.data || [];
  const fmtDate = (d) => (d ? format(new Date(d), "dd MMM yyyy") : "—");

  const statusBadge = (s) =>
    ({
      active: "bg-success-50 text-success-600",
      upcoming: "bg-info-50 text-info-600",
      ended: "bg-gray-100 text-gray-500",
      hidden: "bg-warning-50 text-warning-600",
    })[s] || "bg-gray-50 text-gray-500";

  return (
    <>
      <MentorSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        {isLoading ? (
          <Preloader />
        ) : (
          <div className="dashboard-body">
            <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
              <div className="breadcrumb mb-0">
                <ul className="flex-align gap-4">
                  <li>
                    <Link
                      to="/mentor/dashboard"
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
                      My Practices
                    </span>
                  </li>
                </ul>
              </div>
              <Link
                to="/mentor/assignPractice"
                className="btn btn-main rounded-pill py-9 flex-align gap-8"
              >
                <i className="ph ph-plus" />
                New Practice
              </Link>
            </div>

            {practices.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-48">
                  <i className="ph ph-barbell text-64 text-gray-300 d-block mb-16" />
                  <h5 className="text-gray-500 fw-medium mb-8">
                    No practices yet
                  </h5>
                  <Link
                    to="/mentor/assignPractice"
                    className="btn btn-main rounded-pill py-9"
                  >
                    Create First Practice
                  </Link>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-16">
                {practices.map((p) => {
                  const isExpanded = expandedId === p.id;
                  return (
                    <div key={p.id} className="card border border-gray-100">
                      {/* Practice row */}
                      <div className="card-body p-16">
                        <div className="flex-between flex-wrap gap-8">
                          <div className="flex-align gap-12">
                            {p.image_url && (
                              <img
                                src={p.image_url}
                                alt="practice"
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <div>
                              <h6 className="fw-semibold text-gray-800 mb-2">
                                {p.title}
                              </h6>
                              <div className="flex-align gap-10 flex-wrap">
                                {p.description && (
                                  <span className="text-12 text-gray-400">
                                    {p.description}
                                  </span>
                                )}
                                <span className="text-12 bg-main-50 text-main-600 py-2 px-8 rounded-pill fw-medium">
                                  {p.total_questions} questions
                                </span>
                                {p.added_by_name && (
                                  <span className="text-12 text-gray-400">
                                    <i className="ph ph-user-circle me-4" />
                                    {p.added_by_name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex-align gap-8">
                            {/* Expand/collapse batch assignments */}
                            <button
                              className="btn btn-sm btn-outline-main rounded-pill flex-align gap-6"
                              onClick={() =>
                                setExpandedId(isExpanded ? null : p.id)
                              }
                            >
                              <i
                                className={`ph ph-caret-${isExpanded ? "up" : "down"} text-12`}
                              />
                              {p.batch_assignments?.length || 0} batch
                              {p.batch_assignments?.length !== 1 ? "es" : ""}
                            </button>
                            <Link
                              to="/mentor/assignPractice"
                              className="btn btn-sm btn-outline-info-600 rounded-pill"
                              title="Manage"
                            >
                              <i className="ph ph-gear text-12" />
                            </Link>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill"
                              onClick={() => handleDeletePractice(p)}
                              disabled={deletePracticeMutation.isPending}
                              title="Delete"
                            >
                              <i className="ph ph-trash text-12" />
                            </button>
                          </div>
                        </div>

                        {/* Batch assignments (expandable) */}
                        {isExpanded && (
                          <div className="mt-12 pt-12 border-top border-gray-100">
                            {p.batch_assignments?.length > 0 ? (
                              <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="text-12 text-gray-500 fw-medium py-10 px-12">
                                        Batch
                                      </th>
                                      <th className="text-12 text-gray-500 fw-medium py-10">
                                        Phase
                                      </th>
                                      <th className="text-12 text-gray-500 fw-medium py-10">
                                        Period
                                      </th>
                                      <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                                        Visible
                                      </th>
                                      <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                                        Featured
                                      </th>
                                      <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                                        Status
                                      </th>
                                      <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                                        Remove
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {p.batch_assignments.map((ba) => (
                                      <tr key={ba.batch_assignment_id}>
                                        <td className="text-13 py-10 px-12 fw-medium">
                                          {ba.batch_title || "—"}
                                        </td>
                                        <td className="text-13 py-10">
                                          {ba.phase_title || "All"}
                                        </td>
                                        <td className="text-12 text-gray-500 py-10">
                                          {fmtDate(ba.start_date)} →{" "}
                                          {fmtDate(ba.end_date)}
                                        </td>
                                        <td className="py-10 text-center">
                                          <div className="form-check form-switch mb-0 d-flex justify-content-center">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              role="switch"
                                              checked={ba.is_visible === 1}
                                              onChange={() =>
                                                toggleVisMutation.mutate(
                                                  ba.batch_assignment_id,
                                                )
                                              }
                                              disabled={
                                                toggleVisMutation.isPending
                                              }
                                            />
                                          </div>
                                        </td>
                                        <td className="py-10 text-center">
                                          <div className="form-check form-switch mb-0 d-flex justify-content-center">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              role="switch"
                                              checked={ba.is_featured === 1}
                                              onChange={() =>
                                                toggleFeatMutation.mutate(
                                                  ba.batch_assignment_id,
                                                )
                                              }
                                              disabled={
                                                toggleFeatMutation.isPending
                                              }
                                            />
                                          </div>
                                        </td>
                                        <td className="py-10 text-center">
                                          <span
                                            className={`text-11 py-2 px-8 rounded-pill fw-medium ${statusBadge(ba.status)}`}
                                          >
                                            {ba.status}
                                          </span>
                                        </td>
                                        <td className="py-10 text-center">
                                          <button
                                            className="btn btn-sm btn-outline-danger rounded-pill"
                                            onClick={() =>
                                              handleDeleteBatch(ba, p.title)
                                            }
                                            disabled={
                                              deleteBatchMutation.isPending
                                            }
                                          >
                                            <i className="ph ph-trash text-12" />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-13 text-gray-400 mb-0">
                                No batches assigned yet.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

export default MyAssignments;
