import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import StudentQuizCard from "./StudentQuizCard";

function StudentQuizTab({ activeTab, setActiveTab, quizes }) {
  const currentDate = new Date(); // Get the current date

  const determineTestStatus = (quiz) => {
    const startDate = new Date(quiz.test_start_date);
    const endDate = new Date(quiz.test_end_date);

    if (currentDate >= startDate && currentDate <= endDate) {
      return "ongoing"; // Ongoing if current date is between start and end
    } else if (currentDate > endDate) {
      return "completed"; // Completed if current date is past end date
    } else {
      return "upcoming"; // Default to upcoming
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of items to display per page

  // Filter quizzes based on the active tab and status
  const filterQuizesByStatus = (status) => {
    return quizes.filter((quiz) => determineTestStatus(quiz) === status);
  };

  // Get quizzes for the current page
  const getCurrentPageQuizes = (filteredQuizes) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredQuizes.slice(startIndex, endIndex);
  };

  const filteredQuizes = filterQuizesByStatus(activeTab);
  const totalPages = Math.ceil(filteredQuizes.length / itemsPerPage);

  // Reset pagination to page 1 when activeTab changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when tab changes
  }, [activeTab]);

  // Check if there are any quizzes for the active tab
  const hasQuizes = filteredQuizes.length > 0;

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-24 flex-between gap-16 flex-wrap-reverse">
          <ul
            className="nav nav-pills common-tab gap-20"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`}
                onClick={() => setActiveTab("upcoming")}
                type="button"
                role="tab"
              >
                Upcoming
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
                onClick={() => setActiveTab("ongoing")}
                type="button"
                role="tab"
              >
                Ongoing
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
                onClick={() => setActiveTab("completed")}
                type="button"
                role="tab"
              >
                Completed
              </button>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          <div className="row g-20">
            {getCurrentPageQuizes(filteredQuizes).map((quiz, index) => (
              <StudentQuizCard
                key={index}
                test={quiz}
                testStatus={determineTestStatus(quiz)}
              />
            ))}
            {!hasQuizes && <p>No quizzes found.</p>}
          </div>

          {/* Show Pagination only if there are quizzes to display */}
          {hasQuizes && (
            <div className="pagination-controls">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                variant="outlined"
                color="primary"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentQuizTab;
