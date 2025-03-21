import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import QuizCard from "./quiz";
import "./QuizTab.css";

function QuizTab({ activeTab, setActiveTab, quizes }) {
  const currentDate = new Date(); // Get the current date

  // Determine test status based on start and end dates
  const determineTestStatus = (quiz) => {
    const startDate = new Date(quiz.test_start_date);
    const endDate = new Date(quiz.test_end_date);

    if (currentDate >= startDate && currentDate <= endDate) {
      return "ongoing";
    } else if (currentDate > endDate) {
      return "completed";
    } else {
      return "upcoming";
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of items per page

  // Filter quizzes based on active tab and status
  const filterQuizesByStatus = (status) => {
    if (status === "batch_not_assigned") {
      return quizes.filter((quiz) => quiz.isAssigned === 0);
    }
    return quizes.filter((quiz) => determineTestStatus(quiz) === status);
  };

  // Get paginated quizzes for the current page
  const getCurrentPageQuizes = (filteredQuizes) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredQuizes.slice(startIndex, startIndex + itemsPerPage);
  };

  const filteredQuizes = filterQuizesByStatus(activeTab);
  const totalPages = Math.ceil(filteredQuizes.length / itemsPerPage);

  // Reset pagination when active tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Check if there are any quizzes in the active tab
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
                className={`nav-link ${
                  activeTab === "batch_not_assigned" ? "active" : ""
                }`}
                onClick={() => setActiveTab("batch_not_assigned")}
                type="button"
                role="tab"
              >
                Batch Not Assigned
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "upcoming" ? "active" : ""
                }`}
                onClick={() => setActiveTab("upcoming")}
                type="button"
                role="tab"
              >
                Upcoming
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "ongoing" ? "active" : ""
                }`}
                onClick={() => setActiveTab("ongoing")}
                type="button"
                role="tab"
              >
                Ongoing
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "completed" ? "active" : ""
                }`}
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
              <QuizCard
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

export default QuizTab;
