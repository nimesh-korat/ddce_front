import React, { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function QuizCard({ test }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const startDate = test?.test_start_date
    ? new Date(test.test_start_date)
    : null;
  const endDate = test?.test_end_date ? new Date(test.test_end_date) : null;
  const currentDate = new Date();

  const toggleDescription = () => setIsExpanded(!isExpanded);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  let testStatus = "upcoming";
  if (startDate && endDate) {
    if (currentDate >= startDate && currentDate <= endDate) {
      testStatus = "ongoing";
    } else if (currentDate > endDate) {
      testStatus = "completed";
    }
  }

  const formattedStartDate = startDate
    ? format(startDate, "dd/MM/yyyy 'at' hh:mm a")
    : "";
  const formattedEndDate = endDate
    ? format(endDate, "dd/MM/yyyy 'at' hh:mm a")
    : "";

  return (
    <div className="col-xxl-3 col-lg-4 col-sm-6">
      <div className="card border border-gray-100">
        <div className="card-body p-8">
          <div className="text-end p-3 position-relative">
            <i
              className="ph-fill ph-dots-three-outline-vertical cursor-pointer"
              onClick={toggleDropdown}
              style={{ fontSize: "20px" }}
            />
            {showDropdown && (
              <div
                className="position-absolute bg-white shadow rounded-2 p-2"
                style={{ right: 0, top: "100%" }}
              >
                <Link
                  className="btn btn-sm btn-outline-main w-100"
                  to={"/admin/assignBatch"}
                  state={{ test }}
                >
                  Assign Batch
                </Link>
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
                  : test.test_difficulty === "3"
                  ? "bg-danger-50 text-danger-600"
                  : ""
              }`}
            >
              {test.test_difficulty === "0"
                ? "Easy"
                : test.test_difficulty === "1"
                ? "Medium"
                : test.test_difficulty === "2"
                ? "Hard"
                : test.test_difficulty === "3"
                ? "Time Consuming"
                : ""}
            </span>

            <h5 className="mb-0">
              <p className="hover-text-main-600 text-18 fw-semibold">
                {test.test_name}
              </p>
            </h5>

            <p
              className={`hover-text text-15 ${
                isExpanded ? "" : "two-line-text"
              }`}
              style={{ minHeight: isExpanded ? "auto" : "3rem" }}
            >
              {test.test_desc}
            </p>

            <button
              className="btn btn-link p-0 text-main-600 text-13"
              onClick={toggleDescription}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>

            <div className="flex-align gap-8 mt-12 pt-12">
              <span className="text-13 text-gray-600">
                <strong>Available Time:</strong>{" "}
                <strong>{formattedStartDate}</strong> to{" "}
                <strong>{formattedEndDate}</strong>
              </span>
            </div>

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
                          ? `${format(
                              new Date(assignment.start_date),
                              "dd/MM/yyyy 'at' hh:mm a"
                            )} - ${format(
                              new Date(assignment.end_date),
                              "dd/MM/yyyy 'at' hh:mm a"
                            )}`
                          : "Dates not assigned"}
                      </span>
                    </div>
                  ))}

                {test.assignments.length > 2 && (
                  <button
                    className="btn btn-link p-0 text-main-600 text-13 mt-2"
                    onClick={toggleDescription}
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

            <div className="flex-between gap-4 flex-wrap mt-24">
              {testStatus !== "ongoing" && testStatus !== "completed" && (
                <div className="row w-100">
                  <div className="col-6">
                    <Link
                      to="/admin/addQuizQuestions"
                      state={{ test }}
                      className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                    >
                      Add Questions
                    </Link>
                  </div>

                  <div className="col-6">
                    <Link
                      to="/admin/viewQuizQuestions"
                      state={{ test }}
                      className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
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
    </div>
  );
}

export default QuizCard;
