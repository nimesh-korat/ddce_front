import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  assignBatchToSession,
  getAllBatch,
  getAllPhase,
  getSessionWiseBatch,
  updateIsFeaturedSession,
} from "../../apis/apis";
import Preloader from "../../utils/preloader/Preloader";

function AssignSessionToBatch() {
  const location = useLocation();
  const sessionData = location.state;
  console.log(sessionData);

  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [editBatch, setEditBatch] = useState(null);
  const [newBatch, setNewBatch] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const { data: phases, isLoading: isLoadingPhaseData } = useQuery({
    queryKey: ["allPhase"],
    queryFn: getAllPhase,
  });

  const { data: batches, isLoading: isLoadingData } = useQuery({
    queryKey: ["allBatch"],
    queryFn: getAllBatch,
  });

  const getSessionWiseBatchData = useMutation({
    mutationKey: ["getSessionWiseBatch"],
    mutationFn: (data) => getSessionWiseBatch(data),
    onSuccess: (data) => {
      setBatchData(data);
      console.log("getSessionWiseBatch", data);
    },
  });

  const updateIsFeaturedMutation = useMutation({
    mutationKey: ["updateIsFeaturedSession"],
    mutationFn: (data) => updateIsFeaturedSession(data),
    onSuccess: (data) => {
      if (sessionData) {
        getSessionWiseBatchData.mutate(sessionData.Id);
      }
      toast.success("Feature status changed successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  useEffect(() => {
    if (sessionData) {
      getSessionWiseBatchData.mutate(sessionData.Id);
    }
    //eslint-disable-next-line
  }, [sessionData]);

  // Toggle "Is Featured"
  const handleToggleFeatured = (id) => {
    setBatchData((prevData) =>
      prevData.map((batch) =>
        batch.assigned_session_id === id
          ? { ...batch, is_featured: batch.is_featured === "1" ? "0" : "1" }
          : batch
      )
    );

    updateIsFeaturedMutation.mutate({
      id: id,
      isFeatured:
        batchData.find((batch) => batch.assigned_session_id === id)
          .is_featured === "1"
          ? "0"
          : "1",
    });
  };

  // Handle "Add Batch" Button Click
  const handleAddBatch = () => {
    setNewBatch({
      tbl_session: sessionData.Id,
      tbl_batch: "",
      tbl_phase: "",
      start_date: "",
      end_date: "",
      is_featured: "1",
    });
  };

  // Handle Input Changes for New & Edited Batch
  const handleInputChange = (e, batchId = null) => {
    const { name, type, checked, value } = e.target;
    if (batchId !== null) {
      setEditBatch((prevEditBatch) => ({
        ...prevEditBatch,
        [name]: type === "checkbox" ? checked : value, // Handle checkbox separately
      }));
    } else {
      setNewBatch((prev) => ({ ...prev, [name]: value }));
    }
  };

  const assignBatchToSessionMutation = useMutation({
    mutationFn: (data) => assignBatchToSession(data),
    onSuccess: (data) => {
      if (sessionData) {
        getSessionWiseBatchData.mutate(sessionData.Id);
      }
      toast.success(data.message, { autoClose: 1000 });
      setNewBatch(null);
    },
    onError: (error) => {
      toast.error(error.response.data.message, { autoClose: 1000 });
    },
  });

  // Save New Batch
  const handleSaveNewBatch = () => {
    const batchWithUtcDates = {
      ...newBatch,
      start_date: new Date(newBatch.start_date).toISOString(),
      end_date: new Date(newBatch.end_date).toISOString(),
    };
    assignBatchToSessionMutation.mutate(batchWithUtcDates);
  };

  // Edit Batch
  const handleEditBatch = (batch) => {
    setEditBatch({ ...batch });
  };

  // Save Edited Batch
  // Save Edited Batch with UTC dates (if you also plan to save edited data)
  const handleSaveEditBatch = () => {
    const updatedBatch = {
      ...editBatch,
      start_date: new Date(editBatch.start_date).toISOString(),
      end_date: new Date(editBatch.end_date).toISOString(),
    };

    // If you also plan to update it in UI or API:
    setBatchData((prevData) =>
      prevData.map((batch) =>
        batch.assigned_session_id === editBatch.assigned_session_id
          ? updatedBatch
          : batch
      )
    );
    setEditBatch(null);

    // If you're sending this to an API:
    // assignBatchToSessionMutation.mutate(updatedBatch);
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditBatch(null);
  };

  // Cancel Save
  const handleCancelNewBatch = () => {
    setNewBatch(null);
  };

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
                  to={"/admin"}
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
                  Assign Batch to Session
                </span>
              </li>
            </ul>
          </div>
        </div>
        {isLoadingPhaseData || isLoadingData ? (
          <Preloader />
        ) : (
          <div className="dashboard-body">
            <div className="container-fluid dashboard-content">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card card-default card-md mb-4">
                    <div className="card-header">
                      <h3 className="card-title">{sessionData.description}</h3>
                    </div>
                    <div className="card-body pt-0">
                      <div className="p-1 text-end">
                        <button
                          type="button"
                          className="btn btn-main"
                          onClick={handleAddBatch}
                        >
                          Assign Batch
                        </button>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr className="bg-light">
                              <th>No.</th>
                              <th>Phase</th>
                              <th>Batch</th>
                              <th>Start Date</th>
                              <th>End Date</th>
                              <th>Is Featured</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* New Batch Row */}
                            {newBatch && (
                              <tr>
                                <td>#</td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="tbl_phase"
                                    value={newBatch.tbl_phase}
                                    onChange={handleInputChange}
                                  >
                                    <option value="" selected disabled>
                                      Select Phase
                                    </option>
                                    {isLoadingData ? (
                                      <option>Loading...</option>
                                    ) : (
                                      phases.map((phase) => (
                                        <option key={phase.Id} value={phase.Id}>
                                          {phase.title}
                                        </option>
                                      ))
                                    )}
                                  </select>
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="tbl_batch"
                                    value={newBatch.tbl_batch}
                                    onChange={handleInputChange}
                                  >
                                    <option value="" selected disabled>
                                      Select Batch
                                    </option>
                                    {isLoadingData ? (
                                      <option>Loading...</option>
                                    ) : (
                                      batches.map((batch) => (
                                        <option key={batch.id} value={batch.id}>
                                          {batch.batch_title}
                                        </option>
                                      ))
                                    )}
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="datetime-local"
                                    className="form-control"
                                    name="start_date"
                                    min={new Date().toISOString().slice(0, 16)}
                                    value={newBatch.start_date}
                                    onChange={handleInputChange}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="datetime-local"
                                    className="form-control"
                                    name="end_date"
                                    min={newBatch.start_date}
                                    value={newBatch.end_date}
                                    onChange={handleInputChange}
                                  />
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    name="is_featured"
                                    value={newBatch.is_featured}
                                    onChange={handleInputChange}
                                  >
                                    <option value={"0"}>No</option>
                                    <option value={"1"}>Yes</option>
                                  </select>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={handleSaveNewBatch}
                                  >
                                    <i className="ph ph-floppy-disk" /> Save
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger ms-2"
                                    onClick={handleCancelNewBatch}
                                  >
                                    <i className="ph ph-x" /> Cancel
                                  </button>
                                </td>
                              </tr>
                            )}

                            {/* Existing Batches */}
                            {batchData.map((batch, index) => (
                              <tr key={batch.assigned_session_id}>
                                <td>{index + 1}</td>

                                {/* Edit Mode */}
                                {editBatch &&
                                editBatch.assigned_session_id ===
                                  batch.assigned_session_id ? (
                                  <>
                                    <td>
                                      <select
                                        className="form-select"
                                        name="tbl_phase"
                                        value={editBatch.tbl_phase}
                                        onChange={handleInputChange}
                                      >
                                        <option value="" selected disabled>
                                          Select Phase
                                        </option>
                                        {isLoadingData ? (
                                          <option>Loading...</option>
                                        ) : (
                                          phases.map((phase) => (
                                            <option
                                              key={phase.Id}
                                              value={phase.Id}
                                            >
                                              {phase.title}
                                            </option>
                                          ))
                                        )}
                                      </select>
                                    </td>
                                    <td>
                                      <select
                                        className="form-select"
                                        name="name"
                                        value={editBatch.name}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e,
                                            batch.assigned_session_id
                                          )
                                        }
                                      >
                                        <option value="" selected disabled>
                                          Select Batch
                                        </option>
                                        {isLoadingData ? (
                                          <option>Loading...</option>
                                        ) : (
                                          batches.map((batch) => (
                                            <option
                                              key={batch.id}
                                              value={batch.id}
                                            >
                                              {batch.batch_title}
                                            </option>
                                          ))
                                        )}
                                      </select>
                                    </td>
                                    <td>
                                      <input
                                        type="datetime-local"
                                        className="form-control"
                                        name="startDate"
                                        value={editBatch.startDate}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e,
                                            batch.assigned_session_id
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="datetime-local"
                                        className="form-control"
                                        name="endDate"
                                        value={editBatch.endDate}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e,
                                            batch.assigned_session_id
                                          )
                                        }
                                      />
                                    </td>
                                    <td>-</td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-success"
                                        onClick={handleSaveEditBatch}
                                      >
                                        Save
                                      </button>
                                      <button
                                        className="btn btn-sm btn-secondary ms-2"
                                        onClick={handleCancelEdit}
                                      >
                                        Cancel
                                      </button>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>{batch.phase_name}</td>
                                    <td>{batch.batch_name}</td>
                                    <td>
                                      {new Date(
                                        batch.start_date
                                      ).toLocaleString()}
                                    </td>
                                    <td>
                                      {new Date(
                                        batch.end_date
                                      ).toLocaleString()}
                                    </td>
                                    <td>
                                      <div className="form-check form-switch">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          role="switch"
                                          name="is_featured"
                                          id={`featuredSwitch${batch.assigned_session_id}`}
                                          checked={batch.is_featured === "1"}
                                          onChange={() =>
                                            handleToggleFeatured(
                                              batch.assigned_session_id
                                            )
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`featuredSwitch${batch.assigned_session_id}`}
                                        >
                                          {batch.is_featured === "1"
                                            ? "Yes"
                                            : "No"}
                                        </label>
                                      </div>
                                    </td>

                                    <td>
                                      <button
                                        className="btn btn-sm btn-outline-main"
                                        onClick={() => handleEditBatch(batch)}
                                      >
                                        Edit
                                      </button>
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
