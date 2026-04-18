import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import {
  getSession,
  adminUpdateSession,
  adminDeleteSession,
} from "../../apis/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Preloader from "../../utils/preloader/Preloader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function ShowSession() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editForm, setEditForm] = useState({
    description: "",
    for_who: "",
    link: "",
    isFake: "0",
  });
  const queryClient = useQueryClient();

  const toggleSidebar = () => setIsSidebarActive((prev) => !prev);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data, isLoading } = useQuery({
    queryKey: ["getSessions"],
    queryFn: getSession,
    staleTime: 1 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminUpdateSession(id, data),
    onSuccess: () => {
      toast.success("Session updated successfully!");
      queryClient.invalidateQueries(["getSessions"]);
      setShowEditModal(false);
      setEditingSession(null);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update session"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteSession(id),
    onSuccess: () => {
      toast.success("Session deleted successfully!");
      queryClient.invalidateQueries(["getSessions"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete session"),
  });

  const handleOpenEdit = (item) => {
    setEditingSession(item);
    setEditForm({
      description: item.description || "",
      for_who: item.for_who || "",
      link: item.link || "",
      isFake: item.isFake || "0",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: editingSession.Id, data: editForm });
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "Delete Session?",
      text: `"${item.description}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(item.Id);
    });
  };

  const sessions = data?.data || [];

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
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
                  <span className="text-gray-500 fw-normal d-flex">
                    <i className="ph ph-caret-right" />
                  </span>
                </li>
                <li>
                  <span className="text-main-600 fw-normal text-15">
                    Show Sessions
                  </span>
                </li>
              </ul>
            </div>
            <Link
              to="/admin/addSession"
              className="btn btn-main rounded-pill py-9 flex-align gap-8"
            >
              <i className="ph ph-plus" />
              Add Session
            </Link>
          </div>

          {isLoading ? (
            <Preloader />
          ) : sessions.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-48">
                <i className="ph ph-video-camera text-64 text-gray-300 d-block mb-16" />
                <h5 className="text-gray-500 fw-medium">No sessions found</h5>
                <Link
                  to="/admin/addSession"
                  className="btn btn-main rounded-pill py-9 mt-12"
                >
                  Add Session
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-20">
              {sessions.map((item, index) => (
                <div className="col-xxl-4 col-md-6" key={index}>
                  <div className="card shadow-sm border border-gray-100 h-100">
                    <div className="card-body d-flex flex-column">
                      {/* Header */}
                      <div className="flex-between mb-12">
                        <h5 className="card-title mb-0 fw-semibold text-16">
                          <i className="ph ph-video-camera me-8 text-main-600" />
                          {item.description}
                        </h5>
                        <div className="flex-align gap-8">
                          <button
                            className="btn btn-sm btn-info rounded-pill"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit session"
                          >
                            <i className="ph ph-pencil text-14" />
                          </button>
                          <button
                            className="btn btn-sm btn-danger rounded-pill"
                            onClick={() => handleDelete(item)}
                            disabled={deleteMutation.isPending}
                            title="Delete session"
                          >
                            <i className="ph ph-trash text-14" />
                          </button>
                        </div>
                      </div>

                      <p className="text-14 text-gray-600 mb-4">
                        <strong>For:</strong> {item.for_who}
                      </p>
                      <p className="text-14 text-gray-600 mb-12">
                        <strong>Link:</strong>{" "}
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-main-600 hover-text-main-800"
                          style={{ wordBreak: "break-word" }}
                        >
                          {item.link}
                        </a>
                      </p>

                      <hr className="my-8" />
                      <h6 className="fw-semibold mb-8 text-14">Assignments:</h6>

                      {item.assignments.length > 0 ? (
                        item.assignments.map((assign, idx) => (
                          <div
                            key={idx}
                            className="mb-8 p-10 bg-gray-50 rounded-8 border border-gray-100"
                          >
                            <div className="flex-align gap-12 flex-wrap mb-4">
                              {assign.phase && (
                                <span className="text-13 text-gray-700">
                                  <i className="ph ph-target text-main-600 me-4" />
                                  <strong>Phase:</strong> {assign.phase.title}
                                </span>
                              )}
                              {assign.batch && (
                                <span className="text-13 text-gray-700">
                                  <i className="ph ph-users text-success-600 me-4" />
                                  <strong>Batch:</strong> {assign.batch.title}
                                </span>
                              )}
                            </div>
                            <p className="text-13 text-gray-600 mb-2">
                              <i className="ph ph-calendar-check text-info-600 me-4" />
                              <strong>Start:</strong>{" "}
                              {assign.start_date
                                ? format(
                                    new Date(assign.start_date),
                                    "dd/MM/yyyy hh:mm a",
                                  )
                                : "N/A"}
                            </p>
                            <p className="text-13 text-gray-600 mb-0">
                              <i className="ph ph-calendar-x text-danger-600 me-4" />
                              <strong>End:</strong>{" "}
                              {assign.end_date
                                ? format(
                                    new Date(assign.end_date),
                                    "dd/MM/yyyy hh:mm a",
                                  )
                                : "N/A"}
                            </p>
                            {assign.is_featured === 1 && (
                              <span className="badge bg-warning text-dark mt-4">
                                🌟 Featured
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-13 text-gray-400">
                          No assignments yet.
                        </p>
                      )}

                      <div className="mt-auto pt-12">
                        <Link
                          to="/admin/assignSessionToBatch"
                          state={item}
                          className="btn btn-main w-100 rounded-pill py-9"
                        >
                          Manage Assignments
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Session Modal */}
      {showEditModal && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="bg-white rounded-12 shadow-lg w-100"
            style={{ maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="flex-between p-20 border-bottom border-gray-100">
              <h5 className="fw-semibold mb-0">Edit Session</h5>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="btn btn-sm text-gray-500 p-4"
              >
                <i className="ph ph-x text-20" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-20">
              <div className="mb-12">
                <label className="form-label fw-medium text-14 mb-4">
                  Description / Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-12">
                <label className="form-label fw-medium text-14 mb-4">
                  For Who
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.for_who}
                  onChange={(e) =>
                    setEditForm({ ...editForm, for_who: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-12">
                <label className="form-label fw-medium text-14 mb-4">
                  Link / URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  value={editForm.link}
                  onChange={(e) =>
                    setEditForm({ ...editForm, link: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex-align gap-12 justify-content-end mt-20 pt-16 border-top border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-outline-secondary rounded-pill py-9 px-20"
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-main rounded-pill py-9 px-24"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-6" />
                      Saving...
                    </>
                  ) : (
                    "Update Session"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ShowSession;
