import React, { useEffect, useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import { Link, useLocation } from "react-router-dom";
import Header from "../../common/header/Header";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  assignTestToBatch,
  editAssignedTestToBatch,
  deleteTestBatchAssignment,
  getAllBatch,
  getAllPhase,
  getTestWiseBatch,
  updateIsFeatured,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function AssignBatchToTest() {
  const location = useLocation();
  const testData = location.state.test;

  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [editBatch, setEditBatch] = useState(null);
  const [newBatch, setNewBatch] = useState(null);

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

  const phaseList = phases || [];
  const batchList = batches?.data || batches || [];

  // Fetch test-wise assignments
  const getTestWiseBatchData = useMutation({
    mutationFn: (data) => getTestWiseBatch(data),
    onSuccess: (data) => setBatchData(data || []),
  });

  // Toggle featured
  const updateIsFeaturedMutation = useMutation({
    mutationFn: (data) => updateIsFeatured(data),
    onSuccess: (data) => {
      getTestWiseBatchData.mutate(testData.test_id);
      toast.success(data.message, { autoClose: 1000 });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message, { autoClose: 1000 }),
  });

  // Assign new batch
  const assignMutation = useMutation({
    mutationFn: (data) => assignTestToBatch(data),
    onSuccess: (data) => {
      getTestWiseBatchData.mutate(testData.test_id);
      toast.success(data.message, { autoClose: 1000 });
      setNewBatch(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message, { autoClose: 1000 }),
  });

  // Edit existing assignment
  const editMutation = useMutation({
    mutationFn: (data) => editAssignedTestToBatch(data),
    onSuccess: (data) => {
      getTestWiseBatchData.mutate(testData.test_id);
      toast.success(data.message || "Assignment updated!", { autoClose: 1000 });
      setEditBatch(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update", {
        autoClose: 1000,
      }),
  });

  // Delete assignment
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTestBatchAssignment(id),
    onSuccess: () => {
      getTestWiseBatchData.mutate(testData.test_id);
      toast.success("Assignment removed!", { autoClose: 1000 });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete", {
        autoClose: 1000,
      }),
  });

  useEffect(() => {
    if (testData) getTestWiseBatchData.mutate(testData.test_id);
    // eslint-disable-next-line
  }, [testData]);

  const toggleSidebar = () => setIsSidebarActive((prev) => !prev);
  const closeSidebar = () => setIsSidebarActive(false);

  const handleToggleFeatured = (id) => {
    const batch = batchData.find((b) => b.assigned_batch_id === id);
    if (!batch) return;
    updateIsFeaturedMutation.mutate({
      id,
      isFeatured: batch.isFeatured === "1" ? "0" : "1",
    });
  };

  const handleAddBatch = () =>
    setNewBatch({
      tbl_test: testData.test_id,
      tbl_phase: "",
      tbl_batch: "",
      start_date: "",
      end_date: "",
      isFeatured: "0",
    });

  const handleInputChange = (e, forEdit = false) => {
    const { name, value } = e.target;
    if (forEdit) setEditBatch((prev) => ({ ...prev, [name]: value }));
    else setNewBatch((prev) => ({ ...prev, [name]: value }));
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
      id: editBatch.assigned_batch_id,
      tbl_batch: editBatch.tbl_batch,
      tbl_test: testData.test_id,
      start_date: new Date(editBatch.start_date).toISOString(),
      end_date: new Date(editBatch.end_date).toISOString(),
      isFeatured: editBatch.isFeatured,
    });
  };

  const handleDelete = (batch) => {
    Swal.fire({
      title: "Remove Assignment?",
      text: `Remove batch "${batch.batch_name}" from this test?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Remove",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(batch.assigned_batch_id);
    });
  };

  // Format a stored date string for datetime-local input
  const toDatetimeLocal = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

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
                  to="/admin/showTests"
                  className="text-gray-200 fw-normal text-15 hover-text-main-600"
                >
                  Tests
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

          <div className="row">
            <div className="col-lg-12">
              <div className="card border border-gray-100">
                <div className="card-header flex-between">
                  <h5 className="fw-semibold mb-0">{testData.test_name}</h5>
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
                          <th className="text-13 text-gray-600 fw-medium">#</th>
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
                                onChange={(e) => handleInputChange(e, false)}
                              >
                                <option value="" disabled>
                                  Select Phase
                                </option>
                                {isLoadingPhases ? (
                                  <option>Loading...</option>
                                ) : (
                                  phaseList.map((p) => (
                                    <option key={p.Id} value={p.Id}>
                                      {p.title}
                                    </option>
                                  ))
                                )}
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                name="tbl_batch"
                                value={newBatch.tbl_batch}
                                onChange={(e) => handleInputChange(e, false)}
                              >
                                <option value="" disabled>
                                  Select Batch
                                </option>
                                {isLoadingBatches ? (
                                  <option>Loading...</option>
                                ) : (
                                  batchList.map((b) => (
                                    <option key={b.id} value={b.id}>
                                      {b.batch_title}
                                    </option>
                                  ))
                                )}
                              </select>
                            </td>
                            <td>
                              <input
                                type="datetime-local"
                                className="form-control form-control-sm"
                                name="start_date"
                                value={newBatch.start_date}
                                onChange={(e) => handleInputChange(e, false)}
                              />
                            </td>
                            <td>
                              <input
                                type="datetime-local"
                                className="form-control form-control-sm"
                                name="end_date"
                                value={newBatch.end_date}
                                onChange={(e) => handleInputChange(e, false)}
                              />
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                name="isFeatured"
                                value={newBatch.isFeatured}
                                onChange={(e) => handleInputChange(e, false)}
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
                                  className="btn btn-sm btn-outline-secondary rounded-pill"
                                  onClick={() => setNewBatch(null)}
                                >
                                  <i className="ph ph-x" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* ── Existing Assignments ── */}
                        {batchData.length === 0 && !newBatch && (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center text-gray-400 text-13 py-20"
                            >
                              No batch assignments yet. Click "Assign Batch" to
                              add one.
                            </td>
                          </tr>
                        )}

                        {batchData.map((batch, index) => (
                          <tr key={batch.assigned_batch_id}>
                            <td className="text-13">{index + 1}</td>

                            {editBatch?.assigned_batch_id ===
                            batch.assigned_batch_id ? (
                              /* ── Edit Row ── */
                              <>
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    name="tbl_phase"
                                    value={editBatch.tbl_phase || ""}
                                    onChange={(e) => handleInputChange(e, true)}
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
                                    value={editBatch.tbl_batch || ""}
                                    onChange={(e) => handleInputChange(e, true)}
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
                                    onChange={(e) => handleInputChange(e, true)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="datetime-local"
                                    className="form-control form-control-sm"
                                    name="end_date"
                                    value={toDatetimeLocal(editBatch.end_date)}
                                    onChange={(e) => handleInputChange(e, true)}
                                  />
                                </td>
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    name="isFeatured"
                                    value={editBatch.isFeatured || "0"}
                                    onChange={(e) => handleInputChange(e, true)}
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
                                      className="btn btn-sm btn-outline-secondary rounded-pill"
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
                                    ? new Date(batch.end_date).toLocaleString()
                                    : "—"}
                                </td>
                                <td>
                                  <div className="form-check form-switch mb-0">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      checked={batch.isFeatured === "1"}
                                      onChange={() =>
                                        handleToggleFeatured(
                                          batch.assigned_batch_id,
                                        )
                                      }
                                    />
                                    <label className="form-check-label text-13">
                                      {batch.isFeatured === "1" ? "Yes" : "No"}
                                    </label>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex-align gap-6">
                                    <button
                                      className="btn btn-sm btn-info rounded-pill"
                                      onClick={() => setEditBatch({ ...batch })}
                                      title="Edit"
                                    >
                                      <i className="ph ph-pencil text-14" />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger rounded-pill"
                                      onClick={() => handleDelete(batch)}
                                      disabled={deleteMutation.isPending}
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
    </>
  );
}

export default AssignBatchToTest;
