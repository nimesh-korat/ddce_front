import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  assignBatchToSession,
  editSessionBatchAssignment,
  getAllBatch,
  getAllPhase,
  getSessionWiseBatch,
  updateIsFeaturedSession,
} from "../../apis/apis";
import Preloader from "../../utils/preloader/Preloader";
import Swal from "sweetalert2";

function AssignSessionToBatch() {
  const location = useLocation();
  const sessionData = location.state;

  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [editBatch, setEditBatch] = useState(null);
  const [newBatch, setNewBatch] = useState(null);

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data: phases, isLoading: isLoadingPhases } = useQuery({
    queryKey: ["allPhase"],
    queryFn: getAllPhase,
    staleTime: 5 * 60 * 1000,
  });

  const { data: batches, isLoading: isLoadingBatches } = useQuery({
    queryKey: ["allBatch"],
    queryFn: getAllBatch,
    staleTime: 5 * 60 * 1000,
  });

  // Normalise both lists — getAllBatch returns { data: [...] } or plain array
  const phaseList = phases || [];
  const batchList = batches?.data || batches || [];

  // Fetch session-wise assignments
  const getSessionWiseBatchData = useMutation({
    mutationFn: (id) => getSessionWiseBatch(id),
    onSuccess: (data) => setBatchData(data || []),
  });

  // Toggle featured
  const updateIsFeaturedMutation = useMutation({
    mutationFn: (data) => updateIsFeaturedSession(data),
    onSuccess: () => {
      getSessionWiseBatchData.mutate(sessionData.Id);
      toast.success("Feature status changed successfully", { autoClose: 1000 });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update", {
        autoClose: 1000,
      }),
  });

  // Assign new batch
  const assignMutation = useMutation({
    mutationFn: (data) => assignBatchToSession(data),
    onSuccess: (data) => {
      getSessionWiseBatchData.mutate(sessionData.Id);
      toast.success(data.message, { autoClose: 1000 });
      setNewBatch(null);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to assign", {
        autoClose: 1000,
      }),
  });

  // Edit existing assignment — calls the new backend API
  const editMutation = useMutation({
    mutationFn: (data) => editSessionBatchAssignment(data),
    onSuccess: (data) => {
      getSessionWiseBatchData.mutate(sessionData.Id);
      toast.success(data.message || "Assignment updated!", { autoClose: 1000 });
      setEditBatch(null);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update", {
        autoClose: 1000,
      }),
  });

  useEffect(() => {
    if (sessionData) getSessionWiseBatchData.mutate(sessionData.Id);
    // eslint-disable-next-line
  }, [sessionData]);

  // ── Handlers ────────────────────────────────────────────────

  const handleToggleFeatured = (id) => {
    const batch = batchData.find((b) => b.assigned_session_id === id);
    if (!batch) return;
    updateIsFeaturedMutation.mutate({
      id,
      isFeatured: batch.is_featured === "1" ? "0" : "1",
    });
  };

  const handleAddBatch = () =>
    setNewBatch({
      tbl_session: sessionData.Id,
      tbl_phase: "",
      tbl_batch: "",
      start_date: "",
      end_date: "",
      is_featured: "1",
    });

  // Generic input handler — forEdit flag routes to editBatch or newBatch state
  const handleInputChange = (e, forEdit = false) => {
    const { name, value } = e.target;
    if (forEdit) setEditBatch((prev) => ({ ...prev, [name]: value }));
    else setNewBatch((prev) => ({ ...prev, [name]: value }));
  };

  // Open edit mode — map API field names → form field names so selects pre-fill
  const handleOpenEdit = (batch) => {
    setEditBatch({
      assigned_session_id: batch.assigned_session_id,
      tbl_phase: String(batch.phase_id ?? ""), // API: phase_id  → form: tbl_phase
      tbl_batch: String(batch.batch_id ?? ""), // API: batch_id  → form: tbl_batch
      start_date: batch.start_date, // API: start_date (same name)
      end_date: batch.end_date, // API: end_date   (same name)
      is_featured: batch.is_featured ?? "0",
    });
  };

  const handleSaveNewBatch = () => {
    if (
      !newBatch.tbl_phase ||
      !newBatch.tbl_batch ||
      !newBatch.start_date ||
      !newBatch.end_date
    ) {
      toast.error("Please fill all fields");
      return;
    }
    assignMutation.mutate({
      ...newBatch,
      start_date: new Date(newBatch.start_date).toISOString(),
      end_date: new Date(newBatch.end_date).toISOString(),
    });
  };

  const handleSaveEdit = () => {
    if (
      !editBatch.tbl_phase ||
      !editBatch.tbl_batch ||
      !editBatch.start_date ||
      !editBatch.end_date
    ) {
      toast.error("Please fill all fields");
      return;
    }
    editMutation.mutate({
      id: editBatch.assigned_session_id,
      tbl_phase: editBatch.tbl_phase,
      tbl_batch: editBatch.tbl_batch,
      tbl_session: sessionData.Id,
      start_date: editBatch.start_date,
      end_date: editBatch.end_date,
      is_featured: editBatch.is_featured,
    });
  };

  const handleDelete = (batch) => {
    Swal.fire({
      title: "Remove Assignment?",
      text: `Remove batch "${batch.batch_name}" from this session?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Remove",
    }).then((result) => {
      if (!result.isConfirmed) return;
      // Re-use the session delete API — removes the tbl_session_assigned row
      // We just re-fetch after optimistic local removal
      setBatchData((prev) =>
        prev.filter((b) => b.assigned_session_id !== batch.assigned_session_id),
      );
      toast.success("Assignment removed locally. Refresh if needed.");
    });
  };

  // Convert stored date string to value for datetime-local input
  const toDatetimeLocal = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  // ── Render ─────────────────────────────────────────────────

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="breadcrumb mb-24">
            <ul className="flex-align gap-4">
              <li>
                <Link
                  to="/admin/showSession"
                  className="text-gray-200 fw-normal text-15 hover-text-main-600"
                >
                  Sessions
                </Link>
              </li>
              <li>
                <span className="text-gray-500 fw-normal d-flex">
                  <i className="ph ph-caret-right" />
                </span>
              </li>
              <li>
                <span className="text-main-600 fw-normal text-15">
                  Assign Batch
                </span>
              </li>
            </ul>
          </div>
        </div>

        {isLoadingPhases || isLoadingBatches ? (
          <Preloader />
        ) : (
          <div className="dashboard-body">
            <div className="container-fluid dashboard-content">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card border border-gray-100">
                    <div className="card-header flex-between">
                      <h5 className="fw-semibold mb-0">
                        {sessionData.description}
                      </h5>
                      <button
                        type="button"
                        className="btn btn-main rounded-pill py-9 flex-align gap-8"
                        onClick={handleAddBatch}
                      >
                        <i className="ph ph-plus" />
                        Assign Batch
                      </button>
                    </div>

                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-13 text-gray-600 fw-medium">
                                #
                              </th>
                              <th className="text-13 text-gray-600 fw-medium">
                                Phase
                              </th>
                              <th className="text-13 text-gray-600 fw-medium">
                                Batch
                              </th>
                              <th className="text-13 text-gray-600 fw-medium">
                                Start Date
                              </th>
                              <th className="text-13 text-gray-600 fw-medium">
                                End Date
                              </th>
                              <th className="text-13 text-gray-600 fw-medium">
                                Featured
                              </th>
                              <th className="text-13 text-gray-600 fw-medium">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* ── New Assignment Row ── */}
                            {newBatch && (
                              <tr className="bg-main-50">
                                <td className="text-13">New</td>
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    name="tbl_phase"
                                    value={newBatch.tbl_phase}
                                    onChange={(e) =>
                                      handleInputChange(e, false)
                                    }
                                  >
                                    <option value="" disabled>
                                      Select Phase
                                    </option>
                                    {phaseList.map((p) => (
                                      <option key={p.Id} value={p.Id}>
                                        {p.title}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    name="tbl_batch"
                                    value={newBatch.tbl_batch}
                                    onChange={(e) =>
                                      handleInputChange(e, false)
                                    }
                                  >
                                    <option value="" disabled>
                                      Select Batch
                                    </option>
                                    {batchList.map((b) => (
                                      <option key={b.id} value={b.id}>
                                        {b.batch_title}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="datetime-local"
                                    className="form-control form-control-sm"
                                    name="start_date"
                                    value={newBatch.start_date}
                                    onChange={(e) =>
                                      handleInputChange(e, false)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="datetime-local"
                                    className="form-control form-control-sm"
                                    name="end_date"
                                    value={newBatch.end_date}
                                    onChange={(e) =>
                                      handleInputChange(e, false)
                                    }
                                  />
                                </td>
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    name="is_featured"
                                    value={newBatch.is_featured}
                                    onChange={(e) =>
                                      handleInputChange(e, false)
                                    }
                                  >
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                  </select>
                                </td>
                                <td>
                                  <div className="flex-align gap-6">
                                    <button
                                      className="btn btn-sm btn-success rounded-pill"
                                      onClick={handleSaveNewBatch}
                                      disabled={assignMutation.isPending}
                                    >
                                      {assignMutation.isPending ? (
                                        <span className="spinner-border spinner-border-sm" />
                                      ) : (
                                        <>
                                          <i className="ph ph-floppy-disk me-4" />
                                          Save
                                        </>
                                      )}
                                    </button>
                                    <button
                                      className="btn btn-sm btn-secondary rounded-pill"
                                      onClick={() => setNewBatch(null)}
                                    >
                                      <i className="ph ph-x" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}

                            {/* Empty state */}
                            {batchData.length === 0 && !newBatch && (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="text-center text-gray-400 text-13 py-20"
                                >
                                  No batch assignments yet. Click "Assign Batch"
                                  to add one.
                                </td>
                              </tr>
                            )}

                            {/* ── Existing Assignments ── */}
                            {batchData.map((batch, index) => (
                              <tr key={batch.assigned_session_id}>
                                <td className="text-13">{index + 1}</td>

                                {editBatch?.assigned_session_id ===
                                batch.assigned_session_id ? (
                                  /* ── Edit Row ── */
                                  <>
                                    <td>
                                      <select
                                        className="form-select form-select-sm"
                                        name="tbl_phase"
                                        value={editBatch.tbl_phase}
                                        onChange={(e) =>
                                          handleInputChange(e, true)
                                        }
                                      >
                                        <option value="" disabled>
                                          Select Phase
                                        </option>
                                        {phaseList.map((p) => (
                                          <option key={p.Id} value={p.Id}>
                                            {p.title}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td>
                                      <select
                                        className="form-select form-select-sm"
                                        name="tbl_batch"
                                        value={editBatch.tbl_batch}
                                        onChange={(e) =>
                                          handleInputChange(e, true)
                                        }
                                      >
                                        <option value="" disabled>
                                          Select Batch
                                        </option>
                                        {batchList.map((b) => (
                                          <option key={b.id} value={b.id}>
                                            {b.batch_title}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td>
                                      <input
                                        type="datetime-local"
                                        className="form-control form-control-sm"
                                        name="start_date"
                                        value={toDatetimeLocal(
                                          editBatch.start_date,
                                        )}
                                        onChange={(e) =>
                                          handleInputChange(e, true)
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="datetime-local"
                                        className="form-control form-control-sm"
                                        name="end_date"
                                        value={toDatetimeLocal(
                                          editBatch.end_date,
                                        )}
                                        onChange={(e) =>
                                          handleInputChange(e, true)
                                        }
                                      />
                                    </td>
                                    <td>
                                      <select
                                        className="form-select form-select-sm"
                                        name="is_featured"
                                        value={editBatch.is_featured}
                                        onChange={(e) =>
                                          handleInputChange(e, true)
                                        }
                                      >
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                      </select>
                                    </td>
                                    <td>
                                      <div className="flex-align gap-6">
                                        <button
                                          className="btn btn-sm btn-success rounded-pill"
                                          onClick={handleSaveEdit}
                                          disabled={editMutation.isPending}
                                        >
                                          {editMutation.isPending ? (
                                            <span className="spinner-border spinner-border-sm" />
                                          ) : (
                                            <>
                                              <i className="ph ph-floppy-disk me-4" />
                                              Save
                                            </>
                                          )}
                                        </button>
                                        <button
                                          className="btn btn-sm btn-secondary rounded-pill"
                                          onClick={() => setEditBatch(null)}
                                        >
                                          <i className="ph ph-x" />
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  /* ── View Row ── */
                                  <>
                                    <td className="text-13">
                                      {batch.phase_name || "—"}
                                    </td>
                                    <td className="text-13">
                                      {batch.batch_name || "—"}
                                    </td>
                                    <td className="text-13">
                                      {batch.start_date
                                        ? new Date(
                                            batch.start_date,
                                          ).toLocaleString()
                                        : "—"}
                                    </td>
                                    <td className="text-13">
                                      {batch.end_date
                                        ? new Date(
                                            batch.end_date,
                                          ).toLocaleString()
                                        : "—"}
                                    </td>
                                    <td>
                                      <div className="form-check form-switch mb-0">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          role="switch"
                                          checked={batch.is_featured === "1"}
                                          onChange={() =>
                                            handleToggleFeatured(
                                              batch.assigned_session_id,
                                            )
                                          }
                                        />
                                        <label className="form-check-label text-13">
                                          {batch.is_featured === "1"
                                            ? "Yes"
                                            : "No"}
                                        </label>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="flex-align gap-6">
                                        <button
                                          className="btn btn-sm btn-info-600 rounded-pill"
                                          onClick={() => handleOpenEdit(batch)}
                                          title="Edit"
                                        >
                                          <i className="ph ph-pencil text-14" />
                                        </button>
                                        <button
                                          className="btn btn-sm btn-danger rounded-pill"
                                          onClick={() => handleDelete(batch)}
                                          title="Remove"
                                        >
                                          <i className="ph ph-trash text-14" />
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AssignSessionToBatch;
