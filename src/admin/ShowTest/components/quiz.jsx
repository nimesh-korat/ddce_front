import React, { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUpdateTest, adminDeleteTest } from "../../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function QuizCard({ test }) {
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const difficultyLabel = (val) => {
    const map = { 0: "Easy", 1: "Medium", 2: "Hard", 3: "Time Consuming" };
    return map[val] || val;
  };

  const [editForm, setEditForm] = useState({
    test_name: test?.test_name || "",
    test_desc: test?.test_desc || "",
    test_neg_marks: test?.test_neg_marks || "",
    test_duration: test?.test_duration || "",
    test_difficulty: test?.test_difficulty || "0",
    for_who: test?.for_who || "",
    isFake: test?.isFake || "0",
  });

  const startDate = test?.test_start_date
    ? new Date(test.test_start_date)
    : null;
  const endDate = test?.test_end_date ? new Date(test.test_end_date) : null;
  const currentDate = new Date();

  let testStatus = "upcoming";
  if (startDate && endDate) {
    if (currentDate >= startDate && currentDate <= endDate)
      testStatus = "ongoing";
    else if (currentDate > endDate) testStatus = "completed";
  }

  const formattedStartDate = startDate
    ? format(startDate, "dd/MM/yyyy 'at' hh:mm a")
    : "";
  const formattedEndDate = endDate
    ? format(endDate, "dd/MM/yyyy 'at' hh:mm a")
    : "";

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminUpdateTest(id, data),
    onSuccess: () => {
      toast.success("Test updated successfully!");
      queryClient.invalidateQueries(["getQuiz"]);
      setShowEditModal(false);
      setShowDropdown(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update test");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteTest(id),
    onSuccess: () => {
      toast.success("Test deleted successfully!");
      queryClient.invalidateQueries(["getQuiz"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete test");
    },
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
    updateMutation.mutate({ id: test.test_id, data: formData });
  };

  const handleDelete = () => {
    setShowDropdown(false);
    Swal.fire({
      title: "Delete Test?",
      text: `"${test.test_name}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(test.test_id);
    });
  };

  return (
    <>
      <div className="col-xxl-3 col-lg-4 col-sm-6">
        <div className="card border border-gray-100">
          <div className="card-body p-8">
            <div className="text-end p-3 position-relative">
              <i
                className="ph-fill ph-dots-three-outline-vertical cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ fontSize: "20px" }}
              />
              {showDropdown && (
                <div
                  className="position-absolute bg-white shadow rounded-2 p-2"
                  style={{
                    right: 0,
                    top: "100%",
                    zIndex: 10,
                    minWidth: "160px",
                  }}
                >
                  <Link
                    className="btn btn-sm btn-outline-main w-100 mb-4"
                    to="/admin/assignBatch"
                    state={{ test }}
                    onClick={() => setShowDropdown(false)}
                  >
                    <i className="ph ph-users me-4" />
                    Assign Batch
                  </Link>
                  <button
                    className="btn btn-sm btn-info w-100 mb-4"
                    onClick={() => {
                      setShowEditModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    <i className="ph ph-pencil me-4" />
                    Edit Test
                  </button>
                  <button
                    className="btn btn-sm btn-danger w-100"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    <i className="ph ph-trash me-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <Link className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8">
              <img src={`${test.test_img_path}`} alt="test" />
            </Link>

            <div className="p-8">
              <span
                className={`text-13 py-2 px-10 rounded-pill mb-16 ${
                  test.test_difficulty === "0"
                    ? "bg-success-50 text-success-600"
                    : test.test_difficulty === "1"
                      ? "bg-info-50 text-info-600"
                      : test.test_difficulty === "2"
                        ? "bg-warning-50 text-warning-600"
                        : "bg-danger-50 text-danger-600"
                }`}
              >
                {difficultyLabel(test.test_difficulty)}
              </span>

              <h5 className="mb-0">
                <p className="hover-text-main-600 text-18 fw-semibold">
                  {test.test_name}
                </p>
              </h5>

              <p
                className={`hover-text text-15 ${isExpanded ? "" : "two-line-text"}`}
                style={{ minHeight: isExpanded ? "auto" : "3rem" }}
              >
                {test.test_desc}
              </p>

              <button
                className="btn btn-link p-0 text-main-600 text-13"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>

              {/* <div className="flex-align gap-8 mt-12 pt-12">
                <span className="text-13 text-gray-600">
                  <strong>Available Time:</strong>{" "}
                  <strong>{formattedStartDate}</strong> to{" "}
                  <strong>{formattedEndDate}</strong>
                </span>
              </div> */}

              {test.assignments && test.assignments.length > 0 ? (
                <div className="mt-16 border-top pt-12">
                  <h6 className="fw-semibold mb-2 text-main-600">
                    Assigned Batches & Phases:
                  </h6>
                  {test.assignments
                    .slice(0, isExpanded ? test.assignments.length : 2)
                    .map((assignment, index) => (
                      <div key={index} className="mb-2 p-2 rounded bg-gray-50">
                        <span className="text-14 text-gray-700 d-block">
                          <strong>Phase:</strong>{" "}
                          {assignment.phase?.title || "N/A"} |{" "}
                          <strong>Batch:</strong>{" "}
                          {assignment.batch?.title || "N/A"}
                        </span>
                        <span className="text-13 text-gray-600 d-block">
                          <i className="ph ph-calendar-check me-1" />
                          {assignment.start_date
                            ? `${format(new Date(assignment.start_date), "dd/MM/yyyy 'at' hh:mm a")} - ${format(new Date(assignment.end_date), "dd/MM/yyyy 'at' hh:mm a")}`
                            : "Dates not assigned"}
                        </span>
                      </div>
                    ))}
                  {test.assignments.length > 2 && (
                    <button
                      className="btn btn-link p-0 text-main-600 text-13 mt-2"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? "Show Less" : "View All Assignments"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-16 border-top pt-12">
                  <h6 className="fw-semibold mb-2 text-main-600">
                    Assigned Batches & Phases:
                  </h6>
                  <p className="text-13 text-gray-600">No assignments found</p>
                </div>
              )}

              <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                <div className="flex-align gap-4">
                  <span className="text-sm text-main-600 d-flex">
                    <i className="ph ph-hash" />
                  </span>
                  <span className="text-13 text-gray-600">
                    {test.test_neg_marks} Negative Marks
                  </span>
                </div>
                <div className="flex-align gap-4">
                  <span className="text-sm text-main-600 d-flex">
                    <i className="ph ph-clock" />
                  </span>
                  <span className="text-13 text-gray-600">
                    {test.test_duration} Minutes
                  </span>
                </div>
              </div>

              {testStatus !== "ongoing" && testStatus !== "completed" && (
                <div className="row w-100 mt-24">
                  <div className="col-6">
                    <Link
                      to="/admin/addQuizQuestions"
                      state={{ test }}
                      className="btn btn-outline-main rounded-pill py-9 w-100"
                    >
                      Add Questions
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="/admin/viewQuizQuestions"
                      state={{ test }}
                      className="btn btn-outline-main rounded-pill py-9 w-100"
                    >
                      View Questions
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
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
            style={{ maxWidth: "540px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="flex-between p-20 border-bottom border-gray-100">
              <h5 className="fw-semibold mb-0">Edit Test</h5>
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
                  Test Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.test_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, test_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-12">
                <label className="form-label fw-medium text-14 mb-4">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={editForm.test_desc}
                  onChange={(e) =>
                    setEditForm({ ...editForm, test_desc: e.target.value })
                  }
                  required
                />
              </div>
              <div className="row g-12 mb-12">
                <div className="col-6">
                  <label className="form-label fw-medium text-14 mb-4">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.test_duration}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        test_duration: e.target.value,
                      })
                    }
                    required
                    min={30}
                    max={210}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-medium text-14 mb-4">
                    Negative Marks
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.test_neg_marks}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        test_neg_marks: e.target.value,
                      })
                    }
                    required
                    min={0}
                    step={0.25}
                  />
                </div>
              </div>
              <div className="mb-12">
                <label className="form-label fw-medium text-14 mb-4">
                  Difficulty
                </label>
                <select
                  className="form-control"
                  value={editForm.test_difficulty}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      test_difficulty: e.target.value,
                    })
                  }
                >
                  <option value="0">Easy</option>
                  <option value="1">Medium</option>
                  <option value="2">Hard</option>
                  <option value="3">Time Consuming</option>
                </select>
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
                    "Update Test"
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

export default QuizCard;
