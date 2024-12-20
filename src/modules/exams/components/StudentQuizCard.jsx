import React, { useState } from "react";
import { format } from "date-fns"; // Ensure using the correct version of date-fns
import { Link } from "react-router-dom";

function StudentQuizCard({ test }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const startDate = new Date(test && test.test_start_date);
  const endDate = new Date(test && test.test_end_date);
  const currentDate = new Date(); // Get the current date

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine the test status based on current date and start/end dates
  let testStatus = "upcoming"; // Default to "upcoming"
  if (currentDate >= startDate && currentDate <= endDate) {
    testStatus = "current"; // Ongoing if current date is between start and end
  } else if (currentDate > endDate) {
    testStatus = "completed"; // Completed if current date is past end date
  }

  // Format the dates correctly
  const formattedStartDate = format(startDate, "dd/MM/yyyy 'at' hh:mm a");
  const formattedEndDate = format(endDate, "dd/MM/yyyy 'at' hh:mm a");

  return (
    <div className="col-xxl-3 col-lg-4 col-sm-6">
      <div className="card border border-gray-100">
        <div className="card-body p-8">
          <Link className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8">
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/images/test_images/${test.test_img_path}`}
              alt="test"
            />
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
              <div className="flex-align gap-4">
                <span className="text-13 text-gray-600">
                  <strong>Available Time: </strong>{" "}
                  <strong>{formattedStartDate}</strong> to{" "}
                  <strong>{formattedEndDate}</strong>
                </span>
              </div>
            </div>
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
              {testStatus === "current" && test.has_taken !== 1 ? (
                <Link
                  to={`/test`}
                  state={{ exam: test }}
                  className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                >
                  Give Test
                </Link>
              ) : testStatus === "completed" && test.has_taken === 1 ? (
                <Link
                  to={`/exam-result`}
                  state={{ test }}
                  className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                >
                  View Result
                </Link>
              ) : testStatus === "completed" && test.has_taken !== 1 ? (
                <button
                  disabled
                  to={`/exam-result`}
                  state={{ test }}
                  className="btn btn-outline-main rounded-pill py-9 w-100 mt-24"
                >
                  Quiz Not Attempted
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentQuizCard;
